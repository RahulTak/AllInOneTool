// High-performance client-side WebP encoder module for AllInOneTool
// Uses browser-native canvas.toBlob('image/webp', q) where supported (Chrome, Firefox, Edge)
// and direct WebAssembly libwebp for Safari/WebKit without external dependencies.

let wasmInstancePromise = null;

/**
 * Initializes and caches the official libwebp WebAssembly module.
 */
export async function getWasmModule() {
  if (wasmInstancePromise) return wasmInstancePromise;

  wasmInstancePromise = (async () => {
    let wasmBinary = null;

    // 1. Try Browser fetch across candidate URLs
    const candidateUrls = [
      new URL('./webp_codec.wasm', import.meta.url).href,
      '../assets/js/tools/webp_codec.wasm',
      './assets/js/tools/webp_codec.wasm',
      '/assets/js/tools/webp_codec.wasm'
    ];

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url);
        if (response && response.ok) {
          wasmBinary = await response.arrayBuffer();
          if (wasmBinary && wasmBinary.byteLength > 0) break;
        }
      } catch (e) {
        // Continue to next candidate
      }
    }

    // 2. Fallback for Node.js test environment
    if (!wasmBinary && typeof process !== 'undefined' && process.versions && process.versions.node) {
      try {
        const fsModule = await import('node:fs');
        const { fileURLToPath } = await import('node:url');
        const filePath = fileURLToPath(new URL('./webp_codec.wasm', import.meta.url));
        wasmBinary = fsModule.readFileSync(filePath);
      } catch (e) {
        // Ignore
      }
    }

    if (!wasmBinary || wasmBinary.byteLength === 0) {
      throw new Error('Failed to load webp_codec.wasm from any available source');
    }

    let memory;
    let wasmExports;

    const wasmImports = {
      e: () => {
        throw new Error('WebP WASM abort called');
      },
      d: () => {},
      a: (which, timeout_ms) => {
        if (timeout_ms && wasmExports && wasmExports.m) {
          setTimeout(wasmExports.m, timeout_ms);
        }
      },
      b: (requestedSize) => {
        requestedSize = requestedSize >>> 0;
        const oldSize = memory.buffer.byteLength;
        const pages = Math.ceil((requestedSize - oldSize) / 65536);
        if (pages > 0) {
          try {
            memory.grow(pages);
            return true;
          } catch (e) {
            return false;
          }
        }
        return true;
      },
      c: (code) => {
        throw new Error(`WebP WASM exit(${code})`);
      }
    };

    const { instance } = await WebAssembly.instantiate(wasmBinary, { a: wasmImports });
    wasmExports = instance.exports;
    memory = wasmExports.f;

    if (typeof wasmExports.g === 'function') {
      wasmExports.g();
    }

    return {
      encodeRgba: wasmExports.h,
      decodeRgba: wasmExports.i,
      freeWebp: wasmExports.j,
      malloc: wasmExports.k,
      free: wasmExports.l,
      getMemory: () => memory
    };
  })();

  return wasmInstancePromise;
}

/**
 * Encodes an HTMLCanvasElement into a genuine WebP Blob using WASM libwebp.
 * Preserves dimensions and alpha channel transparency.
 * @param {HTMLCanvasElement} canvas
 * @param {number} quality 1 to 100
 * @returns {Promise<Blob>}
 */
export async function encodeCanvasViaWasm(canvas, quality = 80) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const m = await getWasmModule();
  const memory = m.getMemory();

  const inPtr = m.malloc(data.length);
  new Uint8Array(memory.buffer).set(data, inPtr);
  const sizePtr = m.malloc(4);

  const q = Math.max(1, Math.min(100, Math.round(quality)));
  const outPtr = m.encodeRgba(inPtr, width, height, q, 0, sizePtr);
  const size = new Uint32Array(memory.buffer)[sizePtr >> 2];

  let outBytes = null;
  if (outPtr && size > 0) {
    outBytes = new Uint8Array(memory.buffer).slice(outPtr, outPtr + size);
    m.freeWebp(outPtr);
  }
  m.free(inPtr);
  m.free(sizePtr);

  if (!outBytes) {
    throw new Error('WebP encoding failed in WebAssembly module');
  }

  return new Blob([outBytes], { type: 'image/webp' });
}

/**
 * Checks if browser's native canvas supports WebP export (returns false in Safari).
 */
export function isNativeWebpSupported() {
  try {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 1;
    testCanvas.height = 1;
    const uri = testCanvas.toDataURL('image/webp');
    return uri.indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
}

/**
 * Universal WebP encoder: uses native canvas.toBlob when supported,
 * and seamlessly falls back to WASM libwebp in Safari / unsupported browsers.
 * @param {HTMLCanvasElement} canvas
 * @param {number} qualityPercent 1 to 100
 * @returns {Promise<Blob>}
 */
export function convertCanvasToWebpBlob(canvas, qualityPercent = 80) {
  return new Promise((resolve, reject) => {
    const qualityClamped = Math.max(1, Math.min(100, Math.round(qualityPercent)));
    const qualityRatio = qualityClamped / 100;

    if (isNativeWebpSupported()) {
      canvas.toBlob(
        async (blob) => {
          if (blob && blob.type === 'image/webp') {
            resolve(blob);
          } else {
            // Silently fell back to PNG or failed; use WASM
            try {
              const wasmBlob = await encodeCanvasViaWasm(canvas, qualityClamped);
              resolve(wasmBlob);
            } catch (err) {
              reject(err);
            }
          }
        },
        'image/webp',
        qualityRatio
      );
    } else {
      // Browser does not support native WebP canvas export (Safari / WebKit)
      encodeCanvasViaWasm(canvas, qualityClamped)
        .then(resolve)
        .catch(reject);
    }
  });
}
