import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const brandMarkSvgPath = path.join(publicDir, 'brand_mark.svg');
const combMarkSvgPath = path.join(publicDir, 'combination_mark.svg');
const wordMarkSvgPath = path.join(publicDir, 'word_mark.svg');

async function main() {
  console.log('Generating brand assets from official SVGs...');

  const brandMarkSvg = fs.readFileSync(brandMarkSvgPath);
  const combMarkSvg = fs.readFileSync(combMarkSvgPath);

  // 1. brand_mark.png (2048x2048) - padded for perfect circular / square icons
  // brand_mark aspect ratio is 541.05 x 543.43 (virtually 1:1)
  const brandMarkPngBuffer = await sharp(brandMarkSvg, { density: 600 })
    .resize(1800, 1800, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 124,
      bottom: 124,
      left: 124,
      right: 124,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'brand_mark.png'), brandMarkPngBuffer);
  // Also update icon.png for backwards/direct compatibility
  fs.writeFileSync(path.join(publicDir, 'icon.png'), brandMarkPngBuffer);

  // Sized variants
  await sharp(brandMarkPngBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'brand_mark_512.png'));
  await sharp(brandMarkPngBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'brand_mark_192.png'));
  await sharp(brandMarkPngBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'brand_mark_32.png'));
  await sharp(brandMarkPngBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(brandMarkPngBuffer).webp({ quality: 95 }).toFile(path.join(publicDir, 'brand_mark.webp'));

  // 2. combination_mark.png (high-res transparent horizontal)
  // ViewBox: 374.72 1558.1 2998.8 543.4
  const combWidth = 2400;
  const combHeight = Math.round(2400 * (543.4 / 2998.8)); // ~435px
  const combMarkPngBuffer = await sharp(combMarkSvg, { density: 600 })
    .resize(combWidth, combHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'combination_mark.png'), combMarkPngBuffer);
  fs.writeFileSync(path.join(publicDir, 'full.png'), combMarkPngBuffer);
  await sharp(combMarkPngBuffer).webp({ quality: 95 }).toFile(path.join(publicDir, 'combination_mark.webp'));

  // 3. QR Code center mark (1100 x 350 with white background)
  // Inside 1100 x 350, fit combination mark nicely with margin
  const qrInnerWidth = 880;
  const qrInnerHeight = Math.round(qrInnerWidth * (543.4 / 2998.8)); // ~159px
  const combMarkForQr = await sharp(combMarkSvg, { density: 600 })
    .resize(qrInnerWidth, qrInnerHeight, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const qrLogoBuffer = await sharp({
    create: {
      width: 1100,
      height: 350,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: combMarkForQr,
        gravity: 'centre',
      },
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'combination_mark_qr.png'), qrLogoBuffer);
  fs.writeFileSync(path.join(publicDir, 'full_qr.png'), qrLogoBuffer);

  // 4. OpenGraph image (1200 x 630)
  // Clean, high-contrast, elegant typography & branding matching Zackisch design system
  const ogCombWidth = 560;
  const ogCombHeight = Math.round(ogCombWidth * (543.4 / 2998.8)); // ~101px
  const combMarkForOg = await sharp(combMarkSvg, { density: 400 })
    .resize(ogCombWidth, ogCombHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create SVG overlay for typography
  const textSvg = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <!-- Tagline -->
      <text x="600" y="340" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" font-size="44" fill="#111111" letter-spacing="-0.02em">
        Bestellen und Bezahlen per QR-Code
      </text>
      <!-- Subtitle -->
      <text x="600" y="400" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="500" font-size="22" fill="#666666">
        Die smarte Gastronomie-Plattform für Gäste und Restaurants
      </text>
      <!-- Badges pill -->
      <rect x="360" y="470" width="480" height="48" rx="24" fill="#f4f4f4" stroke="#e5e5e5" stroke-width="1"/>
      <text x="600" y="501" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="600" font-size="16" fill="#111111">
        0 € Grundgebühr  ·  0 € Einrichtungsgebühr  ·  2 % pro Bestellung
      </text>
      <!-- Domain footer -->
      <text x="600" y="580" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="600" font-size="15" fill="#999999" letter-spacing="0.08em">
        ZACKISCH.COM
      </text>
    </svg>
  `);

  const ogBuffer = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 254, g: 254, b: 254, alpha: 1 },
    },
  })
    .composite([
      {
        input: combMarkForOg,
        top: 140,
        left: Math.round((1200 - ogCombWidth) / 2),
      },
      {
        input: textSvg,
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og_image.png'), ogBuffer);

  console.log('All brand assets successfully generated!');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
