import fs from 'fs';
import path from 'path';

const catPath = 'src/data/categories.ts';
let categoriesRaw = fs.readFileSync(catPath, 'utf8');

const dir = 'public/productos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const ids = [...categoriesRaw.matchAll(/id: '([^']+)', name: '([^']+)'/g)];

function translateName(n) {
    let q = n.toLowerCase();
    
    // Meats
    q = q.replace(/ternera|vaca|añojo/g, 'beef')
         .replace(/cerdo|iberico|ibérico/g, 'pork')
         .replace(/cordero|lechal/g, 'lamb')
         .replace(/pollo|corral|gallina/g, 'chicken')
         .replace(/pavo/g, 'turkey')
         .replace(/conejo/g, 'rabbit')
         .replace(/codorniz|codornices/g, 'quail')
         .replace(/perdiz/g, 'partridge')
         .replace(/cochinillo/g, 'whole suckling pig')
         
    // Cuts
    q = q.replace(/lomo/g, 'loin')
         .replace(/solomillo/g, 'tenderloin steak')
         .replace(/chuleta|chuletas/g, 'chop')
         .replace(/costilla|costillas|tira de asado|churrasco/g, 'ribs')
         .replace(/pechuga/g, 'breast')
         .replace(/alitas|alas/g, 'wings')
         .replace(/muslo|traseros|patorras/g, 'thighs')
         .replace(/jamoncitos/g, 'drumsticks')
         .replace(/picada|picar/g, 'minced meat')
         .replace(/burguer|hamburguesa/g, 'burger patty')
         .replace(/croquetas/g, 'croquettes')
         .replace(/panceta|beicon|tocino|torreznos/g, 'belly bacon')
         .replace(/chorizo/g, 'raw chorizo sausage')
         .replace(/salchicha/g, 'raw sausage')
         .replace(/morcilla/g, 'blood sausage')
         .replace(/secreto/g, 'flank steak')
         .replace(/presa/g, 'shoulder steak')
         .replace(/carrillada/g, 'cheek')
         .replace(/oreja/g, 'ear')
         .replace(/careta/g, 'face')
         .replace(/lengua/g, 'beef tongue')
         .replace(/higado|higaditos/g, 'liver')
         .replace(/callos/g, 'tripe')
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
         .replace(/falda/g, 'flank')
         .replace(/aleta/g, 'flank steak')
         .replace(/huesos|esqueletos/g, 'bones')
         .replace(/pierna/g, 'leg')
         .replace(/paletilla/g, 'shoulder')
         .replace(/medios enteros/g, 'half carcass')
         .replace(/cuarto delantero/g, 'forequarter')
         .replace(/cuarto trasero/g, 'hindquarter')
         .replace(/manitas/g, 'trotters')
         .replace(/cabeza/g, 'head')
         .replace(/asadura/g, 'offal')
         .replace(/mollejas/g, 'sweetbreads')
         .replace(/sesos/g, 'brains')
         .replace(/morro/g, 'snout')
         .replace(/huevos|huevo/g, 'eggs')
         .replace(/anchoas|boquerones/g, 'anchovies')
         .replace(/sardinas/g, 'sardines')
         .replace(/adobada|adobadas/g, 'marinated')
         
    return q.trim();
}

async function run() {
    console.log(`Downloading ${ids.length} specific English-translated photos from Bing...`);
    
    let successCount = 0;
    
    const batchSize = 10;
    for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        await Promise.all(batch.map(async ([full, id, name]) => {
            const dest = path.join(dir, `${id}.jpg`);
            
            const engQuery = translateName(name);
            // Search Bing with rigid English keywords
            const query = encodeURIComponent(`"raw ${engQuery}" on wooden cutting board food photography -shutterstock`);
            const url = `https://www.bing.com/images/search?q=${query}&form=HDRSC3`;
            
            try {
                const res = await fetch(url, {
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
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
                }
            } catch (e) {
                console.error(`Error querying Bing for ${name}`);
            }
        }));
        
        console.log(`Batch ${Math.floor(i/batchSize)+1}/${Math.ceil(ids.length/batchSize)} done.`);
        await new Promise(r => setTimeout(r, 600)); 
    }
    
    console.log(`Finished downloading SPECIFIC images. Success: ${successCount}/${ids.length}`);
}

run();
