var chokidar = require('chokidar');
var watcher = chokidar.watch('items.json', {ignored: /[\/\\]\./, persistent: true});
var fs = require('fs');
var crypto = require('crypto');
var itemsFile = 'items.json';
var itemhash = '';

function getHash( cb ) {
    // the file you want to get the hash
    var fd = fs.createReadStream(itemsFile);
    var hash = crypto.createHash('sha1');

    hash.setEncoding('hex');

    fd.on('end', function() {
        hash.end();
        cb(hash.read()); // the desired sha1sum
    });

    // read all file and pipe it (write it) to the hash object
    fd.pipe(hash);

}


getHash( function (hashString) {
    itemhash = hashString;
});



watcher.on('change', function () {
    getHash( function (hashString) {
        if (hashString !== itemhash) {
            console.log(itemsFile, 'changed');
            itemhash = hashString;
        }
        else console.log(itemsFile, 'unchanged');
    });
});
