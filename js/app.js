// app.js main java script file

"use strict";

var timer;
var missed = 0;
var matches = 0;
var remaining = 8;
var elapsedTime = 0;
var turnCount = 0;
var tempTileNum = null;

//creates the array to tiles
var tiles = [];
var i;
for (i = 1; i <= 32; i++) {
    tiles.push({
        tileNum: i,
        src: 'img/tile' + i + '.jpg',
        flipped: false,
        matched: false
    });
} // for each tile


//gets the game ready and runs it
function runGame() {
    var startTime = _.now();
    //manages information at top of game
    timer = window.setInterval(function () {
        elapsedTime = Math.floor((_.now() - startTime) / 1000);
        $('#missed').text('Missed: ' + missed);
        $('#matches').text('Matches: ' + matches);
        $('#remaining').text('Remaining: ' + remaining);
        $('#elapsed-seconds').text('Elapsed Time: ' + elapsedTime);
    }, 1000);

    //shuffles tiles and clones them
    tiles = _.shuffle(tiles);
    var toUse = tiles.slice(0, 8);
    var pairs = [];
    _.forEach(toUse, function (tile) {
        pairs.push(tile);
        pairs.push(_.clone(tile));
    });
    pairs = _.shuffle(pairs);

    //plays the game
    var gameBoard = $('#gameBoard');
    gameBoard.empty();
    var img;
    var row = $(document.createElement('div'));
    _.forEach(pairs, function (tile, elemIndex) {
        if (elemIndex > 0 && elemIndex % 4 == 0) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);

    var turnPart = 0;
    var lastTile;
    var lastImage;
    var stop = null;
    $('#gameBoard img').click(function () {
        if (stop != null) {
            if (!lastImage.flipped) {
                window.setTimeout(function () {
                    clearTimeout(timeOut);
                    timeOut = null;
                }, 1000);
            }
            return;
        }
        var img = $(this);
        var tile = img.data('tile');
        if (tile.flipped) {
            return;
        }
        turnPart++;
        if (turnPart % 2 == 0) {
            turnCount++;
            turnPart = 0;
            flipTile(tile, img);
            if (tile.tileNum == lastTile.tileNum) {
                matches++;
                remaining--;
            } else {
                missed++;
                stop = window.setTimeout(function () {
                    flipTile(tile, img);
                    flipTile(lastTile, lastImage);
                    stop = null;
                }, 1000);
            }
        } else {
            lastImage = $(this);
            lastTile = lastImage.data('tile');
            flipTile(lastTile, lastImage);
        }
        if (matches == 8) {
            var win = Math.floor(elapsedTime);
            window.alert("Congratulations, you won in " + win + "seconds.")
        }
    });

    //Starts or restarts the game
    $('#startGame').click(function() {
        clearInterval(timer);
        clearInterval(stop);
        elapsedTime = 0;
        startTime = _.now();
        matches = 0;
        turnCount = 0;
        remaining = 8;
        missed = 0;
        runGame();
    });
}

//flips a tile
function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}

// when document is ready
$(document).ready(function() {
    runGame();
});