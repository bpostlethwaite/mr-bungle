var spawn = require( 'child_process' ).spawn;
var util = require('util');

function Player () {

    var mplayer = {};

    if (!(this instanceof Player)) {
        return new Player();
    }

    function pause() {
        if ('stdin' in mplayer && mplayer.stdin.writable) {
            mplayer.stdin.write( 'p\n' );
        }
    };

    function quit () {
        if ('stdin' in mplayer && mplayer.stdin.writable) {
            mplayer.stdin.write( 'q\n' );
        }
    };

    function play (file) {
        var lastplayer = mplayer;
        var args = [ '-slave' ];
        if (file.substr(0,4) === 'http') args = ['-slave', '-playlist', file];
        else args = [ '-slave', file ];

        if (!file) throw new Error ('must supply a file to play');
        if ('killed' in mplayer && !mplayer.killed) {
            quit();
            process.nextTick( function () {
                lastplayer.kill('SIGHUP');
            });
        }
        mplayer = spawn( 'mplayer', args );
    }


    this.play = play;
    this.pause = pause;
    this.quit = quit;

    return this;
}


module.exports = Player;
