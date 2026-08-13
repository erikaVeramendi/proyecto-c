import fs from 'fs';

async function test() {
    const query = encodeURIComponent("Lomo de Vaca carne cruda");
    const url = `https://images.search.yahoo.com/search/images?p=${query}`;
    const res = await fetch(url);
    const html = await res.text();
    
    fs.writeFileSync('yahoo_test.html', html);
    
    // Look for src='http' or data-src='http' 
    const matches = [...html.matchAll(/<img[^>]+src=['"](http[^'"]+)['"]/g)];
    const dataMatches = [...html.matchAll(/<img[^>]+data-src=['"](http[^'"]+)['"]/g)];
    
    console.log("Sources:", matches.slice(0, 3).map(m=>m[1]));
    console.log("Data sources:", dataMatches.slice(0, 3).map(m=>m[1]));
}
test();
