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
    // skip the auth module itself to avoid messing up internal references if it's still kept around
    if (f.includes('src/modules/auth/') || f.includes('src/features/auth/')) {
        // wait, we can fix Navbar and others, but let's just do a regex replace
    }

    let content = fs.readFileSync(f, 'utf8');
    let originalContent = content;

    // Replace various forms of useAuth import pointing to modules/auth
    content = content.replace(/import\s+{\s*useAuth\s*}\s+from\s+['"]@\/modules\/auth\/useAuth['"];?/g, "import { useAuth } from '@/features/auth';");
    content = content.replace(/import\s+{\s*useAuth\s*}\s+from\s+['"]\.\.\/modules\/auth\/useAuth['"];?/g, "import { useAuth } from '@/features/auth';");
    content = content.replace(/import\s+{\s*useAuth\s*}\s+from\s+['"]\.\.\/\.\.\/modules\/auth\/useAuth['"];?/g, "import { useAuth } from '@/features/auth';");

    // also standardize features/auth/hooks/useAuth
    content = content.replace(/import\s+{\s*useAuth\s*}\s+from\s+['"]@\/features\/auth\/hooks\/useAuth['"];?/g, "import { useAuth } from '@/features/auth';");

    if (content !== originalContent) {
        fs.writeFileSync(f, content);
        changedCount++;
        console.log(`Updated: ${f}`);
    }
});
console.log(`Changed ${changedCount} files.`);
