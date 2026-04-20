const fs = require('fs');

console.log('=== VIEWPORT META ===');
['ar-viewer.html', 'handbook.html', 'index.html'].forEach(f => {
    const c = fs.readFileSync('public/' + f, 'utf8');
    const vp = c.includes('name="viewport"') ? 'OK' : 'MISSING';
    const mob = (c.includes('max-width') || c.includes('min-width')) ? 'has-media-queries' : 'no-media-queries';
    const ta = c.includes('touch-action') ? 'has-touch-action' : 'no-touch-action';
    const ov = c.includes('overflow') ? 'has-overflow' : '';
    console.log(vp, mob, ta, ov, f);
});

console.log('\n=== TOUCH CSS IN ar-viewer.html ===');
const av = fs.readFileSync('public/ar-viewer.html', 'utf8');
const lines = av.split('\n');
lines.forEach((l, i) => {
    if (/touch-action|touch-callout|user-select|overscroll|webkit-overflow/.test(l))
        console.log((i + 1) + ': ' + l.trim());
});

console.log('\n=== MOBILE MEDIA QUERIES IN ar-viewer.html ===');
lines.forEach((l, i) => {
    if (/@media.*width/.test(l)) console.log((i + 1) + ': ' + l.trim());
});

console.log('\n=== TOUCH HANDLERS IN JS FILES ===');
fs.readdirSync('public/js').filter(f => f.endsWith('.js')).forEach(f => {
    const c = fs.readFileSync('public/js/' + f, 'utf8');
    const touches = (c.match(/touch|Touch|pointer|Pointer/g) || []);
    if (touches.length > 0) console.log(touches.length + ' refs\t' + f);
});

console.log('\n=== CONTROLS.JS TOUCH/GESTURE HANDLERS ===');
const ctrl = fs.readFileSync('public/js/controls.js', 'utf8');
ctrl.split('\n').forEach((l, i) => {
    if (/touch|Touch|gesture|pinch|swipe|pointer/i.test(l)) console.log((i + 1) + ': ' + l.trim());
});

console.log('\n=== CANVAS/RENDERER CONFIG (prevent default) ===');
const scene = fs.readFileSync('public/js/scene.js', 'utf8');
scene.split('\n').forEach((l, i) => {
    if (/touch|Touch|preventDefault|passive|canvas|renderer/.test(l)) console.log((i + 1) + ': ' + l.trim());
});
