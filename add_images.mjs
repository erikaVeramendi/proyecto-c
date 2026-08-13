import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';

const catPath = 'src/data/categories.ts';
let categoriesRaw = fs.readFileSync(catPath, 'utf8');

// The original lines look like:
// { id: 'ts-lomo-vaca', name: 'Lomo de Vaca', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Lomo de vaca selección' },
const regex = /({ id: '([^']+)', name: '([^']+)', price: [^,]+, emoji: '([^']+)', description: '([^']+)'(?!,\s*image:)[^}]*?})/g;

let updated = categoriesRaw.replace(regex, (match, fullMatch, id) => {
  return fullMatch.replace('description: ', `image: '/productos/${id}.jpg', description: `);
});

fs.writeFileSync(catPath, updated);
console.log("Updated categories.ts");

const dir = 'public/productos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Find all product IDs (filter out known category IDs)
const cats = ['ternera-salamanca', 'ternera-asturiana', 'cerdo', 'cerdo-iberico', 'cordero-recental', 'cordero-lechal', 'casqueria', 'polleria'];
const ids = [...updated.matchAll(/id: '([^']+)'/g)]
  .map(m => m[1])
  .filter(id => !cats.includes(id));

// To avoid rate-limits and huge download times, we will fetch a few generic images and copy them
async function run() {
    console.log(`Need to produce ${ids.length} images.`);
    
    // Create an SVG placeholder generator for speed and 100% reliability
    const getSvg = (id, hue) => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
        <rect width="400" height="400" fill="hsl(${hue}, 40%, 90%)"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-family="sans-serif" fill="#444">
            ${id}
        </text>
    </svg>`;

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const dest = path.join(dir, `${id}.jpg`);
        // We just use SVG as jpg since it is a placeholder or loremflickr.
        // Actually browsers check MIME, so let's save as .svg, wait the DB says .jpg
        // So let's generate a solid color using a simple base64 image or just fetch real images with delay.
        // Let's use fetch to loremflickr.
        try {
            if (!fs.existsSync(dest)) {
                await new Promise((resolve) => {
                    const hash = crypto.createHash('md5').update(id).digest('hex').substr(0,4);
                    // Use a simple free placehold service that's fast.
                    const url = `https://placehold.co/400x400/${hash}/FFF.png?text=Photo+${id}`;
                    https.get(url, (res) => {
                        const file = fs.createWriteStream(dest);
                        res.pipe(file);
                        file.on('finish', () => { file.close(); resolve(); });
                    }).on('error', (err) => {
                        console.log("Error fetching", id, err);
                        resolve();
                    });
                });
            }
        } catch (e) {
            console.error(e);
        }
    }
    console.log('Finished producing images.');
}

run();
