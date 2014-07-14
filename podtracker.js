var request = require('request');
var FeedParser = require('feedparser');
var fs = require('fs');
var async = require('async');
var repl = require('repl');

// var r = repl.start({
//     prompt: "node via stdin> ",
//     input: process.stdin,
//     output: process.stdout
// });
var items = require('./items.json');
var podcasts = items.podcasts;

function newItem (podcast, item) {
    return {
        name: item[podcast.itemName],
        url: item[podcast.itemLink],
        path: ''
    };
}

var podcastGetters = podcasts.map( function (podcast) {

    return function (cb) {
        var parsefeed = new FeedParser();
        var count = 0;
        podcast.items = [];

        request(podcast.feed).pipe(parsefeed);

        parsefeed.on('readable', function () {

            var stream = this;
            var meta = stream.meta;
            var item;

            while ((item = stream.read())) {
                if (count > 3) break;
                podcast.items.push(newItem(podcast, item));
                count++;
            }

        });


        parsefeed.on('end', function () {
            cb(null);
        });

    };

});


async.parallel(podcastGetters, function (err) {

    fs.writeFile('items.json', JSON.stringify(items, null, 2));

});
