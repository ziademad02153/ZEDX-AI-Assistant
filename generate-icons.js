const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImage = path.join(__dirname, 'public', 'zedx-logo.png');
const outputDir = path.join(__dirname, 'electron', 'assets');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
    try {
        console.log('Generating green background icons...');

        // Create a 512x512 green background
        const background = {
            create: {
                width: 512,
                height: 512,
                channels: 4,
                background: { r: 16, g: 185, b: 129, alpha: 1 } // Emerald-500 equivalent
            }
        };

        // Resize the logo to fit comfortably
        const logoBuffer = await sharp(inputImage)
            .resize(400, 400, { fit: 'inside' })
            .toBuffer();

        // Compose: Logo on Green Background
        const iconBuffer = await sharp(background)
            .composite([{ input: logoBuffer, gravity: 'center' }])
            .png()
            .toBuffer();

        // Save as PNG
        await fs.promises.writeFile(path.join(outputDir, 'icon.png'), iconBuffer);
        console.log('Generated icon.png');

        // Note: For .ico and .icns, usually you need specialized tools or electron-builder handles it.
        // We'll update package.json to point to the new PNG/JPG.

        // Also save a JPG version for simplicity if needed
        await sharp(iconBuffer).jpeg().toFile(path.join(__dirname, 'public', 'favicon-green.jpg'));
        console.log('Generated favicon-green.jpg');

    } catch (err) {
        console.error('Error generating icons:', err);
    }
}

generateIcons();
