const fs = require('fs');
const buyers = {};
fs.readFile('notes/assignments.txt', 'utf8', function(err, data) {
    // We have a tab-separated list
    const lines = data.split(/[\r\n]+/);
    console.log(`Recived: ${lines.length} lines`);
    lines.forEach(line => {
        const values = line.split(/\t/);
        buyers[values[3]] = {
            'buyer': values[0],
            'hunterId': values[1],
            'wishlist': '',
        };
    });
    fs.writeFile('notes/assignments.json', JSON.stringify(buyers, null, 1), (err) => {
        if (err)
            console.log(err);
        else {
            console.log('wrote the file');
        }
    });
});
