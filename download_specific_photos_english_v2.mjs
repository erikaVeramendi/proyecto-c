import fs from 'fs';
import path from 'path';

const catPath = 'src/data/categories.ts';
let categoriesRaw = fs.readFileSync(catPath, 'utf8');

const dir = 'public/productos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const ids = [...categoriesRaw.matchAll(/id: '([^']+)', name: '([^']+)'/g)];

const usedImgUrls = new Set();

function translateName(n) {
    let q = n.toLowerCase();
    
    // Explicit exact mappings for edge cases
    if (q === 'pato') return 'duck meat';
    if (q === 'lacón' || q === 'lacon') return 'cured pork shoulder';
    if (q === 'compango') return 'chorizo and morcilla sausages';
    if (q.includes('medios') && q.includes('valladolid')) return 'half raw lamb carcass';
    if (q === 'marmitakos / garbanzos') return 'pork chuck stew meat';
    if (q === 'aleta para rellenar') return 'flank steak rolled';
    
    // Generic replacements
    q = q.replace(/ternera|vaca|añojo/g, 'beef')
         .replace(/cerdo|iberico|ibérico/g, 'pork')
         .replace(/cordero|lechal/g, 'lamb')
         .replace(/pollo|corral|gallina/g, 'chicken')
         .replace(/pavo/g, 'turkey')
         .replace(/conejo/g, 'rabbit')
         .replace(/codorniz|codornices/g, 'quail')
         .replace(/perdiz/g, 'partridge')
         .replace(/cochinillo|pato/g, 'whole suckling pig') // wait, pato was handled above
         .replace(/pato/g, 'duck') // fallback
         
    // Cuts
    q = q.replace(/lomo/g, 'loin')
         .replace(/solomillo/g, 'tenderloin steak')
         .replace(/chuleta|chuletas/g, 'chops')
         .replace(/costilla|costillas|tira de asado|churrasco/g, 'ribs')
         .replace(/pechuga/g, 'breast')
         .replace(/alitas|alas/g, 'wings')
         .replace(/muslo|traseros|patorras/g, 'thighs')
         .replace(/jamoncitos/g, 'drumsticks')
         .replace(/picada|picar/g, 'minced meat')
         .replace(/burguer|hamburguesa/g, 'burger patty')
         .replace(/croquetas/g, 'raw meat croquettes')
         .replace(/panceta|beicon|tocino|torreznos/g, 'belly bacon stripes')
         .replace(/chorizo/g, 'raw chorizo sausage')
         .replace(/salchicha/g, 'raw sausage')
         .replace(/morcilla/g, 'blood sausage')
         .replace(/secreto/g, 'flank steak')
         .replace(/presa/g, 'shoulder steak')
         .replace(/carrillada/g, 'pork cheek meat')
         .replace(/oreja/g, 'pig ear')
         .replace(/careta/g, 'pig face')
         .replace(/lengua/g, 'raw beef tongue')
         .replace(/higado|higaditos/g, 'raw liver')
         .replace(/callos/g, 'raw beef tripe')
         .replace(/rabo/g, 'oxtail bone in')
         .replace(/morcillo/g, 'beef shank')
         .replace(/redondo|contra/g, 'round roast')
         .replace(/aguja/g, 'chuck roast')
         .replace(/entraña|entraña/g, 'skirt steak')
         .replace(/espaldilla/g, 'shoulder steak')
         .replace(/babilla/g, 'sirloin tip')
         .replace(/cadera/g, 'rump steak')
         .replace(/tapa|tapilla/g, 'top sirloin')
         .replace(/ossobuco/g, 'ossobuco')
         .replace(/falda/g, 'beef flank')
         .replace(/aleta/g, 'flank steak')
         .replace(/huesos|esqueletos/g, 'raw bones')
         .replace(/pierna/g, 'lamb leg')
         .replace(/paletilla/g, 'lamb shoulder')
         .replace(/medios enteros/g, 'half carcass')
         .replace(/cuarto delantero/g, 'forequarter')
         .replace(/cuarto trasero/g, 'hindquarter')
         .replace(/manitas/g, 'pig trotters')
         .replace(/cabeza/g, 'sheep head')
         .replace(/asadura/g, 'offal meat')
         .replace(/mollejas/g, 'sweetbreads')
         .replace(/sesos/g, 'brains')
         .replace(/morro/g, 'pork snout')
         .replace(/huevos|huevo/g, 'eggs')
         .replace(/anchoas|boquerones/g, 'anchovies')
         .replace(/sardinas/g, 'sardines')
         .replace(/adobada|adobadas/g, 'marinated')
         
    // Strip trailing spaces
    return q.trim();
}

async function run() {
    console.log(`Downloading ${ids.length} PERFECT deduplicated photos from Bing...`);
    
    let successCount = 0;
    
    // Process serially with small batches to strictly enforce uniqueness!
    // Since usedImgUrls checks against the Set, doing it sequentially guarantees no race conditions on duplicates
    for (const [full, id, name] of ids) {
        const dest = path.join(dir, `${id}.jpg`);
        
        const engQuery = translateName(name);
        
        // Very strict query formulation to get specific wooden board butcher photos
        let rawPrefix = engQuery.includes('eggs') || engQuery.includes('sardines') || engQuery.includes('anchovies') ? '' : 'raw ';
        
        const query = encodeURIComponent(`"${rawPrefix}${engQuery}" on rustic wooden cutting board food photography -alamy -stock -shutterstock -dreamstime -123rf -vector -icon`);
        const url = `https://www.bing.com/images/search?q=${query}&form=HDRSC3`;
        
        try {
            const res = await fetch(url, {
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0" }
            });
            const html = await res.text();
            
            const matches = [...html.matchAll(/murl&quot;:&quot;([^&]+)&quot;/g)];
            if (matches.length > 0) {
                let success = false;
                // Go through matches until we find one not in usedImgUrls
                for (let j = 0; j < Math.min(10, matches.length); j++) {
                    const imgUrl = matches[j][1];
                    if (usedImgUrls.has(imgUrl)) continue; // SKIP DUPLICATES!
                    
                    try {
                        const imgRes = await fetch(imgUrl, { signal: AbortSignal.timeout(4000) });
                        if (imgRes.ok) {
                           const buffer = await imgRes.arrayBuffer();
                           fs.writeFileSync(dest, Buffer.from(buffer));
                           usedImgUrls.add(imgUrl); // Mark as used
                           success = true;
                           successCount++;
                           break;
                        }
                    } catch (err) {}
                }
                if (!success) {
                    console.log(`Failed (or all duplicates) for ${name}`);
                }
            } else {
                console.log(`No images found on Bing for ${name}`);
            }
        } catch (e) {
            console.error(`Error querying Bing for ${name}`);
        }
        await new Promise(r => setTimeout(r, 100)); // Sleep nicely
    }
    
    console.log(`Finished PERFECT downloading. Success: ${successCount}/${ids.length}`);
}

run();
