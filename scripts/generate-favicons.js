import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

const inputImage = join(__dirname, '../public/images/profile.jpg');
const outputDir = join(__dirname, '../public');

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Generate each favicon size
sizes.forEach(({ name, size }) => {
  sharp(inputImage)
    .resize(size, size)
    .toFile(join(outputDir, name))
    .then(() => console.log(`Generated ${name}`))
    .catch(err => console.error(`Error generating ${name}:`, err));
}); 