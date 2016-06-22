/**
 * Created by jrnel on 6/20/2016.
 */
// Create instances of Model, Control, and View objects
var gameView = new SudokuView();
var gameControl = new SudokuControl();
var gameModel = new SudokuModel();

// For this version, the grid is a standard 9 x 9 cell puzzle
var defaultGridLength = 9;
var easyPreview = [[0,2,0,9,8,0,0,0,0],
    [0,1,4,0,0,0,0,7,0],
    [0,0,5,4,0,0,0,3,0],
    [4,0,0,0,0,8,0,1,5],
    [0,9,0,5,4,2,7,0,0],
    [0,0,2,0,0,6,0,8,0],
    [0,4,1,8,0,0,0,0,0],
    [8,0,0,0,0,0,1,0,4],
    [7,0,9,0,3,0,8,0,6]];
var medPreview = [[0,0,0,1,0,0,0,4,0],
    [0,1,0,0,0,0,7,0,0],
    [0,0,9,7,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,6],
    [8,4,3,6,0,5,2,0,0],
    [0,0,1,0,0,0,0,0,5],
    [0,0,4,0,2,0,0,0,0],
    [0,8,0,9,6,1,0,2,4],
    [6,0,2,0,4,0,0,0,9]];
var hardPreview = [[0,0,0,3,0,0,0,0,4],
    [0,0,0,1,7,0,2,3,0],
    [0,2,0,0,0,0,7,0,0],
    [0,0,6,5,2,0,0,0,8],
    [0,0,0,0,8,0,0,0,0],
    [7,9,0,0,1,0,5,0,0],
    [0,8,0,0,3,6,0,0,7],
    [0,0,0,0,0,8,0,0,0],
    [0,4,0,2,0,0,0,0,9]];
var crazyPreview = [[0,0,0,0,0,0,0,0,4],
    [0,5,0,0,0,0,0,0,0],
    [7,0,8,0,0,4,0,2,1],
    [0,0,0,0,0,8,0,0,0],
    [0,0,0,0,7,6,0,0,0],
    [0,3,2,0,0,0,7,5,0],
    [6,0,0,0,5,9,0,0,3],
    [1,2,4,0,6,0,0,9,0],
    [0,9,0,0,4,0,0,0,0]];

// On Document Ready Event (Script Start)
$(document).ready(function () {
    // Get Width, Height, and detect whether browser is mobile or desktop
    gameView.getBrowserInfo();

    // Setup events for Startup Screen
    gameView.setupStartScreen();

    var $subMenu = $("#selDropCont");
    var $menuText = $("#selText");

    // Make Startup Screen fade in
    $("#startPage").css({"opacity": "1"});

    // Create 9x9 Game Grid
    gameView.drawGameGrid(defaultGridLength, defaultGridLength);

    // If on a small screen or minimized screen (less than 600px), reorganize toolbar
    if($(window).width() < 600) {
        $("#middleButtons").append($("#help")).css({"float": "right"});
    }

    // Make toolbar and display area visible after 0.5s delay
    setTimeout(function () {
        $("#displayArea").css({"opacity": "1"});
        $("#toolbar").css({"visibility": "visible"});
    },500);

    // Click event for game view back button
    $("#back").click(function () {
        gameView.slideStartOpen();
    });

    $("#startBtn").click(function () {
        gameView.slideStartClose();

        //TODO: Implement Start Button Puzzle Gen and Load
        /*setTimeout(function() {
         if (gameView.loaded() == false && gameModel.completed() == false) {
         if ($("#selText").innerHTML == "Difficulty") {
         $("#selText").html("Medium");
         }
         document.getElementById("puzzleDiffText").innerHTML = document.getElementById("selText").innerHTML;
         gameView.showLoading();
         setTimeout(function() {
         gameControl.loadSelectedPuzzle();
         }, 300);
         }
         },350);*/
    });

    $menuText.click(function () {
        $subMenu.slideDown(300).css({"opacity": "1"});
    });

    $(".selOpt").click(function () {
        $subMenu.slideUp(300).css({"opacity": "0"});
        $menuText.text($(this).text());
        gameModel.setDifficulty($(this).text().toLowerCase());
        $(".prevCell").text("").css({"opacity": "1"});
        setTimeout(function() {
            if ($menuText.text() == "Easy")
                gameView.loadPreview(easyPreview);
            else if ($menuText.text() == "Medium")
                gameView.loadPreview(medPreview);
            else if ($menuText.text() == "Hard")
                gameView.loadPreview(hardPreview);
            else if ($menuText.text() == "Crazy")
                gameView.loadPreview(crazyPreview);
        }, 300);
    });

    // Window Resize event
    $(window).resize(function () {
        gameView.resizeView();
    });
});

