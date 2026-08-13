import fs from 'fs';
import path from 'path';

const catPath = 'src/data/categories.ts';
let categoriesRaw = fs.readFileSync(catPath, 'utf8');

const dir = 'public/productos';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const ids = [...categoriesRaw.matchAll(/id: '([^']+)', name: '([^']+)'/g)];

function translateName(n) {
    let q = n.toLowerCase();
    
    // Explicit exact mappings
    if (q === 'pato') return 'entire raw duck meat';
    if (q === 'lacón' || q === 'lacon') return 'cured pork shoulder';
    if (q === 'compango') return 'chorizo and morcilla blood sausages';
    if (q.includes('medios') && q.includes('valladolid')) return 'half raw lamb carcass';
    if (q === 'marmitakos / garbanzos') return 'pork chuck stew meat';
    if (q === 'aleta para rellenar') return 'flank steak rolled';
    
    // Generic
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
         .replace(/chorizo/g, 'thick raw chorizo sausage')
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
         
    return q.trim();
}

async function run() {
    console.log(`Generating ${ids.length} PERFECT AI images via Pollinations...`);
    
    let successCount = 0;
    
    // Concurrency of 5 to not overwhelm Pollinations, but keep it fast
    const concurrency = 5;
    for (let i = 0; i < ids.length; i += concurrency) {
        const batch = ids.slice(i, i + concurrency);
        
        await Promise.all(batch.map(async ([full, id, name]) => {
            const dest = path.join(dir, `${id}.jpg`);
            
            const engQuery = translateName(name);
            let rawPrefix = engQuery.includes('eggs') || engQuery.includes('sardines') || engQuery.includes('anchovies') ? '' : 'raw ';
            
            // Highly specific prompt to guarantee the wooden board styling and the exact meat
            const prompt = `Close-up top-down professional food photography of ${rawPrefix}${engQuery}, placed beautifully on a rustic wooden cutting board, dark moody lighting, hyper-realistic, butcher shop style`;
            
            // Random seed ensures uniqueness even if names are identical
            const seed = Math.floor(Math.random() * 1000000);
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=400&nologo=true&seed=${seed}`;
            
            try {
                const res = await fetch(url, { 
                    signal: AbortSignal.timeout(15000),
                    headers: {
                       "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0"
                    }
                });
                if (res.ok) {
                    const buffer = await res.arrayBuffer();
                    fs.writeFileSync(dest, Buffer.from(buffer));
                    successCount++;
                    console.log(`Generated AI image for: ${name}`);
                } else {
                    console.log(`Failed HTTP for: ${name}`);
                }
            } catch (e) {
                console.error(`Timeout/Error for ${name}`);
            }
        }));
        
        console.log(`Batch ${Math.floor(i/concurrency)+1}/${Math.ceil(ids.length/concurrency)} done.`);
    }
    
    console.log(`Finished AI generation. Success: ${successCount}/${ids.length}`);
}

run();
