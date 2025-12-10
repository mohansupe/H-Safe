const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'h_safe_project_data.json');

const ignoreExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg'];
const ignoreFiles = ['vite-env.d.ts'];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

try {
    const allFiles = getAllFiles(srcDir);
    const dataset = [];

    console.log(`Scanning ${srcDir}...`);

    allFiles.forEach(filePath => {
        const ext = path.extname(filePath).toLowerCase();
        const filename = path.basename(filePath);

        if (!ignoreExtensions.includes(ext) && !ignoreFiles.includes(filename)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');

            dataset.push({
                path: relativePath,
                language: ext.replace('.', ''),
                content: content
            });
        }
    });

    // Also add package.json and index.html
    const rootFiles = ['package.json', 'index.html', 'README.md', 'vercel.json', 'vite.config.js'];
    rootFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            dataset.push({
                path: file,
                language: path.extname(file).replace('.', ''),
                content: content
            });
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(dataset, null, 2));
    console.log(`Successfully generated ${outputFile} with ${dataset.length} files.`);

} catch (err) {
    console.error('Error generating dataset:', err);
}
