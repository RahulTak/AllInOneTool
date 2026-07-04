export const CATEGORIES = [
    {
        id: 'image',
        name: 'Image Tools',
        description: 'Compress, resize, crop, and convert images directly in your browser.',
        icon: '🖼️',
        count: 30
    },
    {
        id: 'pdf',
        name: 'PDF Tools',
        description: 'Merge, split, compress, protect, and reorganize PDF documents.',
        icon: '📄',
        count: 20
    },
    {
        id: 'text',
        name: 'Text Tools',
        description: 'Count words, format text, compare differences, and translate representations.',
        icon: '✍️',
        count: 20
    },
    {
        id: 'calculator',
        name: 'Calculators',
        description: 'Compute loan EMIs, age, BMI, finance rates, and algebraic equations.',
        icon: '🧮',
        count: 25
    },
    {
        id: 'converter',
        name: 'Converters',
        description: 'Translate lengths, weights, temperature, data sizes, and numeric bases.',
        icon: '🔄',
        count: 20
    },
    {
        id: 'seo',
        name: 'SEO Tools',
        description: 'Analyze keyword density, create sitemaps, and preview search results.',
        icon: '📈',
        count: 10
    },
    {
        id: 'developer',
        name: 'Developer Tools',
        description: 'Format code syntax, generate hashes, encode URLs, and inspect request states.',
        icon: '💻',
        count: 15
    },
    {
        id: 'color',
        name: 'Color Tools',
        description: 'Pick colors, convert color spaces, and extract contrast compliance sheets.',
        icon: '🎨',
        count: 5
    },
    {
        id: 'password',
        name: 'Password Tools',
        description: 'Generate strong credentials, run entropy tests, and analyze ciphers.',
        icon: '🔑',
        count: 5
    },
    {
        id: 'misc',
        name: 'Miscellaneous',
        description: 'Morse code translators, timers, clocks, and simple lists sorting helpers.',
        icon: '⚙️',
        count: 5
    }
];

export function getCategoryById(id) {
    return CATEGORIES.find(cat => cat.id === id);
}
