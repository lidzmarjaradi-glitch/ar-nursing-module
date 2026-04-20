/**
 * compress_models.js
 * Converts all scene.gltf + scene.bin pairs to Draco-compressed scene_draco.glb
 *
 * Usage: node scripts/compress_models.js
 *
 * Draco compression reduces geometry binary sizes by ~70–90%.
 * Examples: heart 116 MB → ~12 MB, male_reproductive 80 MB → ~8 MB
 *
 * Output: public/models/<organ>/scene_draco.glb alongside original files.
 * The original scene.gltf + scene.bin are kept as fallback.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { gltfToGlb, processGlb } = require('gltf-pipeline');

const MODELS_DIR = path.join(__dirname, '..', 'public', 'models');

// Draco compression options — level 7 is a good quality/size balance.
// Quantization: positions 14-bit, normals 10-bit, UVs 12-bit, colors 8-bit.
// Colors (COLOR_0) are preserved — required for heart vertex-color labels.
const DRACO_OPTIONS = {
    compressionLevel: 7,
    quantizePositionBits: 14,
    quantizeNormalBits: 10,
    quantizeTexcoordBits: 12,
    quantizeColorBits: 8,
    quantizeGenericBits: 12,
    unifiedQuantization: false
};

async function compressModel(modelDir) {
    const gltfPath = path.join(modelDir, 'scene.gltf');
    const outPath = path.join(modelDir, 'scene_draco.glb');

    if (!fs.existsSync(gltfPath)) {
        console.log(`  SKIP (no scene.gltf): ${path.basename(modelDir)}`);
        return null;
    }

    // Skip if already compressed and newer than the source
    if (fs.existsSync(outPath)) {
        const srcMtime = fs.statSync(gltfPath).mtimeMs;
        const outMtime = fs.statSync(outPath).mtimeMs;
        if (outMtime > srcMtime) {
            const outSizeMb = (fs.statSync(outPath).size / 1048576).toFixed(1);
            console.log(`  CACHED ${path.basename(modelDir)}: ${outSizeMb} MB (already compressed)`);
            return { skipped: true };
        }
    }

    const gltfContent = fs.readFileSync(gltfPath, 'utf8');
    const gltfJson = JSON.parse(gltfContent);

    // Calculate original .bin size for reporting
    const binPath = path.join(modelDir, 'scene.bin');
    const originalBinSizeMb = fs.existsSync(binPath)
        ? (fs.statSync(binPath).size / 1048576).toFixed(1)
        : '?';

    // Step 1: Pack scene.gltf + scene.bin + textures into a single GLB buffer
    const glbResult = await gltfToGlb(gltfJson, { resourceDirectory: modelDir + path.sep });

    // Step 2: Apply Draco compression to the GLB buffer
    const options = {
        resourceDirectory: modelDir + path.sep,
        dracoOptions: DRACO_OPTIONS
    };

    try {
        const result = await processGlb(glbResult.glb, options);
        fs.writeFileSync(outPath, result.glb);

        const outSizeMb = (fs.statSync(outPath).size / 1048576).toFixed(1);
        const reduction = originalBinSizeMb !== '?'
            ? Math.round((1 - outSizeMb / parseFloat(originalBinSizeMb)) * 100)
            : '?';
        console.log(
            `  OK  ${path.basename(modelDir).padEnd(22)} bin: ${originalBinSizeMb} MB → glb: ${outSizeMb} MB  (${reduction}% smaller)`
        );
        return { original: parseFloat(originalBinSizeMb), compressed: parseFloat(outSizeMb) };
    } catch (err) {
        console.error(`  ERR ${path.basename(modelDir)}: ${err.message}`);
        return null;
    }
}

async function main() {
    console.log('=== Draco Model Compression ===\n');

    const entries = fs.readdirSync(MODELS_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => path.join(MODELS_DIR, e.name));

    let totalOriginalMb = 0;
    let totalCompressedMb = 0;
    let processed = 0;
    let skipped = 0;
    const errors = [];

    for (const modelDir of entries) {
        const result = await compressModel(modelDir);
        if (result && result.skipped) {
            skipped++;
        } else if (result) {
            processed++;
            if (!isNaN(result.original)) totalOriginalMb += result.original;
            if (!isNaN(result.compressed)) totalCompressedMb += result.compressed;
        } else if (result === null) {
            errors.push(path.basename(modelDir));
        }
    }

    console.log('\n=== Summary ===');
    console.log(`  Processed : ${processed} models`);
    console.log(`  Cached    : ${skipped} models (already up to date)`);
    if (errors.length) console.log(`  Errors    : ${errors.join(', ')}`);
    if (totalOriginalMb > 0) {
        const reduction = Math.round((1 - totalCompressedMb / totalOriginalMb) * 100);
        console.log(`  Total bin : ${totalOriginalMb.toFixed(1)} MB`);
        console.log(`  Total glb : ${totalCompressedMb.toFixed(1)} MB`);
        console.log(`  Reduction : ${reduction}%`);
    }
}

main().catch(err => { console.error(err); process.exit(1); });
