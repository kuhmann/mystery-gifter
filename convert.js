const fs = require('fs');
const buyers = {};

// The format of this file is that it is tab-separated (watch your editor) and has the following fields:
// 0: Buyer discord id 
// 1: anything
// 2: anything
// 3: Recipient discord id
// 4: Recipient hunter id
// 5: Helper elf name
// 6: Helper elf hunter id
// 7: Helper elf discord id
fs.readFile('notes/assignments.txt', 'utf8', function(err, data) {
    const lines = data.split(/[\r\n]+/);
    console.log(`Recived: ${lines.length} lines`);
    lines.forEach(line => {
        const values = line.split(/\t/);
        if (values && values.length == 8) {
            buyers[values[3]] = {
                'buyer': values[0],
                'hunterId': values[4],
                'wishlist': '',
                'helper': values[5],
                'helperId': values[6],
                'helperDiscordId': values[7],
            };
        }
    });
    fs.writeFile('notes/assignments.json', JSON.stringify(buyers, null, 1), (err) => {
        if (err)
            console.log(err);
        else {
            console.log('wrote the file');
        }
    });
});
