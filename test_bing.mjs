import fs from 'fs';
async function test() {
    const query = encodeURIComponent("carne cruda Lomo De Vaca");
    const url = `https://www.bing.com/images/search?q=${query}`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    });
    const html = await res.text();
    fs.writeFileSync('bing_test.html', html);
    
    // Bing images usually have m="{murl:'http...'}"
    const matches = [...html.matchAll(/&quot;murl&quot;:&quot;([^&]+)&quot;/g)];
    console.log("Found matches:", matches.length);
    if (matches.length > 0) console.log(matches[0][1]);
}
test();
