const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'target', 'facebook.html');
if (!fs.existsSync(htmlPath)) {
    console.error('File does not exist at ' + htmlPath);
    process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

// Simple regex to extract <input ...>
const inputRegex = /<input[^>]*>/gi;
const inputs = html.match(inputRegex) || [];

console.log('--- ALL INPUTS ---');
inputs.forEach((inp, idx) => {
    console.log(`${idx}: ${inp}`);
});

// Simple regex to extract <button ...>...</button>
const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
const buttons = html.match(buttonRegex) || [];

console.log('\n--- ALL BUTTONS ---');
buttons.forEach((btn, idx) => {
    // Truncate if too long
    console.log(`${idx}: ${btn.substring(0, 300)}`);
});

// Simple regex to find cookie or consent text
console.log('\n--- COOKIE/CONSENT TEXT SEARCH ---');
const bodyStartIndex = html.indexOf('<body');
if (bodyStartIndex !== -1) {
    const bodyText = html.substring(bodyStartIndex).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const keywords = ['cookie', 'consent', 'allow', 'accept', 'decline', 'manage', 'agree', 'reject', 'approve'];
    keywords.forEach(kw => {
        const index = bodyText.toLowerCase().indexOf(kw);
        if (index !== -1) {
            console.log(`Found keyword "${kw}" near: ... ${bodyText.substring(Math.max(0, index - 50), index + 100)} ...`);
        }
    });
}
