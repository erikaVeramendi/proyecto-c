import fs from 'fs';
import path from 'path';

const catPath = 'src/data/categories.ts';
let categoriesRaw = fs.readFileSync(catPath, 'utf8');

const dir = 'public/productos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const cats = ['ternera-salamanca', 'ternera-asturiana', 'cerdo', 'cerdo-iberico', 'cordero-recental', 'cordero-lechal', 'casqueria', 'polleria'];
const ids = [...categoriesRaw.matchAll(/id: '([^']+)'/g)]
  .map(m => m[1])
  .filter(id => !cats.includes(id));

async function run() {
    console.log(`Downloading ${ids.length} realistic meat photos...`);
    // Smaller batch size to prevent hitting limits
    const batchSize = 10;
    
    for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (id, indexInBatch) => {
            const dest = path.join(dir, `${id}.jpg`);
            const globalIndex = i + indexInBatch;
            
            // Generate a random stable id matching the globalIndex so all images differ
            const url = `https://loremflickr.com/500/400/raw,meat,steak?lock=${globalIndex}`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(`Failed to fetch ${url}`);
                    return;
                }
                const buffer = await response.arrayBuffer();
                fs.writeFileSync(dest, Buffer.from(buffer));
            } catch (err) {
                console.error(`Error fetching ${id}`, err);
            }
        }));
        
        console.log(`Downloaded batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(ids.length/batchSize)}`);
    }
    
    console.log('Finished downloading realistic images.');
}

run();
