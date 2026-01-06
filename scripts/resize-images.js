const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, '../public/portfolio');

// Images > 500KB to resize (target: 1920px max width, 85% quality JPEG)
const MAX_WIDTH = 1920;
const QUALITY = 85;
const SIZE_THRESHOLD = 500 * 1024; // 500KB

async function resizeImage(filePath) {
  const fileName = path.basename(filePath);
  const stats = fs.statSync(filePath);

  if (stats.size < SIZE_THRESHOLD) {
    return null;
  }

  const originalSize = stats.size;
  const outputPath = filePath.replace(/\.(jpg|jpeg)$/i, '-small.jpg');

  try {
    // Read file to buffer first
    const inputBuffer = fs.readFileSync(filePath);

    // Get image metadata
    const metadata = await sharp(inputBuffer).metadata();

    // Process with Sharp using buffer
    let pipeline = sharp(inputBuffer);

    // Only resize if wider than MAX_WIDTH
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Optimize and get buffer
    const outputBuffer = await pipeline
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    // Write to new file
    fs.writeFileSync(outputPath, outputBuffer);

    const savings = ((originalSize - outputBuffer.length) / originalSize * 100).toFixed(1);
    console.log(`✓ ${fileName}: ${(originalSize / 1024).toFixed(0)}KB → ${(outputBuffer.length / 1024).toFixed(0)}KB (-${savings}%)`);
    console.log(`  → Saved as: ${path.basename(outputPath)}`);

    return { original: filePath, optimized: outputPath };
  } catch (err) {
    console.error(`✗ Error: ${fileName} - ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('Starting image optimization...\n');
  console.log(`Target: max ${MAX_WIDTH}px width, ${QUALITY}% JPEG quality`);
  console.log(`Processing images > ${SIZE_THRESHOLD / 1024}KB\n`);

  const files = fs.readdirSync(portfolioDir)
    .filter(f => /\.(jpg|jpeg)$/i.test(f) && !f.includes('-small') && !f.includes('-optimized'))
    .map(f => path.join(portfolioDir, f));

  const results = [];
  for (const file of files) {
    const result = await resizeImage(file);
    if (result) results.push(result);
  }

  console.log(`\n========================================`);
  console.log(`Optimized: ${results.length} large images`);
  if (results.length > 0) {
    console.log(`\nNote: Optimized versions saved with -small suffix.`);
    console.log(`You can manually delete originals and rename the optimized files.`);
  }
  console.log(`========================================`);
}

main().catch(console.error);
