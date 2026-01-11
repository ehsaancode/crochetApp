const fs = require('fs');
const path = require('path');
const src = 'C:/Users/maile/.gemini/antigravity/brain/9479ec73-ed1e-4c6c-aaa1-48f616d8fea2/email_footer_final_1768142180333.png';
const destDir = path.join(__dirname, 'assets');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
fs.copyFileSync(src, path.join(destDir, 'footer.png'));
console.log('Copied footer to assets.');
