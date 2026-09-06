const fs = require('fs');
const path = require('path');
const { SITE_URL, CATEGORIES_SEO } = require('../config/seo.js');

// Import tools from generate-project.js
const genProj = fs.readFileSync(path.join(__dirname, 'generate-project.js'), 'utf8');
const toolsMatch = genProj.match(/const TOOLS = \[([\s\S]*?)\];/);
const TOOLS = eval('[' + toolsMatch[1] + ']');

console.log(`Building SEO Catalog for ${TOOLS.length} tools...`);

// Helper to ensure meta description is within ~140-160 characters
function formatMetaDesc(str) {
    let s = str.trim();
    if (s.length > 160) {
        s = s.substring(0, 157).trim() + '...';
    }
    return s;
}

// Curated related tools by category
const CATEGORY_TOOL_POOLS = {
    image: ['image-compressor', 'image-resizer', 'jpg-to-png', 'png-to-jpg', 'webp-to-png', 'crop-image', 'rotate-image', 'image-to-base64'],
    pdf: ['merge-pdf', 'split-pdf', 'pdf-to-jpg', 'jpg-to-pdf', 'compress-pdf', 'rotate-pdf', 'pdf-to-word', 'unlock-pdf', 'protect-pdf'],
    text: ['word-counter', 'case-converter', 'text-diff', 'markdown-to-html', 'lorem-ipsum-generator', 'find-and-replace', 'text-reverser'],
    calculator: ['age-calculator', 'emi-calculator', 'percentage-calculator', 'compound-interest-calculator', 'bmi-calculator', 'discount-calculator', 'salary-hourly-calculator'],
    converter: ['binary-converter', 'length-converter', 'weight-converter', 'temperature-converter', 'digital-storage', 'epoch-converter', 'json-to-csv'],
    seo: ['serp-simulator', 'keyword-density', 'meta-tags-generator', 'robots-generator', 'sitemap-generator', 'og-tag-generator'],
    developer: ['json-formatter', 'xml-formatter', 'css-minifier', 'js-minifier', 'uuid-generator', 'hash-generator', 'qr-code-generator', 'html-table-generator'],
    color: ['color-converter', 'color-scheme', 'contrast-checker', 'gradient-generator', 'color-extractor'],
    password: ['strong-password-generator', 'password-strength', 'password-hash-checker', 'caesar-cipher', 'vigenere-cipher'],
    misc: ['stopwatch-timer', 'morse-translator', 'world-clock', 'list-randomizer', 'random-number-generator', 'dice-roller']
};

function getCuratedRelated(toolId, cat) {
    const pool = CATEGORY_TOOL_POOLS[cat] || [];
    const filtered = pool.filter(id => id !== toolId);
    if (filtered.length >= 4) return filtered.slice(0, 5);
    // Add fallback from all tools in category
    const catTools = TOOLS.filter(t => t.cat === cat && t.id !== toolId).map(t => t.id);
    const combined = Array.from(new Set([...filtered, ...catTools]));
    return combined.slice(0, 5);
}

