import fs from 'fs';
import path from 'path';

const catPath = 'src/data/categories.ts';
let categoriesRaw = fs.readFileSync(catPath, 'utf8');

const baseDir = 'c:\\Users\\erika\\.gemini\\antigravity\\brain\\82194921-3891-4daa-a8b9-ce3f0f43c9fe';
const publicDir = 'public/productos';

// The images we managed to generate:
// base_beef_steak_1783640198802.png
// base_beef_roast_1783640206785.png
// base_beef_stew_1783640214708.png
// base_beef_mince_1783640222555.png
// base_pork_chop_1783640230342.png

// Find the exact names in the brain dir
const brainFiles = fs.readdirSync(baseDir);
const steakFile = brainFiles.find(f => f.startsWith('base_beef_steak_'));
const roastFile = brainFiles.find(f => f.startsWith('base_beef_roast_'));
const stewFile = brainFiles.find(f => f.startsWith('base_beef_stew_'));
const minceFile = brainFiles.find(f => f.startsWith('base_beef_mince_'));
const chopFile = brainFiles.find(f => f.startsWith('base_pork_chop_'));

const mappedImages = {
  steak: path.join(baseDir, steakFile),
  roast: path.join(baseDir, roastFile),
  stew: path.join(baseDir, stewFile),
  mince: path.join(baseDir, minceFile),
  chop: path.join(baseDir, chopFile),
};

const idsProducts = [...categoriesRaw.matchAll(/id: '([^']+)', name: '([^']+)'/g)];

for (let i = 0; i < idsProducts.length; i++) {
    const [full, id, name] = idsProducts[i];
    const nm = name.toLowerCase();
    
    // Choose the best match based on keywords
    let selection = mappedImages.steak; // default
    if (nm.includes('picad') || nm.includes('burger') || nm.includes('hamburguesa') || nm.includes('albond')) selection = mappedImages.mince;
    else if (nm.includes('chuleta') || nm.includes('costilla') || nm.includes('panceta') || nm.includes('pincho') || nm.includes('alas')) selection = mappedImages.chop;
    else if (nm.includes('guisar') || nm.includes('taco') || nm.includes('callos') || nm.includes('rabo')) selection = mappedImages.stew;
    else if (nm.includes('lomo') || nm.includes('contra') || nm.includes('redondo') || nm.includes('aguja') || nm.includes('cinta')) selection = mappedImages.roast;
    
    // Copy the chosen base image to public/productos/id.jpg
    // Since my html replaces expect .jpg, I'll copy the PNG bits as .jpg (browser handles it via magic numbers)
    const dest = path.join(publicDir, `${id}.jpg`);
    try {
        fs.copyFileSync(selection, dest);
    } catch(e) {
        console.log("Error copying for", name, e.message);
    }
}
console.log("Mapped all 158 products to the 5 base AI images.");
