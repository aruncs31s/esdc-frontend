const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}
const files = walk('src');
let changedCount = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes("'../styles/")) {
        content = content.replace(/'\.\.\/styles\//g, "'@/styles/");
        fs.writeFileSync(f, content);
        changedCount++;
    }
});
console.log(`Changed ${changedCount} files.`);
