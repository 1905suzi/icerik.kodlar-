const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '28-Akilli-Kafe-Sistemi');

const files = ['index.html', 'mutfak.html', 'kasa.html'];

const navRegex = /<div class="admin-nav">[\s\S]*?<\/div>/;

files.forEach(file => {
    const filePath = path.join(dirPath, file);
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(navRegex, '');
    fs.writeFileSync(filePath, html);
});

console.log('Admin nav removed from all files.');
