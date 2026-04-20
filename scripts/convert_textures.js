/**
 * convert_textures.js
 * Converts all PNG/JPG textures in GLTF model folders to WebP,
 * then patches the corresponding scene.gltf files to reference .webp.
 *
 * Usage: node scripts/convert_textures.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// GLTF models that need texture conversion
const GLTF_MODELS = [
    'liver', 'eye', 'tooth', 'knee_joint', 'shoulder_joint',
    'muscular_system', 'esophagus', 'tongue', 'diaphragm',
    'inner_ear', 'ear', 'human_cell', 'iv_setup'
];

const MODELS_DIR = path.join(__dirname, '..', 'public', 'models');
const WEBP_QUALITY = 82; // good balance: visually near-lossless, ~10× smaller

async function convertTexture(srcPath) {
    const ext = path.extname(srcPath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

    const webpPath = srcPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    // Skip if already converted and webp is newer than source
    if (fs.existsSync(webpPath)) {
        const srcMtime = fs.statSync(srcPath).mtimeMs;
        const dstMtime = fs.statSync(webpPath).mtimeMs;
        if (dstMtime >= srcMtime) {
            const kb = Math.round(fs.statSync(webpPath).size / 1024);
            return { skipped: true, webpPath, webpKB: kb };
        }
    }

    const srcKB = Math.round(fs.statSync(srcPath).size / 1024);

    await sharp(srcPath)
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(webpPath);

    const dstKB = Math.round(fs.statSync(webpPath).size / 1024);
    return { skipped: false, srcPath, webpPath, srcKB, dstKB };
}

function patchGltfFile(gltfPath) {
    const raw = fs.readFileSync(gltfPath, 'utf8');
    let patched = raw.replace(/"uri"\s*:\s*"(textures\/[^"]+)\.(png|jpg|jpeg)"/gi,
        (match, base, ext) => `"uri": "${base}.webp"`);

    if (patched !== raw) {
        fs.writeFileSync(gltfPath, patched, 'utf8');
        return true;
    }
    return false;
}

async function main() {
    let totalSrcKB = 0, totalDstKB = 0, convertedCount = 0, skippedCount = 0;

    for (const modelId of GLTF_MODELS) {
        const texturesDir = path.join(MODELS_DIR, modelId, 'textures');
        if (!fs.existsSync(texturesDir)) {
            console.log(`[SKIP] ${modelId}: no textures/ folder`);
            continue;
        }

        const files = fs.readdirSync(texturesDir);
        const images = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

        if (images.length === 0) {
            console.log(`[SKIP] ${modelId}: no PNG/JPG textures`);
            continue;
        }

        console.log(`\n[${modelId}] Converting ${images.length} texture(s)...`);

        for (const img of images) {
            const srcPath = path.join(texturesDir, img);
            try {
                const result = await convertTexture(srcPath);
                if (!result) continue;
                if (result.skipped) {
                    console.log(`  ✓ ${img} → .webp (${result.webpKB} KB) [already done]`);
                    skippedCount++;
                } else {
                    const ratio = Math.round((1 - result.dstKB / result.srcKB) * 100);
                    console.log(`  ✓ ${img}: ${result.srcKB} KB → ${result.dstKB} KB (-${ratio}%)`);
                    totalSrcKB += result.srcKB;
                    totalDstKB += result.dstKB;
                    convertedCount++;
                }
            } catch (err) {
                console.error(`  ✗ ${img}: ${err.message}`);
            }
        }

        // Patch the .gltf file to reference .webp
        const gltfPath = path.join(MODELS_DIR, modelId, 'scene.gltf');
        if (fs.existsSync(gltfPath)) {
            const changed = patchGltfFile(gltfPath);
            console.log(`  ${changed ? '✓ Patched' : '— Already patched'} scene.gltf → .webp URIs`);
        }
    }

    console.log('\n════════════════════════════════');
    console.log(`Converted: ${convertedCount} files`);
    console.log(`Skipped (up to date): ${skippedCount} files`);
    if (convertedCount > 0) {
        const saved = totalSrcKB - totalDstKB;
        const ratio = Math.round((1 - totalDstKB / totalSrcKB) * 100);
        console.log(`Total saved: ${Math.round(saved / 1024)} MB  (${Math.round(totalSrcKB / 1024)} MB → ${Math.round(totalDstKB / 1024)} MB, -${ratio}%)`);
    }
    console.log('Done.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
