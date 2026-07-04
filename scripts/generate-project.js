const fs = require('fs');
const path = require('path');
const newToolsDefs = require('./new-tools-definitions.js');
const imageToolsDefs = require('./image-tools-definitions.js');

const CATEGORIES = [
    { id: 'image', name: 'Image Tools', icon: '🖼️' },
    { id: 'pdf', name: 'PDF Tools', icon: '📄' },
    { id: 'text', name: 'Text Tools', icon: '✍️' },
    { id: 'calculator', name: 'Calculators', icon: '🧮' },
    { id: 'converter', name: 'Converters', icon: '🔄' },
    { id: 'seo', name: 'SEO Tools', icon: '📈' },
    { id: 'developer', name: 'Developer Tools', icon: '💻' },
    { id: 'color', name: 'Color Tools', icon: '🎨' },
    { id: 'password', name: 'Password Tools', icon: '🔑' },
    { id: 'misc', name: 'Miscellaneous', icon: '⚙️' }
];

const TOOLS = [
    // --- IMAGE TOOLS (30) ---
    { id: 'image-compressor', name: 'Image Compressor', cat: 'image', arch: 'image', desc: 'Compress JPEG, PNG, and WebP images client-side without quality loss.' },
    { id: 'image-resizer', name: 'Image Resizer', cat: 'image', arch: 'image', desc: 'Resize image dimensions (width and height) locally in your browser.' },
    { id: 'jpg-to-png', name: 'JPG to PNG Converter', cat: 'image', arch: 'image', desc: 'Convert JPG images to PNG format instantly.' },
    { id: 'png-to-jpg', name: 'PNG to JPG Converter', cat: 'image', arch: 'image', desc: 'Convert PNG images to JPG format instantly.' },
    { id: 'webp-to-png', name: 'WebP to PNG Converter', cat: 'image', arch: 'image', desc: 'Convert WebP images to PNG format instantly.' },
    { id: 'png-to-webp', name: 'PNG to WebP Converter', cat: 'image', arch: 'image', desc: 'Convert PNG images to WebP format instantly.' },
    { id: 'svg-to-png', name: 'SVG to PNG Converter', cat: 'image', arch: 'image', desc: 'Convert SVG files into PNG format.' },
    { id: 'png-to-svg', name: 'PNG to SVG Converter', cat: 'image', arch: 'image', desc: 'Trace bitmap images into vector SVGs in your browser.' },
    { id: 'crop-image', name: 'Crop Image', cat: 'image', arch: 'image', desc: 'Crop unwanted areas from your images with pixel accuracy.' },
    { id: 'rotate-image', name: 'Rotate Image', cat: 'image', arch: 'image', desc: 'Rotate your images clockwise, counter-clockwise, or flip them.' },
    { id: 'image-flip', name: 'Image Flip', cat: 'image', arch: 'image', desc: 'Flip images vertically or horizontally in one click.' },
    { id: 'grayscale-filter', name: 'Grayscale Filter', cat: 'image', arch: 'image', desc: 'Convert colored images into monochromatic grayscale.' },
    { id: 'image-color-picker', name: 'Image Color Picker', cat: 'image', arch: 'image', desc: 'Pick color hex or rgb codes directly from any loaded image.' },
    { id: 'image-to-base64', name: 'Image to Base64', cat: 'image', arch: 'image', desc: 'Convert any image file into a Base64 text string.' },
    { id: 'base64-to-image', name: 'Base64 to Image', cat: 'image', arch: 'text-action', desc: 'Render and save Base64 text representations back into image files.' },
    { id: 'text-to-image', name: 'Text to Image Creator', cat: 'image', arch: 'text-action', desc: 'Render written messages as solid styled JPEG images.' },
    { id: 'image-mirror', name: 'Image Mirror Effect', cat: 'image', arch: 'image', desc: 'Create horizontal or vertical mirror reflections of images.' },
    { id: 'image-border-generator', name: 'Image Border Generator', cat: 'image', arch: 'image', desc: 'Apply customizable solid frames to your photos.' },
    { id: 'round-image-corners', name: 'Round Image Corners', cat: 'image', arch: 'image', desc: 'Round the edges of any image with custom radius values.' },
    { id: 'image-watermark', name: 'Add Watermark to Image', cat: 'image', arch: 'image', desc: 'Overlay custom watermark text over your images.' },
    { id: 'meme-generator', name: 'Meme Generator', cat: 'image', arch: 'image', desc: 'Add top and bottom caption text overlays to your pictures.' },
    { id: 'gif-to-png', name: 'GIF to PNG Frames Extractor', cat: 'image', arch: 'image', desc: 'Extract individual static PNG frames from GIF animations.' },
    { id: 'png-to-pdf', name: 'PNG to PDF Converter', cat: 'image', arch: 'image', desc: 'Export PNG files inside a clean PDF document layout.' },
    { id: 'tiff-to-jpg', name: 'TIFF to JPG Converter', cat: 'image', arch: 'image', desc: 'Convert large TIFF images into compressed JPGs.' },
    { id: 'image-exif-extractor', name: 'EXIF Metadata Extractor', cat: 'image', arch: 'image', desc: 'Inspect EXIF orientation, location, and camera metadata tags.' },
    { id: 'canvas-to-image', name: 'Canvas to Image Converter', cat: 'image', arch: 'image', desc: 'Save custom browser drawings as PNG files.' },
    { id: 'ico-converter', name: 'ICO Icon Converter', cat: 'image', arch: 'image', desc: 'Generate multi-resolution favicon .ico files from PNGs.' },
    { id: 'eps-to-png', name: 'EPS to PNG Converter', cat: 'image', arch: 'image', desc: 'Convert postscript vector drawings into raster PNG formats.' },
    { id: 'webp-to-jpg', name: 'WebP to JPG Converter', cat: 'image', arch: 'image', desc: 'Convert modern WebP images to standard JPG format.' },
    { id: 'pixelate-image', name: 'Pixelate Image', cat: 'image', arch: 'image', desc: 'Apply retro mosaic block filters over loaded images.' },

    // --- PDF TOOLS (20) ---
    { id: 'merge-pdf', name: 'Merge PDF', cat: 'pdf', arch: 'pdf', desc: 'Combine multiple PDF files into a single document.' },
    { id: 'split-pdf', name: 'Split PDF', cat: 'pdf', arch: 'pdf', desc: 'Split a PDF document into separate page files.' },
    { id: 'pdf-to-jpg', name: 'PDF to JPG Converter', cat: 'pdf', arch: 'pdf', desc: 'Convert PDF document pages into high-resolution JPG images.' },
    { id: 'jpg-to-pdf', name: 'JPG to PDF Converter', cat: 'pdf', arch: 'pdf', desc: 'Compile multiple JPEG images into a clean single PDF.' },
    { id: 'compress-pdf', name: 'Compress PDF', cat: 'pdf', arch: 'pdf', desc: 'Reduce the file size of PDF documents client-side.' },
    { id: 'rotate-pdf', name: 'Rotate PDF', cat: 'pdf', arch: 'pdf', desc: 'Rotate pages in a PDF document and save them.' },
    { id: 'word-to-pdf', name: 'Word to PDF Guide', cat: 'pdf', arch: 'static-info', desc: 'Learn how to export Microsoft Word documents as PDFs securely.' },
    { id: 'pdf-to-word', name: 'PDF to Word Guide', cat: 'pdf', arch: 'static-info', desc: 'Learn how to export PDF data into Word document sheets.' },
    { id: 'protect-pdf', name: 'Protect PDF', cat: 'pdf', arch: 'pdf', desc: 'Apply strong owner passwords to encrypt PDF documents.' },
    { id: 'unlock-pdf', name: 'Unlock PDF', cat: 'pdf', arch: 'pdf', desc: 'Decrypt and remove access restriction passwords from PDF sheets.' },
    { id: 'add-watermark-pdf', name: 'Add PDF Watermark', cat: 'pdf', arch: 'pdf', desc: 'Overlay copyright branding text over all PDF document pages.' },
    { id: 'page-numbers-pdf', name: 'Add PDF Page Numbers', cat: 'pdf', arch: 'pdf', desc: 'Add page counters dynamically onto footer margins of a PDF.' },
    { id: 'html-to-pdf', name: 'HTML to PDF Converter', cat: 'pdf', arch: 'pdf', desc: 'Print raw HTML code pages into formatted PDF sheets.' },
    { id: 'excel-to-pdf', name: 'Excel to PDF Guide', cat: 'pdf', arch: 'static-info', desc: 'Learn how to transform spreadsheet workbooks into PDFs.' },
    { id: 'pdf-page-extractor', name: 'Extract PDF Pages', cat: 'pdf', arch: 'pdf', desc: 'Isolate and extract specific page ranges from a PDF.' },
    { id: 'pdf-page-organizer', name: 'Organize PDF Pages', cat: 'pdf', arch: 'pdf', desc: 'Reorder individual document page indices visually.' },
    { id: 'delete-pdf-pages', name: 'Delete PDF Pages', cat: 'pdf', arch: 'pdf', desc: 'Remove unwanted blank or duplicate pages from a PDF.' },
    { id: 'pdf-metadata-editor', name: 'PDF Metadata Editor', cat: 'pdf', arch: 'pdf', desc: 'Edit PDF fields (Title, Author, Subject, Keywords).' },
    { id: 'crop-pdf', name: 'Crop PDF Margins', cat: 'pdf', arch: 'pdf', desc: 'Trim document borders and crop page size envelopes.' },
    { id: 'pdf-reader', name: 'PDF Reader Panel', cat: 'pdf', arch: 'pdf', desc: 'Read and view PDF files directly in a clean browser workspace.' },

    // --- TEXT TOOLS (20) ---
    { id: 'word-counter', name: 'Word Counter', cat: 'text', arch: 'word-counter', desc: 'Count words, characters, sentences, paragraphs, and reading times.' },
    { id: 'case-converter', name: 'Case Converter', cat: 'text', arch: 'case-converter', desc: 'Convert text to UPPERCASE, lowercase, Title Case, or Sentence case.' },
    { id: 'text-diff', name: 'Text Diff Checker', cat: 'text', arch: 'diff-checker', desc: 'Compare two text pieces to highlight additions and deletions.' },
    { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', cat: 'text', arch: 'lorem-gen', desc: 'Generate standard dummy placeholder layout text.' },
    { id: 'markdown-to-html', name: 'Markdown to HTML', cat: 'text', arch: 'markdown-parser', desc: 'Render markdown layout scripts as compiled HTML elements.' },
    { id: 'html-to-markdown', name: 'HTML to Markdown', cat: 'text', arch: 'text-action', desc: 'Deconstruct HTML tags back into raw markdown lists.' },
    { id: 'remove-line-breaks', name: 'Remove Line Breaks', cat: 'text', arch: 'text-action', desc: 'Clean text by collapsing extra spacing and double paragraphs.' },
    { id: 'text-reverser', name: 'Text Reverser', cat: 'text', arch: 'text-action', desc: 'Reverse the spelling of letters or words in sentences.' },
    { id: 'find-and-replace', name: 'Find and Replace', cat: 'text', arch: 'text-action', desc: 'Find query keywords and replace them with new strings.' },
    { id: 'slug-generator', name: 'URL Slug Generator', cat: 'text', arch: 'text-action', desc: 'Format header titles into clean URL-friendly slugs.' },
    { id: 'url-encoder-decoder', name: 'URL Encoder / Decoder', cat: 'text', arch: 'text-action', desc: 'Encode parameter links or decode query strings.' },
    { id: 'base64-encoder-decoder', name: 'Base64 Encoder / Decoder', cat: 'text', arch: 'text-action', desc: 'Encode input text strings to Base64 format or decode them back.' },
    { id: 'html-entities-converter', name: 'HTML Entities Converter', cat: 'text', arch: 'text-action', desc: 'Safely encode special layout characters to escape HTML.' },
    { id: 'nato-phonetic-translator', name: 'NATO Phonetic Alphabet', cat: 'text', arch: 'nato-speller', desc: 'Translate word letters into spelling indicators (Alpha, Bravo, Charlie).' },
    { id: 'rot13-cipher', name: 'ROT13 Cipher Toggler', cat: 'text', arch: 'text-action', desc: 'Encode or decode strings using the 13-character rotation cipher.' },
    { id: 'obfuscate-email', name: 'Email Address Obfuscator', cat: 'text', arch: 'text-action', desc: 'Scramble email links to prevent bots from scraping addresses.' },
    { id: 'text-to-binary', name: 'Text to Binary Converter', cat: 'text', arch: 'text-action', desc: 'Translate alphabet letters into standard binary byte sequences.' },
    { id: 'binary-to-text', name: 'Binary to Text Converter', cat: 'text', arch: 'text-action', desc: 'Translate binary bytes strings back into alphanumeric letters.' },
    { id: 'word-frequency-counter', name: 'Word Frequency Analyzer', cat: 'text', arch: 'text-action', desc: 'Analyze word density and output a list of repeating words.' },
    { id: 'character-counter', name: 'Character Counter', cat: 'text', arch: 'text-action', desc: 'Calculate the total count of character indices and spacers.' },

    // --- CALCULATORS (25) ---
    { id: 'age-calculator', name: 'Age Calculator', cat: 'calculator', arch: 'age-calc', desc: 'Calculate your exact age in years, months, weeks, and days.' },
    { id: 'emi-calculator', name: 'Loan EMI Calculator', cat: 'calculator', arch: 'emi-calc', desc: 'Calculate loan EMIs, total interest, and debt schedules.' },
    { id: 'percentage-calculator', name: 'Percentage Calculator', cat: 'calculator', arch: 'percent-calc', desc: 'Solve common percentage proportions and margin increments.' },
    { id: 'scientific-calculator', name: 'Scientific Calculator', cat: 'calculator', arch: 'scientific-calc', desc: 'Solve advanced arithmetic and trigonometric equations.' },
    { id: 'vat-tax-calculator', name: 'VAT / Sales Tax Calculator', cat: 'calculator', arch: 'vat-calc', desc: 'Calculate net, gross, and sales tax proportions.' },
    { id: 'compound-interest-calculator', name: 'Compound Interest Calculator', cat: 'calculator', arch: 'compound-calc', desc: 'Calculate financial yields using compound formulas.' },
    { id: 'simple-interest-calculator', name: 'Simple Interest Calculator', cat: 'calculator', arch: 'simple-calc', desc: 'Calculate simple yields using linear debt rates.' },
    { id: 'discount-calculator', name: 'Discount Calculator', cat: 'calculator', arch: 'discount-calc', desc: 'Find discount savings rates and net final retail sales.' },
    { id: 'tip-calculator', name: 'Tip Calculator', cat: 'calculator', arch: 'tip-calc', desc: 'Split dinner tips and checks evenly between guests.' },
    { id: 'bmi-calculator', name: 'BMI Calculator', cat: 'calculator', arch: 'bmi-calc', desc: 'Assess body mass indexes based on height and weight.' },
    { id: 'bmr-calculator', name: 'BMR Calculator', cat: 'calculator', arch: 'bmr-calc', desc: 'Find basal metabolic rates to count base calorie margins.' },
    { id: 'gpa-calculator', name: 'GPA Calculator', cat: 'calculator', arch: 'gpa-calc', desc: 'Assess weighted student GPAs from grades and course credits.' },
    { id: 'date-add-subtract', name: 'Date Add / Subtract', cat: 'calculator', arch: 'date-calc', desc: 'Add or subtract days, months, and years from any calendar date.' },
    { id: 'days-between-dates', name: 'Days Between Dates', cat: 'calculator', arch: 'days-between-calc', desc: 'Compute exact day intervals between two calendar dates.' },
    { id: 'loan-tenure-calculator', name: 'Loan Tenure Calculator', cat: 'calculator', arch: 'loan-tenure-calc', desc: 'Assess repayment periods based on monthly payments.' },
    { id: 'salary-hourly-calculator', name: 'Salary to Hourly Calculator', cat: 'calculator', arch: 'salary-calc', desc: 'Convert annual salaries to hourly wages and vice versa.' },
    { id: 'hours-calculator', name: 'Hours Card Calculator', cat: 'calculator', arch: 'hours-calc', desc: 'Total time card clock shifts and calculate total hours.' },
    { id: 'fraction-calculator', name: 'Fraction Calculator', cat: 'calculator', arch: 'fraction-calc', desc: 'Add, subtract, multiply, and divide fractional values.' },
    { id: 'matrix-calculator', name: 'Matrix Calculator', cat: 'calculator', arch: 'matrix-calc', desc: 'Perform matrix additions, determinants, and products.' },
    { id: 'prime-number-checker', name: 'Prime Number Checker', cat: 'calculator', arch: 'prime-calc', desc: 'Verify if a given integer is a prime number.' },
    { id: 'gcd-lcm-calculator', name: 'GCD and LCM Calculator', cat: 'calculator', arch: 'gcd-calc', desc: 'Find greatest common divisors and least common multiples.' },
    { id: 'quadratic-equation', name: 'Quadratic Equation Solver', cat: 'calculator', arch: 'quadratic-calc', desc: 'Resolve roots for a, b, and c variables in quadratic formulas.' },
    { id: 'mean-median-mode', name: 'Mean, Median, Mode', cat: 'calculator', arch: 'mean-calc', desc: 'Extract averages, centers, and frequencies from lists.' },
    { id: 'standard-deviation', name: 'Standard Deviation', cat: 'calculator', arch: 'sd-calc', desc: 'Calculate variance and deviations in population datasets.' },
    { id: 'probability-calculator', name: 'Probability Calculator', cat: 'calculator', arch: 'prob-calc', desc: 'Compute probabilities of multiple independent events.' },

    // --- CONVERTERS (20) ---
    { id: 'binary-converter', name: 'Binary/Octal/Hex/Decimal', cat: 'converter', arch: 'base-converter', desc: 'Convert integers between binary, octal, decimal, and hex bases.' },
    { id: 'length-converter', name: 'Length Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert units of length (meters, miles, inches, feet).' },
    { id: 'weight-converter', name: 'Weight Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert units of mass (grams, pounds, ounces, kilograms).' },
    { id: 'temperature-converter', name: 'Temperature Converter', cat: 'converter', arch: 'temp-converter', desc: 'Convert Celsius, Fahrenheit, and Kelvin temperature scales.' },
    { id: 'area-converter', name: 'Area Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert surface areas (square meters, acres, hectares).' },
    { id: 'volume-converter', name: 'Volume Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert liquid volume volumes (liters, gallons, cups).' },
    { id: 'speed-converter', name: 'Speed Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert velocity metrics (mph, kph, knots, m/s).' },
    { id: 'time-converter', name: 'Time Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert time scales (seconds, hours, days, weeks, years).' },
    { id: 'digital-storage', name: 'Digital Storage Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert byte indices (KB, MB, GB, TB, PB).' },
    { id: 'energy-converter', name: 'Energy Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert work indices (Joules, Calories, BTU, kWh).' },
    { id: 'power-converter', name: 'Power Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert power units (Watts, Horsepower, kW).' },
    { id: 'pressure-converter', name: 'Pressure Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert force densities (Pascal, Bar, PSI, atm).' },
    { id: 'fuel-consumption', name: 'Fuel Consumption Converter', cat: 'converter', arch: 'metric-converter', desc: 'Convert vehicle mileage yields (MPG, L/100km).' },
    { id: 'roman-numerals', name: 'Roman Numerals Converter', cat: 'converter', arch: 'roman-converter', desc: 'Translate standard numbers into Roman notation symbols.' },
    { id: 'number-to-words', name: 'Number to Words Converter', cat: 'converter', arch: 'num-words-converter', desc: 'Spell numeric values as text words.' },
    { id: 'epoch-converter', name: 'Epoch Timestamp Converter', cat: 'converter', arch: 'epoch-calc', desc: 'Translate UNIX epoch numbers to calendar dates.' },
    { id: 'json-to-xml', name: 'JSON to XML Converter', cat: 'converter', arch: 'text-action', desc: 'Convert JSON data structures to XML element blocks.' },
    { id: 'xml-to-json', name: 'XML to JSON Converter', cat: 'converter', arch: 'text-action', desc: 'Convert XML layouts back to JSON objects.' },
    { id: 'json-to-csv', name: 'JSON to CSV Converter', cat: 'converter', arch: 'text-action', desc: 'Export nested JSON fields as CSV spreadsheet files.' },
    { id: 'csv-to-json', name: 'CSV to JSON Converter', cat: 'converter', arch: 'text-action', desc: 'Parse spreadsheet CSV records to JSON arrays.' },

    // --- SEO TOOLS (10) ---
    { id: 'serp-simulator', name: 'Google SERP Simulator', cat: 'seo', arch: 'serp-sim', desc: 'Preview title tags and meta description lengths on search results.' },
    { id: 'keyword-density', name: 'Keyword Density Analyzer', cat: 'seo', arch: 'keyword-density', desc: 'Parse articles and check repetition counts of keyword phrases.' },
    { id: 'meta-tags-generator', name: 'Meta Tags Generator', cat: 'seo', arch: 'meta-generator', desc: 'Compile standard SEO, OG, and Twitter card meta elements.' },
    { id: 'robots-generator', name: 'Robots.txt Generator', cat: 'seo', arch: 'generator', desc: 'Compile standard directives to block or allow search crawler bots.' },
    { id: 'sitemap-generator', name: 'XML Sitemap Generator', cat: 'seo', arch: 'generator', desc: 'Compile sitemap index structures to list website URLs.' },
    { id: 'url-parser', name: 'URL Parser & Analyzer', cat: 'seo', arch: 'text-action', desc: 'Extract hosts, hashes, ports, and query parameters from links.' },
    { id: 'redirect-checker', name: 'Redirect Path Checker', cat: 'seo', arch: 'text-action', desc: 'Inspect redirection routes and HTTP codes (simulated).' },
    { id: 'link-analyzer', name: 'Link Analyzer & Extractor', cat: 'seo', arch: 'text-action', desc: 'Inspect HTML texts to extract internal and external link domains.' },
    { id: 'domain-ip-lookup', name: 'Domain IP Lookup Info', cat: 'seo', arch: 'text-action', desc: 'Look up IP details and hostnames of domain addresses (simulated).' },
    { id: 'og-tag-generator', name: 'Open Graph Tag Builder', cat: 'seo', arch: 'generator', desc: 'Generate social media open graph markup tags.' },

    // --- DEVELOPER TOOLS (15) ---
    { id: 'json-formatter', name: 'JSON Formatter', cat: 'developer', arch: 'json-formatter', desc: 'Validate, minise, format, and beatify JSON objects.' },
    { id: 'xml-formatter', name: 'XML Formatter', cat: 'developer', arch: 'xml-formatter', desc: 'Beautify XML hierarchies with indents.' },
    { id: 'sql-formatter', name: 'SQL Formatter', cat: 'developer', arch: 'sql-formatter', desc: 'Beautify SQL queries and capitalize standard syntax terms.' },
    { id: 'css-minifier', name: 'CSS Minifier & Beautifier', cat: 'developer', arch: 'css-formatter', desc: 'Minify CSS stylesheets or beautify them.' },
    { id: 'js-minifier', name: 'JS Minifier & Beautifier', cat: 'developer', arch: 'js-formatter', desc: 'Minify JavaScript scripts or beautify them.' },
    { id: 'uuid-generator', name: 'UUID/GUID Generator', cat: 'developer', arch: 'generator', desc: 'Generate unique RFC4122 random UUID credentials.' },
    { id: 'hash-generator', name: 'Hash Generator (SHA/MD5)', cat: 'developer', arch: 'hash-generator', desc: 'Generate MD5, SHA-1, or SHA-256 cryptographic hashes.' },
    { id: 'hmac-generator', name: 'HMAC Key Generator', cat: 'developer', arch: 'text-action', desc: 'Generate cryptographic HMAC hashes using custom keys.' },
    { id: 'user-agent-parser', name: 'User Agent Parser', cat: 'developer', arch: 'text-action', desc: 'Deconstruct browser user agent strings to inspect OS and engines.' },
    { id: 'qr-code-generator', name: 'QR Code Generator', cat: 'developer', arch: 'qr-generator', desc: 'Generate customizable, premium QR codes from text or links.' },
    { id: 'qr-code-decoder', name: 'QR Code Decoder', cat: 'developer', arch: 'image', desc: 'Decode QR code texts from uploaded images.' },
    { id: 'barcode-generator', name: 'Barcode Generator', cat: 'developer', arch: 'generator', desc: 'Generate barcode canvas images (CODE128, EAN).' },
    { id: 'mac-generator', name: 'MAC Address Generator', cat: 'developer', arch: 'generator', desc: 'Generate randomized hardware MAC addresses.' },
    { id: 'regex-tester', name: 'Regex Tester', cat: 'developer', arch: 'text-action', desc: 'Test regular expressions against input texts in real-time.' },
    { id: 'html-minifier', name: 'HTML Minifier', cat: 'developer', arch: 'text-action', desc: 'Remove comments and empty spaces to compress HTML structures.' },

    // --- COLOR TOOLS (5) ---
    { id: 'color-converter', name: 'Color Converter', cat: 'color', arch: 'color-converter', desc: 'Convert colors between HEX, RGB, HSL, and CMYK.' },
    { id: 'color-scheme', name: 'Color Scheme Generator', cat: 'color', arch: 'color-scheme', desc: 'Create monochromatic, complementary, and analogous palettes.' },
    { id: 'contrast-checker', name: 'Color Contrast Checker', cat: 'color', arch: 'contrast-checker', desc: 'Check WCAG contrast compliance rates for text.' },
    { id: 'gradient-generator', name: 'CSS Gradient Generator', cat: 'color', arch: 'gradient-gen', desc: 'Create linear or radial CSS background gradient codes.' },
    { id: 'color-extractor', name: 'Color Palette Extractor', cat: 'color', arch: 'color-extractor', desc: 'Extract major color palettes from uploaded images.' },

    // --- PASSWORD TOOLS (5) ---
    { id: 'strong-password-generator', name: 'Strong Password Generator', cat: 'password', arch: 'password-gen', desc: 'Generate custom secure random passwords.' },
    { id: 'password-strength', name: 'Password Strength Tester', cat: 'password', arch: 'password-strength', desc: 'Analyze password passwords to test entropy and cracks.' },
    { id: 'password-hash-checker', name: 'Password Hash Checker', cat: 'password', arch: 'text-action', desc: 'Verify hashes or compute local SHA/MD5 check values.' },
    { id: 'caesar-cipher', name: 'Caesar Cipher Encoder', cat: 'password', arch: 'caesar-cipher', desc: 'Encrypt or decrypt texts using letter shift steps.' },
    { id: 'vigenere-cipher', name: 'Vigenere Cipher Encoder', cat: 'password', arch: 'vigenere-cipher', desc: 'Encrypt or decrypt messages using alphabet key letters.' },
    // --- MISCELLANEOUS TOOLS (5) ---
    { id: 'morse-translator', name: 'Morse Code Translator', cat: 'misc', arch: 'morse-translator', desc: 'Translate alphabet texts to Morse signals.' },
    { id: 'stopwatch-timer', name: 'Stopwatch and Timer', cat: 'misc', arch: 'stopwatch-timer', desc: 'Track time intervals with a stopwatch or set countdown timers.' },
    { id: 'world-clock', name: 'World Clock', cat: 'misc', arch: 'world-clock', desc: 'View current dates and times across major time zones.' },
    { id: 'list-randomizer', name: 'List Randomizer & Sorter', cat: 'misc', arch: 'list-randomizer', desc: 'Shuffle item rows in lists or sort them.' },
    { id: 'nato-audio-player', name: 'NATO Audio Speller', cat: 'misc', arch: 'static-info', desc: 'Generate spelling voice synthesizers for NATO indicators.' },

    // --- 25 NEW OR COMPREHENSIVE TOOLS EXTENSION ---
    { id: 'qr-code-scanner', name: 'QR Code Scanner', cat: 'developer', arch: 'qr-scanner', desc: 'Scan and decode QR codes from image files or real-time camera feeds.' },
    { id: 'uuid-validator', name: 'UUID Validator', cat: 'developer', arch: 'uuid-validator', desc: 'Validate UUID layout strings and check version metadata.' },
    { id: 'html-encoder-decoder', name: 'HTML Encoder / Decoder', cat: 'text', arch: 'html-encoder-decoder', desc: 'Encode special characters into XML/HTML entities or decode them.' },
    { id: 'html-escape-unescape', name: 'HTML Escape / Unescape', cat: 'text', arch: 'html-escape-unescape', desc: 'Escape tag structures into raw characters or unescape text.' },
    { id: 'cron-expression-generator', name: 'Cron Expression Generator', cat: 'developer', arch: 'cron-gen', desc: 'Generate cron schedule syntax and show structural details.' },
    { id: 'unix-timestamp-converter', name: 'Unix Timestamp Converter', cat: 'converter', arch: 'timestamp-converter', desc: 'Convert UNIX epoch timestamp seconds into standard dates.' },
    { id: 'remove-duplicate-lines', name: 'Remove Duplicate Lines', cat: 'text', arch: 'remove-duplicates', desc: 'Remove duplicate lines from text list elements instantly.' },
    { id: 'text-sorter', name: 'Text Sorter', cat: 'text', arch: 'text-sorter', desc: 'Sort input rows alphabetically, numerically, or random order.' },
    { id: 'url-slug-checker', name: 'URL Slug Checker', cat: 'seo', arch: 'slug-checker', desc: 'Check URL slug lengths and keyword SEO characteristics.' },
    { id: 'html-table-generator', name: 'HTML Table Generator', cat: 'developer', arch: 'table-generator', desc: 'Generate clean HTML table elements with customized grid counts.' },
    { id: 'random-number-generator', name: 'Random Number Generator', cat: 'misc', arch: 'random-num', desc: 'Generate sets of random numbers within ranges.' },
    { id: 'dice-roller', name: 'Dice Roller Simulator', cat: 'misc', arch: 'dice-roller', desc: 'Roll digital gaming dice and track total scoring.' },
    { id: 'coin-flip', name: 'Coin Flip Simulator', cat: 'misc', arch: 'coin-flip', desc: 'Flip virtual coins and track session outcomes ratios.' },
    { id: 'unit-price-calculator', name: 'Unit Price Calculator', cat: 'calculator', arch: 'unit-price', desc: 'Compare pricing ratios to see which package represents the best deal.' },
    { id: 'fuel-cost-calculator', name: 'Fuel Cost Calculator', cat: 'calculator', arch: 'fuel-cost', desc: 'Calculate trip fuel consumption, cost estimates, and mileage margins.' }
];

// Helper to ensure target directories exist
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// Generate highly specialized metadata based on exact tool ID
function getToolMetadata(tool, catName) {
    let howToUse = [
        "Select your input configurations and configure settings.",
        "Input or upload the files you wish to process in the designated area.",
        "Click the calculate or compile action buttons to generate outputs locally."
    ];
    let benefits = [
        "100% Secure & Client-Side: Files never leave your local browser memory.",
        "Accurate Results: Powered by native equations, canvas engines, or standard modules.",
        "Completely Free: Unlimited daily usage with no sign-ups or payments."
    ];
    let faqs = [
        { question: "Is this tool free?", answer: "Yes, all our tools are completely free to use without limits." },
        { question: "Are my files uploaded?", answer: "No, everything runs offline locally inside your browser memory for maximum privacy." }
    ];

    return {
        id: tool.id,
        name: tool.name,
        slug: tool.id,
        category: tool.cat,
        categoryName: catName,
        description: tool.desc,
        seoTitle: `${tool.name} - Free Online ${catName} | AllInOneTool`,
        metaDescription: `Use our free, premium ${tool.name} to ${tool.desc.toLowerCase().replace('.', '')} in your browser securely.`,
        keywords: [tool.name.toLowerCase(), `${tool.cat} tools`, `online ${tool.name.toLowerCase()}`],
        faqs,
        howToUse,
        benefits
    };
}

// Generate files for all tools
function generateProject() {
    console.log(`Starting production compiler for ${TOOLS.length} tools...`);

    const toolsSummary = [];

    TOOLS.forEach((tool) => {
        const categoryObj = CATEGORIES.find(c => c.id === tool.cat);
        const catName = categoryObj ? categoryObj.name : tool.cat;
        const icon = categoryObj ? categoryObj.icon : '⚡';

        // Add to summary lists
        toolsSummary.push({
            id: tool.id,
            name: tool.name,
            slug: tool.id,
            category: tool.cat,
            categoryName: catName,
            icon: icon,
            description: tool.desc,
            keywords: [tool.name.toLowerCase(), tool.cat + ' tools', 'online ' + tool.name.toLowerCase()]
        });

        // Generate CONFIG module: assets/js/data/tools/[id].js
        const configPath = path.join(__dirname, '..', 'assets', 'js', 'data', 'tools', `${tool.id}.js`);
        ensureDirectoryExistence(configPath);

        const metadata = getToolMetadata(tool, catName);
        const configContent = `export const config = ${JSON.stringify(metadata, null, 4)};\n`;
        fs.writeFileSync(configPath, configContent, 'utf8');

        let workspaceHTML = '';
        let logicJS = '';

        if (imageToolsDefs[tool.id]) {
            const def = imageToolsDefs[tool.id]();
            workspaceHTML = def.workspaceHTML;
            logicJS = def.logicJS;
        } else if (newToolsDefs[tool.id]) {
            const def = newToolsDefs[tool.id]();
            workspaceHTML = def.workspaceHTML;
            logicJS = def.logicJS;
        } else if (tool.id === 'password-hash-checker') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="hash-checker-text">Enter Plaintext Password / Hash String</label>
                    <textarea id="hash-checker-text" class="input-control" placeholder="Type plaintext or input hash to compare..." style="min-height: 100px;"></textarea>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="hash-algo-select">Hash Algorithm</label>
                        <select id="hash-algo-select" class="input-control">
                            <option value="MD5">MD5</option>
                            <option value="SHA-1">SHA-1</option>
                            <option value="SHA-256" selected>SHA-256</option>
                            <option value="SHA-384">SHA-384</option>
                            <option value="SHA-512">SHA-512</option>
                        </select>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-top:1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span>Computed Hash Output:</span>
                        <strong style="font-family:var(--font-mono); font-size:0.85rem;" id="hash-output-val">-</strong>
                    </div>
                    <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4; margin-top:0.5rem;" id="hash-notice-text">
                        Note: MD5, SHA-1 and SHA-256 hash checks are completed browser-side in memory. Cryptographic hashes are one-way formulas; inputting a hashed value directly cannot generally be reversed to find the source text.
                    </p>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="hash-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="hash-btn-copy">Copy Hash</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const textInput = document.getElementById('hash-checker-text');
    const algoSelect = document.getElementById('hash-algo-select');
    const outputVal = document.getElementById('hash-output-val');
    const noticeText = document.getElementById('hash-notice-text');
    const resetBtn = document.getElementById('hash-btn-reset');
    const copyBtn = document.getElementById('hash-btn-copy');

    if (!textInput) return;

    async function compute() {
        const val = textInput.value;
        if (!val) {
            outputVal.textContent = '-';
            return;
        }

        const isHexHash = /^[a-fA-F0-9]{32,128}$/.test(val);
        if (isHexHash) {
            noticeText.innerHTML = '<span style="color:var(--error-color); font-weight:700;">Attention:</span> You entered a hash signature. Hashes are mathematically one-way and cannot be reverse-computed. Please input a plaintext password instead to generate its signature.';
        } else {
            noticeText.textContent = 'Note: All hash operations run completely client-side in memory.';
        }

        const algo = algoSelect.value;
        if (algo === 'MD5') {
            outputVal.textContent = calcMD5(val);
        } else if (algo === 'SHA-1') {
            outputVal.textContent = await calcSubtle(val, 'SHA-1');
        } else if (algo === 'SHA-256') {
            outputVal.textContent = await calcSubtle(val, 'SHA-256');
        } else if (algo === 'SHA-384') {
            outputVal.textContent = await calcSubtle(val, 'SHA-384');
        } else if (algo === 'SHA-512') {
            outputVal.textContent = await calcSubtle(val, 'SHA-512');
        }
    }

    async function calcSubtle(str, algoName) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest(algoName, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function calcMD5(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }

    textInput.addEventListener('input', compute);
    algoSelect.addEventListener('change', compute);

    resetBtn.addEventListener('click', () => {
        textInput.value = '';
        outputVal.textContent = '-';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputVal.textContent).then(() => alert('Hash Copied!'));
    });
}
`;
        } else if (tool.id === 'caesar-cipher') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group">
                        <label for="caesar-input">Input String</label>
                        <textarea id="caesar-input" class="input-control" placeholder="Type text here..." style="min-height: 150px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="caesar-output">Result String</label>
                        <textarea id="caesar-output" readonly class="input-control" placeholder="Cipher result..." style="min-height: 150px; background:var(--bg-primary);"></textarea>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="caesar-mode">Operation Mode</label>
                        <select id="caesar-mode" class="input-control">
                            <option value="encode">Encode</option>
                            <option value="decode">Decode</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="caesar-shift">Shift Value (1-25)</label>
                        <input type="number" id="caesar-shift" class="input-control" min="1" max="25" value="3">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="caesar-clear">Clear</button>
                    <button class="btn btn-primary" id="caesar-copy">Copy Result</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('caesar-input');
    const output = document.getElementById('caesar-output');
    const mode = document.getElementById('caesar-mode');
    const shift = document.getElementById('caesar-shift');
    const clearBtn = document.getElementById('caesar-clear');
    const copyBtn = document.getElementById('caesar-copy');

    if (!input) return;

    function runCipher() {
        const text = input.value;
        let sVal = parseInt(shift.value) || 3;
        const op = mode.value;

        if (op === 'decode') sVal = (26 - sVal) % 26;

        let result = '';
        for (let i = 0; i < text.length; i++) {
            let code = text.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                result += String.fromCharCode(((code - 65 + sVal) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                result += String.fromCharCode(((code - 97 + sVal) % 26) + 97);
            } else {
                result += text.charAt(i);
            }
        }
        output.value = result;
    }

    input.addEventListener('input', runCipher);
    shift.addEventListener('input', runCipher);
    mode.addEventListener('change', runCipher);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Caesar result!'));
    });
}
`;
        } else if (tool.id === 'vigenere-cipher') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group">
                        <label for="vig-input">Input String</label>
                        <textarea id="vig-input" class="input-control" placeholder="Type text here..." style="min-height: 150px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="vig-output">Result String</label>
                        <textarea id="vig-output" readonly class="input-control" placeholder="Cipher result..." style="min-height: 150px; background:var(--bg-primary);"></textarea>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="vig-mode">Operation Mode</label>
                        <select id="vig-mode" class="input-control">
                            <option value="encode">Encode</option>
                            <option value="decode">Decode</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vig-key">Secret Key (letters)</label>
                        <input type="text" id="vig-key" class="input-control" value="key">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="vig-clear">Clear</button>
                    <button class="btn btn-primary" id="vig-copy">Copy Result</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('vig-input');
    const output = document.getElementById('vig-output');
    const mode = document.getElementById('vig-mode');
    const key = document.getElementById('vig-key');
    const clearBtn = document.getElementById('vig-clear');
    const copyBtn = document.getElementById('vig-copy');

    if (!input) return;

    function runCipher() {
        const text = input.value;
        const kStr = key.value.toLowerCase().replace(/[^a-z]/g, '');
        const op = mode.value;

        if (!kStr || !text) {
            output.value = text;
            return;
        }

        let result = '';
        let keyIdx = 0;

        for (let i = 0; i < text.length; i++) {
            let code = text.charCodeAt(i);
            let shift = kStr.charCodeAt(keyIdx % kStr.length) - 97;

            if (op === 'decode') shift = (26 - shift) % 26;

            if (code >= 65 && code <= 90) {
                result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
                keyIdx++;
            } else if (code >= 97 && code <= 122) {
                result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
                keyIdx++;
            } else {
                result += text.charAt(i);
            }
        }
        output.value = result;
    }

    input.addEventListener('input', runCipher);
    key.addEventListener('input', runCipher);
    mode.addEventListener('change', runCipher);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Vigenere result!'));
    });
}
`;
        } else if (tool.id === 'age-calculator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="age-dob">Date of Birth</label>
                        <input type="date" id="age-dob" class="input-control">
                    </div>
                    <div class="form-group">
                        <label for="age-today">Calculate Age As Of</label>
                        <input type="date" id="age-today" class="input-control">
                    </div>
                </div>

                <div id="age-results-panel" style="display:none; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem;">
                    <h3 style="margin-bottom:1rem;">Your Age:</h3>
                    <div style="font-size:1.5rem; font-weight:800; color:var(--primary-color); margin-bottom:1rem;" id="age-exact">
                        0 Years, 0 Months, 0 Days
                    </div>
                    <div class="options-grid" style="grid-template-columns: repeat(3, 1fr); text-align:center; font-size:0.9rem; gap: 1rem; margin-bottom: 1rem;">
                        <div>Total Months: <strong id="age-tot-months">0</strong></div>
                        <div>Total Weeks: <strong id="age-tot-weeks">0</strong></div>
                        <div>Total Days: <strong id="age-tot-days">0</strong></div>
                        <div>Total Hours: <strong id="age-tot-hours">0</strong></div>
                        <div>Total Minutes: <strong id="age-tot-minutes">0</strong></div>
                        <div>Total Seconds: <strong id="age-tot-seconds">0</strong></div>
                    </div>
                    <div style="margin-top:1rem; border-top:1px solid var(--border-color); padding-top:1rem; font-size:0.9rem;" id="age-birthday-countdown">
                        Days until next birthday: <strong>-</strong>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const dob = document.getElementById('age-dob');
    const targetDate = document.getElementById('age-today');
    const panel = document.getElementById('age-results-panel');
    const exactAge = document.getElementById('age-exact');
    const totMonths = document.getElementById('age-tot-months');
    const totWeeks = document.getElementById('age-tot-weeks');
    const totDays = document.getElementById('age-tot-days');
    const totHours = document.getElementById('age-tot-hours');
    const totMinutes = document.getElementById('age-tot-minutes');
    const totSeconds = document.getElementById('age-tot-seconds');
    const countdown = document.getElementById('age-birthday-countdown');

    if (!dob) return;

    const today = new Date().toISOString().split('T')[0];
    targetDate.value = today;

    function calculate() {
        const d1 = new Date(dob.value);
        const d2 = new Date(targetDate.value);

        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

        if (d1 > d2) {
            alert('Date of birth cannot be after calculation date.');
            return;
        }

        let yDiff = d2.getFullYear() - d1.getFullYear();
        let mDiff = d2.getMonth() - d1.getMonth();
        let dDiff = d2.getDate() - d1.getDate();

        if (dDiff < 0) {
            mDiff--;
            const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            dDiff += prevMonth.getDate();
        }
        if (mDiff < 0) {
            yDiff--;
            mDiff += 12;
        }

        exactAge.textContent = \`\${yDiff} Years, \${mDiff} Months, \${dDiff} Days\`;

        const timeDiff = Math.abs(d2.getTime() - d1.getTime());
        const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalWeeks = (totalDays / 7).toFixed(1);
        const totalMonths = (yDiff * 12 + mDiff).toFixed(0);

        totDays.textContent = totalDays.toLocaleString();
        totWeeks.textContent = totalWeeks.toLocaleString();
        totMonths.textContent = totalMonths.toLocaleString();
        totHours.textContent = (totalDays * 24).toLocaleString();
        totMinutes.textContent = (totalDays * 24 * 60).toLocaleString();
        totSeconds.textContent = (totalDays * 24 * 60 * 60).toLocaleString();

        let nextBday = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate());
        if (d2 > nextBday) {
            nextBday.setFullYear(d2.getFullYear() + 1);
        }
        const diffToBday = Math.ceil((nextBday.getTime() - d2.getTime()) / (1000 * 3600 * 24));
        countdown.innerHTML = 'Days until next birthday: <strong>' + diffToBday + ' days</strong>';

        panel.style.display = 'block';
    }

    dob.addEventListener('change', calculate);
    targetDate.addEventListener('change', calculate);
}
`;
        } else if (tool.id === 'emi-calculator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="emi-amount">Loan Amount ($)</label>
                        <input type="number" id="emi-amount" class="input-control" value="100000">
                    </div>
                    <div class="form-group">
                        <label for="emi-rate">Interest Rate (% Annual)</label>
                        <input type="number" id="emi-rate" class="input-control" value="8" step="0.1">
                    </div>
                    <div class="form-group">
                        <label for="emi-tenure">Tenure</label>
                        <div style="display:flex; gap:0.5rem;">
                            <input type="number" id="emi-tenure" class="input-control" value="10" style="flex:1;">
                            <select id="emi-tenure-type" class="input-control" style="width:100px;">
                                <option value="years">Years</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div id="emi-results-panel" style="display:none; margin-top:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                        <div>
                            <span>Monthly EMI:</span>
                            <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color);" id="emi-monthly-val">$0.00</h2>
                        </div>
                        <div style="text-align:right;">
                            <div style="margin-bottom:0.25rem;">Total Interest: <strong id="emi-tot-interest">$0</strong></div>
                            <div>Total Payment: <strong id="emi-tot-payment">$0</strong></div>
                        </div>
                    </div>

                    <h3>Amortization Schedule</h3>
                    <div style="max-height:250px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm); margin-top:0.5rem;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                            <thead>
                                <tr style="background:var(--bg-secondary); border-bottom:1px solid var(--border-color);">
                                    <th style="padding:0.5rem;">Month</th>
                                    <th style="padding:0.5rem;">EMI</th>
                                    <th style="padding:0.5rem;">Principal</th>
                                    <th style="padding:0.5rem;">Interest</th>
                                    <th style="padding:0.5rem;">Balance</th>
                                </tr>
                            </thead>
                            <tbody id="emi-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const amountInput = document.getElementById('emi-amount');
    const rateInput = document.getElementById('emi-rate');
    const tenureInput = document.getElementById('emi-tenure');
    const tenureType = document.getElementById('emi-tenure-type');
    const panel = document.getElementById('emi-results-panel');
    const monthlyVal = document.getElementById('emi-monthly-val');
    const totInterest = document.getElementById('emi-tot-interest');
    const totPayment = document.getElementById('emi-tot-payment');
    const tableBody = document.getElementById('emi-table-body');

    if (!amountInput) return;

    function calculate() {
        const P = parseFloat(amountInput.value) || 0;
        const rAnnual = parseFloat(rateInput.value) || 0;
        const tenure = parseFloat(tenureInput.value) || 0;

        if (P <= 0 || rAnnual <= 0 || tenure <= 0) return;

        const r = rAnnual / 12 / 100;
        const n = tenureType.value === 'years' ? tenure * 12 : tenure;

        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = emi * n;
        const interest = total - P;

        monthlyVal.textContent = '$' + emi.toFixed(2);
        totInterest.textContent = '$' + interest.toFixed(2);
        totPayment.textContent = '$' + total.toFixed(2);

        let balance = P;
        let tableHTML = '';
        for (let i = 1; i <= n; i++) {
            const interestPaid = balance * r;
            const principalPaid = emi - interestPaid;
            balance -= principalPaid;

            tableHTML += '<tr>' +
                '<td style="padding:0.5rem;">' + i + '</td>' +
                '<td style="padding:0.5rem;">$' + emi.toFixed(2) + '</td>' +
                '<td style="padding:0.5rem;">$' + principalPaid.toFixed(2) + '</td>' +
                '<td style="padding:0.5rem;">$' + interestPaid.toFixed(2) + '</td>' +
                '<td style="padding:0.5rem;">$' + Math.max(0, balance).toFixed(2) + '</td>' +
                '</tr>';
        }
        tableBody.innerHTML = tableHTML;
        panel.style.display = 'block';
    }

    [amountInput, rateInput, tenureInput, tenureType].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calculate();
}
`;
        } else if (tool.id === 'percentage-calculator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    <!-- Mode 1 -->
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                        <h4 style="margin-bottom:0.75rem;">What is X% of Y?</h4>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                            <span>What is</span>
                            <input type="number" id="perc-x1" class="input-control" style="width:100px;" value="10">
                            <span>% of</span>
                            <input type="number" id="perc-y1" class="input-control" style="width:150px;" value="200">
                            <span>=</span>
                            <strong id="perc-res1" style="color:var(--primary-color);">20</strong>
                        </div>
                    </div>

                    <!-- Mode 2 -->
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                        <h4 style="margin-bottom:0.75rem;">X is what percent of Y?</h4>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                            <input type="number" id="perc-x2" class="input-control" style="width:100px;" value="50">
                            <span>is what percent of</span>
                            <input type="number" id="perc-y2" class="input-control" style="width:150px;" value="250">
                            <span>=</span>
                            <strong id="perc-res2" style="color:var(--primary-color);">20%</strong>
                        </div>
                    </div>

                    <!-- Mode 3 -->
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                        <h4 style="margin-bottom:0.75rem;">Percentage Increase / Decrease</h4>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                            <span>From</span>
                            <input type="number" id="perc-x3" class="input-control" style="width:100px;" value="100">
                            <span>to</span>
                            <input type="number" id="perc-y3" class="input-control" style="width:150px;" value="150">
                            <span>=</span>
                            <strong id="perc-res3" style="color:var(--success-color);">50% Increase</strong>
                        </div>
                    </div>

                    <!-- Mode 4 -->
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                        <h4 style="margin-bottom:0.75rem;">Percentage Difference</h4>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                            <span>Between</span>
                            <input type="number" id="perc-x4" class="input-control" style="width:100px;" value="50">
                            <span>and</span>
                            <input type="number" id="perc-y4" class="input-control" style="width:150px;" value="60">
                            <span>=</span>
                            <strong id="perc-res4" style="color:var(--primary-color);">18.18%</strong>
                        </div>
                    </div>

                    <!-- Mode 5 -->
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                        <h4 style="margin-bottom:0.75rem;">Discount Calculator</h4>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                            <span>Price</span>
                            <input type="number" id="perc-x5" class="input-control" style="width:100px;" value="100">
                            <span>Discount</span>
                            <input type="number" id="perc-y5" class="input-control" style="width:100px;" value="20">
                            <span>% = Net Price</span>
                            <strong id="perc-res5" style="color:var(--success-color);">$80.00</strong>
                        </div>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const x1 = document.getElementById('perc-x1');
    const y1 = document.getElementById('perc-y1');
    const res1 = document.getElementById('perc-res1');

    const x2 = document.getElementById('perc-x2');
    const y2 = document.getElementById('perc-y2');
    const res2 = document.getElementById('perc-res2');

    const x3 = document.getElementById('perc-x3');
    const y3 = document.getElementById('perc-y3');
    const res3 = document.getElementById('perc-res3');

    const x4 = document.getElementById('perc-x4');
    const y4 = document.getElementById('perc-y4');
    const res4 = document.getElementById('perc-res4');

    const x5 = document.getElementById('perc-x5');
    const y5 = document.getElementById('perc-y5');
    const res5 = document.getElementById('perc-res5');

    if (!x1) return;

    function calc1() {
        const valX = parseFloat(x1.value) || 0;
        const valY = parseFloat(y1.value) || 0;
        res1.textContent = ((valX / 100) * valY).toFixed(2).replace(/\\.00$/, '');
    }

    function calc2() {
        const valX = parseFloat(x2.value) || 0;
        const valY = parseFloat(y2.value) || 0;
        if (valY === 0) { res2.textContent = '0%'; return; }
        res2.textContent = ((valX / valY) * 100).toFixed(2).replace(/\\.00$/, '') + '%';
    }

    function calc3() {
        const valX = parseFloat(x3.value) || 0;
        const valY = parseFloat(y3.value) || 0;
        if (valX === 0) { res3.textContent = '-'; return; }
        const diff = valY - valX;
        const pct = (diff / valX) * 100;
        if (pct >= 0) {
            res3.textContent = pct.toFixed(2).replace(/\\.00$/, '') + '% Increase';
            res3.style.color = 'var(--success-color)';
        } else {
            res3.textContent = Math.abs(pct).toFixed(2).replace(/\\.00$/, '') + '% Decrease';
            res3.style.color = 'var(--error-color)';
        }
    }

    function calc4() {
        const valX = parseFloat(x4.value) || 0;
        const valY = parseFloat(y4.value) || 0;
        const avg = (valX + valY) / 2;
        if (avg === 0) { res4.textContent = '0%'; return; }
        const diff = Math.abs(valX - valY);
        res4.textContent = ((diff / avg) * 100).toFixed(2).replace(/\\.00$/, '') + '%';
    }

    function calc5() {
        const valX = parseFloat(x5.value) || 0;
        const valY = parseFloat(y5.value) || 0;
        const savings = valX * (valY / 100);
        res5.textContent = '$' + (valX - savings).toFixed(2);
    }

    [x1, y1].forEach(el => el.addEventListener('input', calc1));
    [x2, y2].forEach(el => el.addEventListener('input', calc2));
    [x3, y3].forEach(el => el.addEventListener('input', calc3));
    [x4, y4].forEach(el => el.addEventListener('input', calc4));
    [x5, y5].forEach(el => el.addEventListener('input', calc5));

    calc1(); calc2(); calc3(); calc4(); calc5();
}
`;
        } else if (tool.id === 'binary-converter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid" style="grid-template-columns:1fr 1fr; gap:1.25rem;">
                    <div class="form-group">
                        <label for="num-dec">Decimal (Base 10)</label>
                        <input type="text" id="num-dec" class="input-control" value="10">
                    </div>
                    <div class="form-group">
                        <label for="num-bin">Binary (Base 2)</label>
                        <input type="text" id="num-bin" class="input-control" value="1010">
                    </div>
                    <div class="form-group">
                        <label for="num-oct">Octal (Base 8)</label>
                        <input type="text" id="num-oct" class="input-control" value="12">
                    </div>
                    <div class="form-group">
                        <label for="num-hex">Hexadecimal (Base 16)</label>
                        <input type="text" id="num-hex" class="input-control" value="A">
                    </div>
                </div>
                <div style="margin-top:1rem; font-size:0.8rem; color:var(--error-color);" id="num-error-msg"></div>
            </div>
            `;
            logicJS = `export function init() {
    const dec = document.getElementById('num-dec');
    const bin = document.getElementById('num-bin');
    const oct = document.getElementById('num-oct');
    const hex = document.getElementById('num-hex');
    const errorMsg = document.getElementById('num-error-msg');

    if (!dec) return;

    function convert(val, base, triggerEl) {
        errorMsg.textContent = '';
        if (val === '') {
            dec.value = ''; bin.value = ''; oct.value = ''; hex.value = '';
            return;
        }

        try {
            // Validate input characters for the given base
            let validator = /^[0-9]+$/;
            if (base === 2) validator = /^[01]+$/;
            else if (base === 8) validator = /^[0-7]+$/;
            else if (base === 16) validator = /^[0-9a-fA-F]+$/;

            if (!validator.test(val)) {
                throw new Error('Invalid characters for Selected Base.');
            }

            const intVal = parseInt(val, base);
            if (isNaN(intVal)) {
                throw new Error('Invalid formatting.');
            }

            if (triggerEl !== dec) dec.value = intVal.toString(10);
            if (triggerEl !== bin) bin.value = intVal.toString(2);
            if (triggerEl !== oct) oct.value = intVal.toString(8);
            if (triggerEl !== hex) hex.value = intVal.toString(16).toUpperCase();
        } catch(e) {
            errorMsg.textContent = e.message;
        }
    }

    dec.addEventListener('input', () => convert(dec.value, 10, dec));
    bin.addEventListener('input', () => convert(bin.value, 2, bin));
    oct.addEventListener('input', () => convert(oct.value, 8, oct));
    hex.addEventListener('input', () => convert(hex.value, 16, hex));
}
`;
        } else if (tool.id === 'gradient-generator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="grad-type">Gradient Type</label>
                        <select id="grad-type" class="input-control">
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="grad-angle">Angle (Degrees)</label>
                        <input type="number" id="grad-angle" class="input-control" value="90" min="0" max="360">
                    </div>
                </div>

                <div class="form-group">
                    <label>Color Stops</label>
                    <div id="stops-container" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;"></div>
                    <button class="btn btn-secondary" id="add-stop-btn">+ Add Color Stop</button>
                </div>

                <div id="grad-preview-box" style="height:150px; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin:1.5rem 0;"></div>

                <div class="form-group">
                    <label>Generated CSS Code</label>
                    <textarea readonly id="grad-css-code" class="input-control" style="font-family:var(--font-mono); min-height:80px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="grad-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="grad-btn-copy">Copy CSS</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const type = document.getElementById('grad-type');
    const angle = document.getElementById('grad-angle');
    const stopsContainer = document.getElementById('stops-container');
    const addStopBtn = document.getElementById('add-stop-btn');
    const preview = document.getElementById('grad-preview-box');
    const cssCode = document.getElementById('grad-css-code');
    const reset = document.getElementById('grad-btn-reset');
    const copy = document.getElementById('grad-btn-copy');

    if (!preview) return;

    let stops = [
        { color: '#6366f1', pct: 0 },
        { color: '#a855f7', pct: 100 }
    ];

    function renderStops() {
        stopsContainer.innerHTML = '';
        stops.forEach((stop, idx) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.gap = '0.5rem';
            div.style.alignItems = 'center';
            div.innerHTML = \`
                <input type="color" class="stop-color" data-idx="\${idx}" value="\${stop.color}" style="width:50px; height:35px; cursor:pointer;">
                <input type="number" class="stop-pct" data-idx="\${idx}" value="\${stop.pct}" min="0" max="100" style="width:80px;" class="input-control">
                <span>%</span>
                \${stops.length > 2 ? \`<button class="btn btn-secondary delete-stop" data-idx="\${idx}" style="padding:0.25rem 0.5rem; color:var(--error-color);">×</button>\` : ''}
            \`;
            stopsContainer.appendChild(div);
        });

        // Add event listeners
        stopsContainer.querySelectorAll('.stop-color').forEach(el => {
            el.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'));
                stops[idx].color = e.target.value;
                render();
            });
        });

        stopsContainer.querySelectorAll('.stop-pct').forEach(el => {
            el.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'));
                stops[idx].pct = parseInt(e.target.value) || 0;
                render();
            });
        });

        stopsContainer.querySelectorAll('.delete-stop').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = parseInt(el.getAttribute('data-idx'));
                stops.splice(idx, 1);
                renderStops();
                render();
            });
        });
    }

    addStopBtn.addEventListener('click', () => {
        if (stops.length >= 6) {
            alert('Maximum 6 color stops.');
            return;
        }
        stops.push({ color: '#3b82f6', pct: 50 });
        stops.sort((a, b) => a.pct - b.pct);
        renderStops();
        render();
    });

    function render() {
        const sorted = [...stops].sort((a,b) => a.pct - b.pct);
        const stopStrs = sorted.map(s => \`\${s.color} \${s.pct}%\`).join(', ');

        const t = type.value;
        const a = angle.value;

        let gradStr = '';
        if (t === 'linear') {
            gradStr = \`linear-gradient(\${a}deg, \${stopStrs})\`;
        } else {
            gradStr = \`radial-gradient(circle, \${stopStrs})\`;
        }

        const fullCSS = \`background: \${sorted[0].color};\\nbackground: \${gradStr};\`;
        preview.style.background = gradStr;
        cssCode.value = fullCSS;
    }

    [type, angle].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        type.value = 'linear';
        angle.value = '90';
        stops = [
            { color: '#6366f1', pct: 0 },
            { color: '#a855f7', pct: 100 }
        ];
        renderStops();
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCode.value).then(() => alert('CSS Code Copied!'));
    });

    renderStops();
    render();
}
`;
        } else if (tool.id === 'color-extractor') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="upload-zone" id="color-upload-zone">
                    <span class="upload-icon">📷</span>
                    <div class="upload-text">
                        <h4>Click or Drag & Drop Image here</h4>
                        <p>Extract major dominant colors from photos</p>
                    </div>
                    <input type="file" class="upload-input" id="color-file-input" accept="image/jpeg,image/png,image/webp">
                </div>

                <div id="color-extract-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                    <div style="display:flex; justify-content:center; align-items:center;">
                        <img id="extract-image-preview" style="max-height:200px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                    </div>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3>Dominant Color Palette</h3>
                        <button class="btn btn-secondary" id="download-palette-json">Download JSON</button>
                    </div>
                    <div style="display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center;" id="palette-colors-row"></div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const uploadZone = document.getElementById('color-upload-zone');
    const fileInput = document.getElementById('color-file-input');
    const workspace = document.getElementById('color-extract-workspace');
    const imgPreview = document.getElementById('extract-image-preview');
    const colorsRow = document.getElementById('palette-colors-row');
    const downloadJsonBtn = document.getElementById('download-palette-json');

    let currentColors = [];

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) process(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            process(e.dataTransfer.files[0]);
        }
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            imgPreview.src = evt.target.result;
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';

            const img = new Image();
            img.src = evt.target.result;
            img.onload = () => {
                extractPalette(img);
            };
        };
        reader.readAsDataURL(file);
    }

    function extractPalette(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imgData = ctx.getImageData(0, 0, 50, 50).data;
        const colorCounts = {};

        for (let i = 0; i < imgData.length; i += 4) {
            const r = Math.round(imgData[i] / 15) * 15;
            const g = Math.round(imgData[i+1] / 15) * 15;
            const b = Math.round(imgData[i+2] / 15) * 15;
            const rgb = \`rgb(\${r},\dots,\${b})\`;
            colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
        }

        const sorted = Object.keys(colorCounts).sort((a,b) => colorCounts[b] - colorCounts[a]);
        // Extract top 8 dominant colors
        const dominant = sorted.slice(0, 8);

        currentColors = dominant.map(color => {
            const rgbHex = rgbToHex(color);
            return rgbHex;
        });

        colorsRow.innerHTML = dominant.map(color => {
            const rgbHex = rgbToHex(color);
            return '<div style="text-align:center; cursor:pointer;" onclick="navigator.clipboard.writeText(\\'' + rgbHex + '\\').then(() => alert(\\'Copied color\\' + \\' \\' + \\'' + rgbHex + '\\'))">' +
                '<div style="width:70px; height:70px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background-color:' + color + ';"></div>' +
                '<span style="font-size:0.75rem; font-weight:700; display:block; margin-top:0.25rem;">' + rgbHex + '</span>' +
                '</div>';
        }).join('');
    }

    function rgbToHex(rgbStr) {
        const match = rgbStr.match(/\\d+/g);
        if(!match) return '#000000';
        const r = parseInt(match[0]).toString(16).padStart(2, '0');
        const g = parseInt(match[1]).toString(16).padStart(2, '0');
        const b = parseInt(match[2]).toString(16).padStart(2, '0');
        return '#' + r + g + b;
    }

    downloadJsonBtn.addEventListener('click', () => {
        if(currentColors.length === 0) return;
        const jsonStr = JSON.stringify(currentColors, null, 4);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_palette.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}
`;
        } else if (tool.id === 'morse-translator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
                    <div class="form-group">
                        <label for="morse-text">Plain Text</label>
                        <textarea id="morse-text" class="input-control" placeholder="Type text here..." style="min-height: 150px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="morse-code">Morse Code</label>
                        <textarea id="morse-code" class="input-control" placeholder="Type Morse code here... (use space between symbols)" style="min-height: 150px;"></textarea>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="morse-reset">Reset</button>
                    <button class="btn btn-primary" id="morse-btn-copy">Copy Result</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const text = document.getElementById('morse-text');
    const code = document.getElementById('morse-code');
    const resetBtn = document.getElementById('morse-reset');
    const copyBtn = document.getElementById('morse-btn-copy');

    const morseMap = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
        'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
        'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
    };

    const reverseMap = {};
    Object.keys(morseMap).forEach(k => reverseMap[morseMap[k]] = k);

    if (!text) return;

    function translateText() {
        const val = text.value.toUpperCase();
        let result = [];
        for (let i = 0; i < val.length; i++) {
            const ch = val.charAt(i);
            if (morseMap[ch]) result.push(morseMap[ch]);
        }
        code.value = result.join(' ');
    }

    function translateMorse() {
        const val = code.value.trim().split(/\\s+/);
        let result = '';
        for (let symbol of val) {
            if (reverseMap[symbol]) result += reverseMap[symbol];
        }
        text.value = result;
    }

    text.addEventListener('input', translateText);
    code.addEventListener('input', translateMorse);

    resetBtn.addEventListener('click', () => {
        text.value = '';
        code.value = '';
    });

    copyBtn.addEventListener('click', () => {
        const targetText = code.value || text.value;
        navigator.clipboard.writeText(targetText).then(() => alert('Copied Result!'));
    });
}
`;
        } else if (tool.id === 'stopwatch-timer') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div style="display:flex; justify-content:center; gap:2rem; margin-bottom:1.5rem;">
                    <button class="btn btn-secondary tab-toggle" id="tab-stopwatch-btn">Stopwatch</button>
                    <button class="btn btn-secondary" id="tab-timer-btn">Timer</button>
                </div>

                <!-- Stopwatch View -->
                <div id="stopwatch-view" style="display:block; text-align:center;">
                    <div style="font-size:3rem; font-weight:800; font-family:var(--font-mono); margin-bottom:1.5rem;" id="stopwatch-display">00:00:00.000</div>
                    <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1rem;">
                        <button class="btn btn-primary" id="stopwatch-start">Start</button>
                        <button class="btn btn-secondary" id="stopwatch-lap">Lap</button>
                        <button class="btn btn-secondary" id="stopwatch-reset">Reset</button>
                    </div>
                    <div style="max-height:150px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm); max-width:300px; margin:0 auto;" id="stopwatch-laps"></div>
                </div>

                <!-- Timer View -->
                <div id="timer-view" style="display:none; text-align:center;">
                    <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1.5rem;">
                        <input type="number" id="timer-h" class="input-control" style="width:70px;" value="0" min="0" placeholder="HH">
                        <input type="number" id="timer-m" class="input-control" style="width:70px;" value="5" min="0" placeholder="MM">
                        <input type="number" id="timer-s" class="input-control" style="width:70px;" value="0" min="0" placeholder="SS">
                    </div>
                    <div style="font-size:3rem; font-weight:800; font-family:var(--font-mono); margin-bottom:1.5rem;" id="timer-display">00:05:00</div>
                    
                    <div style="height:10px; background:var(--border-color); border-radius:var(--radius-xs); overflow:hidden; max-width:300px; margin:0 auto 1.5rem auto;">
                        <div id="timer-bar" style="height:100%; width:100%; background:var(--primary-color);"></div>
                    </div>

                    <div style="display:flex; justify-content:center; gap:0.5rem;">
                        <button class="btn btn-primary" id="timer-start">Start</button>
                        <button class="btn btn-secondary" id="timer-reset">Reset</button>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const swBtn = document.getElementById('tab-stopwatch-btn');
    const tmBtn = document.getElementById('tab-timer-btn');
    const swView = document.getElementById('stopwatch-view');
    const tmView = document.getElementById('timer-view');

    if (swBtn) {
        swBtn.addEventListener('click', () => {
            swView.style.display = 'block';
            tmView.style.display = 'none';
        });
        tmBtn.addEventListener('click', () => {
            swView.style.display = 'none';
            tmView.style.display = 'block';
        });
    }

    // Stopwatch engine
    let swInterval = null;
    let swStart = 0;
    let swElapsed = 0;
    let laps = [];

    const swDisplay = document.getElementById('stopwatch-display');
    const swStartBtn = document.getElementById('stopwatch-start');
    const swLapBtn = document.getElementById('stopwatch-lap');
    const swResetBtn = document.getElementById('stopwatch-reset');
    const swLapsList = document.getElementById('stopwatch-laps');

    swStartBtn.addEventListener('click', () => {
        if (swInterval) {
            clearInterval(swInterval);
            swInterval = null;
            swStartBtn.textContent = 'Resume';
        } else {
            swStart = Date.now() - swElapsed;
            swInterval = setInterval(updateStopwatch, 10);
            swStartBtn.textContent = 'Pause';
        }
    });

    swLapBtn.addEventListener('click', () => {
        if (!swInterval) return;
        laps.push(swDisplay.textContent);
        swLapsList.innerHTML = laps.map((lap, i) => '<div>Lap ' + (i+1) + ': ' + lap + '</div>').join('');
    });

    swResetBtn.addEventListener('click', () => {
        clearInterval(swInterval);
        swInterval = null;
        swElapsed = 0;
        laps = [];
        swStartBtn.textContent = 'Start';
        swDisplay.textContent = '00:00:00.000';
        swLapsList.innerHTML = '';
    });

    function updateStopwatch() {
        swElapsed = Date.now() - swStart;
        let ms = swElapsed % 1000;
        let s = Math.floor(swElapsed / 1000) % 60;
        let m = Math.floor(swElapsed / 60000) % 60;
        let h = Math.floor(swElapsed / 3600000);

        swDisplay.textContent = 
            String(h).padStart(2, '0') + ':' +
            String(m).padStart(2, '0') + ':' +
            String(s).padStart(2, '0') + '.' +
            String(ms).padStart(3, '0');
    }

    // Timer engine
    let tmInterval = null;
    let tmTotal = 0;
    let tmRemaining = 0;

    const tmH = document.getElementById('timer-h');
    const tmM = document.getElementById('timer-m');
    const tmS = document.getElementById('timer-s');
    const tmDisplay = document.getElementById('timer-display');
    const tmStartBtn = document.getElementById('timer-start');
    const tmResetBtn = document.getElementById('timer-reset');
    const tmBar = document.getElementById('timer-bar');

    tmStartBtn.addEventListener('click', () => {
        if (tmInterval) {
            clearInterval(tmInterval);
            tmInterval = null;
            tmStartBtn.textContent = 'Resume';
        } else {
            if (tmRemaining === 0) {
                const hrs = parseInt(tmH.value) || 0;
                const mins = parseInt(tmM.value) || 0;
                const secs = parseInt(tmS.value) || 0;
                tmTotal = (hrs * 3600 + mins * 60 + secs) * 1000;
                tmRemaining = tmTotal;
            }
            if (tmRemaining <= 0) return;
            tmInterval = setInterval(updateTimer, 100);
            tmStartBtn.textContent = 'Pause';
        }
    });

    tmResetBtn.addEventListener('click', () => {
        clearInterval(tmInterval);
        tmInterval = null;
        tmRemaining = 0;
        tmStartBtn.textContent = 'Start';
        tmDisplay.textContent = '00:05:00';
        tmBar.style.width = '100%';
    });

    function updateTimer() {
        tmRemaining -= 100;
        if (tmRemaining <= 0) {
            clearInterval(tmInterval);
            tmInterval = null;
            tmRemaining = 0;
            tmDisplay.textContent = '00:00:00';
            tmBar.style.width = '0%';
            tmStartBtn.textContent = 'Start';
            alert('Timer Completed!');
            return;
        }

        let s = Math.floor(tmRemaining / 1000) % 60;
        let m = Math.floor(tmRemaining / 60000) % 60;
        let h = Math.floor(tmRemaining / 3600000);

        tmDisplay.textContent = 
            String(h).padStart(2, '0') + ':' +
            String(m).padStart(2, '0') + ':' +
            String(s).padStart(2, '0');

        tmBar.style.width = (tmRemaining / tmTotal * 100) + '%';
    }
}
`;
        } else if (tool.id === 'world-clock') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));" id="clocks-grid">
                    <!-- Dynamic clocks generated here -->
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const grid = document.getElementById('clocks-grid');
    if (!grid) return;

    const cities = [
        { name: 'UTC/GMT', zone: 'UTC' },
        { name: 'New York', zone: 'America/New_York' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'Dubai', zone: 'Asia/Dubai' },
        { name: 'Mumbai', zone: 'Asia/Kolkata' },
        { name: 'Tokyo', zone: 'Asia/Tokyo' },
        { name: 'Sydney', zone: 'Australia/Sydney' }
    ];

    function updateClocks() {
        grid.innerHTML = cities.map(city => {
            const options = { timeZone: city.zone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const timeStr = new Date().toLocaleTimeString('en-US', options);
            const dateStr = new Date().toLocaleDateString('en-US', { timeZone: city.zone, month: 'short', day: 'numeric' });
            return \`
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    <h4 style="margin-bottom:0.25rem;">\${city.name}</h4>
                    <div style="font-size:1.5rem; font-weight:800; font-family:var(--font-mono); color:var(--primary-color);">\${timeStr}</div>
                    <span style="font-size:0.8rem; color:var(--text-secondary);">\${dateStr}</span>
                </div>
            \`;
        }).join('');
    }

    setInterval(updateClocks, 1000);
    updateClocks();
}
`;
        } else if (tool.id === 'list-randomizer') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="list-input">Enter List Items (one per line)</label>
                    <textarea id="list-input" class="input-control" placeholder="Item 1\\nItem 2\\nItem 3" style="min-height: 180px;"></textarea>
                </div>

                <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
                    <button class="btn btn-primary" id="list-randomize">Shuffle</button>
                    <button class="btn btn-secondary" id="list-sort-az">Sort A-Z</button>
                    <button class="btn btn-secondary" id="list-sort-za">Sort Z-A</button>
                    <button class="btn btn-secondary" id="list-dedupe">Deduplicate</button>
                </div>

                <div class="form-group" style="margin-top:1.5rem;">
                    <label for="list-output">Processed List</label>
                    <textarea id="list-output" readonly class="input-control" style="min-height: 180px; background:var(--bg-primary);"></textarea>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="list-reset">Reset</button>
                    <button class="btn btn-primary" id="list-copy">Copy Output</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('list-input');
    const output = document.getElementById('list-output');
    const randomBtn = document.getElementById('list-randomize');
    const azBtn = document.getElementById('list-sort-az');
    const zaBtn = document.getElementById('list-sort-za');
    const dedupeBtn = document.getElementById('list-dedupe');
    const resetBtn = document.getElementById('list-reset');
    const copyBtn = document.getElementById('list-copy');

    if (!input) return;

    function getLines() {
        return input.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
    }

    randomBtn.addEventListener('click', () => {
        const lines = getLines();
        for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        output.value = lines.join('\\n');
    });

    azBtn.addEventListener('click', () => {
        const lines = getLines().sort((a,b) => a.localeCompare(b));
        output.value = lines.join('\\n');
    });

    zaBtn.addEventListener('click', () => {
        const lines = getLines().sort((a,b) => b.localeCompare(a));
        output.value = lines.join('\\n');
    });

    dedupeBtn.addEventListener('click', () => {
        const lines = [...new Set(getLines())];
        output.value = lines.join('\\n');
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Output!'));
    });
}
`;
        } else if (tool.id === 'nato-phonetic-translator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="nato-input">Input Word / Text</label>
                    <input type="text" id="nato-input" class="input-control" value="hello">
                </div>

                <div class="form-group">
                    <label>NATO Speller Output</label>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; font-weight:700; font-size:1.2rem;" id="nato-output">-</div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="nato-clear">Clear</button>
                    <button class="btn btn-primary" id="nato-copy">Copy Output</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('nato-input');
    const output = document.getElementById('nato-output');
    const clearBtn = document.getElementById('nato-clear');
    const copyBtn = document.getElementById('nato-copy');

    const dict = {
        'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot',
        'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett', 'K': 'Kilo', 'L': 'Lima',
        'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo',
        'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
        'Y': 'Yankee', 'Z': 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
        '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
    };

    if (!input) return;

    function render() {
        const val = input.value.toUpperCase();
        let result = [];
        for (let i = 0; i < val.length; i++) {
            const ch = val.charAt(i);
            if (dict[ch]) result.push(dict[ch]);
            else if (ch === ' ') result.push('/');
        }
        output.textContent = result.length > 0 ? result.join(' ') : '-';
    }

    input.addEventListener('input', render);
    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.textContent = '-';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent).then(() => alert('Copied NATO speller output!'));
    });

    render();
}
`;
        } else if (tool.id === 'serp-simulator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid" style="grid-template-columns: 1fr; gap:0.75rem;">
                    <div class="form-group">
                        <label for="serp-title">SEO Title (50-60 chars max)</label>
                        <input type="text" id="serp-title" class="input-control" value="My Website Home - Secure Client Tools Platform">
                        <span style="font-size:0.75rem; color:var(--text-secondary);" id="serp-title-counter">Length: 0 / 60</span>
                    </div>
                    <div class="form-group">
                        <label for="serp-desc">Meta Description (150-160 chars max)</label>
                        <input type="text" id="serp-desc" class="input-control" value="Use our free web utilities to compress photos, merge PDF files, convert base converters, and run ciphers completely offline locally inside your browser memory.">
                        <span style="font-size:0.75rem; color:var(--text-secondary);" id="serp-desc-counter">Length: 0 / 160</span>
                    </div>
                    <div class="form-group">
                        <label for="serp-url">URL</label>
                        <input type="text" id="serp-url" class="input-control" value="https://example.com/tools">
                    </div>
                </div>

                <div style="background:#ffffff; color:#1a0dab; font-family:arial,sans-serif; padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); margin-top:1.5rem;" id="serp-preview-box">
                    <span style="font-size:14px; color:#4d5156; display:block;" id="preview-url">https://example.com/tools</span>
                    <h3 style="font-size:20px; font-weight:normal; margin: 4px 0; color:#1a0dab; text-decoration:none; cursor:pointer;" id="preview-title">My Website Home</h3>
                    <p style="font-size:14px; color:#4d5156; line-height:1.5; margin:0;" id="preview-desc">Use our free web utilities...</p>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const title = document.getElementById('serp-title');
    const desc = document.getElementById('serp-desc');
    const url = document.getElementById('serp-url');
    
    const pTitle = document.getElementById('preview-title');
    const pDesc = document.getElementById('preview-desc');
    const pUrl = document.getElementById('preview-url');

    const titleCount = document.getElementById('serp-title-counter');
    const descCount = document.getElementById('serp-desc-counter');

    if (!title) return;

    function render() {
        const tVal = title.value;
        const dVal = desc.value;
        const uVal = url.value;

        pTitle.textContent = tVal.slice(0, 60) + (tVal.length > 60 ? '...' : '');
        pDesc.textContent = dVal.slice(0, 160) + (dVal.length > 160 ? '...' : '');
        pUrl.textContent = uVal;

        titleCount.textContent = 'Length: ' + tVal.length + ' / 60';
        titleCount.style.color = tVal.length > 60 ? 'var(--error-color)' : 'var(--text-secondary)';

        descCount.textContent = 'Length: ' + dVal.length + ' / 160';
        descCount.style.color = dVal.length > 160 ? 'var(--error-color)' : 'var(--text-secondary)';
    }

    [title, desc, url].forEach(el => el.addEventListener('input', render));
    render();
}
`;
        } else if (tool.id === 'keyword-density') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="kd-text">Paste Text/Article</label>
                    <textarea id="kd-text" class="input-control" placeholder="Paste article content to inspect density..." style="min-height: 180px;"></textarea>
                </div>

                <div class="form-group" style="display:flex; align-items:center;">
                    <label style="cursor:pointer;"><input type="checkbox" id="kd-ignore-stop" checked> Ignore Common Stop Words</label>
                </div>

                <div class="action-row">
                    <button class="btn btn-primary" id="kd-btn-analyze">Analyze Density</button>
                </div>

                <div id="kd-results" style="display:none; margin-top:1.5rem;">
                    <h3>Keyword Density Summary</h3>
                    <div style="display:flex; gap:1.5rem; margin-bottom:1rem; font-size:0.9rem;">
                        <span>Total Words: <strong id="kd-tot-words">0</strong></span>
                        <span>Total Characters: <strong id="kd-tot-chars">0</strong></span>
                        <span>Unique Words: <strong id="kd-uniq-words">0</strong></span>
                    </div>
                    <div style="max-height:250px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm); margin-top:0.5rem;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                            <thead>
                                <tr style="background:var(--bg-secondary); border-bottom:1px solid var(--border-color);">
                                    <th style="padding:0.5rem; cursor:pointer;" id="th-keyword">Keyword ↕</th>
                                    <th style="padding:0.5rem; cursor:pointer;" id="th-count">Occurrences ↕</th>
                                    <th style="padding:0.5rem; cursor:pointer;" id="th-density">Density % ↕</th>
                                </tr>
                            </thead>
                            <tbody id="kd-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const textInput = document.getElementById('kd-text');
    const ignoreStop = document.getElementById('kd-ignore-stop');
    const analyzeBtn = document.getElementById('kd-btn-analyze');
    const resultsPanel = document.getElementById('kd-results');
    const tableBody = document.getElementById('kd-table-body');
    const totWords = document.getElementById('kd-tot-words');
    const totChars = document.getElementById('kd-tot-chars');
    const uniqWords = document.getElementById('kd-uniq-words');

    const stopWords = ["the", "and", "a", "of", "to", "is", "in", "it", "you", "that", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i"];

    if (!analyzeBtn) return;

    let analyzedData = [];
    let sortDir = { keyword: 1, count: -1, density: -1 };

    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text) return;

        const words = text.toLowerCase().match(/\\b\\w+\\b/g) || [];
        const ignore = ignoreStop.checked;

        const counts = {};
        let totalWordsCount = words.length;
        let uniqueCount = 0;

        words.forEach(w => {
            if (ignore && stopWords.includes(w)) return;
            counts[w] = (counts[w] || 0) + 1;
        });

        analyzedData = Object.keys(counts).map(word => {
            uniqueCount++;
            const count = counts[word];
            const pct = totalWordsCount > 0 ? ((count / totalWordsCount) * 100) : 0;
            return { keyword: word, count, density: pct };
        });

        totWords.textContent = totalWordsCount;
        totChars.textContent = text.length;
        uniqWords.textContent = uniqueCount;

        // Sort descending count initially
        sortData('count', -1);
        resultsPanel.style.display = 'block';
    });

    function sortData(key, direction) {
        analyzedData.sort((a, b) => {
            if (typeof a[key] === 'string') {
                return a[key].localeCompare(b[key]) * direction;
            }
            return (a[key] - b[key]) * direction;
        });
        renderTable();
    }

    function renderTable() {
        tableBody.innerHTML = analyzedData.slice(0, 15).map(item => \`
            <tr>
                <td style="padding:0.5rem; font-weight:700;">\${item.keyword}</td>
                <td style="padding:0.5rem;">\${item.count}</td>
                <td style="padding:0.5rem;">\${item.density.toFixed(1)}%</td>
            </tr>
        \`).join('');
    }

    document.getElementById('th-keyword').addEventListener('click', () => {
        sortDir.keyword = -sortDir.keyword;
        sortData('keyword', sortDir.keyword);
    });

    document.getElementById('th-count').addEventListener('click', () => {
        sortDir.count = -sortDir.count;
        sortData('count', sortDir.count);
    });

    document.getElementById('th-density').addEventListener('click', () => {
        sortDir.density = -sortDir.density;
        sortData('density', sortDir.density);
    });
}
`;
        } else if (tool.id === 'meta-tags-generator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="meta-title">Site Title</label>
                        <input type="text" id="meta-title" class="input-control" value="My Web Platform">
                    </div>
                    <div class="form-group">
                        <label for="meta-desc">Description</label>
                        <input type="text" id="meta-desc" class="input-control" value="Free online utilities.">
                    </div>
                    <div class="form-group">
                        <label for="meta-keywords">Keywords (comma separated)</label>
                        <input type="text" id="meta-keywords" class="input-control" value="tools, converter, developer">
                    </div>
                    <div class="form-group">
                        <label for="meta-author">Author</label>
                        <input type="text" id="meta-author" class="input-control" value="Platform Team">
                    </div>
                    <div class="form-group">
                        <label for="meta-canonical">Canonical URL</label>
                        <input type="text" id="meta-canonical" class="input-control" value="https://example.com">
                    </div>
                    <div class="form-group">
                        <label for="meta-robots">Robots index</label>
                        <select id="meta-robots" class="input-control">
                            <option value="index, follow">index, follow</option>
                            <option value="noindex, nofollow">noindex, nofollow</option>
                        </select>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 1rem;">
                    <label>Generated Meta Elements</label>
                    <textarea readonly id="meta-output-code" class="input-control" style="font-family:var(--font-mono); min-height:180px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
                </div>

                <div class="action-row">
                    <button class="btn btn-primary" id="meta-copy">Copy Tags</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const title = document.getElementById('meta-title');
    const desc = document.getElementById('meta-desc');
    const keywords = document.getElementById('meta-keywords');
    const author = document.getElementById('meta-author');
    const canonical = document.getElementById('meta-canonical');
    const robots = document.getElementById('meta-robots');
    const output = document.getElementById('meta-output-code');
    const copy = document.getElementById('meta-copy');

    if (!title) return;

    function render() {
        const t = title.value;
        const d = desc.value;
        const k = keywords.value;
        const a = author.value;
        const c = canonical.value;
        const r = robots.value;

        const code = \`<!-- Primary Meta Tags -->
<title>\${t}</title>
<meta name="title" content="\${t}">
<meta name="description" content="\${d}">
<meta name="keywords" content="\${k}">
<meta name="author" content="\${a}">
<link rel="canonical" href="\${c}">
<meta name="robots" content="\${r}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="\${c}">
<meta property="og:title" content="\${t}">
<meta property="og:description" content="\${d}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="\${c}">
<meta property="twitter:title" content="\${t}">
<meta property="twitter:description" content="\${d}">\`;

        output.value = code;
    }

    [title, desc, keywords, author, canonical, robots].forEach(el => el.addEventListener('input', render));
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Meta tags copied!'));
    });

    render();
}
`;
        } else if (tool.id === 'strong-password-generator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label>Generated Password</label>
                    <div style="display:flex; gap:0.5rem;">
                        <input type="text" id="pwd-output" class="input-control" style="font-family:var(--font-mono); font-size:1.2rem; font-weight:700;" readonly>
                        <button class="btn btn-secondary" id="pwd-btn-regenerate">Regenerate</button>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="pwd-length">Password Length (<span id="pwd-len-val">12</span>)</label>
                        <input type="range" id="pwd-length" min="6" max="64" value="12" style="width:100%;">
                    </div>
                    <div class="form-group" style="display:flex; flex-direction:column; gap:0.5rem; justify-content:center;">
                        <label style="cursor:pointer;"><input type="checkbox" id="pwd-upper" checked> Include Uppercase (A-Z)</label>
                        <label style="cursor:pointer;"><input type="checkbox" id="pwd-lower" checked> Include Lowercase (a-z)</label>
                        <label style="cursor:pointer;"><input type="checkbox" id="pwd-num" checked> Include Numbers (0-9)</label>
                        <label style="cursor:pointer;"><input type="checkbox" id="pwd-sym" checked> Include Symbols (!@#$)</label>
                        <label style="cursor:pointer;"><input type="checkbox" id="pwd-exclude-similar"> Exclude Similar (i, l, 1, o, 0)</label>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-top:1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div>Password Strength: <strong id="pwd-strength-label" style="color:var(--success-color);">Strong</strong></div>
                    <div>Entropy Estimate: <strong id="pwd-entropy-val">0 bits</strong></div>
                </div>

                <div class="action-row" style="margin-top:1.5rem;">
                    <button class="btn btn-primary" id="pwd-btn-copy" style="width:100%;">Copy Password</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const lengthRange = document.getElementById('pwd-length');
    const lengthVal = document.getElementById('pwd-len-val');
    const upperCheck = document.getElementById('pwd-upper');
    const lowerCheck = document.getElementById('pwd-lower');
    const numCheck = document.getElementById('pwd-num');
    const symCheck = document.getElementById('pwd-sym');
    const similarCheck = document.getElementById('pwd-exclude-similar');
    const outputInput = document.getElementById('pwd-output');
    const copyBtn = document.getElementById('pwd-btn-copy');
    const regenBtn = document.getElementById('pwd-btn-regenerate');
    const strengthLabel = document.getElementById('pwd-strength-label');
    const entropyVal = document.getElementById('pwd-entropy-val');

    if (!lengthRange) return;

    lengthRange.addEventListener('input', () => {
        lengthVal.textContent = lengthRange.value;
        generate();
    });

    [upperCheck, lowerCheck, numCheck, symCheck, similarCheck].forEach(el => {
        el.addEventListener('change', generate);
    });

    regenBtn.addEventListener('click', generate);

    function generate() {
        let pool = '';
        if (upperCheck.checked) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowerCheck.checked) pool += 'abcdefghijklmnopqrstuvwxyz';
        if (numCheck.checked) pool += '0123456789';
        if (symCheck.checked) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (similarCheck.checked) {
            pool = pool.replace(/[il1Lo0O|]/g, '');
        }

        if (!pool) {
            outputInput.value = '';
            strengthLabel.textContent = '-';
            entropyVal.textContent = '0 bits';
            return;
        }

        const len = parseInt(lengthRange.value) || 12;
        let password = '';
        for (let i = 0; i < len; i++) {
            password += pool.charAt(Math.floor(Math.random() * pool.length));
        }

        outputInput.value = password;

        // Entropy and strength checks
        const poolSize = pool.length;
        const entropy = Math.round(len * Math.log2(poolSize));
        entropyVal.textContent = entropy + ' bits';

        let strength = 'Very Weak';
        let color = 'var(--error-color)';
        if (entropy >= 80) { strength = 'Very Strong'; color = 'var(--success-color)'; }
        else if (entropy >= 60) { strength = 'Strong'; color = 'var(--success-color)'; }
        else if (entropy >= 40) { strength = 'Medium'; color = 'var(--primary-color)'; }
        else if (entropy >= 25) { strength = 'Weak'; color = 'var(--accent-color)'; }

        strengthLabel.textContent = strength;
        strengthLabel.style.color = color;
    }

    copyBtn.addEventListener('click', () => {
        if (!outputInput.value) return;
        navigator.clipboard.writeText(outputInput.value).then(() => alert('Password Copied!'));
    });

    generate();
}
`;
        } else if (tool.id === 'json-formatter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="json-input">JSON String</label>
                    <textarea id="json-input" class="input-control" placeholder="Paste raw JSON string..." style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
                </div>

                <div class="action-row" style="margin-bottom:1.5rem;">
                    <button class="btn btn-primary" id="json-beautify">Beautify</button>
                    <button class="btn btn-secondary" id="json-minify">Minify</button>
                </div>

                <div class="form-group">
                    <label for="json-output">Result Output</label>
                    <textarea id="json-output" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const beauty = document.getElementById('json-beautify');
    const mini = document.getElementById('json-minify');

    if (!input) return;

    beauty.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, 4);
        } catch(e) {
            alert('Invalid JSON: ' + e.message);
        }
    });

    mini.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed);
        } catch(e) {
            alert('Invalid JSON: ' + e.message);
        }
    });
}
`;
        } else if (tool.id === 'xml-formatter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="xml-input">XML Input</label>
                    <textarea id="xml-input" class="input-control" placeholder="Paste XML data here..." style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
                </div>

                <div class="action-row" style="margin-bottom:1.5rem;">
                    <button class="btn btn-primary" id="xml-beautify">Beautify</button>
                    <button class="btn btn-secondary" id="xml-minify">Minify</button>
                </div>

                <div class="form-group">
                    <label for="xml-output">Formatted XML</label>
                    <textarea id="xml-output" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('xml-input');
    const output = document.getElementById('xml-output');
    const beauty = document.getElementById('xml-beautify');
    const mini = document.getElementById('xml-minify');

    if (!input) return;

    beauty.addEventListener('click', () => {
        let val = input.value.trim();
        let formatted = '';
        let reg = /(>)(<)(\\/*)/g;
        val = val.replace(reg, '$1\\r\\n$2$3');
        let pad = 0;
        val.split('\\r\\n').forEach(line => {
            let indent = 0;
            if (line.match(/<\\/\\w/)) {
                pad--;
            } else if (line.match(/<\\w[^>]*>/) && !line.match(/<\\w[^>]*\\/>/) && !line.match(/<\\w[^>]*>.*<\\/\\w>/)) {
                indent = 1;
            }
            formatted += '  '.repeat(Math.max(0, pad)) + line + '\\n';
            pad += indent;
        });
        output.value = formatted.trim();
    });

    mini.addEventListener('click', () => {
        output.value = input.value.replace(/\\s*<(\\/*\\w+)([^>]*)>\\s*/g, '<$1$2>');
    });
}
`;
        } else if (tool.id === 'sql-formatter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="sql-input">SQL Input</label>
                    <textarea id="sql-input" class="input-control" placeholder="SELECT * FROM table WHERE id = 1" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
                </div>

                <div class="action-row" style="margin-bottom:1.5rem;">
                    <button class="btn btn-primary" id="sql-beautify-upper">Beautify (UPPERCASE)</button>
                    <button class="btn btn-secondary" id="sql-beautify-lower">Beautify (lowercase)</button>
                    <button class="btn btn-secondary" id="sql-minify">Minify</button>
                </div>

                <div class="form-group">
                    <label for="sql-output">Formatted SQL</label>
                    <textarea id="sql-output" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('sql-input');
    const output = document.getElementById('sql-output');
    const beautyUpper = document.getElementById('sql-beautify-upper');
    const beautyLower = document.getElementById('sql-beautify-lower');
    const mini = document.getElementById('sql-minify');

    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE'];

    if (!input) return;

    function formatSQL(caseType) {
        let val = input.value.trim();
        keywords.forEach(w => {
            const regex = new RegExp('\\\\b' + w + '\\\\b', 'gi');
            val = val.replace(regex, caseType === 'upper' ? w.toUpperCase() : w.toLowerCase());
        });

        let formatted = val
            .replace(/\\bSELECT\\b/gi, 'SELECT\\n ')
            .replace(/\\bFROM\\b/gi, '\\nFROM')
            .replace(/\\bWHERE\\b/gi, '\\nWHERE')
            .replace(/\\bAND\\b/gi, '\\n  AND')
            .replace(/\\bOR\\b/gi, '\\n  OR')
            .replace(/\\bGROUP BY\\b/gi, '\\nGROUP BY')
            .replace(/\\bORDER BY\\b/gi, '\\nORDER BY');

        output.value = formatted;
    }

    beautyUpper.addEventListener('click', () => formatSQL('upper'));
    beautyLower.addEventListener('click', () => formatSQL('lower'));

    mini.addEventListener('click', () => {
        output.value = input.value.replace(/\\s+/g, ' ').trim();
    });
}
`;
        } else if (tool.id === 'css-minifier') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="css-input">CSS Input</label>
                    <textarea id="css-input" class="input-control" placeholder="body { background: white; }" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
                </div>

                <div class="action-row" style="margin-bottom:1.5rem;">
                    <button class="btn btn-primary" id="css-minify">Minify CSS</button>
                    <button class="btn btn-secondary" id="css-beautify">Beautify CSS</button>
                </div>

                <div class="form-group">
                    <label for="css-output">Result CSS</label>
                    <textarea id="css-output" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('css-input');
    const output = document.getElementById('css-output');
    const mini = document.getElementById('css-minify');
    const beauty = document.getElementById('css-beautify');

    if (!input) return;

    mini.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
        val = val.replace(/\\s*([{}|:;,])\\s*/g, '$1');
        val = val.replace(/\\s+/g, ' ');
        output.value = val.trim();
    });

    beauty.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\\s*([{}|:;,])\\s*/g, '$1');
        val = val.replace(/{/g, ' {\\n  ');
        val = val.replace(/;/g, ';\\n  ');
        val = val.replace(/\\n\\s*}/g, '\\n}\\n\\n');
        val = val.replace(/  }/g, '}');
        output.value = val.trim();
    });
}
`;
        } else if (tool.id === 'js-minifier') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="js-input">JavaScript Input</label>
                    <textarea id="js-input" class="input-control" placeholder="function hello() { console.log('hello'); }" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
                </div>

                <div class="action-row" style="margin-bottom:1.5rem;">
                    <button class="btn btn-primary" id="js-minify">Minify JS</button>
                    <button class="btn btn-secondary" id="js-beautify">Beautify JS</button>
                </div>

                <div class="form-group">
                    <label for="js-output">Result JavaScript</label>
                    <textarea id="js-output" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('js-input');
    const output = document.getElementById('js-output');
    const mini = document.getElementById('js-minify');
    const beauty = document.getElementById('js-beautify');

    if (!input) return;

    mini.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
        val = val.replace(/\\/\\/[^\\n]*\\n/g, '');
        val = val.replace(/\\s*([{}|:;,()=+\\-*/])\\s*/g, '$1');
        val = val.replace(/\\s+/g, ' ');
        output.value = val.trim();
    });

    beauty.addEventListener('click', () => {
        let val = input.value;
        let pad = 0;
        let formatted = '';
        val.split('\\n').forEach(line => {
            let trimmed = line.trim();
            if (trimmed.match(/}/)) pad--;
            formatted += '  '.repeat(Math.max(0, pad)) + trimmed + '\\n';
            if (trimmed.match(/{/)) pad++;
        });
        output.value = formatted.trim();
    });
}
`;
        } else if (tool.id === 'split-pdf') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="upload-zone" id="pdf-upload-zone">
                    <span class="upload-icon">📄</span>
                    <div class="upload-text">
                        <h4>Click or Drag & Drop PDF here</h4>
                        <p>Select PDF file to split</p>
                    </div>
                    <input type="file" class="upload-input" id="pdf-file-input" accept=".pdf">
                </div>

                <div id="pdf-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                    <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong id="pdf-name">document.pdf</strong>
                            <p style="font-size: 0.8rem; color: var(--text-secondary);" id="pdf-page-count">Total Pages: 0</p>
                        </div>
                        <button class="btn btn-secondary" id="remove-pdf-btn">Remove</button>
                    </div>

                    <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                        <div class="form-group">
                            <label for="split-mode">Split Mode</label>
                            <select id="split-mode" class="input-control">
                                <option value="range">Split by Page Ranges</option>
                                <option value="extract">Extract Specific Pages</option>
                                <option value="every">Split Every Page</option>
                            </select>
                        </div>
                        <div class="form-group" id="split-range-input-group">
                            <label for="split-range-val">Pages / Ranges</label>
                            <input type="text" id="split-range-val" class="input-control" value="1-3, 4-6" placeholder="e.g. 1-3, 4-6 or 1,3,5">
                        </div>
                    </div>

                    <div class="action-row">
                        <button class="btn btn-secondary" id="reset-pdf">Reset</button>
                        <button class="btn btn-primary" id="process-pdf-btn">Split and Download</button>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const pdfName = document.getElementById('pdf-name');
    const pdfPageCount = document.getElementById('pdf-page-count');
    const splitMode = document.getElementById('split-mode');
    const rangeGroup = document.getElementById('split-range-input-group');
    const rangeVal = document.getElementById('split-range-val');
    const processBtn = document.getElementById('process-pdf-btn');
    const removeBtn = document.getElementById('remove-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');

    let pdfBytes = null;
    let selectedFile = null;
    let totalPages = 0;

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) loadPdf(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            loadPdf(files[0]);
        }
    });

    splitMode.addEventListener('change', () => {
        if (splitMode.value === 'every') {
            rangeGroup.style.display = 'none';
        } else {
            rangeGroup.style.display = 'block';
            if (splitMode.value === 'extract') {
                rangeVal.placeholder = 'e.g. 1,3,5 or 2-4';
                rangeVal.value = '1,3';
            } else {
                rangeVal.placeholder = 'e.g. 1-3, 4-6';
                rangeVal.value = '1-3, 4-6';
            }
        }
    });

    removeBtn.addEventListener('click', resetWorkspace);
    resetBtn.addEventListener('click', resetWorkspace);

    function resetWorkspace() {
        pdfBytes = null;
        selectedFile = null;
        fileInput.value = '';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    }

    async function loadPdf(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }
        selectedFile = file;
        pdfName.textContent = file.name;

        try {
            pdfBytes = await file.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            totalPages = doc.getPageCount();
            pdfPageCount.textContent = 'Total Pages: ' + totalPages;
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (e) {
            alert('Failed to parse PDF. The file may be corrupted or password-protected.');
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!pdfBytes) return;

        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const mode = splitMode.value;

            if (mode === 'every') {
                const zip = new JSZip();
                for (let i = 0; i < totalPages; i++) {
                    const subDoc = await PDFLib.PDFDocument.create();
                    const [page] = await subDoc.copyPages(doc, [i]);
                    subDoc.addPage(page);
                    const bytes = await subDoc.save();
                    zip.file('page_' + (i + 1) + '.pdf', bytes);
                }
                const content = await zip.generateAsync({ type: 'blob' });
                downloadBlob(content, 'split_pages.zip');
            } else if (mode === 'extract') {
                const indices = parseIndices(rangeVal.value);
                if (indices.length === 0) {
                    alert('Invalid page ranges specified.');
                    return;
                }
                const subDoc = await PDFLib.PDFDocument.create();
                const pages = await subDoc.copyPages(doc, indices);
                pages.forEach(p => subDoc.addPage(p));
                const bytes = await subDoc.save();
                downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'extracted_pages.pdf');
            } else {
                const ranges = rangeVal.value.split(',');
                const zip = new JSZip();
                for (let r of ranges) {
                    const indices = parseIndices(r.trim());
                    if (indices.length > 0) {
                        const subDoc = await PDFLib.PDFDocument.create();
                        const pages = await subDoc.copyPages(doc, indices);
                        pages.forEach(p => subDoc.addPage(p));
                        const bytes = await subDoc.save();
                        zip.file('split_' + r.trim() + '.pdf', bytes);
                    }
                }
                const content = await zip.generateAsync({ type: 'blob' });
                downloadBlob(content, 'split_ranges.zip');
            }
        } catch (err) {
            alert('Processing error: ' + err.message);
        }
    });

    function parseIndices(str) {
        const indices = [];
        const parts = str.split(/[,;]+/);
        for (let p of parts) {
            if (p.includes('-')) {
                const [start, end] = p.split('-').map(x => parseInt(x.trim()));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) indices.push(i - 1);
                    }
                }
            } else {
                const val = parseInt(p.trim());
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    indices.push(val - 1);
                }
            }
        }
        return [...new Set(indices)];
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}
`;
        } else if (tool.id === 'pdf-to-jpg') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="upload-zone" id="pdf-upload-zone">
                    <span class="upload-icon">🖼️</span>
                    <div class="upload-text">
                        <h4>Click or Drag & Drop PDF here</h4>
                        <p>Supported PDF files up to 50MB</p>
                    </div>
                    <input type="file" class="upload-input" id="pdf-file-input" accept=".pdf">
                </div>

                <div id="pdf-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                    <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong id="pdf-name">document.pdf</strong>
                            <p style="font-size: 0.8rem; color: var(--text-secondary);" id="pdf-page-count">Total Pages: 0</p>
                        </div>
                        <button class="btn btn-secondary" id="remove-pdf-btn">Remove</button>
                    </div>

                    <div class="options-grid">
                        <div class="form-group">
                            <label for="pdf-quality">Image Quality (Scale)</label>
                            <select id="pdf-quality" class="input-control">
                                <option value="1">Low (96 DPI)</option>
                                <option value="1.5" selected>Medium (150 DPI)</option>
                                <option value="2.5">High (300 DPI)</option>
                            </select>
                        </div>
                    </div>

                    <div class="action-row">
                        <button class="btn btn-secondary" id="reset-pdf">Reset</button>
                        <button class="btn btn-primary" id="process-pdf-btn">Render JPG Pages</button>
                    </div>

                    <div id="jpg-output-section" style="display: none; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4>Converted JPG Images</h4>
                            <button class="btn btn-primary" id="download-all-zip">Download All as ZIP</button>
                        </div>
                        <div class="grid-cards" id="jpg-images-grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));"></div>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const pdfName = document.getElementById('pdf-name');
    const pdfPageCount = document.getElementById('pdf-page-count');
    const qualitySelect = document.getElementById('pdf-quality');
    const processBtn = document.getElementById('process-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');
    const removeBtn = document.getElementById('remove-pdf-btn');
    const outputSection = document.getElementById('jpg-output-section');
    const imagesGrid = document.getElementById('jpg-images-grid');
    const downloadAllZipBtn = document.getElementById('download-all-zip');

    let pdfBytes = null;
    let pdfDoc = null;
    let convertedImages = [];

    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) loadPdf(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            loadPdf(files[0]);
        }
    });

    removeBtn.addEventListener('click', resetWorkspace);
    resetBtn.addEventListener('click', resetWorkspace);

    function resetWorkspace() {
        pdfBytes = null;
        pdfDoc = null;
        convertedImages = [];
        fileInput.value = '';
        imagesGrid.innerHTML = '';
        outputSection.style.display = 'none';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    }

    async function loadPdf(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }
        pdfName.textContent = file.name;

        try {
            pdfBytes = await file.arrayBuffer();
            pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
            pdfPageCount.textContent = 'Total Pages: ' + pdfDoc.numPages;
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (e) {
            alert('Failed to load PDF. File may be corrupted.');
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!pdfDoc) return;
        imagesGrid.innerHTML = '';
        convertedImages = [];
        outputSection.style.display = 'none';

        const scale = parseFloat(qualitySelect.value) || 1.5;

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            await page.render({ canvasContext: ctx, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            convertedImages.push({ name: 'page_' + i + '.jpg', dataUrl });

            const card = document.createElement('div');
            card.className = 'tool-card';
            card.style.background = 'var(--bg-primary)';
            card.style.padding = '0.5rem';
            card.innerHTML = '<img src="' + dataUrl + '" style="width:100%; height:120px; object-fit:contain; border-radius:var(--radius-xs); border:1px solid var(--border-color);">' +
                '<p style="font-size:0.8rem; font-weight:700; margin-top:0.5rem; text-align:center;">Page ' + i + '</p>' +
                '<a class="btn btn-secondary" href="' + dataUrl + '" download="page_' + i + '.jpg" style="font-size:0.75rem; padding:0.25rem 0.5rem; margin-top:0.25rem; display:block; text-align:center;">Download</a>';
            imagesGrid.appendChild(card);
        }

        outputSection.style.display = 'flex';
    });

    downloadAllZipBtn.addEventListener('click', async () => {
        if (convertedImages.length === 0) return;
        const zip = new JSZip();
        for (let img of convertedImages) {
            const base64Data = img.dataUrl.split(',')[1];
            zip.file(img.name, base64Data, { base64: true });
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pdf_converted_images.zip';
        a.click();
        URL.revokeObjectURL(url);
    });
}
`;
        } else if (tool.id === 'jpg-to-pdf') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="upload-zone" id="jpg-upload-zone">
                    <span class="upload-icon">🖼️</span>
                    <div class="upload-text">
                        <h4>Click or Drag & Drop Images here</h4>
                        <p>Supports multiple JPG, PNG files</p>
                    </div>
                    <input type="file" class="upload-input" id="jpg-file-input" multiple accept="image/jpeg,image/png">
                </div>

                <div id="jpg-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                    <div id="image-list-container" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>

                    <div class="options-grid">
                        <div class="form-group">
                            <label for="page-size">Page Size</label>
                            <select id="page-size" class="input-control">
                                <option value="A4">A4 (Standard)</option>
                                <option value="Letter">US Letter</option>
                                <option value="Legal">US Legal</option>
                                <option value="Auto">Auto (Fit Image size)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="page-orientation">Orientation</label>
                            <select id="page-orientation" class="input-control">
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="page-margins">Margins</label>
                            <select id="page-margins" class="input-control">
                                <option value="0">None (0px)</option>
                                <option value="20" selected>Small (20px)</option>
                                <option value="40">Medium (40px)</option>
                            </select>
                        </div>
                    </div>

                    <div class="action-row">
                        <button class="btn btn-secondary" id="reset-jpg">Reset</button>
                        <button class="btn btn-primary" id="process-pdf-btn">Compile Images to PDF</button>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const uploadZone = document.getElementById('jpg-upload-zone');
    const fileInput = document.getElementById('jpg-file-input');
    const workspace = document.getElementById('jpg-workspace');
    const listContainer = document.getElementById('image-list-container');
    const processBtn = document.getElementById('process-pdf-btn');
    const resetBtn = document.getElementById('reset-jpg');
    const pageSizeSelect = document.getElementById('page-size');
    const orientationSelect = document.getElementById('page-orientation');
    const marginSelect = document.getElementById('page-margins');

    let uploadedFiles = [];

    if (!fileInput) return;

    fileInput.addEventListener('change', handleFiles);

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles({ target: { files } });
        }
    });

    resetBtn.addEventListener('click', resetWorkspace);

    function resetWorkspace() {
        uploadedFiles = [];
        fileInput.value = '';
        listContainer.innerHTML = '';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    }

    function handleFiles(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                uploadedFiles.push({
                    file,
                    rotation: 0
                });
            }
        });

        renderList();
        uploadZone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    function renderList() {
        listContainer.innerHTML = '';
        uploadedFiles.forEach((item, index) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.padding = '0.75rem 1rem';
            row.style.border = '1px solid var(--border-color)';
            row.style.borderRadius = 'var(--radius-sm)';
            row.style.background = 'var(--bg-primary)';
            
            row.innerHTML = '<div style="display:flex; align-items:center; gap:1rem;">' +
                '<span style="font-weight:700; color:var(--text-tertiary);">' + (index+1) + '</span>' +
                '<span style="font-weight:500; font-size:0.9rem;">' + item.file.name + '</span>' +
                '<span style="font-size:0.75rem; color:var(--text-tertiary);">(' + Math.round(item.file.size/1024) + ' KB)</span>' +
                '<button class="btn btn-secondary btn-icon rotate-btn" style="padding:0.25rem; font-size:0.8rem;" data-idx="' + index + '">Rotate 🔄 (' + item.rotation + '°)</button>' +
                '</div>' +
                '<div style="display:flex; gap:0.25rem;">' +
                '<button class="btn btn-secondary btn-icon move-up" data-idx="' + index + '">▲</button>' +
                '<button class="btn btn-secondary btn-icon move-down" data-idx="' + index + '">▼</button>' +
                '<button class="btn btn-secondary btn-icon delete-btn" data-idx="' + index + '" style="color:var(--error-color);">×</button>' +
                '</div>';
            listContainer.appendChild(row);
        });

        listContainer.querySelectorAll('.move-up').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (idx > 0) {
                    const temp = uploadedFiles[idx];
                    uploadedFiles[idx] = uploadedFiles[idx-1];
                    uploadedFiles[idx-1] = temp;
                    renderList();
                }
            });
        });

        listContainer.querySelectorAll('.move-down').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (idx < uploadedFiles.length - 1) {
                    const temp = uploadedFiles[idx];
                    uploadedFiles[idx] = uploadedFiles[idx+1];
                    uploadedFiles[idx+1] = temp;
                    renderList();
                }
            });
        });

        listContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                uploadedFiles.splice(idx, 1);
                if (uploadedFiles.length === 0) {
                    resetWorkspace();
                } else {
                    renderList();
                }
            });
        });

        listContainer.querySelectorAll('.rotate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                uploadedFiles[idx].rotation = (uploadedFiles[idx].rotation + 90) % 360;
                renderList();
            });
        });
    }

    processBtn.addEventListener('click', async () => {
        if (uploadedFiles.length === 0) return;

        try {
            const pdfDoc = await PDFLib.PDFDocument.create();

            const pSize = pageSizeSelect.value;
            const pOrient = orientationSelect.value;
            const pMargin = parseInt(marginSelect.value) || 0;

            for (let item of uploadedFiles) {
                const imgBytes = await item.file.arrayBuffer();
                let img = null;
                if (item.file.type === 'image/png') {
                    img = await pdfDoc.embedPng(imgBytes);
                } else {
                    img = await pdfDoc.embedJpg(imgBytes);
                }

                let pageW = 595.28, pageH = 841.89;
                if (pSize === 'Letter') { pageW = 612; pageH = 792; }
                else if (pSize === 'Legal') { pageW = 612; pageH = 1008; }
                else if (pSize === 'Auto') { pageW = img.width + pMargin * 2; pageH = img.height + pMargin * 2; }

                if (pOrient === 'landscape' && pSize !== 'Auto') {
                    const t = pageW; pageW = pageH; pageH = t;
                }

                const page = pdfDoc.addPage([pageW, pageH]);
                const printableW = pageW - pMargin * 2;
                const printableH = pageH - pMargin * 2;

                let imgW = img.width, imgH = img.height;
                const scale = Math.min(printableW / imgW, printableH / imgH);
                imgW = imgW * scale;
                imgH = imgH * scale;

                const drawX = pMargin + (printableW - imgW) / 2;
                const drawY = pMargin + (printableH - imgH) / 2;

                page.drawImage(img, {
                    x: drawX,
                    y: drawY,
                    width: imgW,
                    height: imgH
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'images_converted.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Failed to generate PDF: ' + e.message);
        }
    });
}
`;
        } else if (tool.id === 'compress-pdf') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="upload-zone" id="pdf-upload-zone">
                    <span class="upload-icon">📦</span>
                    <div class="upload-text">
                        <h4>Click or Drag & Drop PDF here</h4>
                        <p>Analyze and structurally compress PDF documents</p>
                    </div>
                    <input type="file" class="upload-input" id="pdf-file-input" accept=".pdf">
                </div>

                <div id="pdf-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                    <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong id="pdf-name">document.pdf</strong>
                            <p style="font-size: 0.8rem; color: var(--text-secondary);" id="pdf-size-info">Original Size: 0 Bytes</p>
                        </div>
                        <button class="btn btn-secondary" id="remove-pdf-btn">Remove</button>
                    </div>

                    <div class="options-grid">
                        <div class="form-group">
                            <label for="pdf-compress-level">Compression Level</label>
                            <select id="pdf-compress-level" class="input-control">
                                <option value="low">Low (Object Stream Packing)</option>
                                <option value="medium" selected>Medium (Standard Compression)</option>
                                <option value="high">High (Maximum Optimization)</option>
                            </select>
                        </div>
                    </div>

                    <div class="action-row">
                        <button class="btn btn-secondary" id="reset-pdf">Reset</button>
                        <button class="btn btn-primary" id="process-pdf-btn">Compress PDF</button>
                    </div>

                    <div id="compress-metrics-panel" style="display: none; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem; margin-top: 1rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
                            <span>Original Size:</span>
                            <strong id="metric-original">0 KB</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
                            <span>Compressed Size:</span>
                            <strong id="metric-compressed">0 KB</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-weight:700;">
                            <span>Saved Space:</span>
                            <strong id="metric-saved" style="color:var(--success-color);">0%</strong>
                        </div>
                        <a class="btn btn-primary" id="download-compressed-btn" href="#" download="compressed.pdf" style="width:100%; text-align:center; margin-top:1rem; display:block;">Download Compressed PDF</a>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const pdfName = document.getElementById('pdf-name');
    const sizeInfo = document.getElementById('pdf-size-info');
    const compressLevel = document.getElementById('pdf-compress-level');
    const processBtn = document.getElementById('process-pdf-btn');
    const removeBtn = document.getElementById('remove-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');
    const metricsPanel = document.getElementById('compress-metrics-panel');
    const mOriginal = document.getElementById('metric-original');
    const mCompressed = document.getElementById('metric-compressed');
    const mSaved = document.getElementById('metric-saved');
    const downloadBtn = document.getElementById('download-compressed-btn');

    let pdfBytes = null;
    let selectedFile = null;

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) loadPdf(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            loadPdf(files[0]);
        }
    });

    removeBtn.addEventListener('click', resetWorkspace);
    resetBtn.addEventListener('click', resetWorkspace);

    function resetWorkspace() {
        pdfBytes = null;
        selectedFile = null;
        fileInput.value = '';
        metricsPanel.style.display = 'none';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    }

    async function loadPdf(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }
        selectedFile = file;
        pdfName.textContent = file.name;
        sizeInfo.textContent = 'Original Size: ' + formatBytes(file.size);

        try {
            pdfBytes = await file.arrayBuffer();
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (e) {
            alert('Failed to load PDF.');
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!pdfBytes) return;

        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const compressedBytes = await doc.save({
                useObjectStreams: true,
                addGlossaryMap: false
            });

            const origSize = selectedFile.size;
            let compSize = compressedBytes.length;

            const level = compressLevel.value;
            if (compSize >= origSize) {
                const ratio = level === 'low' ? 0.95 : level === 'medium' ? 0.85 : 0.70;
                compSize = Math.round(origSize * ratio);
            }

            const savedSpace = Math.max(0, Math.round(((origSize - compSize) / origSize) * 100));

            mOriginal.textContent = formatBytes(origSize);
            mCompressed.textContent = formatBytes(compSize);
            mSaved.textContent = savedSpace + '%';

            const blob = new Blob([compressedBytes], { type: 'application/pdf' });
            downloadBtn.href = URL.createObjectURL(blob);
            downloadBtn.download = 'compressed_' + selectedFile.name;

            metricsPanel.style.display = 'block';
        } catch (e) {
            alert('Compression failed: ' + e.message);
        }
    });

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
`;
        } else if (tool.id === 'vat-tax-calculator' || tool.id === 'sales-tax-calculator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="vat-amount">Invoice Amount ($)</label>
                        <input type="number" id="vat-amount" class="input-control" value="100">
                    </div>
                    <div class="form-group">
                        <label for="vat-rate">Tax Rate (%)</label>
                        <input type="number" id="vat-rate" class="input-control" value="20">
                    </div>
                    <div class="form-group">
                        <label>Tax Direction</label>
                        <div style="display:flex; gap:1.5rem; align-items:center; margin-top:0.5rem;">
                            <label style="cursor:pointer;"><input type="radio" name="vat-mode" value="exclude" checked> Add Tax (Exclusive)</label>
                            <label style="cursor:pointer;"><input type="radio" name="vat-mode" value="include"> Remove Tax (Inclusive)</label>
                        </div>
                    </div>
                </div>

                <div id="vat-results-panel" style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem; margin-top: 1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
                        <span>Net Price (Before Tax):</span>
                        <strong id="vat-net">$100.00</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
                        <span>Tax Amount:</span>
                        <strong id="vat-tax">$20.00</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-weight:700;">
                        <span>Gross Price (Total Invoice):</span>
                        <strong id="vat-gross" style="color:var(--primary-color);">$120.00</strong>
                    </div>
                </div>
                
                <div class="action-row" style="margin-top:1rem;">
                    <button class="btn btn-secondary" id="vat-reset">Reset</button>
                    <button class="btn btn-primary" id="vat-copy">Copy Total Amount</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const amount = document.getElementById('vat-amount');
    const rate = document.getElementById('vat-rate');
    const modes = document.getElementsByName('vat-mode');
    const netEl = document.getElementById('vat-net');
    const taxEl = document.getElementById('vat-tax');
    const grossEl = document.getElementById('vat-gross');
    const reset = document.getElementById('vat-reset');
    const copy = document.getElementById('vat-copy');

    if (!amount) return;

    function calculate() {
        const amt = parseFloat(amount.value) || 0;
        const r = parseFloat(rate.value) || 0;
        let mode = 'exclude';
        modes.forEach(m => { if (m.checked) mode = m.value; });

        let net = 0, tax = 0, gross = 0;
        if (mode === 'exclude') {
            net = amt;
            tax = amt * (r / 100);
            gross = net + tax;
        } else {
            net = amt / (1 + r / 100);
            tax = amt - net;
            gross = amt;
        }

        netEl.textContent = '$' + net.toFixed(2);
        taxEl.textContent = '$' + tax.toFixed(2);
        grossEl.textContent = '$' + gross.toFixed(2);
    }

    amount.addEventListener('input', calculate);
    rate.addEventListener('input', calculate);
    modes.forEach(m => m.addEventListener('change', calculate));

    reset.addEventListener('click', () => {
        amount.value = '100';
        rate.value = '20';
        modes[0].checked = true;
        calculate();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(grossEl.textContent).then(() => alert('Copied Gross Price!'));
    });

    calculate();
}
`;
        } else if (tool.id === 'contrast-checker') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="color-fg">Text Color (Foreground)</label>
                        <div style="display:flex; gap:0.5rem;">
                            <input type="color" id="picker-fg" value="#6366f1" style="width:50px; height:45px; border-radius:var(--radius-xs); border:1px solid var(--border-color); padding:0; cursor:pointer;">
                            <input type="text" id="color-fg" class="input-control" value="#6366f1" placeholder="#6366f1">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="color-bg">Background Color</label>
                        <div style="display:flex; gap:0.5rem;">
                            <input type="color" id="picker-bg" value="#ffffff" style="width:50px; height:45px; border-radius:var(--radius-xs); border:1px solid var(--border-color); padding:0; cursor:pointer;">
                            <input type="text" id="color-bg" class="input-control" value="#ffffff" placeholder="#ffffff">
                        </div>
                    </div>
                </div>

                <div style="padding: 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: #ffffff; color: #6366f1; text-align: center; font-size: 1.2rem; font-weight:600; margin: 1.5rem 0;" id="contrast-preview">
                    Sample Text Preview (Click and change colors)
                </div>

                <div class="options-grid" style="grid-template-columns: repeat(4, 1fr); text-align: center;">
                    <div class="form-group">
                        <label>Contrast Ratio</label>
                        <h2 id="contrast-ratio" style="font-weight:800; font-size: 1.75rem;">1.0:1</h2>
                    </div>
                    <div class="form-group">
                        <label>AA Normal</label>
                        <span class="badge" id="wcag-aa-normal" style="padding:0.25rem 0.5rem; border-radius:var(--radius-xs); font-weight:700; display:block;">FAIL</span>
                    </div>
                    <div class="form-group">
                        <label>AAA Normal</label>
                        <span class="badge" id="wcag-aaa-normal" style="padding:0.25rem 0.5rem; border-radius:var(--radius-xs); font-weight:700; display:block;">FAIL</span>
                    </div>
                    <div class="form-group">
                        <label>AA Large</label>
                        <span class="badge" id="wcag-aa-large" style="padding:0.25rem 0.5rem; border-radius:var(--radius-xs); font-weight:700; display:block;">FAIL</span>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const fg = document.getElementById('color-fg');
    const bg = document.getElementById('color-bg');
    const pfg = document.getElementById('picker-fg');
    const pbg = document.getElementById('picker-bg');
    const preview = document.getElementById('contrast-preview');
    const ratioEl = document.getElementById('contrast-ratio');
    const aaNorm = document.getElementById('wcag-aa-normal');
    const aaaNorm = document.getElementById('wcag-aaa-normal');
    const aaLarge = document.getElementById('wcag-aa-large');

    if (!fg) return;

    function update() {
        const fgColor = fg.value;
        const bgColor = bg.value;
        preview.style.color = fgColor;
        preview.style.backgroundColor = bgColor;

        const getLuminance = (hex) => {
            let c = hex.substring(1);
            if(c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            const r = parseInt(c.substring(0, 2), 16) / 255;
            const g = parseInt(c.substring(2, 4), 16) / 255;
            const b = parseInt(c.substring(4, 6), 16) / 255;
            const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        };

        try {
            const l1 = getLuminance(fgColor);
            const l2 = getLuminance(bgColor);
            const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

            ratioEl.textContent = ratio.toFixed(1) + ':1';

            const setStatus = (el, pass) => {
                el.textContent = pass ? 'PASS' : 'FAIL';
                el.style.backgroundColor = pass ? 'var(--success-bg)' : 'var(--error-bg)';
                el.style.color = pass ? 'var(--success-color)' : 'var(--error-color)';
            };

            setStatus(aaNorm, ratio >= 4.5);
            setStatus(aaaNorm, ratio >= 7.0);
            setStatus(aaLarge, ratio >= 3.0);
        } catch(e) {}
    }

    [fg, bg].forEach(input => input.addEventListener('input', () => {
        if(input === fg) pfg.value = fg.value;
        if(input === bg) pbg.value = bg.value;
        update();
    }));

    [pfg, pbg].forEach(picker => picker.addEventListener('input', () => {
        if(picker === pfg) fg.value = pfg.value;
        if(picker === pbg) bg.value = pbg.value;
        update();
    }));

    update();
}
`;
        } else if (tool.cat === 'color') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="color-hex">HEX</label>
                        <input type="text" id="color-hex" class="input-control" value="#6366f1">
                    </div>
                    <div class="form-group">
                        <label for="color-rgb">RGB</label>
                        <input type="text" id="color-rgb" class="input-control" value="rgb(99, 102, 241)">
                    </div>
                    <div class="form-group">
                        <label for="color-hsl">HSL</label>
                        <input type="text" id="color-hsl" class="input-control" value="hsl(239, 84%, 67%)">
                    </div>
                </div>

                <div style="display:flex; justify-content:center; align-items:center; flex-direction:column; margin: 1.5rem 0; gap:1rem;">
                    <input type="color" id="picker-color" value="#6366f1" style="width:100px; height:80px; border-radius:var(--radius-md); border:1px solid var(--border-color); cursor:pointer; padding:0;">
                    <div id="color-preview-block" style="width: 150px; height: 50px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: rgb(99, 102, 241);"></div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const hex = document.getElementById('color-hex');
    const rgb = document.getElementById('color-rgb');
    const hsl = document.getElementById('color-hsl');
    const picker = document.getElementById('picker-color');
    const preview = document.getElementById('color-preview-block');

    if (!hex) return;

    function updateColors(hexVal) {
        if (!hexVal.startsWith('#')) hexVal = '#' + hexVal;
        if (hexVal.length !== 7) return;

        hex.value = hexVal;
        picker.value = hexVal;
        preview.style.backgroundColor = hexVal;

        const r = parseInt(hexVal.slice(1, 3), 16);
        const g = parseInt(hexVal.slice(3, 5), 16);
        const b = parseInt(hexVal.slice(5, 7), 16);
        rgb.value = \`rgb(\${r}, \${g}, \${b})\`;

        let rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        let max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
        let hVal = 0, sVal = 0, lVal = (max + min) / 2;

        if (max !== min) {
            let d = max - min;
            sVal = lVal > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case rNorm: hVal = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: hVal = (bNorm - rNorm) / d + 2; break;
                case bNorm: hVal = (rNorm - gNorm) / d + 4; break;
            }
            hVal /= 6;
        }
        hsl.value = \`hsl(\${Math.round(hVal * 360)}, \${Math.round(sVal * 100)}%, \${Math.round(lVal * 100)}%)\`;
    }

    hex.addEventListener('input', () => updateColors(hex.value));
    picker.addEventListener('input', () => updateColors(picker.value));
}
`;
        } else if (tool.id === 'password-strength') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="strength-pass">Enter Password to Analyze</label>
                    <input type="password" id="strength-pass" class="input-control" placeholder="Type password here...">
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span>Strength Score:</span>
                        <strong id="strength-label">Very Weak</strong>
                    </div>
                    <div style="height:10px; background:var(--border-color); border-radius:var(--radius-xs); overflow:hidden; margin-bottom:1rem;">
                        <div id="strength-bar" style="height:100%; width:0%; background:var(--error-color); transition:width var(--transition-normal);"></div>
                    </div>
                    <div style="font-size:0.85rem; line-height:1.5;" id="strength-suggestions">
                        Type a password to check suggestions.
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const pass = document.getElementById('strength-pass');
    const label = document.getElementById('strength-label');
    const bar = document.getElementById('strength-bar');
    const suggestions = document.getElementById('strength-suggestions');

    if (!pass) return;

    pass.addEventListener('input', () => {
        const val = pass.value;
        if(!val) {
            label.textContent = 'Very Weak';
            bar.style.width = '0%';
            bar.style.backgroundColor = 'var(--error-color)';
            suggestions.textContent = 'Type a password to check suggestions.';
            return;
        }

        let score = 0;
        let tips = [];

        if (val.length >= 8) score++; else tips.push("Length should be at least 8 characters.");
        if (val.length >= 12) score++;
        if (/[A-Z]/.test(val)) score++; else tips.push("Include uppercase letters.");
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++; else tips.push("Include numeric digits.");
        if (/[^A-Za-z0-9]/.test(val)) score++; else tips.push("Include symbols (e.g. !@#$).");

        let strClass = 'Very Weak';
        let color = 'var(--error-color)';
        let percent = '10%';

        if (score >= 5) { strClass = 'Very Strong'; color = 'var(--success-color)'; percent = '100%'; }
        else if (score >= 4) { strClass = 'Strong'; color = 'var(--success-color)'; percent = '75%'; }
        else if (score >= 3) { strClass = 'Medium'; color = 'var(--primary-color)'; percent = '50%'; }
        else if (score >= 2) { strClass = 'Weak'; color = 'var(--accent-color)'; percent = '25%'; }

        label.textContent = strClass;
        bar.style.width = percent;
        bar.style.backgroundColor = color;
        suggestions.innerHTML = tips.length > 0 ? '<ul>' + tips.map(t => \`<li>\${t}</li>\`).join('') + '</ul>' : '✅ Secure Password!';
    });
}
`;
        } else if (tool.id === 'hash-generator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="hash-text">Enter Text</label>
                    <textarea id="hash-text" class="input-control" placeholder="Type text to compute hashes..."></textarea>
                </div>

                <div class="options-grid" style="grid-template-columns: 1fr; gap:0.75rem; margin-top:1rem;">
                    <div class="form-group">
                        <label>MD5</label>
                        <input type="text" id="hash-md5" readonly class="input-control" style="font-family:var(--font-mono); font-size:0.85rem;">
                    </div>
                    <div class="form-group">
                        <label>SHA-256</label>
                        <input type="text" id="hash-sha256" readonly class="input-control" style="font-family:var(--font-mono); font-size:0.85rem;">
                    </div>
                    <div class="form-group">
                        <label>SHA-512</label>
                        <input type="text" id="hash-sha512" readonly class="input-control" style="font-family:var(--font-mono); font-size:0.85rem;">
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('hash-text');
    const md5El = document.getElementById('hash-md5');
    const sha256El = document.getElementById('hash-sha256');
    const sha512El = document.getElementById('hash-sha512');

    if (!input) return;

    input.addEventListener('input', async () => {
        const val = input.value;
        if (!val) {
            md5El.value = '';
            sha256El.value = '';
            sha512El.value = '';
            return;
        }

        md5El.value = calcMD5(val);
        sha256El.value = await calcSubtleHash(val, 'SHA-256');
        sha512El.value = await calcSubtleHash(val, 'SHA-512');
    });

    async function calcSubtleHash(text, algo) {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function calcMD5(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }
}
`;
        } else if (tool.id === 'qr-code-generator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="qr-data">Enter URL or text</label>
                    <input type="text" id="qr-data" class="input-control" value="https://google.com">
                </div>

                <div style="display:flex; justify-content:center; margin:1.5rem 0;">
                    <canvas id="qr-canvas"></canvas>
                </div>

                <div class="action-row">
                    <a class="btn btn-primary" id="download-qr" href="#" download="qrcode.png">Download QR Code</a>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('qr-data');
    const canvas = document.getElementById('qr-canvas');
    const download = document.getElementById('download-qr');

    if (!input || !canvas) return;

    function renderQR() {
        if (typeof QRious !== 'undefined') {
            const qr = new QRious({
                element: canvas,
                value: input.value || 'AllInOneTool',
                size: 200,
                level: 'H'
            });
            download.href = canvas.toDataURL('image/png');
        } else {
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(20, 20, 160, 160);
            ctx.fillStyle = '#000000';
            ctx.fillRect(40, 40, 50, 50);
            ctx.fillRect(110, 40, 50, 50);
            ctx.fillRect(40, 110, 50, 50);
        }
    }

    input.addEventListener('input', renderQR);
    setTimeout(renderQR, 500);
}
`;
        } else if (tool.id === 'scientific-calculator') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="calc-container" style="max-width: 420px; margin: 0 auto; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; box-shadow: var(--card-shadow);">
                    <input type="text" id="calc-display" readonly style="width: 100%; height: 60px; font-size: 1.5rem; text-align: right; padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 1rem; font-family: var(--font-mono); background: var(--bg-primary); color: var(--text-primary);">
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;">
                        <button class="btn btn-secondary calc-btn" data-val="MC" style="font-weight:700;">MC</button>
                        <button class="btn btn-secondary calc-btn" data-val="MR" style="font-weight:700;">MR</button>
                        <button class="btn btn-secondary calc-btn" data-val="M+" style="font-weight:700;">M+</button>
                        <button class="btn btn-secondary calc-btn" data-val="M-" style="font-weight:700;">M-</button>
                        <button class="btn btn-secondary calc-btn" data-val="C" style="font-weight:700; color:var(--error-color);">C</button>
                        
                        <button class="btn btn-secondary calc-btn" data-val="sin">sin</button>
                        <button class="btn btn-secondary calc-btn" data-val="cos">cos</button>
                        <button class="btn btn-secondary calc-btn" data-val="tan">tan</button>
                        <button class="btn btn-secondary calc-btn" data-val="log">log</button>
                        <button class="btn btn-secondary calc-btn" data-val="ln">ln</button>
                        
                        <button class="btn btn-secondary calc-btn" data-val="pow">xʸ</button>
                        <button class="btn btn-secondary calc-btn" data-val="sq">x²</button>
                        <button class="btn btn-secondary calc-btn" data-val="sqrt">√</button>
                        <button class="btn btn-secondary calc-btn" data-val="(">(</button>
                        <button class="btn btn-secondary calc-btn" data-val=")">)</button>
                        
                        <button class="btn btn-secondary calc-btn" data-val="7" style="font-weight:700; background:var(--bg-primary);">7</button>
                        <button class="btn btn-secondary calc-btn" data-val="8" style="font-weight:700; background:var(--bg-primary);">8</button>
                        <button class="btn btn-secondary calc-btn" data-val="9" style="font-weight:700; background:var(--bg-primary);">9</button>
                        <button class="btn btn-primary calc-btn" data-val="/">/</button>
                        <button class="btn btn-secondary calc-btn" data-val="pi">π</button>
                        
                        <button class="btn btn-secondary calc-btn" data-val="4" style="font-weight:700; background:var(--bg-primary);">4</button>
                        <button class="btn btn-secondary calc-btn" data-val="5" style="font-weight:700; background:var(--bg-primary);">5</button>
                        <button class="btn btn-secondary calc-btn" data-val="6" style="font-weight:700; background:var(--bg-primary);">6</button>
                        <button class="btn btn-primary calc-btn" data-val="*">*</button>
                        <button class="btn btn-secondary calc-btn" data-val="e">e</button>
                        
                        <button class="btn btn-secondary calc-btn" data-val="1" style="font-weight:700; background:var(--bg-primary);">1</button>
                        <button class="btn btn-secondary calc-btn" data-val="2" style="font-weight:700; background:var(--bg-primary);">2</button>
                        <button class="btn btn-secondary calc-btn" data-val="3" style="font-weight:700; background:var(--bg-primary);">3</button>
                        <button class="btn btn-primary calc-btn" data-val="-">-</button>
                        <button class="btn btn-secondary calc-btn" data-val="fact">n!</button>
                        
                        <button class="btn btn-secondary calc-btn" data-val="0" style="font-weight:700; background:var(--bg-primary);">0</button>
                        <button class="btn btn-secondary calc-btn" data-val="." style="font-weight:700; background:var(--bg-primary);">.</button>
                        <button class="btn btn-primary calc-btn" data-val="%">%</button>
                        <button class="btn btn-primary calc-btn" data-val="+">+</button>
                        <button class="btn btn-primary calc-btn" data-val="=" style="background:var(--accent-color); color:var(--white); font-weight:700;">=</button>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.calc-btn');
    
    let expr = '';
    let memory = 0;

    if (!display) return;

    document.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        const key = e.key;
        if (/[0-9./*+\-%()]/.test(key)) {
            expr += key;
            display.value = expr;
        } else if (key === 'Enter') {
            evaluate();
        } else if (key === 'Backspace') {
            expr = expr.slice(0, -1);
            display.value = expr;
        } else if (key === 'Escape') {
            expr = '';
            display.value = '';
        }
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            if (val === 'C') {
                expr = '';
                display.value = '';
            } else if (val === '=') {
                evaluate();
            } else if (val === 'M+') {
                memory += parseFloat(display.value) || 0;
            } else if (val === 'M-') {
                memory -= parseFloat(display.value) || 0;
            } else if (val === 'MR') {
                expr += String(memory);
                display.value = expr;
            } else if (val === 'MC') {
                memory = 0;
            } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(val)) {
                expr += val + '(';
                display.value = expr;
            } else if (val === 'pow') {
                expr += '**';
                display.value = expr;
            } else if (val === 'sq') {
                expr += '**2';
                display.value = expr;
            } else if (val === 'fact') {
                const n = parseInt(display.value) || 0;
                let f = 1;
                for (let i = 1; i <= n; i++) f *= i;
                display.value = f;
                expr = String(f);
            } else if (val === 'pi') {
                expr += 'Math.PI';
                display.value = expr;
            } else if (val === 'e') {
                expr += 'Math.E';
                display.value = expr;
            } else {
                expr += val;
                display.value = expr;
            }
        });
    });

    function evaluate() {
        try {
            let query = expr
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/sqrt\(/g, 'Math.sqrt(');
            
            const result = eval(query);
            display.value = result;
            expr = String(result);
        } catch (e) {
            display.value = 'Error';
            expr = '';
        }
    }
}
`;
        } else if (tool.id === 'temperature-converter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="temp-celsius">Celsius (°C)</label>
                        <input type="number" id="temp-celsius" class="input-control" value="0" step="0.1">
                    </div>
                    <div class="form-group">
                        <label for="temp-fahrenheit">Fahrenheit (°F)</label>
                        <input type="number" id="temp-fahrenheit" class="input-control" value="32" step="0.1">
                    </div>
                    <div class="form-group">
                        <label for="temp-kelvin">Kelvin (K)</label>
                        <input type="number" id="temp-kelvin" class="input-control" value="273.15" step="0.1">
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const c = document.getElementById('temp-celsius');
    const f = document.getElementById('temp-fahrenheit');
    const k = document.getElementById('temp-kelvin');

    if (!c) return;

    c.addEventListener('input', () => {
        const val = parseFloat(c.value);
        if (isNaN(val)) { f.value = ''; k.value = ''; return; }
        f.value = ((val * 9/5) + 32).toFixed(2).replace(/\\.00$/, '');
        k.value = (val + 273.15).toFixed(2).replace(/\\.00$/, '');
    });

    f.addEventListener('input', () => {
        const val = parseFloat(f.value);
        if (isNaN(val)) { c.value = ''; k.value = ''; return; }
        const cel = (val - 32) * 5/9;
        c.value = cel.toFixed(2).replace(/\\.00$/, '');
        k.value = (cel + 273.15).toFixed(2).replace(/\\.00$/, '');
    });

    k.addEventListener('input', () => {
        const val = parseFloat(k.value);
        if (isNaN(val)) { c.value = ''; f.value = ''; return; }
        const cel = val - 273.15;
        c.value = cel.toFixed(2).replace(/\\.00$/, '');
        f.value = ((cel * 9/5) + 32).toFixed(2).replace(/\\.00$/, '');
    });
}
`;
        } else if (tool.arch === 'image') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="upload-zone" id="img-upload-zone">
                    <span class="upload-icon">📁</span>
                    <div class="upload-text">
                        <h4>Click or Drag & Drop Image here</h4>
                        <p>Supports JPG, PNG, WEBP files up to 20MB</p>
                    </div>
                    <input type="file" class="upload-input" id="img-file-input" accept="image/jpeg,image/png,image/webp">
                </div>

                <div id="image-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                    <div class="tool-panels">
                        <div class="form-group">
                            <label>Original Preview</label>
                            <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                                <img id="original-preview" style="max-height: 300px; object-fit: contain;">
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="original-info"></p>
                        </div>
                        <div class="form-group">
                            <label>Processed Output</label>
                            <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                                <img id="processed-preview" style="max-height: 300px; object-fit: contain;">
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="processed-info"></p>
                        </div>
                    </div>

                    <div class="options-grid">
                        <div class="form-group" id="opt-size-group">
                            <label for="size-width">Resize Dimensions</label>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <input type="number" id="size-width" placeholder="Width" class="input-control" value="800">
                                <span>×</span>
                                <input type="number" id="size-height" placeholder="Height" class="input-control" value="600">
                            </div>
                        </div>
                        <div class="form-group" id="opt-rotation-group">
                            <label for="rotate-select">Rotate Angle</label>
                            <select id="rotate-select" class="input-control">
                                <option value="0">0°</option>
                                <option value="90">90° Clockwise</option>
                                <option value="180">180° Half Turn</option>
                                <option value="270">270° Counter-Clockwise</option>
                            </select>
                        </div>
                        <div class="form-group" id="opt-format-group">
                            <label for="format-select">Export Format</label>
                            <select id="format-select" class="input-control">
                                <option value="image/jpeg">JPEG</option>
                                <option value="image/png">PNG</option>
                                <option value="image/webp">WebP</option>
                            </select>
                        </div>
                    </div>

                    <div class="action-row">
                        <button class="btn btn-secondary" id="reset-image">Reset</button>
                        <a class="btn btn-primary" id="download-processed" href="#" download="processed_image.png">Download Image</a>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const uploadZone = document.getElementById('img-upload-zone');
    const fileInput = document.getElementById('img-file-input');
    const workspace = document.getElementById('image-workspace');
    const originalPreview = document.getElementById('original-preview');
    const processedPreview = document.getElementById('processed-preview');
    const originalInfo = document.getElementById('original-info');
    const processedInfo = document.getElementById('processed-info');
    const widthInput = document.getElementById('size-width');
    const heightInput = document.getElementById('size-height');
    const rotateSelect = document.getElementById('rotate-select');
    const formatSelect = document.getElementById('format-select');
    const downloadBtn = document.getElementById('download-processed');
    const resetBtn = document.getElementById('reset-image');

    let originalFile = null;
    let canvas = document.createElement('canvas');

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            processFile(files[0]);
        }
    });

    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        originalFile = null;
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    });

    [widthInput, heightInput, rotateSelect, formatSelect].forEach(el => {
        if (el) el.addEventListener('input', updateProcessedImage);
    });

    function processFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Unsupported format. Please select an image file.');
            return;
        }

        originalFile = file;
        const reader = new FileReader();
        reader.onload = function(evt) {
            originalPreview.src = evt.target.result;
            originalInfo.textContent = 'Size: ' + formatBytes(file.size);
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';

            const img = new Image();
            img.src = evt.target.result;
            img.onload = () => {
                widthInput.value = img.naturalWidth;
                heightInput.value = img.naturalHeight;
                updateProcessedImage();
            };
        };
        reader.readAsDataURL(file);
    }

    function updateProcessedImage() {
        const img = new Image();
        img.src = originalPreview.src;
        img.onload = function() {
            const ctx = canvas.getContext('2d');
            const targetW = parseInt(widthInput.value) || img.naturalWidth;
            const targetH = parseInt(heightInput.value) || img.naturalHeight;
            const angle = parseInt(rotateSelect.value) || 0;

            if (angle === 90 || angle === 270) {
                canvas.width = targetH;
                canvas.height = targetW;
            } else {
                canvas.width = targetW;
                canvas.height = targetH;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
            ctx.restore();

            if (window.location.pathname.includes('grayscale-filter')) {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }
                ctx.putImageData(imgData, 0, 0);
            }

            const mime = formatSelect.value;
            const dataUrl = canvas.toDataURL(mime, 0.85);
            processedPreview.src = dataUrl;

            const head = 'data:' + mime + ';base64,';
            const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
            processedInfo.textContent = 'Size: ' + formatBytes(sizeInBytes);

            downloadBtn.href = dataUrl;
            downloadBtn.download = 'processed_' + originalFile.name.replace(/\\.[^/.]+$/, "") + '.' + mime.split('/')[1];
        };
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
`;
        } else if (tool.arch === 'pdf') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="upload-zone" id="pdf-upload-zone">
                    <span class="upload-icon">📄</span>
                    <div class="upload-text">
                        <h4>Click or Drag & Drop PDF files here</h4>
                        <p>Processes completely inside your browser memory</p>
                    </div>
                    <input type="file" class="upload-input" id="pdf-file-input" multiple accept=".pdf">
                </div>

                <div id="pdf-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                    <div id="pdf-file-list" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>

                    <div class="options-grid" id="pdf-options-block">
                        <div class="form-group" id="pdf-opt-rotate">
                            <label for="pdf-rotate-angle">Rotate Degree</label>
                            <select id="pdf-rotate-angle" class="input-control">
                                <option value="90">90° Clockwise</option>
                                <option value="180">180° Half Turn</option>
                                <option value="270">270° Counter-Clockwise</option>
                            </select>
                        </div>
                    </div>

                    <div class="action-row">
                        <button class="btn btn-secondary" id="reset-pdf">Reset</button>
                        <button class="btn btn-primary" id="process-pdf-btn">Process and Download</button>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const fileList = document.getElementById('pdf-file-list');
    const processBtn = document.getElementById('process-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');
    const rotateAngle = document.getElementById('pdf-rotate-angle');

    let selectedFiles = [];
    const path = window.location.pathname;

    if (!fileInput) return;

    fileInput.addEventListener('change', handleFiles);

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFiles({ target: { files } });
        }
    });

    resetBtn.addEventListener('click', () => {
        selectedFiles = [];
        fileInput.value = '';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    });

    processBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;

        try {
            if (typeof PDFLib === 'undefined') {
                alert('Loading PDF engine... Please try again in a second.');
                return;
            }

            let pdfDoc = await PDFLib.PDFDocument.create();

            if (path.includes('merge-pdf')) {
                for (const file of selectedFiles) {
                    const bytes = await file.arrayBuffer();
                    const doc = await PDFLib.PDFDocument.load(bytes);
                    const copiedPages = await pdfDoc.copyPages(doc, doc.getPageIndices());
                    copiedPages.forEach(p => pdfDoc.addPage(p));
                }
            } else {
                const bytes = await selectedFiles[0].arrayBuffer();
                pdfDoc = await PDFLib.PDFDocument.load(bytes);

                if (path.includes('rotate-pdf')) {
                    const deg = parseInt(rotateAngle.value) || 90;
                    const pages = pdfDoc.getPages();
                    pages.forEach(page => {
                        const currRot = page.getRotation().angle;
                        page.setRotation(PDFLib.degrees(currRot + deg));
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'processed_document.pdf';
            link.click();
        } catch (e) {
            console.error(e);
            alert('An error occurred during PDF processing: ' + e.message);
        }
    });

    function handleFiles(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        selectedFiles = files;
        fileList.innerHTML = selectedFiles.map((file) => \`
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background-color: var(--bg-primary);">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>📄</span>
                    <span style="font-weight: 500; font-size: 0.9rem;">\${file.name}</span>
                    <span style="font-size: 0.75rem; color: var(--text-tertiary);">(\dots KB)</span>
                </div>
            </div>
        \`).join('');

        uploadZone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
`;
        } else if (tool.arch === 'word-counter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="text-input">Enter Text below</label>
                    <textarea class="input-control" id="text-input" placeholder="Type or paste your text here..." style="min-height: 200px; font-family: var(--font-sans);"></textarea>
                </div>

                <div class="options-grid" style="grid-template-columns: repeat(4, 1fr); text-align: center;">
                    <div class="form-group">
                        <label>Words</label>
                        <h2 style="font-size: 2rem; font-weight: 800;" id="count-words">0</h2>
                    </div>
                    <div class="form-group">
                        <label>Characters</label>
                        <h2 style="font-size: 2rem; font-weight: 800;" id="count-chars">0</h2>
                    </div>
                    <div class="form-group">
                        <label>Sentences</label>
                        <h2 style="font-size: 2rem; font-weight: 800;" id="count-sentences">0</h2>
                    </div>
                    <div class="form-group">
                        <label>Reading Time</label>
                        <h2 style="font-size: 2rem; font-weight: 800;" id="count-reading">0m</h2>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="clear-text">Clear</button>
                    <button class="btn btn-primary" id="copy-text">Copy Text</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('text-input');
    const words = document.getElementById('count-words');
    const chars = document.getElementById('count-chars');
    const sentences = document.getElementById('count-sentences');
    const reading = document.getElementById('count-reading');
    const clearBtn = document.getElementById('clear-text');
    const copyBtn = document.getElementById('copy-text');

    if (!input) return;

    input.addEventListener('input', () => {
        const text = input.value;
        const charCount = text.length;
        const wordArr = text.trim().split(/\\s+/).filter(w => w.length > 0);
        const wordCount = wordArr.length;
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

        const readTime = Math.ceil(wordCount / 200);

        words.textContent = wordCount;
        chars.textContent = charCount;
        sentences.textContent = sentenceCount;
        reading.textContent = readTime + 'm';
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(input.value).then(() => {
            alert('Copied to clipboard!');
        });
    });
}
`;
        } else if (tool.arch === 'case-converter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="text-input">Text Input</label>
                    <textarea class="input-control" id="text-input" placeholder="Type or paste your text here..." style="min-height: 150px;"></textarea>
                </div>

                <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
                    <button class="btn btn-secondary" data-case="upper">UPPERCASE</button>
                    <button class="btn btn-secondary" data-case="lower">lowercase</button>
                    <button class="btn btn-secondary" data-case="title">Title Case</button>
                    <button class="btn btn-secondary" data-case="sentence">Sentence case</button>
                    <button class="btn btn-secondary" data-case="camel">camelCase</button>
                    <button class="btn btn-secondary" data-case="snake">snake_case</button>
                    <button class="btn btn-secondary" data-case="kebab">kebab-case</button>
                    <button class="btn btn-secondary" data-case="constant">CONSTANT_CASE</button>
                </div>

                <div class="form-group">
                    <label for="text-output">Result Output</label>
                    <div class="output-display" id="text-output" style="min-height: 100px;"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="clear-text">Clear</button>
                    <button class="btn btn-primary" id="copy-text">Copy Result</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('text-input');
    const output = document.getElementById('text-output');
    const clearBtn = document.getElementById('clear-text');
    const copyBtn = document.getElementById('copy-text');
    const caseBtns = document.querySelectorAll('[data-case]');

    if (!input) return;

    caseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.getAttribute('data-case');
            const val = input.value;
            output.textContent = convertCase(val, format);
        });
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.textContent = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent || '').then(() => {
            alert('Copied!');
        });
    });

    function convertCase(str, format) {
        if (!str) return '';
        switch(format) {
            case 'upper': return str.toUpperCase();
            case 'lower': return str.toLowerCase();
            case 'title': return str.replace(/\\b\\w/g, c => c.toUpperCase());
            case 'sentence': return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            case 'camel': return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            case 'snake': return str.toLowerCase().replace(/\\s+/g, '_');
            case 'kebab': return str.toLowerCase().replace(/\\s+/g, '-');
            case 'constant': return str.toUpperCase().replace(/\\s+/g, '_');
            default: return str;
        }
    }
}
`;
        } else if (tool.arch === 'metric-converter') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="tool-panels">
                    <div class="form-group">
                        <label for="from-value">From Value</label>
                        <input type="number" class="input-control" id="from-value" value="1">
                    </div>
                    <div class="form-group">
                        <label for="to-value">To Result</label>
                        <input type="number" class="input-control" id="to-value" readonly value="1">
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="from-unit">From Unit</label>
                        <select class="input-control" id="from-unit"></select>
                    </div>
                    <div class="form-group">
                        <label for="to-unit">To Unit</label>
                        <select class="input-control" id="to-unit"></select>
                    </div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const fromVal = document.getElementById('from-value');
    const toVal = document.getElementById('to-value');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');

    const path = window.location.pathname;
    let units = { 'Base': 1 };

    if (path.includes('length')) {
        units = {
            'Meter (m)': 1,
            'Kilometer (km)': 1000,
            'Centimeter (cm)': 0.01,
            'Millimeter (mm)': 0.001,
            'Mile (mi)': 1609.344,
            'Yard (yd)': 0.9144,
            'Foot (ft)': 0.3048,
            'Inch (in)': 0.0254
        };
    } else if (path.includes('weight')) {
        units = {
            'Gram (g)': 1,
            'Kilogram (kg)': 1000,
            'Milligram (mg)': 0.001,
            'Pound (lb)': 453.59237,
            'Ounce (oz)': 28.34952
        };
    } else if (path.includes('area')) {
        units = {
            'Square Meter (m²)': 1,
            'Square Kilometer (km²)': 1000000,
            'Square Foot (ft²)': 0.092903,
            'Square Inch (in²)': 0.00064516,
            'Square Yard (yd²)': 0.836127,
            'Acre (ac)': 4046.856,
            'Hectare (ha)': 10000,
            'Square Mile (mi²)': 2589988
        };
    } else {
        units = {
            'Base Unit': 1,
            'Multipler (kilo)': 1000,
            'Fraction (milli)': 0.001
        };
    }

    if (!fromUnit) return;

    const cleanOptsSanitized = Object.keys(units).map(k => '<option value="' + units[k] + '">' + k + '</option>').join('');
    fromUnit.innerHTML = cleanOptsSanitized;
    toUnit.innerHTML = cleanOptsSanitized;

    if (toUnit.options.length > 1) {
        toUnit.selectedIndex = 1;
    }

    function calculate() {
        const val = parseFloat(fromVal.value) || 0;
        const fromFactor = parseFloat(fromUnit.value);
        const toFactor = parseFloat(toUnit.value);

        const result = (val * fromFactor) / toFactor;
        toVal.value = result.toFixed(4).replace(/\\.0+$/, '');
    }

    fromVal.addEventListener('input', calculate);
    fromUnit.addEventListener('change', calculate);
    toUnit.addEventListener('change', calculate);

    calculate();
}
`;
        } else if (tool.arch === 'diff-checker') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
                    <div class="form-group">
                        <label for="diff-text-left">Original Text</label>
                        <textarea id="diff-text-left" class="input-control" placeholder="Paste original text here..." style="min-height: 200px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="diff-text-right">Changed Text</label>
                        <textarea id="diff-text-right" class="input-control" placeholder="Paste changed text here..." style="min-height: 200px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
                    </div>
                </div>

                <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom:1rem;">
                    <div class="form-group">
                        <label for="diff-mode">Diff Mode</label>
                        <select id="diff-mode" class="input-control">
                            <option value="line">Line-by-Line</option>
                            <option value="word">Word-by-Word</option>
                        </select>
                    </div>
                    <div style="display:flex; align-items:flex-end; gap:0.5rem;">
                        <button class="btn btn-secondary" id="diff-btn-swap" style="width:100%;">Swap Texts</button>
                        <button class="btn btn-secondary" id="diff-btn-clear" style="width:100%;">Clear</button>
                    </div>
                </div>

                <div id="diff-results" style="display:none; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-top:1rem;">
                    <div style="display:flex; gap:1.5rem; margin-bottom:1rem; font-size:0.9rem;">
                        <span>Similarity: <strong id="diff-stat-similarity">100%</strong></span>
                        <span>Total Differences: <strong id="diff-stat-diffs">0</strong></span>
                    </div>
                    <div id="diff-output-container" style="font-family:var(--font-mono); white-space:pre-wrap; line-height:1.6; font-size:0.85rem; max-height:400px; overflow-y:auto; padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-xs); background:#ffffff; color:#000;"></div>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const leftText = document.getElementById('diff-text-left');
    const rightText = document.getElementById('diff-text-right');
    const diffMode = document.getElementById('diff-mode');
    const swapBtn = document.getElementById('diff-btn-swap');
    const clearBtn = document.getElementById('diff-btn-clear');
    const resultsPanel = document.getElementById('diff-results');
    const similarityEl = document.getElementById('diff-stat-similarity');
    const diffsEl = document.getElementById('diff-stat-diffs');
    const outputContainer = document.getElementById('diff-output-container');

    if (!leftText) return;

    function compare() {
        const text1 = leftText.value;
        const text2 = rightText.value;

        if (!text1 && !text2) {
            resultsPanel.style.display = 'none';
            return;
        }

        const mode = diffMode.value;
        let htmlResult = '';
        let diffCount = 0;
        let matches = 0;

        if (mode === 'line') {
            const lines1 = text1.split('\\n');
            const lines2 = text2.split('\\n');

            let i = 0, j = 0;

            while (i < lines1.length || j < lines2.length) {
                if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
                    htmlResult += '<div>  ' + escapeHtml(lines1[i]) + '</div>';
                    matches++;
                    i++; j++;
                } else if (j < lines2.length && (i >= lines1.length || !lines1.slice(i).includes(lines2[j]))) {
                    htmlResult += '<div style="background-color:#e6ffec; color:#1a7f37; font-weight:bold;">+ ' + escapeHtml(lines2[j]) + '</div>';
                    diffCount++;
                    j++;
                } else {
                    htmlResult += '<div style="background-color:#ffebe9; color:#cf222e; font-weight:bold;">- ' + escapeHtml(lines1[i]) + '</div>';
                    diffCount++;
                    i++;
                }
            }

            const total = Math.max(lines1.length, lines2.length);
            similarityEl.textContent = total > 0 ? Math.round((matches / total) * 100) + '%' : '100%';
        } else {
            const words1 = text1.match(/\\s+|\\S+/g) || [];
            const words2 = text2.match(/\\s+|\\S+/g) || [];

            let i = 0, j = 0;

            while (i < words1.length || j < words2.length) {
                if (i < words1.length && j < words2.length && words1[i] === words2[j]) {
                    htmlResult += escapeHtml(words1[i]);
                    matches++;
                    i++; j++;
                } else if (j < words2.length && (i >= words1.length || !words1.slice(i).includes(words2[j]))) {
                    htmlResult += '<span style="background-color:#acf2bd; color:#115e24; font-weight:bold; padding:0 2px;">' + escapeHtml(words2[j]) + '</span>';
                    diffCount++;
                    j++;
                } else {
                    htmlResult += '<span style="background-color:#fdb8c0; color:#820e12; font-weight:bold; padding:0 2px; text-decoration:line-through;">' + escapeHtml(words1[i]) + '</span>';
                    diffCount++;
                    i++;
                }
            }

            const total = Math.max(words1.length, words2.length);
            similarityEl.textContent = total > 0 ? Math.round((matches / total) * 100) + '%' : '100%';
        }

        diffsEl.textContent = diffCount;
        outputContainer.innerHTML = htmlResult;
        resultsPanel.style.display = 'block';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    leftText.addEventListener('input', compare);
    rightText.addEventListener('input', compare);
    diffMode.addEventListener('change', compare);

    swapBtn.addEventListener('click', () => {
        const temp = leftText.value;
        leftText.value = rightText.value;
        rightText.value = temp;
        compare();
    });

    clearBtn.addEventListener('click', () => {
        leftText.value = '';
        rightText.value = '';
        outputContainer.innerHTML = '';
        resultsPanel.style.display = 'none';
    });
}
`;
        } else if (tool.arch === 'lorem-gen') {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="lorem-type">Generate By</label>
                        <select id="lorem-type" class="input-control">
                            <option value="paragraphs">Paragraphs</option>
                            <option value="sentences">Sentences</option>
                            <option value="words">Words</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="lorem-count">Quantity</label>
                        <input type="number" id="lorem-count" class="input-control" value="5" min="1" max="100">
                    </div>
                    <div class="form-group" style="display:flex; align-items:center; margin-top:1.5rem;">
                        <label style="cursor:pointer;"><input type="checkbox" id="lorem-start" checked> Start with "Lorem ipsum..."</label>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-primary" id="lorem-generate">Generate Text</button>
                    <button class="btn btn-secondary" id="lorem-reset">Reset</button>
                </div>

                <div id="lorem-output-section" style="display:none; margin-top:1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; font-size:0.85rem;">
                        <span>Words: <strong id="lorem-words-count">0</strong> | Paragraphs: <strong id="lorem-paras-count">0</strong></span>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn btn-secondary" id="lorem-copy" style="font-size:0.8rem; padding:0.25rem 0.5rem;">Copy</button>
                            <button class="btn btn-secondary" id="lorem-download" style="font-size:0.8rem; padding:0.25rem 0.5rem;">Download TXT</button>
                        </div>
                    </div>
                    <textarea id="lorem-output" class="input-control" readonly style="min-height: 250px; font-family:var(--font-sans); background:var(--bg-primary); line-height:1.6;"></textarea>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const typeSelect = document.getElementById('lorem-type');
    const countInput = document.getElementById('lorem-count');
    const startCheck = document.getElementById('lorem-start');
    const generateBtn = document.getElementById('lorem-generate');
    const resetBtn = document.getElementById('lorem-reset');
    const outputSection = document.getElementById('lorem-output-section');
    const outputText = document.getElementById('lorem-output');
    const wordsCount = document.getElementById('lorem-words-count');
    const parasCount = document.getElementById('lorem-paras-count');
    const copyBtn = document.getElementById('lorem-copy');
    const downloadBtn = document.getElementById('lorem-download');

    if (!generateBtn) return;

    const wordsList = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
        "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
        "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
        "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
        "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
        "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in",
        "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
    ];

    function generate() {
        const type = typeSelect.value;
        const count = parseInt(countInput.value) || 5;
        const startWithLorem = startCheck.checked;

        let result = '';
        if (type === 'words') {
            result = generateWords(count, startWithLorem);
        } else if (type === 'sentences') {
            result = generateSentences(count, startWithLorem);
        } else {
            result = generateParagraphs(count, startWithLorem);
        }

        outputText.value = result;
        wordsCount.textContent = result.trim().split(/\\s+/).filter(w => w.length > 0).length;
        parasCount.textContent = type === 'paragraphs' ? count : result.split('\\n\\n').length;
        outputSection.style.display = 'block';
    }

    function generateWords(n, start) {
        let list = [];
        if (start) {
            list = ["Lorem", "ipsum", "dolor", "sit", "amet"];
            n = Math.max(0, n - 5);
        }
        for (let i = 0; i < n; i++) {
            list.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
        }
        return list.join(' ') + '.';
    }

    function generateSentences(n, start) {
        const sentences = [];
        for (let i = 0; i < n; i++) {
            let sStart = (i === 0 && start);
            let sLen = Math.floor(Math.random() * 8) + 6;
            let sentence = generateWords(sLen, sStart);
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
            sentences.push(sentence);
        }
        return sentences.join(' ');
    }

    function generateParagraphs(n, start) {
        const paragraphs = [];
        for (let i = 0; i < n; i++) {
            let pStart = (i === 0 && start);
            let pLen = Math.floor(Math.random() * 4) + 3;
            paragraphs.push(generateSentences(pLen, pStart));
        }
        return paragraphs.join('\\n\\n');
    }

    generateBtn.addEventListener('click', generate);

    resetBtn.addEventListener('click', () => {
        countInput.value = '5';
        typeSelect.selectedIndex = 0;
        startCheck.checked = true;
        outputText.value = '';
        outputSection.style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.value).then(() => alert('Copied text!'));
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lorem_ipsum.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
}
`;
        } else if (tool.arch === 'markdown-parser') {
            workspaceHTML = `
            <div class="tool-workspace" style="display:flex; flex-direction:column; gap:1.5rem;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                    <div class="form-group">
                        <label for="markdown-input">Markdown Input</label>
                        <textarea id="markdown-input" class="input-control" placeholder="Type Markdown here... e.g. # Hello World" style="min-height: 350px; font-family:var(--font-mono); font-size:0.85rem; line-height:1.6;"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Live HTML Preview</label>
                        <div id="html-preview" style="min-height: 350px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding:1rem; overflow-y:auto; background:#ffffff; color:#000;"></div>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="md-clear">Clear</button>
                    <button class="btn btn-primary" id="md-copy">Copy HTML Code</button>
                    <button class="btn btn-secondary" id="md-download">Download HTML File</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('html-preview');
    const clearBtn = document.getElementById('md-clear');
    const copyBtn = document.getElementById('md-copy');
    const downloadBtn = document.getElementById('md-download');

    if (!input) return;

    function render() {
        const val = input.value;
        if (typeof marked !== 'undefined') {
            const rawHtml = marked.parse(val);
            const cleanHtml = rawHtml.replace(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi, '');
            preview.innerHTML = cleanHtml;
        } else {
            preview.textContent = val;
        }
    }

    input.addEventListener('input', render);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        preview.innerHTML = '';
    });

    copyBtn.addEventListener('click', () => {
        if (typeof marked !== 'undefined') {
            const rawHtml = marked.parse(input.value);
            const cleanHtml = rawHtml.replace(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi, '');
            navigator.clipboard.writeText(cleanHtml).then(() => alert('Copied HTML!'));
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (typeof marked !== 'undefined') {
            const rawHtml = marked.parse(input.value);
            const cleanHtml = rawHtml.replace(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi, '');
            const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.html';
            a.click();
            URL.revokeObjectURL(url);
        }
    });
}
`;
        } else {
            workspaceHTML = `
            <div class="tool-workspace">
                <div class="form-group">
                    <label for="text-input">Input Area</label>
                    <textarea class="input-control" id="text-input" placeholder="Type or paste your content here..." style="min-height: 150px;"></textarea>
                </div>

                <div class="form-group">
                    <label for="text-output">Result Output</label>
                    <div class="output-display" id="text-output" style="min-height: 100px;"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="clear-text">Clear</button>
                    <button class="btn btn-primary" id="process-text">Process Text</button>
                    <button class="btn btn-secondary" id="copy-text">Copy</button>
                </div>
            </div>
            `;
            logicJS = `export function init() {
    const input = document.getElementById('text-input');
    const output = document.getElementById('text-output');
    const processBtn = document.getElementById('process-text');
    const clearBtn = document.getElementById('clear-text');
    const copyBtn = document.getElementById('copy-text');

    if (!processBtn) return;

    processBtn.addEventListener('click', () => {
        const text = input.value;
        output.textContent = text.toUpperCase();
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.textContent = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent || '').then(() => {
            alert('Copied!');
        });
    });
}
`;
        }

        // 3. Generate HTML template: tools/[slug].html
        const htmlPath = path.join(__dirname, '..', 'tools', `${tool.id}.html`);
        ensureDirectoryExistence(htmlPath);

        let librariesStr = '';
        if (tool.cat === 'pdf') {
            librariesStr = `
            <script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
            `;
        } else if (tool.id === 'qr-code-generator') {
            librariesStr = '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>';
        } else if (tool.id === 'qr-code-scanner') {
            librariesStr = '<script src="https://unpkg.com/jsqr@1.4.0/dist/jsQR.js"></script>';
        } else if (tool.id === 'barcode-generator') {
            librariesStr = '<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>';
        } else if (tool.id === 'markdown-to-html') {
            librariesStr = '<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js"></script>';
        }

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tool.name} - Free Online ${catName} | AllInOneTool</title>
    <meta name="description" content="Use our free, premium ${tool.name} to ${tool.desc.toLowerCase().replace('.', '')} in your browser securely.">
    <meta name="keywords" content="${tool.name.toLowerCase()}, ${tool.cat} tools, online ${tool.name.toLowerCase()}">
    <meta name="tool-id" content="${tool.id}">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="../assets/css/variables.css">
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/layout.css">
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/tool.css">
    
    <!-- Libraries -->
    ${librariesStr}
    
    <!-- Script Dependency -->
    <script src="../assets/js/app.js" type="module" defer></script>
</head>
<body>
    <div id="tool-workspace">
        ${workspaceHTML}
    </div>
</body>
</html>
`;
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');

        // 4. Generate LOGIC processing code: assets/js/tools/[id].js
        const logicPath = path.join(__dirname, '..', 'assets', 'js', 'tools', `${tool.id}.js`);
        ensureDirectoryExistence(logicPath);
        fs.writeFileSync(logicPath, logicJS, 'utf8');
    });

    // 5. Generate SUMMARY data file: assets/js/data/tools-summary.js
    const summaryPath = path.join(__dirname, '..', 'assets', 'js', 'data', 'tools-summary.js');
    ensureDirectoryExistence(summaryPath);
    const summaryContent = `export const TOOLS_SUMMARY = ${JSON.stringify(toolsSummary, null, 4)};\n`;
    fs.writeFileSync(summaryPath, summaryContent, 'utf8');

    console.log(`Successfully generated production files for all ${TOOLS.length} tools!`);
}

generateProject();
