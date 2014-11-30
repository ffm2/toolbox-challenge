"use strict";
//when the page loads, create the game board and add the click handlers
$(document).ready(function() {

    var tiles = [];//array collection of tiles in the game
    var idx;//index counter for for loop to create image tiles
    var timer;//timer object
    var firstImage = null;
    var matches = 0;
    var remaining = 8;
    var missed = 0;

    //click handler to the rules button
    $('#rulesbutton').click(function() {
        //display game rules when user clicks the Brain Game Rules button
        $('#game-stuff-modal').modal();
    });


    //start at tile 1 a tile hasn't been created yet
    for (idx = 1; idx <= 32; ++idx) {
        //push adds new element to array
        tiles.push({
            //new properties of our new object (keys and values)
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg',
            flipped: false
        });
    }
    //display tiles
    console.log(tiles);
    var gameBoard = $('#game-board');

    //invoke resetGame method and start game over
    resetGame(tiles);

    //click handler for my start thinking button that starts the timer and wipes the tiles to begin a new game
    //every time
    $('#startgamebutton').click(function() {

        //resets my timer and user's results
        window.clearInterval(timer);
        $('#matches').text('Matches: 0');
        $('#remaining').text('Remaining: 8');
        $('#missed').text('Missed: 0');

        //wipes my tiles' images
        resetGame(tiles);

        //timer begins again
        beginTiming();
    });

    //start the timer (refreshing ever second)
    function beginTiming() {
        window.clearInterval(timer);
        var startTime = _.now();
        timer = window.setInterval(function() {
            //floor rounds it down to nearest integer from any decimal number
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text("Elapsed Time: " + elapsedSeconds + " seconds");
        }, 1000);
    }

    //start a new game by resetting statistics and create a new gameboard with
    //different tiles
    function resetGame(tiles) {
        //empties my gameboard
        gameBoard.empty();

        var shuffledTiles =_.shuffle(tiles);
        console.log(shuffledTiles);

        //you slice eight not seven because the last element is non-inclusive
        var selectedTiles = shuffledTiles.slice(0, 8);

        //display sliced tiles
        console.log(selectedTiles);

        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            //add same image twice to create a match/pair
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });

        tilePairs = _.shuffle(tilePairs);

        console.log(tilePairs);

        gameBoard = $('#game-board');//grid that creates the gameboard grid
        var row = $(document.createElement('div'));
        var img;

        //array element and numeric parameters (second parameter is optional)
        _.forEach(tilePairs, function(tile, elemIndex) {

            //put the static value on the left so you don't make mistake
            if (elemIndex > 0 && 0 == elemIndex % 4) {
                //create rows of gameboard grid
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }

            //display back of tile and image on front of tile
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'image of tile ' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);

        firstImage = null;
        matches = 0;
        remaining = 8;
        missed = 0;
        timer = null;

        //adds event listener for newTurn
        $('#game-board img').click(newTurn);//on click of gameboard images
    }

    //flips my tiles
    function flippingTiles(img) {

        //.data method gives me a way of associating any sort of data I want with
        //any HTML element
        var tile = img.data('tile');

        //flips my tiles from back to front and front to back depending on if they are matches or missed
        img.fadeOut(100, function() {
            if (tile.flipped) {
                img.attr('src', 'img/tile-back.png');
            }
            else {
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.fadeIn(100);
        });//after fadeOut
    }//end of flippingTile function

    //enforce game rules after user chooses tile
    function newTurn() {

        //if the tile can be flipped over
        if($(this).data('tile').flipped) {
            return;
        }

        //if this is the first tile clicked on
        else if (firstImage == null) {

            //display the same image twice
            firstImage = $(this);
            console.log(firstImage);
            flippingTiles(firstImage);
        }
        else {
            var secondImage = $(this);
            console.log(secondImage);
            flippingTiles(secondImage);
            //compares two tiles
            var match = comparePics(firstImage, secondImage);

            //compare first and second images
            if (match) {

                //update statistics
                ++matches;
                --remaining;

                //displays my id's with their labels concatenated on the webpage
                $('#matches').text("Matches: " + matches);
                $('#remaining').text("Remaining: " + remaining);
                firstImage = null;
                if (matches == 8) {
                    //let the user that time is up and the game is over
                    $('#congrats-modal').modal();
                }
            }

            else {
                //increase missed because the user clicked on two different images
                ++missed;
                //set tile back to grey image tile
                var currFirst = firstImage;
                //update missed on results
                $('#missed').text("Missed: " + missed);

                //calls this function after 1000 milliseconds (flips tile after a while)
                window.setTimeout(function() {
                    flippingTiles(currFirst);
                    flippingTiles(secondImage);
                    firstImage = null;
                }, 1000);
            }
        }
    }

    //compares image1 and image2 and returns true to help manipulate keeping them facing up
    function comparePics(image1, image2) {
        return image1.data('tile').tileNum == image2.data('tile').tileNum;
    }
})