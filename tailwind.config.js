/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Enable class-based dark mode for better compatibility with next-themes
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#15803d',
                    foreground: '#ffffff',
                },
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
            },
        },
    },
    plugins: [],
}
