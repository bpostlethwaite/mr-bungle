var request = require('request');
var FeedParser = require('feedparser');
var fs = require('fs');
var parsefeed = new FeedParser();
var repl = require('repl');
var player = require('./player')();
var r = repl.start({
    prompt: "node via stdin> ",
    input: process.stdin,
    output: process.stdout
});

var ITEMS = [];

r.context.player = player;

request('http://www.cbc.ca/podcasting/includes/qpodcast.xml').pipe(parsefeed);

parsefeed.on('readable', function () {

    var stream = this;
    var meta = stream.meta;
    var item;

//    console.log(meta);

    while ((item = stream.read())) {
//        r.context.item = item;
        ITEMS.push(item.permalink);
//        console.log(item.permalink);
    }



});


parsefeed.on('end', function () {
    //request(ITEMS[0]).pipe(fs.createWriteStream('tmp.mp3'));
});