// Systematic database of tool SEO templates and overrides
const TOOL_OVERRIDES = {
    // Top Image Tools
    'image-compressor': {
        seoTitle: 'Image Compressor – Compress JPG, PNG & WebP Online Free',
        metaDescription: 'Compress JPG, PNG, and WebP images online for free without losing quality. Reduce image file sizes locally in your browser with zero server uploads.',
        primaryKeyword: 'image compressor',
        secondaryKeywords: ['compress image', 'compress jpg', 'compress png', 'reduce image size', 'image size reducer'],
        searchIntent: 'Commercial / Informational – Reduce image file size without quality loss',
        howToUse: [
            'Drag and drop or select your JPG, PNG, or WebP photo into the upload area.',
            'Select your target compression strength (Low, Medium, or High compression).',
            'Review real-time file size savings, reduction percentage, and visual preview.',
            'Click Download Compressed Image to save your optimized photo instantly.'
        ],
        benefits: [
            '100% Client-Side Privacy: Your photos stay in your browser and are never uploaded.',
            'Quality Preservation: Smart optimization preserves sharp text and vivid colors.',
            'Significant Savings: Reduce file sizes by up to 80% to accelerate website load speed.',
            'Multi-Format Support: Seamlessly compress JPEG, WebP, and PNG assets with one tool.'
        ],
        features: ['Real-time byte savings breakdown', 'Three intelligent compression levels', 'Interactive image canvas preview', 'Instant local file download'],
        faqs: [
            { question: 'Does image compression reduce visual quality?', answer: 'Our compressor removes invisible metadata and optimizes color quantization, delivering significant file size reduction with virtually indistinguishable visual changes.' },
            { question: 'Which image formats are supported?', answer: 'We support JPEG/JPG, PNG, and modern WebP image formats.' },
            { question: 'Is there a limit on image size or count?', answer: 'Because compression executes directly in your browser memory, there are no artificial server limits or daily caps.' },
            { question: 'Are my images stored or logged on a server?', answer: 'No. All processing happens 100% client-side in your browser tab. Your files never touch a remote server.' }
        ]
    },
    'jpg-to-png': {
        seoTitle: 'JPG to PNG Converter – Convert JPG Images to PNG Free',
        metaDescription: 'Convert JPG images to high-quality PNG format online for free. Fast, client-side conversion preserves image quality with zero server uploads.',
        primaryKeyword: 'jpg to png converter',
        secondaryKeywords: ['convert jpg to png', 'jpeg to png', 'image converter', 'convert image to png'],
        searchIntent: 'Commercial / Informational – Convert JPEG photos into lossless PNG format',
        howToUse: [
            'Upload or drag your JPG/JPEG image into the converter upload zone.',
            'The tool immediately renders the image onto a high-fidelity client-side canvas.',
            'Preview the converted lossless PNG graphic in the workspace viewer.',
            'Click Convert & Download to save your new PNG image file.'
        ],
        benefits: [
            'Lossless Quality: Converts compressed JPEG artifacts into clean PNG structures.',
            'Complete Privacy: Images are processed in local memory and never leave your device.',
            'No Watermarks: Clean, full-resolution output without branding or restrictions.',
            'Instant Speed: Client-side conversion eliminates slow server upload queues.'
        ],
        features: ['Full resolution canvas rendering', 'Lossless PNG rasterization', 'Live graphic preview window', 'Fast single-click download'],
        faqs: [
            { question: 'Why convert JPG to PNG?', answer: 'PNG uses lossless compression and supports transparency, making it superior for graphics, logos, screenshots, and repeated editing.' },
            { question: 'Will converting JPG to PNG increase file size?', answer: 'Yes, PNG files are typically larger than JPGs because PNG stores full lossless image data rather than lossy approximations.' },
            { question: 'Can I convert multiple JPGs to PNG?', answer: 'Yes, you can convert images sequentially with no limits or waiting times.' },
            { question: 'Are my images uploaded to any server?', answer: 'Never. All conversions run 100% locally inside your browser via HTML5 Canvas.' }
        ]
    },
    'png-to-jpg': {
        seoTitle: 'PNG to JPG Converter – Convert PNG Images to JPG Online Free',
        metaDescription: 'Convert PNG images to JPG format online for free. Select custom JPEG quality, optimize background colors, and reduce file size with zero uploads.',
        primaryKeyword: 'png to jpg converter',
        secondaryKeywords: ['convert png to jpg', 'png to jpeg', 'compress png to jpg', 'image format converter'],
        searchIntent: 'Commercial / Informational – Convert PNG assets to lightweight JPG photos',
        howToUse: [
            'Select or drag and drop your PNG image file into the tool.',
            'Adjust the JPEG output quality slider (from 10% to 100%).',
            'Transparent areas are automatically rendered with a clean solid white background.',
            'Click Convert to JPG to download your lightweight JPEG file.'
        ],
        benefits: [
            'Massive File Size Reduction: Save up to 70% storage by switching to JPG compression.',
            'Configurable Quality Slider: Fine-tune visual clarity versus target byte size.',
            'Automatic Transparency Fill: Replaces transparent pixels with a crisp white background.',
            'Zero Server Uploads: Safe for private photos, confidential charts, and client designs.'
        ],
        features: ['Interactive JPEG quality slider', 'Automated alpha transparency blending', 'Real-time canvas preview', 'Instant local conversion'],
        faqs: [
            { question: 'What happens to transparent backgrounds in PNG?', answer: 'Since standard JPEG does not support alpha transparency, transparent areas are cleanly blended onto a solid white background.' },
            { question: 'How much smaller will the JPG file be?', answer: 'Converting photographic PNGs to JPG typically reduces file size by 50% to 80% with minimal visible difference.' },
            { question: 'What quality setting should I choose?', answer: 'A quality level of 85% to 92% provides the optimal balance of sharp details and low file weight.' },
            { question: 'Is my data secure?', answer: 'Yes. All image processing takes place purely in browser memory without sending data to our servers.' }
        ]
    },
    'image-resizer': {
        seoTitle: 'Image Resizer – Resize Image Dimensions Online Free',
        metaDescription: 'Resize image width and height online for free. Scale by pixels or percentage with aspect ratio lock. Fast client-side image resizing with zero uploads.',
        primaryKeyword: 'image resizer',
        secondaryKeywords: ['resize image', 'resize photo', 'change image dimensions', 'scale image online'],
        searchIntent: 'Commercial / Informational – Scale image dimensions to specific pixel bounds',
        howToUse: [
            'Upload your image (JPG, PNG, WebP) into the resizer box.',
            'Enter target width and height in pixels, or scale by percentage.',
            'Keep Maintain Aspect Ratio checked to prevent image distortion.',
            'Click Resize & Download to save your scaled image file.'
        ],
        benefits: [
            'Aspect Ratio Lock: Avoids stretching or squishing your graphics.',
            'Multiple Sizing Modes: Scale by exact pixel dimensions or percentage ratios.',
            'High Quality Resampling: Utilizes bi-cubic canvas smoothing for crisp outputs.',
            'Client-Side Speed: Resizes high-resolution photos in milliseconds.'
        ],
        features: ['Maintain aspect ratio toggle', 'Pixel and percentage scaling modes', 'Real-time dimension readout', 'Support for JPG, PNG, and WebP'],
        faqs: [
            { question: 'Will resizing make my image blurry?', answer: 'Downscaling images retains sharpness. Upscaling an image beyond its native resolution can cause softening, as new pixel data must be interpolated.' },
            { question: 'Can I resize an image for social media avatars?', answer: 'Yes. You can enter exact dimensions such as 1080x1080 for Instagram or 1200x630 for Facebook banners.' },
            { question: 'What formats does the resizer support?', answer: 'It supports PNG, JPEG/JPG, and WebP image files.' },
            { question: 'Are my photos uploaded to a cloud server?', answer: 'No. The image is rendered and resized entirely inside your browser tab.' }
        ]
    },
    // Top PDF Tools
    'merge-pdf': {
        seoTitle: 'Merge PDF Online – Combine Multiple PDF Files Free',
        metaDescription: 'Merge PDF files online for free. Combine multiple PDF documents into a single organized PDF file in seconds. 100% private client-side processing.',
        primaryKeyword: 'merge pdf',
        secondaryKeywords: ['combine pdf', 'join pdf', 'merge pdf files online', 'combine pdf files free'],
        searchIntent: 'Commercial / Informational – Combine multiple PDF files into one document',
        howToUse: [
            'Select or drag and drop two or more PDF files into the merge upload zone.',
            'Review the loaded document list and verify total page counts.',
            'Click Merge PDF Files to combine all pages into one sequential document.',
            'Download your consolidated PDF file immediately.'
        ],
        benefits: [
            'Strict Document Confidentiality: Legal contracts and tax records never leave your computer.',
            'Vector Text Preservation: Retains selectable text, original fonts, and sharp graphics.',
            'No Page Limits: Merge large manuals, bank statements, or invoices effortlessly.',
            'Fast Client-Side Engine: Powered by WebAssembly and PDF-Lib in your browser.'
        ],
        features: ['Multi-file queue management', 'Page count summary calculation', 'Native vector stream merging', 'Direct browser download'],
        faqs: [
            { question: 'In what order are the merged PDF pages placed?', answer: 'Pages are merged sequentially in the exact order you select your input documents.' },
            { question: 'Will merging PDFs degrade text or image quality?', answer: 'No. The tool copies original PDF page streams and embedded assets without re-compressing them, maintaining 100% original quality.' },
            { question: 'Is it safe to merge confidential bank statements or contracts?', answer: 'Yes. Because merging runs entirely client-side via PDF-Lib, no data ever leaves your device.' },
            { question: 'Can I merge password-protected PDFs?', answer: 'Protected PDFs must first be unlocked with our Unlock PDF tool before merging.' }
        ]
    },
    'pdf-to-word': {
        seoTitle: 'PDF to Word Converter – Convert PDF to DOCX Online Free',
        metaDescription: 'Convert PDF documents to editable Microsoft Word (.docx) files online for free. Extracts multi-page text into genuine Office Open XML format.',
        primaryKeyword: 'pdf to word converter',
        secondaryKeywords: ['convert pdf to word', 'pdf to docx', 'pdf to word online free', 'extract text from pdf'],
        searchIntent: 'Commercial / Informational – Convert PDF documents into editable Word files',
        howToUse: [
            'Upload your PDF document into the PDF to Word converter.',
            'The client-side parser extracts all text, lines, and paragraphs page by page.',
            'Preview the extracted text directly in the document editor viewport.',
            'Click Convert to Word (.docx) to download a genuine Office Open XML document.'
        ],
        benefits: [
            'Genuine Office Open XML: Generates real .docx packages that open cleanly in Word without repair errors.',
            'Multi-Page Pagebreak Handling: Preserves document pagination and page separation.',
            'Complete Document Security: Proprietary reports and resumes never leave your browser.',
            'Full Text Editability: Easily revise, reformat, and restyle extracted text in Word.'
        ],
        features: ['Full PDF.js page-by-page text extraction', 'Standards-compliant OOXML packaging via JSZip', 'Built-in document preview viewport', 'Clean Calibri typographic styling'],
        faqs: [
            { question: 'Does this tool generate real Word .docx files?', answer: 'Yes. It compiles genuine Office Open XML packages containing document.xml, relationships, and styles that open natively in Microsoft Word, LibreOffice, and Google Docs.' },
            { question: 'Can it convert scanned PDF documents without text?', answer: 'It extracts embedded digital text. If a PDF consists entirely of flat scanned camera images, OCR text recognition is required.' },
            { question: 'Will converting PDF to Word alter my fonts?', answer: 'Extracted paragraphs are structured with standard Calibri typography and clean paragraph spacing for easy editing.' },
            { question: 'Are my uploaded PDF contracts stored on a server?', answer: 'No. All parsing and DOCX packaging executes 100% locally in your browser memory.' }
        ]
    },
    'unlock-pdf': {
        seoTitle: 'Unlock PDF Online – Remove PDF Password Restrictions Free',
        metaDescription: 'Unlock password-protected PDF files online for free. Remove owner and user passwords to enable unrestricted printing, copying, and reading.',
        primaryKeyword: 'unlock pdf',
        secondaryKeywords: ['remove pdf password', 'unlock pdf online', 'decrypt pdf', 'pdf password remover'],
        searchIntent: 'Commercial / Informational – Decrypt password-protected PDFs with known password',
        howToUse: [
            'Upload your encrypted PDF file into the secure unlock zone.',
            'Enter the correct document password into the password input field.',
            'Click Unlock & Download to authenticate and decrypt the PDF in memory.',
            'Save your decrypted PDF file that opens freely without requiring a password.'
        ],
        benefits: [
            'Native Crypto Authentication: Validates passwords using browser-grade cryptography.',
            'Zero Document Leakage: Your password and document content are never sent to a server.',
            'Permanent Decryption: The downloaded PDF can be viewed, copied, and printed anywhere.',
            'Clear Error Diagnosis: Accurately distinguishes between wrong passwords and unsupported ciphers.'
        ],
        features: ['PDF.js cryptographic authentication', 'Clean unlocked PDF reconstruction', 'Real-time password error reporting', 'Direct decrypted PDF download'],
        faqs: [
            { question: 'Do I need to know the PDF password to unlock it?', answer: 'Yes. The tool authenticates your authorized password client-side and removes the security restrictions to produce an unencrypted document.' },
            { question: 'Can this tool crack an unknown PDF password?', answer: 'No. Modern 128-bit and 256-bit AES encryption cannot be brute-forced in a browser without the valid password.' },
            { question: 'Is my password transmitted across the internet?', answer: 'No. Decryption executes entirely inside your browser tab memory. Neither the password nor the document ever touches a server.' },
            { question: 'What can I do with the unlocked PDF?', answer: 'The resulting PDF is completely unencrypted. You can open, print, annotate, and merge it without entering a password.' }
        ]
    },
    'html-to-pdf': {
        seoTitle: 'HTML to PDF Converter – Compile HTML Code to PDF Online Free',
        metaDescription: 'Convert HTML code and web pages to formatted PDF documents online for free. Supports tables, headings, CSS styling, and clean multi-page pagination.',
        primaryKeyword: 'html to pdf converter',
        secondaryKeywords: ['convert html to pdf', 'html to pdf online', 'html code to pdf', 'print html to pdf'],
        searchIntent: 'Commercial / Informational – Render HTML markup into printable PDF documents',
        howToUse: [
            'Type or paste your HTML, CSS, and table code into the editor textarea.',
            'Click Update Live Preview to verify your rendered layout, colors, and styling.',
            'Ensure all embedded images and external web fonts have finished loading.',
            'Click Compile HTML to PDF to generate and download your formatted PDF document.'
        ],
        benefits: [
            'Multi-Page Smart Pagination: Automatically calculates page breaks across long content.',
            'Full CSS Support: Preserves custom table borders, typography, background fills, and colors.',
            'Zero Server Execution: Renders client-side with no privacy or data exposure risks.',
            'Verified Non-Blank Output: Validates canvas and binary streams before downloading.'
        ],
        features: ['Live interactive HTML preview viewport', 'Automatic image pre-load detector', 'Multi-page canvas pagebreak engine', 'Validated PDF blob download'],
        faqs: [
            { question: 'Can I include tables and CSS in my HTML code?', answer: 'Yes. The converter supports tables, nested divs, typography, background colors, and CSS styling.' },
            { question: 'Does it support multi-page HTML documents?', answer: 'Yes. Content that exceeds a single page is automatically paginated across multiple standard Letter pages.' },
            { question: 'Why did my previous PDF download as a blank page?', answer: 'Blank outputs are commonly caused by scroll offsets or cross-origin images. Our tool eliminates scroll offsets and verifies pixel data before downloading.' },
            { question: 'Are external images supported in the HTML?', answer: 'Yes, provided the image host permits CORS access. Data URIs and local images are always fully supported.' }
        ]
    },
    'excel-to-pdf': {
        seoTitle: 'Excel to PDF Converter – Convert Spreadsheet Workbooks to PDF Free',
        metaDescription: 'Convert Excel XLS and XLSX spreadsheets to clean PDF tables online for free. Features data-driven vector text, zebra styling, and multi-page pagination.',
        primaryKeyword: 'excel to pdf converter',
        secondaryKeywords: ['convert excel to pdf', 'xlsx to pdf', 'spreadsheet to pdf', 'excel to pdf online free'],
        searchIntent: 'Commercial / Informational – Convert Excel sheets into formatted PDF tables',
        howToUse: [
            'Upload your Excel spreadsheet (.xlsx or .xls) into the dropzone.',
            'Select the specific worksheet tab you wish to export from the dropdown.',
            'Review the interactive spreadsheet table grid preview.',
            'Click Generate PDF from Sheet to download a clean, multi-page vector PDF table.'
        ],
        benefits: [
            '100% Data-Driven Vector PDF: Text is crisp, searchable, and selectable without blurry screenshots.',
            'Multi-Page Table Pagination: Automatically repeats table headers on every page with page numbers.',
            'Zebra-Striped Formatting: Professional table borders, soft blue headers, and alternating row fills.',
            'Strict Financial Privacy: Financial spreadsheets and payroll records never leave your device.'
        ],
        features: ['SheetJS / XLSX sheet parser', 'Vector text rendering via PDF-Lib', 'Landscape layout with proportional column widths', 'Automatic page header repetition'],
        faqs: [
            { question: 'Can I select which sheet tab in my workbook to convert?', answer: 'Yes. The sheet dropdown allows you to choose any tab in multi-sheet Excel workbooks.' },
            { question: 'Is the text in the generated PDF selectable?', answer: 'Yes! Unlike screenshot converters, our tool generates genuine vector text using Helvetica fonts, so all text is fully searchable and copyable.' },
            { question: 'How does it handle large spreadsheets with dozens of rows?', answer: 'The tool calculates page heights and automatically distributes rows across multiple pages, repeating the table headers on each page.' },
            { question: 'Are my private financial records uploaded anywhere?', answer: 'No. The workbook is parsed and the PDF is generated 100% inside your browser session.' }
        ]
    },
    // Top Calculators
    'age-calculator': {
        seoTitle: 'Age Calculator – Calculate Your Exact Age Online Free',
        metaDescription: 'Calculate your exact age in years, months, weeks, days, hours, and minutes. Discover your next birthday countdown and day of the week you were born.',
        primaryKeyword: 'age calculator',
        secondaryKeywords: ['calculate age', 'exact age calculator', 'chronological age calculator', 'how old am i'],
        searchIntent: 'Informational / Utility – Calculate exact chronological age from date of birth',
        howToUse: [
            'Select your Date of Birth using the interactive calendar picker.',
            'Optionally select a target date (defaults to current date).',
            'Click Calculate Exact Age to process your chronological metrics.',
            'Review your age broken down into years, months, days, and total hours.'
        ],
        benefits: [
            'Exact Precision: Accounts for leap years, differing month lengths, and timezones.',
            'Comprehensive Breakdown: View your age in total days, weeks, hours, and minutes.',
            'Next Birthday Countdown: Know the exact remaining days until your next celebration.',
            'Completely Private: Your date of birth is processed locally and never stored.'
        ],
        features: ['Years, months, and days calculation', 'Leap year calendar compensation', 'Upcoming birthday countdown tracker', 'Day-of-the-week born identifier'],
        faqs: [
            { question: 'How does the calculator account for leap years?', answer: 'It calculates exact calendar days between dates, accurately including February 29th in all intervening leap years.' },
            { question: 'Can I calculate how old I will be on a future date?', answer: 'Yes. Simply change the "Age at Date" field to any future calendar date.' },
            { question: 'Does it calculate total days and hours lived?', answer: 'Yes. It displays your complete lifespan in total months, total weeks, total days, and total hours.' },
            { question: 'Is my birthday recorded on your website?', answer: 'No. All calculations run strictly in your browser memory.' }
        ]
    },
    'emi-calculator': {
        seoTitle: 'Loan EMI Calculator – Calculate Monthly EMI & Interest Free',
        metaDescription: 'Calculate loan EMI, total interest, and complete repayment breakdown for home, car, or personal loans. Fast, accurate online financial calculator.',
        primaryKeyword: 'loan emi calculator',
        secondaryKeywords: ['emi calculator', 'calculate emi', 'home loan emi calculator', 'car loan emi calculator'],
        searchIntent: 'Commercial / Financial – Estimate loan monthly payments and interest costs',
        howToUse: [
            'Enter your Principal Loan Amount (e.g. $50,000).',
            'Input the Annual Interest Rate percentage (e.g. 7.5%).',
            'Select your Loan Tenure in years or months.',
            'Review your monthly EMI, total interest payable, and overall loan cost.'
        ],
        benefits: [
            'Financial Clarity: Understand the true cost of borrowing before signing loan agreements.',
            'Transparent Mathematics: Uses standard amortizing formulas applied by global banks.',
            'Principal vs Interest Split: Clearly see what portion of payments goes toward interest.',
            'Confidential Simulation: Test loan scenarios privately without submitting financial data.'
        ],
        features: ['Standard banking amortization formula', 'Total interest vs principal ratio readout', 'Support for tenure in years or months', 'Real-time calculation updates'],
        faqs: [
            { question: 'What formula is used to calculate EMI?', answer: 'It uses EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is principal, R is monthly interest rate, and N is the number of monthly installments.' },
            { question: 'Can I use this for home, car, and personal loans?', answer: 'Yes. The formula applies universally to any reducing-balance term loan.' },
            { question: 'How does increasing tenure affect total interest?', answer: 'A longer tenure reduces your monthly EMI installment but significantly increases the total interest paid over the life of the loan.' },
            { question: 'Are my loan figures shared with lenders or banks?', answer: 'No. All calculations occur locally on your device with zero tracking.' }
        ]
    },
    // Top Developer Tools
    'json-formatter': {
        seoTitle: 'JSON Formatter & Validator – Beautify JSON Online Free',
        metaDescription: 'Format, beautify, validate, and minify JSON data online for free. Features syntax highlighting, error diagnosis, and tree formatting with zero uploads.',
        primaryKeyword: 'json formatter',
        secondaryKeywords: ['json beautifier', 'format json', 'json validator', 'beautify json online'],
        searchIntent: 'Commercial / Developer – Beautify, validate, and inspect JSON payloads',
        howToUse: [
            'Paste your raw, minified, or unformatted JSON text into the input box.',
            'Choose your preferred indentation spacing (2 spaces, 4 spaces, or tabs).',
            'Click Format JSON to beautify the structure and validate syntax.',
            'Copy the cleaned JSON to your clipboard or download it as a .json file.'
        ],
        benefits: [
            'Syntax Error Pinpointing: Identifies exact line and character positions of syntax errors.',
            'Safe for API Keys: Proprietary API payloads and credentials never leave your browser.',
            'Flexible Indentation: Customize 2-space, 4-space, or compact minification formats.',
            'Instant Parsing: Handles large JSON files up to several megabytes with zero lag.'
        ],
        features: ['Line-by-line syntax error reporter', 'Configurable tab / space indentation', 'One-click copy to clipboard', 'Minify and beautify toggle'],
        faqs: [
            { question: 'What causes JSON syntax errors?', answer: 'Common causes include trailing commas, unquoted keys, single quotes instead of double quotes, and unescaped control characters.' },
            { question: 'Can this tool minify JSON for production?', answer: 'Yes. Click the Minify button to remove all unnecessary whitespace and carriage returns for minimal payload size.' },
            { question: 'Is my JSON sent to an external API or server?', answer: 'No. All parsing and formatting uses native JSON.parse() and JSON.stringify() inside your local browser.' },
            { question: 'Can I format nested arrays and complex objects?', answer: 'Yes. The formatter handles arbitrarily deep JSON nesting cleanly.' }
        ]
    }
};

