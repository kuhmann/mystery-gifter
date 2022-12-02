const fs = require('fs');
const buyers = {};
fs.readFile('assignments.csv', 'utf8', function(err, data) {
    // We have a csv
    const lines = data.split(/[\r\n]+/);
    lines.shift();
    console.log(`Recived: ${lines.length} lines`);
    lines.forEach(line => {
        const values = split (line, ',', 9);
        if (values && values[3]) {
            buyers[values[0]] = {
                'buyer': values[1],
                'hunterId': values[2],
                'helper': values[3],
                'helperId': values[4],
                'helperDiscordId': values[5],
                'stalked': values[6] == 'true',
                'can_see_santa': values[7] == 'true',
                'wishlist': values[8].slice(1, -1).replace(/""/g, '"'),
            };
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
    const split = string.split(separator);
    if (split.length <= n)
        return split;
    const out = split.slice(0,n-1);
    out.push(split.slice(n-1).join(separator));
    return out;
}
