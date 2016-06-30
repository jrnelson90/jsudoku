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
        setTimeout(function () {
            gameControl.resetGameTable();
        },350);
    });

    $("#startBtn").click(function () {
        gameView.slideStartClose();
        // setTimeout(function() {
        //     gameControl.loadSelectedPuzzle();
        // }, 500);
        //TODO: Implement Start Button Puzzle Gen and Load

        setTimeout(function() {
             if (gameView.loaded() == false && gameModel.completed() == false) {
                 if ($("#selText").text() == "Difficulty") {
                    $("#selText").text("Medium");
                 }
                $("#puzzleDiffText").text($("#selText").text());
                //gameView.showLoading();
                setTimeout(function() {
                    gameControl.loadSelectedPuzzle();
                }, 300);
             }
         },350);
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

    $(".gameCell").click(function () {
        gameControl.clickCell(this);
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
    var numOfInputs;
    var filledInputs;
    var tableRowsNum;
    var tableColumnsNum;

    var gameGrid;
    var gameTable;
    var puzzleCompleted;
    var generatedPuzzle = null;
    var currentStart = [];
    var currentSolution = [];
    var startingTime;
    var endTime;
    var inputGrid;

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

    this.inputNum = function () {
        return numOfInputs;
    };

    this.setInputNum = function (_inputNum) {
        numOfInputs = _inputNum;
    };

    this.filled = function () {
        return filledInputs;
    };

    this.setFilledInputs = function (_numFilled) {
        filledInputs = _numFilled;
    };

    this.setRows = function (_rowsNum) {
        tableRowsNum = _rowsNum;
    };

    this.rowsNum = function () {
        return tableRowsNum;
    };

    this.setColumnNum = function (_columnsNum) {
        tableColumnsNum = _columnsNum;
    };

    this.columnsNum = function () {
        return tableColumnsNum;
    };

    this.table = function () {
        return gameTable;
    };

    this.setGameTable = function (_table) {
        gameTable = _table;
    };

    this.grid = function () {
        return gameGrid;
    };

    this.setGameGrid = function (_grid) {
        gameGrid = _grid;
    };

    this.completed = function () {
        return puzzleCompleted;
    };

    this.setCompleted = function (_puzzleState) {
        puzzleCompleted = _puzzleState;
    };

    this.puzzle = function() {
        return generatedPuzzle;
    };

    this.setPuzzle = function(_genPuz) {
        generatedPuzzle = _genPuz;
    };

    this.solution = function () {
        return currentSolution;
    };

    this.starter = function () {
        return currentStart
    };

    this.setStarter = function (_array) {
        currentStart = _array;
    };

    this.setInputGrid = function (_inputGrid) {
        inputGrid = _inputGrid;
    };

    this.inputGrid = function () {
        return inputGrid;
    };

    this.setStart = function (_start) {
        startingTime = _start;
    };

    this.startTime = function () {
        return startingTime;
    };

    this.setEndTime = function(_time){
        endTime = _time;
    };

    this.endTime = function() {
        return endTime;
    };

}

// Sudoku Control Object
function SudokuControl(){
    var lastClicked;
    var viewUpdateInterval;
    var checkToggle = false;
    var noteMode = false;
    var paused = false;
    var currentTimeElapsed;
    var pausedTimeStart;
    var pausedTimeStop;
    var pausedTimeElapsed;

    this.loadSelectedPuzzle = function () {
        if (gameModel.difficulty() == "easy")
            gameModel.setPuzzle(genPuzzle("Easy"));

        else if (gameModel.difficulty() == "medium")
            gameModel.setPuzzle(genPuzzle("Medium"));

        else if (gameModel.difficulty() == "hard")
            gameModel.setPuzzle(genPuzzle("Hard"));

        else if (gameModel.difficulty() == "crazy")
            fetchPuzzle("crazypuzzles.json");
        gameView.loadPuzzle(gameModel.puzzle().getGiven());
    };

    function fetchPuzzle(_difficulty) {
        var xmlhttp;
        var returnedPuzzles;
        var randNum = Math.floor((Math.random() * 1000)) % 10;
        console.log(randNum);
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                returnedPuzzles = JSON.parse(xmlhttp.responseText);
                var retrivedPuzzle = new Puzzle(returnedPuzzles[randNum].start, returnedPuzzles[randNum].solution);
                gameModel.setPuzzle(retrivedPuzzle);
            }
        };
        xmlhttp.open("GET", _difficulty, true);
        xmlhttp.send();
    }

    this.resetGameTable = function () {
        /*if(gameView.getInputVisibility()== true) {
            var input = document.body.querySelector("#inputBorder");
            input.parentNode.removeChild(input);
            gameView.setInputVisibility(false);
        }
        if(gameControl.noteMode() == true) {
            gameControl.editClick();
        }*/
        //gameModel.table().parentNode.removeChild(gameModel.table());
        $(".puzzleNum").remove();
        $(".inputNum").remove();

        // gameView.drawGameGrid(9, 9);
        gameView.setLoaded(false);
        // document.getElementById("checkIcon").setAttribute("class", "material-icons inactive");
        // document.getElementById("check").removeEventListener("click", gameControl.checkClick);
    };

    this.clickCell = function (clickedCell) {
        if(gameView.selectToggle() == true)
            gameView.collapseSelect();
        if (typeof lastClicked != 'undefined' && lastClicked != clickedCell) {
            gameView.unhighlight(lastClicked);
            if (gameView.getInputVisibility() == true) {
                gameView.closeInputGrid();
            }
        }
        //gameView.highlight(clickedCell);
        if (gameView.getInputVisibility() == false) {
            gameView.openInputGrid(clickedCell);
        }
        lastClicked = clickedCell;
    };

    this.noteMode = function() {
        return noteMode;
    };

    //**********************
    // Needs to be rewritten
    //**********************


    this.initInputGrid = function () {
        var inputBorder = document.createElement("DIV");
        inputBorder.setAttribute("id", "inputBorder");
        inputBorder.style.display = "none";
        inputBorder.style.visibility = "hidden";
        inputBorder.style.width = "80px";
        document.body.insertBefore(inputBorder, document.getElementById("displayArea"));
        inputBorder.style.top = 0;
        inputBorder.style.left = 0;

        if(!(gameView.getIsMobile() && document.body.offsetWidth < 420)) {
            var close = closeBtn();
            close.style.zIndex = "100";
            close.onclick = function () {
                gameView.closeInputGrid();
            };
            inputBorder.appendChild(close);
        }

        var newInput = document.createElement("DIV");
        newInput.style.zIndex = 2;
        newInput.style.width = "80px";
        newInput.setAttribute("id", "inputGrid");
        gameModel.setInputGrid(newInput);

        inputBorder.appendChild(gameModel.inputGrid());

        var inNumCont = document.createElement("DIV");
        inNumCont.setAttribute("id", "numberCont");
        gameModel.inputGrid().appendChild(inNumCont);

        for (var i = 0; i < 9; i++) {
            var selectNum = document.createElement("DIV");
            selectNum.setAttribute("class", "numSelect");
            var optText = i + 1;
            selectNum.innerHTML = optText.toString();
            inNumCont.appendChild(selectNum);
            if ((i + 1) % 3 == 0) {
                var newLine = document.createElement("BR");
                inNumCont.appendChild(newLine);
            }
        }

        var clearButton = document.createElement("div");
        clearButton.setAttribute("id", "clearButton");
        clearButton.style.color = "rgba(255, 255, 255, 1.0)";
        clearButton.style.cursor = "pointer";
        clearButton.innerHTML = "<i class='material-icons'>block</i>";
        inNumCont.appendChild(clearButton);

        clearButton.onclick = function () {
            if(isNaN(parseInt(gameControl.lastClick().innerHTML)) == false) {
                var filled = gameModel.filled();
                filled--;
                gameModel.setFilledInputs((filled));
                if(filled == 0) {
                    document.getElementById("checkIcon").setAttribute("class", "material-icons inactive");
                    var checkButton = document.getElementById("check");
                    checkButton.removeEventListener("click", gameControl.checkClick);
                }
            }
            gameControl.lastClick().innerHTML = "";
            gameView.closeInputGrid();
        };

        //
        gameView.setInputVisibility(false);

        //Set event listeners for when numbers are clicked
        for (i = 0; i < 9; i++) {
            var numbers = document.getElementsByClassName("numSelect");
            numbers[i].onclick = function () {
                if (gameControl.noteMode() == false) {

                    if (gameControl.lastClick().style.color == "red") {
                        gameControl.lastClick().style.color = "#1c86ee";
                    }
                    if (isNaN(parseInt(gameControl.lastClick().innerHTML)) == true) {
                        var filled = gameModel.filled();
                        if (filled == 0) {
                            document.getElementById("checkIcon").setAttribute("class", "material-icons");
                            var checkButton = document.getElementById("check");
                            checkButton.addEventListener("click", gameControl.checkClick);
                        }
                        filled++;
                        gameModel.setFilledInputs((filled));
                    }

                    if (gameControl.lastClick().style.fontSize == gameView.textBold()) {
                        gameControl.lastClick().style.fontSize = gameView.textNorm();
                        gameControl.lastClick().style.fontWeight = "normal";
                    }
                    gameControl.lastClick().innerHTML = this.innerHTML;
                    gameView.closeInputGrid();

                    if (gameControl.lastClick().innerHTML == gameView.lastHighlight() && gameView.highToggle() == true) {
                        gameControl.lastClick().style.fontSize = gameView.textBold();
                        gameControl.lastClick().style.fontWeight = "bold";

                    }
                    if (gameModel.filled() == gameModel.inputNum()) {
                        gameControl.checkGrid("endGame");
                    }
                }
                else {
                    if (gameControl.lastClick().childNodes[0]) {
                        if (gameControl.lastClick().childNodes[0].className != "noteCont")
                            lastClicked.innerHTML = "";
                    }
                    if(!gameControl.lastClick().childNodes[0])
                        gameView.drawMiniGrid(gameControl.lastClick());
                    console.log(gameControl.lastClick().childNodes[0].className);
                    var num = parseInt(this.innerHTML);
                    var list = gameControl.lastClick().querySelectorAll(".noteNum");
                    console.log(list);

                    if(list[(num-1)].style.opacity == "0") {
                        list[(num-1)].style.opacity = "1";
                        this.style.color = "rgba(255, 250, 240, 0.5)";
                    }
                    else {
                        list[(num-1)].style.opacity = "0";
                        this.style.color = "rgba(255, 255, 255, 1.0)";
                    }
                }
            };
        }
    };

    function closeBtn() {
        var closeButton = document.createElement("div");
        closeButton.setAttribute("class", "closeBtn");
        var closeX = document.createElement("div");
        closeX.setAttribute("class", "closeX");
        if(gameView.isFirefox() == true && gameView.isMobile() == true) {
            closeX.style.marginTop = "-14px";
            closeX.style.marginLeft = "-8px";
        }
        closeX.innerHTML = "&times";

        closeButton.appendChild(closeX);
        return closeButton;
    }

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
    var selectToggle = false;

    var gridBlurred = false;

    this.setupStartScreen = function () {
        startOpen = true;
        $startScreen = $("#startPage");
        $startScreen.css({"width": $(window).width() + "px"});

        var $subMenu = $("#selDropCont");
        $subMenu.hide();
        var $menuText = $("#selText");

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
        gameModel.setCompleted(false);
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
        else if (this.getViewWidth() > this.getViewHeight()) {
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
            "font-size": fontNormal,
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

    this.loadPuzzle = function (_passedPuzzle) {
        //gameView.hideLoading();
        gameModel.setInputNum(0);

        // Repeat loop for each row in gameTable
        var inputCellCount = 0;
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                var $currentCell = $("#" + x + "x" + y);
                if (_passedPuzzle[x][y]!= 0)
                    $currentCell.append('<div class=\"puzzleNum\">'+ _passedPuzzle[x][y]+'</div>');
                else if (_passedPuzzle[x][y] == 0) {
                    // Create a new div element newInputText for the user to enter in numbers later
                    $currentCell.append('<div class=\"inputNum\"></div>');
                    $currentCell.css({"color": "#1976D2"});
                    inputCellCount++;
                }
            }
        }

        gameModel.setInputNum(inputCellCount);

        // gameControl.startTimer();
        // Set puzzleLoaded to true so that the Start Game button can't load the puzzle again.
        puzzleLoaded = true;
        gameModel.setFilledInputs(0);

        setTimeout(function() {
            $(".gameCell").css({"opacity": "1"});
        }, 100);
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

    this.loaded = function () {
        return puzzleLoaded;
    };

    this.setLoaded = function (_state) {
        puzzleLoaded = _state;
    };

    this.getInputVisibility = function () {
        return inputGridVisible;
    };

    this.setInputVisibility = function (_state) {
        inputGridVisible = _state;
    };

    this.selectToggle = function() {
        return selectToggle;
    };

    /*

    ***************
    Needs Rewriting
    ***************

    */

    this.expandSelect = function() {
        if (gameView.getInputVisibility() == true) {
            this.closeInputGrid();
        }
        var list = document.getElementById("selDropCont");
        list.style.visibility = "visible";
        list.style.display = "block";
        list.style.height = "auto";
        setTimeout(function(){
            var options = document.getElementsByClassName("selOpt");
            for (var i = 0; i < options.length; i++) {
                options[i].style.display = "block";
                options[i].style.visibility = "visible";
                //options[i].style.height = "24px";
            }
        }, 50);
        selectToggle = true;
    };

    this.collapseSelect = function() {
        var options = document.getElementsByClassName("selOpt");
        for (var i = 0; i < options.length; i++) {
            options[i].style.visibility = "hidden";
            options[i].style.display = "none";
            //options[i].style.height = "0";
        }
        setTimeout(function(){
            var list = document.getElementById("selDropCont");
            list.style.height = "0";
            list.style.display = "none";
            list.style.visibility = "hidden";
        }, 50);
        selectToggle = false;
    };

    this.openInputGrid = function (thisCell) {
        gameControl.initInputGrid();
        if (gameControl.noteMode() == true) {
            var numbers = document.getElementsByClassName("numSelect");
            if (thisCell.childNodes[0]) {
                if (thisCell.childNodes[0].className == "noteCont") {
                    var list = thisCell.querySelectorAll(".noteNum");
                    for (var i = 0; i < 9; i++) {
                        if (list[i].style.opacity == "1")
                            numbers[i].style.color = "rgba(255, 250, 240, 0.5)";
                    }
                }
            }
        }
        var expandHeight = 110;

        var inCont = document.getElementById("inputBorder");
        // If the cell is part of the bottom two rows of the grid
        var gameGrid = document.getElementById("gameGrid");
        var numCont = document.getElementById("numberCont");
        numCont.style.height = expandHeight + "px";
        var rect = thisCell.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);

        inCont.style.top = rect.top - ((expandHeight- parseInt(thisCell.style.width))/2) + "px";

        console.log(rect.left);
        console.log(parseInt(gameModel.inputGrid().style.width));
        console.log(((parseInt(gameModel.inputGrid().style.width)- parseInt(thisCell.style.width))/2));

        if (isMobile && document.body.offsetWidth < 420 && thisCell.cellIndex == 0)
            inCont.style.left = rect.left + "px";
        else if (isMobile && document.body.offsetWidth < 420 && thisCell.cellIndex == 8)
            inCont.style.left = rect.left - (parseInt(gameModel.inputGrid().style.width) - parseInt(thisCell.style.width)) + "px";
        else
            inCont.style.left = rect.left - ((parseInt(gameModel.inputGrid().style.width) - parseInt(thisCell.style.width)) / 2) + "px";

        inCont.style.display = "inline-block";
        setTimeout(function() {
            inCont.style.visibility = "visible";
            inCont.style.height = expandHeight + "px";
            gameModel.inputGrid().style.height = expandHeight + "px";
        }, 100);

        inputGridVisible = true;
    };

    this.closeInputGrid = function () {
        var inCont = document.getElementById("inputBorder");

        gameModel.inputGrid().style.height = 0;
        inCont.style.height = 0;
        setTimeout(function() {
            gameModel.inputGrid().style.visibility = "hidden";
            gameModel.inputGrid().style.display = "none";
            inCont.parentNode.removeChild(inCont);

        },301);

        inputGridVisible = false;
    };

    this.isFirefox = function() {
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            console.log("This is Firefox");
            return true
        }
        else
            return false;
    };

}