// Sudoku Model Object
function SudokuModel() {
    //
    // Model Data
    //
    var currentDifficulty = "medium";

    //
    // Model Methods
    //

    // SudokuModel.difficulty()
    // Returns current puzzle difficulty level
    this.difficulty = function () {
        return currentDifficulty;
    };

    // SudokuModel.setDifficulty()
    // Sets current puzzle difficulty level
    this.setDifficulty = function (_selection) {
        currentDifficulty = _selection;
    };

}

// Sudoku Control Object
function SudokuControl(){

}

// Sudoku View Object
function SudokuView() {
    var isMobile;
    var viewWidth;
    var viewHeight;
    var cellSize = 0;
    var startOpen;
    var $startScreen;
    var $gameCells;

    var fontNormal;
    var fontBold;
    var fontNote;

    var lastHighlighted;
    var highToggle = false;
    var popUpVisible = false;
    var puzzleLoaded = false;
    var clickTimer = null;
    var inputGridVisible = false;

    var gridBlurred = false;

    this.setupStartScreen = function () {
        startOpen = true;
        $startScreen = $("#startPage");
        $startScreen.css({"width": $(window).width() + "px"});

        var $subMenu = $("#selDropCont");
        $subMenu.hide();
        var $menuText = $("#selText");
        $subMenu.css({"visibility": "visible"});
        $(".selOpt").css({"visibility": "visible"});


        // Add Difficulty Preview Grid
        drawPreviewGrid(9,9);
        gameView.loadPreview(medPreview);

        function drawPreviewGrid(_rows, _columns) {
            for (var i = 0; i < _rows; i++) {
                $("#previewGrid").append('<div id=\"prevRow' + i + '\" class=\"prevRow\">');
                for (var j = 0; j < _columns; j++) {
                    $(".prevRow:last").append('<div id=\"prev' + i + 'x' + j + '\" class=\"gridCell prevCell\">');

                    var $currentCell = $(".prevCell:last");

                    if (i == 0) {
                        $currentCell.css({"border-top": "solid black"});
                    }
                    else if ((i + 1) % Math.sqrt(_rows) == 0) {
                        $currentCell.css({"border-bottom": "solid black"});
                    }
                    else {
                        $currentCell.css({"border-color": "black"});
                    }

                    if (j == 0)
                        $currentCell.css({"border-left": "solid black"});
                    else if ((j + 1) % Math.sqrt(_columns) == 0)
                        $currentCell.css({"border-right": "solid black"});
                }
            }
            var prevCellSize;
            var prevGridSize;
            gameView.getBrowserInfo();
            // Define the CSS style of gameGrid to have a black border with curved corners and a white background
            if(gameView.getViewWidth() < gameView.getViewHeight()) {
                if (gameView.getIsMobile() && $(window).width() < 420){
                    prevGridSize = gameView.getViewWidth() * 0.7;
                    prevCellSize = ((prevGridSize/9));
                }
                else {
                    prevGridSize = gameView.getViewWidth() * 0.5;
                    prevCellSize = ((prevGridSize/9));
                }
            }
            else if (gameView.getViewWidth() > gameView.getViewHeight())
            {
                prevGridSize = gameView.getViewHeight() * 0.5;
                prevCellSize = ((prevGridSize/9));
            }

            if (gameView.getViewWidth() < 420)
                $(".prevCell").css({"font-weight": "bold"});

            $(".prevCell").css({
                "height": prevCellSize + "px",
                "width": prevCellSize + "px",
                "font-size": prevCellSize - 14 + "px",
                "unselectable": "on",
                "vertical-align": "middle"

            });
            console.log(prevGridSize);
            console.log(prevCellSize);
        }
    };

    this.loadPreview = function(_passedPuzzle) {
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                if (_passedPuzzle[x][y]!= 0)
                    $("#prev" + x + "x" + y).append('<div class=\"previewGivenNums\">'+_passedPuzzle[x][y]+'</div>');
            }
        }
        setTimeout(function() {
            $(".previewGivenNums").css({"opacity": "1"});
        }, 50);
    };

    this.slideStartClose = function() {
        startOpen = false;
        var currentStartWidth = parseInt($startScreen.css("width"));
        console.log(currentStartWidth);
        $startScreen.animate({left: '-='+ currentStartWidth + "px"}, 500);

        setTimeout(function() {
            $startScreen.css({"visibility": "hidden"});
        },510);
    };

    this.slideStartOpen = function() {
        startOpen = true;
        $startScreen.css({"visibility": "visible", "width": $(window).width()+"px"});
        $startScreen.animate({left: "0px"}, 500);
    };

    this.drawGameGrid = function (_rows, _columns) {
        var $gameGrid = $("#gameGrid");
        for (var i = 0; i < _rows; i++) {
            $gameGrid.append('<div id=\"row' + i + '\" class=\"gridRow\">');
            var $currentRow = $(".gridRow:last");
            for (var j = 0; j < _columns; j++) {
                $currentRow.append('<div id=\"' + i + 'x' + j + '\" class=\"gridCell gameCell\">');

                var $currentCell = $(".gameCell:last");

                if (i == 0) {
                    $currentCell.css({"border-top": "solid black"});
                }
                else if ((i + 1) % Math.sqrt(_rows) == 0) {
                    $currentCell.css({"border-bottom": "solid black"});
                }
                else {
                    $currentCell.css({"border-color": "black"});
                }

                if (j == 0)
                    $currentCell.css({"border-left": "solid black"});
                else if ((j + 1) % Math.sqrt(_columns) == 0)
                    $currentCell.css({"border-right": "solid black"});
            }
        }
        this.resizeView();
    };

    this.resizeView = function() {
        var cellSize;
        var gridSize;
        this.getBrowserInfo();

        if (startOpen == false)
            $startScreen.css({"left": (0 - $(window).width()) + "px", "top": "0"});
        $startScreen.css({"width": $(window).width() + "px", "height": $(window).height() + "px"});


        // Define the CSS style of gameGrid to have a black border with curved corners and a white background
        if(this.getViewWidth() < this.getViewHeight()) {
            if (gameView.getIsMobile() && $(window).width() < 420){
                gridSize = this.getViewWidth() * 0.9;
                cellSize = ((gridSize/9));
                gameView.setCellSize(cellSize);
            }
            else {
                gridSize = this.getViewWidth() * 0.8;
                cellSize = ((gridSize/9));
                gameView.setCellSize(cellSize);
            }
        }
        else if (this.getViewWidth() > this.getViewHeight())
        {
            gridSize = this.getViewHeight() * 0.75;
            cellSize = ((gridSize/9));
            gameView.setCellSize(cellSize);
        }

        fontNormal = cellSize - 14 + "px";
        fontBold = cellSize - 10 + "px";
        //cell.style.fontSize = fontNormal;
        //cell.setAttribute("unselectable", "on");

        $(".gameCell").css({
            "height": gameView.getCellSize() + "px",
            "width": gameView.getCellSize() + "px",
            "font-size": fontNormal+ "px",
            "unselectable": "on",
            "opacity": "1"
        });
        console.log(gridSize);
        console.log(cellSize);

        /*for (var i = 0; i < numOfRows; i++) {
            if (i == 0) {
                row.setAttribute("style", "border-top: solid; border-color: black;");
            }
            else if ((i + 1) % Math.sqrt(numOfRows) == 0) {
                row.setAttribute("style", "border-bottom: solid; border-color: black;");
            }
            else {
                row.setAttribute("style", "border-color: black;");
            }

            for (var j = 0; j < numOfColumns; j++) {
                var cell = document.createElement("TD");
                cell.setAttribute("class", "gridCell gameCell");
                cell.style.height = cellSize + "px";
                cell.style.width = cellSize + "px";
                fontNormal = cellSize - 14 + "px";
                fontBold = cellSize - 10 + "px";
                cell.style.fontSize = fontNormal;
                cell.setAttribute("unselectable", "on");

                if (j == 0)
                    cell.style.borderLeft = "solid black";
                else if ((j + 1) % Math.sqrt(numOfColumns) == 0)
                    cell.style.borderRight = "solid black";
                row.appendChild(cell);
            }
        }*/

        //TODO: Script resizing preview grid
        //TODO: Script resizing font sizes
    };

    this.getBrowserInfo = function() {
        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        var is_android = navigator.platform.toLowerCase().indexOf("android") > -1;
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || is_firefox && is_android)
            gameView.setIsMobile(true);
        else
            gameView.setIsMobile(false);
        console.log("isMobile = " + gameView.getIsMobile());
        setViewHeight(window.innerHeight);
        setViewWidth(window.innerWidth);
    };

    this.getCellSize = function () {
        return cellSize;
    };

    this.setCellSize = function (_size) {
        cellSize = _size;
    };

    this.getIsMobile = function() {
        return isMobile;
    };

    function setViewHeight(_viewHeight) {
        viewHeight = _viewHeight
    }

    function setViewWidth(_viewWidth) {
        viewWidth = _viewWidth;
    }

    this.getViewWidth = function() {
        return viewWidth;
    };

    this.getViewHeight = function() {
        return viewHeight;
    };

    this.setIsMobile = function (_bool) {
        isMobile = _bool;
    };
}