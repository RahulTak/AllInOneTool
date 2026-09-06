/**
 * Centralized SEO Configuration for AllInOneTool
 * Configurable production domain and global SEO defaults.
 */

const SITE_URL = 'https://allinonetool.com';
const SITE_NAME = 'AllInOneTool';
const DEFAULT_TITLE = 'AllInOneTool – 150+ Free Premium Client-Side Online Tools';
const DEFAULT_DESCRIPTION = 'Access 150+ free, fast, and secure client-side tools for PDF editing, image conversion, developer utilities, calculators, and text analysis.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/og-banner.png`;
const TWITTER_HANDLE = '@allinonetool';

const CATEGORIES_SEO = {
    image: {
        id: 'image',
        slug: 'image-tools',
        name: 'Image Tools',
        icon: '🖼️',
        title: 'Free Online Image Tools – Compress, Resize & Convert Images | AllInOneTool',
        description: 'Explore 30 free online image tools to compress JPG/PNG/WebP, resize dimensions, crop, rotate, convert formats, and create memes directly in your browser.',
        h1: 'Online Image Tools & Utilities',
        intro: 'Optimize, convert, transform, and edit image files with zero server uploads. All computations occur client-side inside your browser, ensuring your private photos never leave your device.',
        faqs: [
            {
                question: 'Are my image files uploaded to a remote server?',
                answer: 'No. All image transformations, conversions, resizing, and compressions run 100% locally inside your browser using HTML5 Canvas and Web APIs. Your images are never transmitted over the internet.'
            },
            {
                question: 'What image file formats are supported?',
                answer: 'Our image tools support standard modern web formats including JPEG/JPG, PNG, WebP, SVG, GIF, ICO, TIFF, and EPS.'
            },
            {
                question: 'Is there a limit on file size or number of images?',
                answer: 'Because processing executes client-side on your own device, there are no artificial server paywalls, daily quotas, or queue limits. Performance is limited only by your computer memory.'
            },
            {
                question: 'Does image compression reduce visual image quality?',
                answer: 'You can choose between Low, Medium, and High compression modes to find the ideal balance between visual clarity and file size reduction for your website or app.'
            }
        ]
    },
    pdf: {
        id: 'pdf',
        slug: 'pdf-tools',
        name: 'PDF Tools',
        icon: '📄',
        title: 'Free Online PDF Tools – Merge, Split, Convert & Secure PDFs | AllInOneTool',
        description: 'Discover 20 free client-side PDF utilities to merge, split, compress, protect, unlock, rotate, and convert documents into Word, JPG, and Excel.',
        h1: 'Online PDF Tools & Document Editors',
        intro: 'Handle sensitive documents, contracts, and presentations securely. Our PDF tools run directly inside your browser tab using WebAssembly and PDF-Lib, safeguarding confidential paperwork from server exposure.',
        faqs: [
            {
                question: 'Is it safe to edit confidential legal or financial PDFs here?',
                answer: 'Yes. All document manipulations, password encryptions, page splits, and merges happen client-side in your browser memory. No document data is ever sent to or stored on our servers.'
            },
            {
                question: 'Can I combine multiple PDF files into one?',
                answer: 'Yes. The Merge PDF tool allows you to upload multiple files, arrange them in your preferred sequence, and combine them into a single consolidated PDF in seconds.'
            },
            {
                question: 'Does the PDF to Word converter produce genuine DOCX files?',
                answer: 'Yes. Our converter compiles extracted text and formatting into authentic Office Open XML (.docx) packages compatible with Microsoft Word, LibreOffice, and Google Docs.'
            },
            {
                question: 'How do password protection and unlocking work?',
                answer: 'Protect PDF encrypts documents with standard AES/RC4 ciphers. Unlock PDF authenticates your password client-side and generates a clean, restriction-free document.'
            }
        ]
    },
    text: {
        id: 'text',
        slug: 'text-tools',
        name: 'Text Tools',
        icon: '✍️',
        title: 'Free Online Text Tools – Word Counter, Diff, Case & Ciphers | AllInOneTool',
        description: 'Comprehensive suite of 24 online text utilities. Count words, inspect character frequencies, convert letter casing, compare diffs, and generate dummy text.',
        h1: 'Online Text Tools, Counters & Formatter Suite',
        intro: 'Inspect, sanitize, transform, and analyze textual content with precision. Whether you are copy editing, comparing code revisions, or obfuscating links, our text tools provide instant feedback.',
        faqs: [
            {
                question: 'What statistics does the Word Counter track?',
                answer: 'It calculates total words, total characters (with and without spaces), sentence counts, paragraph tallies, average reading time, and estimated speaking duration in real time.'
            },
            {
                question: 'How does the Text Diff Checker compare two passages?',
                answer: 'It calculates longest common subsequences to highlight exact character and word additions (in green) and deletions (in red) side-by-side.'
            },
            {
                question: 'Are text transformations processed privately?',
                answer: 'Yes. All string operations, regex matches, and text parsing occur exclusively in your browser memory.'
            },
            {
                question: 'Can I convert Markdown directly to formatted HTML?',
                answer: 'Yes. Our Markdown to HTML tool converts markdown headings, lists, links, code blocks, and tables into clean, semantic HTML markup.'
            }
        ]
    },
    calculator: {
        id: 'calculator',
        slug: 'calculators',
        name: 'Calculators',
        icon: '🧮',
        title: 'Free Online Calculators – Finance, Math, Health & Date Tools | AllInOneTool',
        description: 'Calculate loan EMIs, compound interest, exact age, BMI, sales tax, GPA, fractions, and quadratic roots with 27 accurate interactive online calculators.',
        h1: 'Online Calculators for Finance, Math & Science',
        intro: 'Perform accurate numerical computations instantly. From estimating mortgage installments and compound investment growth to calculating body mass index, our calculators provide transparent formulas and result breakdowns.',
        faqs: [
            {
                question: 'How does the Loan EMI Calculator calculate monthly installments?',
                answer: 'It applies the standard financial amortizing formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is principal, R is monthly interest, and N is the number of months.'
            },
            {
                question: 'Can I calculate my exact age down to days and hours?',
                answer: 'Yes. The Age Calculator computes your exact chronological age in completed years, months, weeks, and days, along with a countdown to your next birthday.'
            },
            {
                question: 'Are calculation formulas disclosed?',
                answer: 'Yes. Every calculator page explains the mathematical formulas, variable definitions, and step-by-step logic used to derive the result.'
            },
            {
                question: 'Do these financial calculators store my loan or salary inputs?',
                answer: 'No. All calculations run strictly in your browser session and are never transmitted, logged, or recorded.'
            }
        ]
    },
    converter: {
        id: 'converter',
        slug: 'converters',
        name: 'Converters',
        icon: '🔄',
        title: 'Free Online Unit & Data Converters – Metric, Epoch, JSON & XML | AllInOneTool',
        description: 'Convert units of length, weight, temperature, digital storage, pressure, and epoch timestamps, plus data converters for JSON, XML, and CSV.',
        h1: 'Online Unit Converters & Data Format Transformers',
        intro: 'Convert measurement units and structured datasets seamlessly. Whether converting imperial to metric distances, UNIX timestamps to calendar dates, or JSON objects into XML trees, get exact conversions with zero latency.',
        faqs: [
            {
                question: 'What unit measurement categories are supported?',
                answer: 'We support length, weight/mass, temperature, volume, area, speed, time, digital storage (bytes to terabytes), energy, power, pressure, and fuel consumption.'
            },
            {
                question: 'How does the Epoch Timestamp Converter work?',
                answer: 'It translates raw UNIX epoch seconds and milliseconds into UTC and local calendar date-time strings, and vice versa.'
            },
            {
                question: 'Can I convert spreadsheet CSV data to JSON objects?',
                answer: 'Yes. The CSV to JSON tool parses column headers and row entries into clean, valid JSON array objects ready for API consumption.'
            },
            {
                question: 'Are large data conversions performed client-side?',
                answer: 'Yes. All JSON, XML, CSV, and unit transformations are computed locally without server bandwidth limits.'
            }
        ]
    },
    seo: {
        id: 'seo',
        slug: 'seo-tools',
        name: 'SEO Tools',
        icon: '📈',
        title: 'Free Online SEO Tools – SERP Simulator, Meta Generator & Robots | AllInOneTool',
        description: 'Analyze keyword density, preview Google search snippets, generate robots.txt directives, format XML sitemaps, and inspect URL slugs with 11 SEO tools.',
        h1: 'Online SEO Utilities & Search Engine Optimization Tools',
        intro: 'Audit on-page factors, simulate search engine result page listings, and build technical crawl directives. Designed for webmasters, digital marketers, and content creators aiming for higher organic search visibility.',
        faqs: [
            {
                question: 'What is the Google SERP Simulator used for?',
                answer: 'It previews how your page title, URL slug, and meta description appear on desktop and mobile Google search engine result pages, warning you if pixel lengths get truncated.'
            },
            {
                question: 'How does the Keyword Density Analyzer help SEO?',
                answer: 'It counts single-word, two-word, and three-word phrase frequencies to ensure your copy sounds natural and avoids over-optimization or keyword stuffing penalties.'
            },
            {
                question: 'Does the Robots.txt Generator create valid crawler directives?',
                answer: 'Yes. It produces compliant robots.txt syntax specifying User-agent rules, Disallow paths, Allow rules, and XML sitemap references.'
            },
            {
                question: 'What does the Open Graph Tag Builder do?',
                answer: 'It generates complete social meta tags (og:title, og:description, og:image, twitter:card) so links look attractive when shared on social media.'
            }
        ]
    },
    developer: {
        id: 'developer',
        slug: 'developer-tools',
        name: 'Developer Tools',
        icon: '💻',
        title: 'Free Online Developer Tools – JSON Formatter, Minifiers & UUIDs | AllInOneTool',
        description: 'Essential toolkit of 19 developer utilities. Format JSON, beautify XML, minify CSS/JS, generate UUID v4s, hash passwords, and scan QR codes.',
        h1: 'Online Developer Tools, Formatters & Code Utilities',
        intro: 'Accelerate web development workflows with zero installations. Format minified JSON payloads, inspect XML trees, compile UUID identifiers, generate cryptographic hashes, and test regular expressions client-side.',
        faqs: [
            {
                question: 'Is formatted JSON or code sent to an external API?',
                answer: 'Never. Parsing, syntax highlighting, and minification happen directly inside your browser engine. It is completely safe for proprietary code and API keys.'
            },
            {
                question: 'What cryptographic hash algorithms are supported?',
                answer: 'Our Hash Generator supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512 using the native browser Web Cryptography API.'
            },
            {
                question: 'Are generated UUIDs cryptographically random?',
                answer: 'Yes. UUID v4 strings are generated using crypto.getRandomValues() to guarantee collision-resistant pseudo-random identifiers.'
            },
            {
                question: 'Can I scan QR codes using my webcam?',
                answer: 'Yes. The QR Code Scanner can decode QR barcodes both from uploaded image files and via live webcam video feeds locally.'
            }
        ]
    },
    color: {
        id: 'color',
        slug: 'color-tools',
        name: 'Color Tools',
        icon: '🎨',
        title: 'Free Online Color Tools – HEX to RGB, Contrast Checker & Palettes | AllInOneTool',
        description: 'Explore 5 online color utilities to convert HEX/RGB/HSL, check WCAG accessibility contrast ratios, create harmonic palettes, and extract gradients.',
        h1: 'Online Color Pickers, Converters & Contrast Tools',
        intro: 'Design accessible, visually appealing web interfaces. Convert color spaces with precision, audit foreground-to-background contrast compliance against WCAG 2.1 standards, and generate harmonic color schemes.',
        faqs: [
            {
                question: 'How does the Color Contrast Checker evaluate accessibility?',
                answer: 'It computes the relative luminance ratio between text and background colors according to WCAG 2.1 specifications, scoring AA and AAA compliance for normal and large text.'
            },
            {
                question: 'Which color spaces can be converted?',
                answer: 'Our color tools convert between HEX, RGB, RGBA, HSL, HSLA, and CSS color representations.'
            },
            {
                question: 'Can I generate harmonic color schemes?',
                answer: 'Yes. The Color Palette Generator creates complementary, analogous, triadic, and monochromatic color harmonies based on any starting base hue.'
            },
            {
                question: 'Does the tool work offline?',
                answer: 'Yes. Color math operates entirely in client-side JavaScript without any network roundtrips.'
            }
        ]
    },
    password: {
        id: 'password',
        slug: 'password-tools',
        name: 'Password Tools',
        icon: '🔑',
        title: 'Free Online Password Tools – Strong Generator, Entropy & Hashes | AllInOneTool',
        description: 'Generate high-entropy random passwords, test passphrase resilience, calculate bit entropy, and verify cryptographic password hashes securely.',
        h1: 'Online Password Tools, Generators & Security Utilities',
        intro: 'Fortify digital security with cryptographically secure credentials. Generate random passwords, construct memorable multi-word passphrases, and evaluate brute-force crack times without leaving your device.',
        faqs: [
            {
                question: 'Is it safe to generate passwords in an online browser tool?',
                answer: 'Yes, because AllInOneTool generates random credentials using window.crypto.getRandomValues() entirely inside your local device memory. No password is ever transmitted, logged, or saved.'
            },
            {
                question: 'What makes a password truly strong?',
                answer: 'High length (16+ characters), mixed uppercase, lowercase, numbers, and symbols, and high information entropy (80+ bits) to resist dictionary and brute-force attacks.'
            },
            {
                question: 'How does the Passphrase Generator work?',
                answer: 'It selects random words from vetted dictionaries based on the Diceware concept, creating memorable credentials with strong mathematical crack resistance.'
            },
            {
                question: 'Can a password hash be reverse-engineered?',
                answer: 'No. Cryptographic hash functions like SHA-256 are one-way mathematical algorithms designed to be irreversible.'
            }
        ]
    },
    misc: {
        id: 'misc',
        slug: 'miscellaneous-tools',
        name: 'Miscellaneous Tools',
        icon: '⚙️',
        title: 'Free Online Miscellaneous Utilities – Stopwatch, Morse, Clock & Dice | AllInOneTool',
        description: 'Versatile collection of 8 handy web tools: precision stopwatch timer, Morse code audio translator, world clock, list randomizer, and dice roller.',
        h1: 'Miscellaneous Web Utilities & Everyday Productivity Tools',
        intro: 'A curated collection of handy daily utilities. From tracking multi-lap stopwatch intervals and decoding international Morse code to rolling polyhedral dice and checking international time zones.',
        faqs: [
            {
                question: 'Does the Morse Code Translator include sound audio playback?',
                answer: 'Yes. It translates alphanumeric text into dot-dash sequences and synthesizes real audio beeps using the Web Audio API directly in your browser.'
            },
            {
                question: 'How accurate is the online stopwatch and timer?',
                answer: 'It uses high-resolution browser performance.now() timestamps to provide millisecond-accurate lap tracking and countdown alerts.'
            },
            {
                question: 'Are list shuffling and coin flips truly random?',
                answer: 'Yes. They utilize the Fisher-Yates shuffle algorithm powered by cryptographic random number generation to ensure completely fair, unbiased results.'
            },
            {
                question: 'Can the World Clock track multiple time zones simultaneously?',
                answer: 'Yes. It displays real-time clocks across UTC, New York, London, Tokyo, Sydney, and other global hubs with daylight saving adjustments.'
            }
        ]
    }
};

module.exports = {
    SITE_URL,
    SITE_NAME,
    DEFAULT_TITLE,
    DEFAULT_DESCRIPTION,
    DEFAULT_OG_IMAGE,
    TWITTER_HANDLE,
    CATEGORIES_SEO
};