// Generic generator for tools not explicitly in TOOL_OVERRIDES
function generateToolSeo(tool) {
    if (TOOL_OVERRIDES[tool.id]) {
        return {
            id: tool.id,
            name: tool.name,
            slug: tool.id,
            category: tool.cat,
            categoryName: CATEGORIES_SEO[tool.cat] ? CATEGORIES_SEO[tool.cat].name : tool.cat,
            ...TOOL_OVERRIDES[tool.id],
            relatedTools: getCuratedRelated(tool.id, tool.cat)
        };
    }

    const catInfo = CATEGORIES_SEO[tool.cat] || { name: tool.cat, slug: `${tool.cat}-tools` };
    const catName = catInfo.name;

    // Craft intent-based titles
    let titleAction = 'Free Online Tool';
    if (tool.cat === 'calculator') titleAction = 'Calculate Online Free';
    else if (tool.cat === 'converter') titleAction = 'Convert Online Free';
    else if (tool.cat === 'image') titleAction = 'Free Image Tool';
    else if (tool.cat === 'pdf') titleAction = 'Free PDF Tool';
    else if (tool.cat === 'developer') titleAction = 'Free Developer Utility';
    else if (tool.cat === 'seo') titleAction = 'Free SEO Tool';
    else if (tool.cat === 'text') titleAction = 'Online Text Tool Free';

    const seoTitle = `${tool.name} – ${titleAction} | AllInOneTool`;

    // 140-160 character meta description
    const descAction = tool.desc.endsWith('.') ? tool.desc.slice(0, -1) : tool.desc;
    const rawMetaDesc = `Use our free, premium ${tool.name} to ${descAction.toLowerCase()}. Fast, accurate, and 100% client-side with zero server uploads.`;
    const metaDescription = formatMetaDesc(rawMetaDesc);

    const primaryKeyword = tool.name.toLowerCase();
    const secondaryKeywords = [
        `online ${tool.name.toLowerCase()}`,
        `free ${tool.name.toLowerCase()}`,
        `${tool.cat} tools`,
        `${tool.name.toLowerCase()} online free`
    ];

    const searchIntent = `Commercial / Informational – ${descAction}`;

    const howToUse = [
        `Enter, paste, or upload your ${tool.cat === 'calculator' ? 'numeric values' : tool.cat === 'image' || tool.cat === 'pdf' ? 'document or image file' : 'input data'} into the designated area.`,
        'Configure any applicable settings, options, or operation modes to suit your requirements.',
        'Click the action button to process and generate your output immediately.',
        'Review the result and copy or download your finalized output with one click.'
    ];

    const benefits = [
        'Client-Side Security: All operations execute in your browser memory without uploading files to external servers.',
        'Instant Performance: Zero server roundtrips or queue waiting times for high-speed processing.',
        '100% Free & Unlimited: No subscriptions, sign-ups, watermarks, or usage restrictions.',
        'Responsive Interface: Works seamlessly across desktop computers, tablets, and smartphones.'
    ];

    const features = [
        'Interactive input controls and real-time validation',
        'Accurate calculations and standards-compliant formatting',
        'Clean visual display with instant output feedback',
        'One-click copy and download functionality'
    ];

    const faqs = [
        {
            question: `How does the ${tool.name} work?`,
            answer: `The ${tool.name} runs entirely in your local browser using modern web standards. It takes your input, executes the computation or transformation, and displays the result without sending any data over the internet.`
        },
        {
            question: `Is the ${tool.name} completely free?`,
            answer: 'Yes. All tools on AllInOneTool are completely free to use with unlimited daily access and no registration requirements.'
        },
        {
            question: 'Are my files or data uploaded to your server?',
            answer: 'No. All processing occurs locally within your browser tab. Your files, texts, and calculations never leave your device.'
        },
        {
            question: 'Can I use this tool on my mobile phone?',
            answer: 'Yes. The tool features a fully responsive layout optimized for mobile screens, tablets, and desktop workstations.'
        }
    ];

    return {
        id: tool.id,
        name: tool.name,
        slug: tool.id,
        category: tool.cat,
        categoryName: catName,
        seoTitle,
        metaDescription,
        primaryKeyword,
        secondaryKeywords,
        searchIntent,
        shortDescription: tool.desc,
        howToUse,
        benefits,
        features,
        faqs,
        relatedTools: getCuratedRelated(tool.id, tool.cat)
    };
}

// Build full catalog dictionary
const catalog = {};
TOOLS.forEach(tool => {
    catalog[tool.id] = generateToolSeo(tool);
});

// Write to scripts/seo-catalog.js and data/seo-catalog.json
const catalogJsContent = `// Centralized SEO Catalog for AllInOneTool (170 Tools)
module.exports = ${JSON.stringify(catalog, null, 4)};
`;

fs.writeFileSync(path.join(__dirname, 'seo-catalog.js'), catalogJsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'data', 'seo-catalog.json'), JSON.stringify(catalog, null, 2), 'utf8');

console.log(`Successfully compiled SEO Catalog for all ${Object.keys(catalog).length} tools!`);
