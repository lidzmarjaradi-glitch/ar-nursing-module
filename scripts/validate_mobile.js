/**
 * Mobile validation script — tests all live Render endpoints
 * with a mobile User-Agent (iPhone Safari).
 * Run: node scripts/validate_mobile.js
 */
const https = require('https');
const BASE = 'ar-nursing-module.onrender.com';
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function get(path) {
    return new Promise(resolve => {
        const req = https.get(
            { hostname: BASE, path, headers: { 'User-Agent': MOBILE_UA } },
            res => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => resolve({ s: res.statusCode, b: d, ct: res.headers['content-type'] || '' }));
            }
        );
        req.on('error', e => resolve({ s: 0, e: e.message }));
        req.setTimeout(12000, () => { req.destroy(); resolve({ s: -1, e: 'timeout' }); });
    });
}

// All models: procedural ones (syringe, neuron) have no file on disk
const GLTF_MODELS = [
    'skull', 'brain', 'eye', 'tooth', 'ear', 'inner_ear', 'tongue', 'larynx', 'thyroid', 'pituitary',
    'heart', 'lungs', 'spine', 'spinal_cord', 'diaphragm',
    'esophagus', 'liver', 'stomach', 'pancreas', 'gallbladder_organ', 'kidney',
    'adrenal_gland', 'small_intestine', 'large_intestine',
    'bladder', 'urinary_system', 'male_reproductive', 'female_reproductive', 'pelvis',
    'shoulder_joint', 'hip_joint', 'knee_joint', 'foot', 'hand', 'muscular_system', 'skin',
    'blood_cells', 'human_cell', 'dna', 'lymph_node', 'iv_setup', 'catheter'
];
const PROCEDURAL_MODELS = ['syringe', 'neuron'];
const QR_ORGANS = ['heart', 'lungs', 'kidney', 'brain', 'syringe'];
const PAGES = ['/', '/ar-viewer.html', '/handbook.html', '/api/models'];

function label(ok) { return ok ? '✓ OK  ' : '✗ FAIL'; }

async function run() {
    let totalFail = 0;

    // 1. Pages
    console.log('\n══════════════════════════════════════════');
    console.log('  SECTION 1 — HTML Pages & API');
    console.log('══════════════════════════════════════════');
    for (const p of PAGES) {
        const r = await get(p);
        const ok = r.s === 200;
        if (!ok) totalFail++;
        console.log(label(ok), r.s, p, r.e ? '  ERR:' + r.e : '');
    }

    // 2. QR codes
    console.log('\n══════════════════════════════════════════');
    console.log('  SECTION 2 — QR Code Endpoints');
    console.log('══════════════════════════════════════════');
    for (const o of QR_ORGANS) {
        const r = await get('/api/qrcode/' + o);
        let urlOk = false, qrUrl = 'n/a';
        if (r.s === 200) {
            try {
                const j = JSON.parse(r.b);
                qrUrl = j.url || '';
                urlOk = qrUrl.includes('onrender.com') && qrUrl.includes('ar-viewer.html') && qrUrl.includes('model=');
            } catch (e) { /* parse error */ }
        }
        const ok = r.s === 200 && urlOk;
        if (!ok) totalFail++;
        console.log(label(ok), r.s, '/api/qrcode/' + o, '->', qrUrl);
    }

    // 3. Model GLTF files
    console.log('\n══════════════════════════════════════════');
    console.log('  SECTION 3 — GLTF Model Files (' + GLTF_MODELS.length + ' GLTF + ' + PROCEDURAL_MODELS.length + ' procedural)');
    console.log('══════════════════════════════════════════');
    const failedModels = [];
    for (const m of GLTF_MODELS) {
        const r = await get('/models/' + m + '/scene.gltf');
        const ok = r.s === 200;
        if (!ok) { failedModels.push(m + ':' + r.s); totalFail++; }
        process.stdout.write(ok ? '.' : 'F');
    }
    console.log('\nGLTF: ' + (GLTF_MODELS.length - failedModels.length) + '/' + GLTF_MODELS.length + ' OK');
    PROCEDURAL_MODELS.forEach(m => console.log(label(true), 'procedural (no file)', m));
    if (failedModels.length) failedModels.forEach(f => console.log('  FAIL:', f));

    // 4. Sample BIN files for large models (spot check)
    console.log('\n══════════════════════════════════════════');
    console.log('  SECTION 4 — BIN Asset Spot Check');
    console.log('══════════════════════════════════════════');
    const BIN_SPOT = ['skull', 'brain', 'heart', 'lungs', 'kidney', 'spine', 'pituitary', 'spinal_cord'];
    for (const m of BIN_SPOT) {
        const r = await get('/models/' + m + '/scene.bin');
        const ok = r.s === 200;
        if (!ok) totalFail++;
        console.log(label(ok), r.s, '/models/' + m + '/scene.bin', r.e ? 'ERR:' + r.e : '');
    }

    // 5. Summary
    console.log('\n══════════════════════════════════════════');
    console.log('  SUMMARY');
    console.log('══════════════════════════════════════════');
    console.log('Total failures:', totalFail);
    if (totalFail === 0) {
        console.log('ALL CHECKS PASSED ✓');
    }
}

run().catch(e => console.error('Runner error:', e));
