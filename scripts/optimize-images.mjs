import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');

const imagesToOptimize = [
  'hero-graphics.png',
  'careers-hero-bg.png',
  'project-ecommerce.png',
  'project-fintech.png',
  'project-health.png',
  'service-design.png',
  'service-mobile.png',
  'logo-icon.png',
  'logo-general.png',
  'logo.png',
];

async function optimizeImages() {
  console.log('Optimizing PNG assets in public directory...');

  for (const file of imagesToOptimize) {
    const inputPath = path.join(publicDir, file);
    if (!fs.existsSync(inputPath)) continue;

    const baseName = path.parse(file).name;
    const webpPath = path.join(publicDir, `${baseName}.webp`);
    const avifPath = path.join(publicDir, `${baseName}.avif`);

    const statsBefore = fs.statSync(inputPath);
    console.log(`Processing ${file} (${(statsBefore.size / 1024).toFixed(1)} KB)...`);

    // Generate WebP
    await sharp(inputPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);

    // Generate AVIF
    await sharp(inputPath)
      .avif({ quality: 75, effort: 6 })
      .toFile(avifPath);

    // Also optimize original PNG in-place if possible
    const pngBuffer = await sharp(inputPath)
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();
    
    if (pngBuffer.length < statsBefore.size) {
      fs.writeFileSync(inputPath, pngBuffer);
    }

    const webpStats = fs.statSync(webpPath);
    const avifStats = fs.statSync(avifPath);
    console.log(
      ` -> WebP: ${(webpStats.size / 1024).toFixed(1)} KB, AVIF: ${(avifStats.size / 1024).toFixed(1)} KB`
    );
  }

  console.log('Image optimization completed successfully!');
}

optimizeImages().catch((err) => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
