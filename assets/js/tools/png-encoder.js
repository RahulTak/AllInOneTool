/**
 * Client-side Lossless Optimized PNG Encoder
 * 
 * Generates standards-compliant, lossless PNG images from HTML5 Canvas.
 * - Detects image transparency: for opaque images (like JPG), encodes as 24-bit Truecolor RGB (Color Type 2),
 *   eliminating 25% redundant alpha channel scanline data.
 * - For images with transparency, encodes as 32-bit Truecolor RGBA (Color Type 6) preserving alpha fidelity.
 * - Evaluates PNG scanline prediction filters (None, Sub, Up, Average, Paeth) row-by-row to maximize Deflate compression.
 * - Uses native CompressionStream('deflate') (RFC 1950 zlib wrapper) with safe fallback to native canvas.toBlob.
 * - Always guarantees optimal size: compares optimized PNG against canvas blob and picks the smallest.
 */

// Precomputed CRC-32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
}

function crc32(buf, offset, length) {
    let crc = 0xffffffff;
    const end = offset + length;
    for (let i = offset; i < end; i++) {
        crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function writeUint32(buf, offset, value) {
    buf[offset] = (value >>> 24) & 0xff;
    buf[offset + 1] = (value >>> 16) & 0xff;
    buf[offset + 2] = (value >>> 8) & 0xff;
    buf[offset + 3] = value & 0xff;
}

function paethPredictor(a, b, c) {
    const p = a + b - c;
    const pa = p > a ? p - a : a - p;
    const pb = p > b ? p - b : b - p;
    const pc = p > c ? p - c : c - p;
    return (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
}

function hasTransparency(data) {
    const len = data.length;
    for (let i = 3; i < len; i += 4) {
        if (data[i] < 255) return true;
    }
    return false;
}

function canvasToBlobNative(canvas, mimeType = 'image/png', quality) {
    return new Promise((resolve) => {
        canvas.toBlob(blob => resolve(blob), mimeType, quality);
    });
}

/**
 * Filter scanlines using standard PNG adaptive filtering
 */
function filterScanlines(width, height, data, hasAlpha) {
    const bpp = hasAlpha ? 4 : 3;
    const rowBytes = width * bpp;
    const rawData = new Uint8Array(height * (1 + rowBytes));

    const subRow = new Uint8Array(rowBytes);
    const upRow = new Uint8Array(rowBytes);
    const avgRow = new Uint8Array(rowBytes);
    const paethRow = new Uint8Array(rowBytes);

    let priorRow = new Uint8Array(rowBytes);
    let currentRow = new Uint8Array(rowBytes);
    let rawOffset = 0;

    for (let y = 0; y < height; y++) {
        const srcRowOffset = y * width * 4;

        if (hasAlpha) {
            for (let x = 0; x < width; x++) {
                const s = srcRowOffset + (x << 2);
                const d = x << 2;
                currentRow[d] = data[s];
                currentRow[d + 1] = data[s + 1];
                currentRow[d + 2] = data[s + 2];
                currentRow[d + 3] = data[s + 3];
            }
        } else {
            for (let x = 0; x < width; x++) {
                const s = srcRowOffset + (x << 2);
                const d = x * 3;
                currentRow[d] = data[s];
                currentRow[d + 1] = data[s + 1];
                currentRow[d + 2] = data[s + 2];
            }
        }

        let sumNone = 0, sumSub = 0, sumUp = 0, sumAvg = 0, sumPaeth = 0;

        // First bpp bytes of row
        for (let i = 0; i < bpp; i++) {
            const xVal = currentRow[i];
            const bVal = priorRow[i];

            sumNone += xVal > 127 ? 256 - xVal : xVal;

            subRow[i] = xVal;
            sumSub += xVal > 127 ? 256 - xVal : xVal;

            const upVal = (xVal - bVal) & 0xff;
            upRow[i] = upVal;
            sumUp += upVal > 127 ? 256 - upVal : upVal;

            const avgVal = (xVal - (bVal >> 1)) & 0xff;
            avgRow[i] = avgVal;
            sumAvg += avgVal > 127 ? 256 - avgVal : avgVal;

            const paethVal = (xVal - bVal) & 0xff;
            paethRow[i] = paethVal;
            sumPaeth += paethVal > 127 ? 256 - paethVal : paethVal;
        }

        // Remaining bytes of row
        for (let i = bpp; i < rowBytes; i++) {
            const xVal = currentRow[i];
            const aVal = currentRow[i - bpp];
            const bVal = priorRow[i];
            const cVal = priorRow[i - bpp];

            sumNone += xVal > 127 ? 256 - xVal : xVal;

            const subVal = (xVal - aVal) & 0xff;
            subRow[i] = subVal;
            sumSub += subVal > 127 ? 256 - subVal : subVal;

            const upVal = (xVal - bVal) & 0xff;
            upRow[i] = upVal;
            sumUp += upVal > 127 ? 256 - upVal : upVal;

            const avgVal = (xVal - ((aVal + bVal) >> 1)) & 0xff;
            avgRow[i] = avgVal;
            sumAvg += avgVal > 127 ? 256 - avgVal : avgVal;

            const pVal = (xVal - paethPredictor(aVal, bVal, cVal)) & 0xff;
            paethRow[i] = pVal;
            sumPaeth += pVal > 127 ? 256 - pVal : pVal;
        }

        let bestFilter = 0;
        let minSum = sumNone;
        let chosenBuffer = currentRow;

        if (sumSub < minSum) { minSum = sumSub; bestFilter = 1; chosenBuffer = subRow; }
        if (sumUp < minSum) { minSum = sumUp; bestFilter = 2; chosenBuffer = upRow; }
        if (sumAvg < minSum) { minSum = sumAvg; bestFilter = 3; chosenBuffer = avgRow; }
        if (sumPaeth < minSum) { minSum = sumPaeth; bestFilter = 4; chosenBuffer = paethRow; }

        rawData[rawOffset++] = bestFilter;
        rawData.set(chosenBuffer, rawOffset);
        rawOffset += rowBytes;

        const tmp = priorRow;
        priorRow = currentRow;
        currentRow = tmp;
    }

    return rawData;
}

async function deflateZlib(data) {
    if (typeof CompressionStream !== 'function') return null;
    try {
        const cs = new CompressionStream('deflate');
        const writer = cs.writable.getWriter();
        writer.write(data);
        writer.close();

        const chunks = [];
        let totalLength = 0;
        const reader = cs.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            chunks.push(value);
            totalLength += value.length;
        }

        const out = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            out.set(chunk, offset);
            offset += chunk.length;
        }
        return out;
    } catch (e) {
        console.warn('CompressionStream failed, falling back to canvas.toBlob', e);
        return null;
    }
}

/**
 * Builds a valid PNG Uint8Array from uncompressed raw data
 */
function buildPngFile(width, height, hasAlpha, idatData) {
    // 8 (sig) + 25 (IHDR) + (12 + idatData.length) + 12 (IEND)
    const totalPngSize = 8 + 25 + (12 + idatData.length) + 12;
    const png = new Uint8Array(totalPngSize);

    // 1. Signature
    png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    let offset = 8;

    // 2. IHDR
    writeUint32(png, offset, 13);
    offset += 4;
    const ihdrStart = offset;
    png.set([0x49, 0x48, 0x44, 0x52], offset); // 'IHDR'
    offset += 4;
    writeUint32(png, offset, width);
    offset += 4;
    writeUint32(png, offset, height);
    offset += 4;
    png[offset++] = 8; // 8 bits per sample
    png[offset++] = hasAlpha ? 6 : 2; // Color type: 2 (Truecolor RGB) or 6 (Truecolor RGBA)
    png[offset++] = 0; // Compression (0 = deflate)
    png[offset++] = 0; // Filter (0 = adaptive)
    png[offset++] = 0; // Interlace (0 = no interlace)
    const ihdrCrc = crc32(png, ihdrStart, offset - ihdrStart);
    writeUint32(png, offset, ihdrCrc);
    offset += 4;

    // 3. IDAT
    writeUint32(png, offset, idatData.length);
    offset += 4;
    const idatStart = offset;
    png.set([0x49, 0x44, 0x41, 0x54], offset); // 'IDAT'
    offset += 4;
    png.set(idatData, offset);
    offset += idatData.length;
    const idatCrc = crc32(png, idatStart, offset - idatStart);
    writeUint32(png, offset, idatCrc);
    offset += 4;

    // 4. IEND
    writeUint32(png, offset, 0);
    offset += 4;
    const iendStart = offset;
    png.set([0x49, 0x45, 0x4e, 0x44], offset); // 'IEND'
    offset += 4;
    const iendCrc = crc32(png, iendStart, offset - iendStart);
    writeUint32(png, offset, iendCrc);
    offset += 4;

    return png;
}

/**
 * Encodes an HTMLCanvasElement into an optimized lossless PNG Blob.
 * If forceOpaque is true (e.g. for JPG input), transparency check is bypassed and 24-bit RGB is used.
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {boolean} [forceOpaque=false] 
 * @returns {Promise<Blob>}
 */
export async function encodeCanvasToOptimizedPng(canvas, forceOpaque = false) {
    if (!canvas || !canvas.width || !canvas.height) {
        return canvasToBlobNative(canvas, 'image/png');
    }

    try {
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const hasAlpha = forceOpaque ? false : hasTransparency(data);
        const filteredData = filterScanlines(width, height, data, hasAlpha);
        const compressed = await deflateZlib(filteredData);

        if (compressed) {
            const pngBytes = buildPngFile(width, height, hasAlpha, compressed);
            const optimizedBlob = new Blob([pngBytes], { type: 'image/png' });

            // Always compare with native canvas toBlob and ensure optimal size
            const nativeBlob = await canvasToBlobNative(canvas, 'image/png');
            if (nativeBlob && nativeBlob.size < optimizedBlob.size) {
                return nativeBlob;
            }
            return optimizedBlob;
        }
    } catch (err) {
        console.warn('Optimized PNG encoding failed, falling back to native toBlob:', err);
    }

    return canvasToBlobNative(canvas, 'image/png');
}
