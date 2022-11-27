const fs = require('fs');
const buyers = {};
fs.readFile('assignments.csv', 'utf8', function(err, data) {
    // We have a csv
    const lines = data.split(/[\r\n]+/);
    lines.shift();
    console.log(`Recived: ${lines.length} lines`);
    lines.forEach(line => {
        const values = split (line, ',', 8);
        if (values && values[3]) {
            buyers[values[0]] = {
                'buyer': values[1],
                'hunterId': values[2],
                'helper': values[3],
                'helperId': values[4],
                'stalked': values[5],
                'can_see_santa': values[6],
                'wishlist': values[7],
            };
            console.log(`Wishlist was: ${values[7]}`);
        }
    });
    fs.writeFile('notes/assignments2.json', JSON.stringify(buyers, null, 1), (err) => {
        if (err)
            console.log(err);
        else {
            console.log('wrote the file');
        }
    });
});

function split(string,separator,n) {
    var split = string.split(separator);
    if (split.length <= n)
        return split;
    var out = split.slice(0,n-1);
    out.push(split.slice(n-1).join(separator));
    return out;
}
