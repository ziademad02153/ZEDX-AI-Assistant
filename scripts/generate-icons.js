/* global __dirname, require, console */
/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');

const inputImage = path.join(__dirname, '..', 'public', 'zedx-logo.png');
const outputDir = path.join(__dirname, '..', 'public');

const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.jpg', size: 512, format: 'jpeg' },
    { name: 'favicon.ico', size: 32 }, // Just a single size ico for now
];

async function generateIcons() {
    console.log('Starting icon generation...');

    for (const target of targets) {
        try {
            let pipeline = sharp(inputImage).resize(target.size, target.size);

            if (target.format === 'jpeg') {
                pipeline = pipeline.jpeg({ quality: 100 });
            } else if (target.name.endsWith('.ico')) {
                // Sharp doesn't native support .ico easily, but for basic usage we'll create a PNG and rename
                // though usually browsers want a real ICO. Let's try to just output png first.
                pipeline = pipeline.png();
            } else {
                pipeline = pipeline.png();
            }

            const outputPath = path.join(outputDir, target.name);
            await pipeline.toFile(outputPath);
            console.log(`Generated: ${target.name}`);
        } catch (error) {
            console.error(`Error generating ${target.name}:`, error);
        }
    }

    console.log('Icon generation complete!');
}

generateIcons();
