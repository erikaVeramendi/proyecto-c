import fs from 'fs';
import path from 'path';

const catPath = 'src/data/categories.ts';
let categoriesRaw = fs.readFileSync(catPath, 'utf8');

const dir = 'public/productos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const ids = [...categoriesRaw.matchAll(/id: '([^']+)', name: '([^']+)'/g)];

async function run() {
    console.log(`Downloading ${ids.length} specific meat photos from Bing...`);
    
    let successCount = 0;
    
    // Batch processing to be faster but not too aggressive
    const batchSize = 10;
    for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        await Promise.all(batch.map(async ([full, id, name]) => {
            const dest = path.join(dir, `${id}.jpg`);
            
            // Query for raw meat cut specifically
            const query = encodeURIComponent(`"carne cruda" "${name}" carnicería`);
            const url = `https://www.bing.com/images/search?q=${query}&form=HDRSC3`;
            
            try {
                const res = await fetch(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    }
                });
                const html = await res.text();
                
                const matches = [...html.matchAll(/murl&quot;:&quot;([^&]+)&quot;/g)];
                if (matches.length > 0) {
                    let success = false;
                    for (let j = 0; j < Math.min(3, matches.length); j++) {
                        try {
                            const imgRes = await fetch(matches[j][1], { signal: AbortSignal.timeout(4000) });
                            if (imgRes.ok) {
                               const buffer = await imgRes.arrayBuffer();
                               fs.writeFileSync(dest, Buffer.from(buffer));
                               success = true;
                               successCount++;
                               break;
                            }
                        } catch (err) {}
                    }
                    if (!success) { // Fallback query if no images download 
                       console.log(`Failed to fetch image for: ${name}`);
                    }
                } else {
                    console.log(`No images found on Bing for: ${name}`);
                }
            } catch (e) {
                console.error(`Error querying Bing for ${name}`);
            }
        }));
        
        console.log(`Batch ${Math.floor(i/batchSize)+1}/${Math.ceil(ids.length/batchSize)} done.`);
        await new Promise(r => setTimeout(r, 600)); // small delay to respect Bing
    }
    
    console.log(`Finished downloading SPECIFIC images. Success: ${successCount}/${ids.length}`);
}

run();
