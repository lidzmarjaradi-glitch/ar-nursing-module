/**
 * Downloads the heart model from Sketchfab at Render build time.
 * heart/scene.bin is 116 MB — exceeds GitHub's 100 MB limit —
 * so it is excluded from the repository and fetched here instead.
 *
 * Env var: SKETCHFAB_TOKEN (set in Render dashboard)
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOKEN = process.env.SKETCHFAB_TOKEN;
if (!TOKEN) {
    console.error('ERROR: SKETCHFAB_TOKEN environment variable is not set.');
    console.error('Set it in the Render dashboard under Environment Variables.');
    process.exit(1);
}
const HEART_UID = 'a3f0ea2030214a6bbaa97e7357eebd58';
const DEST_DIR = path.join(__dirname, '..', 'public', 'models', 'heart');
const BIN_PATH = path.join(DEST_DIR, 'scene.bin');
const ZIP_PATH = path.join(DEST_DIR, 'heart_dl.zip');

function httpsGet(url, opts) {
    return new Promise((resolve, reject) => {
        https.get(url, opts || {}, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return httpsGet(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        }).on('error', reject);
    });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const follow = (u) => {
            https.get(u, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) return follow(res.headers.location);
                const file = fs.createWriteStream(dest);
                let bytes = 0;
                res.on('data', chunk => { bytes += chunk.length; });
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(bytes); });
                file.on('error', reject);
                res.on('error', reject);
            }).on('error', reject);
        };
        follow(url);
    });
}

async function main() {
    if (fs.existsSync(BIN_PATH)) {
        console.log('heart/scene.bin already present — skipping download.');
        return;
    }

    console.log('Fetching heart model download URL from Sketchfab...');
    const raw = await httpsGet(
        `https://api.sketchfab.com/v3/models/${HEART_UID}/download`,
        { headers: { Authorization: `Token ${TOKEN}` } }
    );
    const json = JSON.parse(raw);
    const dlUrl = json.gltf && json.gltf.url;
    if (!dlUrl) throw new Error(`No glTF URL in response: ${raw.substring(0, 200)}`);

    console.log('Downloading heart model (~116 MB)...');
    if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
    const bytes = await downloadFile(dlUrl, ZIP_PATH);
    console.log(`Downloaded ${(bytes / 1024 / 1024).toFixed(1)} MB`);

    console.log('Extracting...');
    // Use unzip (Linux) or PowerShell Expand-Archive (Windows)
    try {
        execSync(`unzip -o "${ZIP_PATH}" -d "${DEST_DIR}"`, { stdio: 'inherit' });
    } catch {
        execSync(
            `powershell -Command "Expand-Archive -Path '${ZIP_PATH}' -DestinationPath '${DEST_DIR}' -Force"`,
            { stdio: 'inherit' }
        );
    }
    fs.unlinkSync(ZIP_PATH);
    console.log('Heart model ready.');
}

main().catch(err => {
    console.error('ERROR downloading heart model:', err.message);
    process.exit(1);
});
