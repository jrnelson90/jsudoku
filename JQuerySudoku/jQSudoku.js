/**
 * Created by jrnel on 6/20/2016.
 */
//TODO: Comment all existing code
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
    gameView.resetTimerDisplay();

    var $subMenu = $("#selDropCont");
    var $menuText = $("#selText");

    // Make Startup Screen fade in
    $("#startPage").css("opacity", "1");

    $("#checkIcon").addClass("material-icons inactive");
    //$("#notesIcon").addClass("material-icons inactive");
    // Create 9x9 Game Grid
    gameView.drawGameGrid(defaultGridLength, defaultGridLength);

    // If on a small screen or minimized screen (less than 600px), reorganize toolbar
    if($(window).width() < 600) {
        $("#middleButtons").append($("#help")).css("float", "right");
    }

    // Make toolbar and display area visible after 0.5s delay
    setTimeout(function () {
        $("#displayArea").css("opacity", "1");
        $("#toolbar").css("visibility", "visible");
    },500);

    // Click event for game view back button
    $("#back").click(function () {
        if (gameModel.completed() == false && gameView.loaded() == true) {
            if(gameControl.isPaused() == false) {
                gameControl.pauseTimer();
            }
            if(gameView.isBlurred() == false) {
                gameView.blurGrid();
            }
            if(gameView.getInputVisibility() == true)
                gameView.closeInputGrid();
            gameControl.initEndGamePop();
            gameView.togglePopupView($("#endGamePop"));
        }
        else if (gameModel.completed() == true && gameView.loaded() == true) {
            gameControl.stopTimer();
            gameView.slideStartOpen();
            setTimeout(function() {
                gameControl.resetGameTable();
                gameView.resetTimerDisplay();
            },400);
            gameModel.setCompleted(false);
        }
    });

    $("#startBtn").click(function () {
        gameView.slideStartClose();

        setTimeout(function() {
            gameControl.loadSelectedPuzzle();
        }, 500);

        setTimeout(function() {
            var $selText = $("#selText");
            if (gameView.loaded() == false && gameModel.completed() == false) {
                 if ($selText.text() == "Difficulty") {
                     $selText.text("Medium");
                 }
                $("#puzzleDiffText").text($selText.text());
                gameView.showLoading();
            }
         },350);
    });

    $("#pause").click(function () {
        gameControl.pauseClick();
    });

    $menuText.click(function () {
        $subMenu.slideDown(300).css("opacity", "1");
    });

    $(".selOpt").click(function () {
        $subMenu.slideUp(300).css("opacity", "0");
        $menuText.text($(this).text());
        gameModel.setDifficulty($(this).text().toLowerCase());
        $(".prevCell").text("").css("opacity", "1");
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

    $("#help").click(function () {
        gameControl.clickHelp();
    });

    $("#notesIcon").click(function(){
        gameControl.editClick()
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
    var $lastClicked;
    var $lastClickedText;
    var viewUpdateInterval;
    var checkToggle = false;
    var noteMode = false;
    var paused = false;
    var currentTimeElapsed;
    var pausedTimeStart;
    var pausedTimeStop;
    var pausedTimeElapsed;

    //TODO: Implement mobile tap detection and actions

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
        if(gameControl.noteMode() == true) {
            gameControl.editClick();
        }
        gameControl.stopTimer();
        gameView.resetTimerDisplay();
        $(".puzzleNum").remove();
        $(".inputNum").remove();
        $(".gameCell").css({"color": "#000000", "background-color": "white"});
        if(gameView.getInputVisibility()== true) {
            $("#inputBorder").remove();
            gameView.setInputVisibility(false);
        }

        if(gameView.isPauseLayerVisible() == true) {
            if(gameView.isBlurred())
                gameView.blurGrid();
            $("#pauseLayer").remove();
            paused = false;
        }

        gameView.setLoaded(false);
    };

    this.clickCell = function (_clickedCell) {
        if(gameView.selectToggle() == true)
            gameView.collapseSelect();
        if (typeof gameControl.lastClick() != 'undefined' && gameControl.lastClick() != _clickedCell) {

            gameView.unhighlight($lastClicked);
            if (gameView.getInputVisibility() == true) {
                gameView.closeInputGrid();
            }
        }
        gameView.highlight(_clickedCell);
        $lastClicked = _clickedCell;
        $lastClickedText = $(gameControl.lastClick()).children();
        if (gameView.getInputVisibility() == false) {
            gameView.openInputGrid(_clickedCell);
        }
    };

    this.noteMode = function() {
        return noteMode;
    };

    this.lastClick = function () {
        return $lastClicked;
    };

    this.initInputGrid = function () {

        $("<div id=\"inputBorder\"></div>").insertBefore($("#displayArea"));
        var $inputBorder = $("#inputBorder");
        $inputBorder.css({
            "display": "none",
            "visibility": "hidden",
            "width": "80px",
            "top": "0",
            "left": "0"
        });

        if(!(gameView.getIsMobile() && document.body.offsetWidth < 420)) {
            $inputBorder.append(closeBtn());
            var $close = $(".closeBtn");
            $close.css("z-index",  "100");
            $close.click( function () {
                gameView.closeInputGrid();
            });
        }

        $inputBorder.append($("<div id=\"inputGrid\"></div>"));
        var $newInput = $("#inputGrid");
        $newInput.css({"z-index": "2", "width": "80px"});
        gameModel.setInputGrid($newInput);

        gameModel.inputGrid().append($("<div id=\"numberCont\"></div>"));
        var $inNumCont = $("#numberCont");

        for (var i = 0; i < 9; i++) {
            $inNumCont.append($("<div class=\'numSelect\' id=\'numSelect"+(i+1)+"\'>"+(i+1)+"</div>"));
            if ((i + 1) % 3 == 0)
                $inNumCont.append("<br>");
        }

        $inNumCont.append($("<div id=\'clearButton\'><i class=\'material-icons\'>block</i></div>"));
        $("#clearButton").css({"color": "rgba(255, 255, 255, 1.0)", "cursor": "pointer"});

        var $checkIcon = $("#checkIcon");
        $("#clearButton").click(function () {
            if($lastClickedText.text() != "") {
                gameModel.setFilledInputs(gameModel.filled() - 1);
                if(gameModel.filled() == 0) {
                    $checkIcon.addClass("material-icons inactive");
                    $checkIcon.css("color", "rgba(255, 255, 255, 0.3)");
                    $("#check").unbind();
                }
            }
            $(gameControl.lastClick()).children().text("");
            gameView.closeInputGrid();
        });

        //
        gameView.setInputVisibility(true);

        $(".numSelect").click(function () {
            if (gameControl.noteMode() == false) {
                if ($lastClickedText.css("color") == "rgb(255, 0, 0)") {
                    $lastClickedText.css("color", "#1c86ee");
                }
                var filled = gameModel.filled();
                if (filled == 0) {
                    $checkIcon.addClass("material-icons");
                    $checkIcon.css("color", "rgba(255, 255, 255, 1.0)");
                    $("#check").click(function () {
                        gameControl.checkClick();
                    });
                }
                if ($lastClickedText.text() == "") {
                    filled++;
                    gameModel.setFilledInputs((filled));
                }

                if ($lastClickedText.css("font-weight") == "bold") {
                    $lastClickedText.css("font-weight", "normal");
                }
                if ($(this).text() == gameView.lastHighlight() && gameView.highToggle() == true) {
                    $lastClickedText.css("font-weight", "bold");
                }

                $lastClickedText.text($(this).text());
                gameView.closeInputGrid();

                if (gameModel.filled() == gameModel.inputNum()) {
                    gameControl.checkGrid("endGame");
                }
            }
            // Creating notes when toggle is enabled
            else {

                if ($lastClickedText.text() != "" && $lastClickedText.text() != "123456789")
                    $lastClickedText.text("");
                if($lastClickedText.text() == "")
                    gameView.drawMiniGrid($lastClickedText);

                var num = parseInt($(this).text());
                var list = $lastClickedText.find(".noteNum").toArray();
                console.log(list);

                if($(list[num-1]).css("opacity") == "0") {
                    $(list[num-1]).css("opacity", "1");
                    $(this).css("color", "rgba(255, 250, 240, 0.5)");
                }
                else {
                    $(list[num-1]).css("opacity", "0");
                    $(this).css("color", "rgba(255, 255, 255, 1.0)");
                }
            }


        });
    };

    function closeBtn() {
        var $closeButton = $("<div class=\'closeBtn\'></div>");
        var $closeX = $("<div class=\'closeX\'></div>");
        if(gameView.isFirefox() == true && gameView.getIsMobile() == true)
            $closeX.css({"margin-top": "-14px", "margin-left": "-8px"});
        $closeX.html("&times");
        $closeButton.append($closeX);
        return $closeButton;
    }

    this.startTimer = function () {
        gameModel.setEndTime("00:00:00");
        viewUpdateInterval = setInterval(function () {
            gameView.updateTimerDisplay();
        }, 1000);
        gameModel.setStart(currentTime());
    };

    this.stopTimer = function () {
        clearInterval(viewUpdateInterval);
        gameModel.setEndTime(this.getElapsedTime());
        return gameModel.endTime();
    };

    this.pauseTimer = function() {
        currentTimeElapsed = this.getElapsedTime();
        this.stopTimer();
        pausedTimeStart = currentTime();
        paused = true;
    };

    this.resumeTimer = function() {
        pausedTimeStop = currentTime();
        pausedTimeElapsed = pausedTimeStop - pausedTimeStart;
        var lastStart = gameModel.startTime();
        gameModel.setStart(lastStart+pausedTimeElapsed);
        gameView.updateTimerDisplay();
        viewUpdateInterval = setInterval(function () {
            gameView.updateTimerDisplay();
        }, 1000);
        paused = false;
    };

    var currentTime = function () {
        return ((new Date()).getTime() / 1000);
    };

    this.getElapsedTime = function () {
        return formatTime((currentTime() - gameModel.startTime()));
    };

    var formatTime = function (time) {

        var h = addZero(Math.floor(time / 3600));
        time %= 3600;

        var m = addZero(Math.floor(time / 60));
        time %= 60;

        var s = addZero(Math.floor(time));

        return (h + ':' + m + ':' + s);
    };

    var addZero = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    this.pauseClick = function() {
        if (paused == false) {
            gameControl.pauseTimer();
            if(gameView.getInputVisibility() == true)
                gameView.closeInputGrid();
            var $pauseLayer = $("<div id=\'pauseLayer\'><h1>Game Paused</h1></div>");
            $pauseLayer.css("height", $(window).innerHeight() - 46 + "px");
            gameView.blurGrid();
            $('body').append($pauseLayer);
        }
        else if (paused == true) {
            gameControl.resumeTimer();
            gameView.blurGrid();
            $("#pauseLayer").remove();
        }
    };

    this.isPaused = function() {
        return paused;
    };

    this.initLoading = function () {
        var $newPopCont = $("<div id=\'popContainer\'></div>");
        $('body').append($newPopCont);

        $newPopCont.append("<div id=\'haze\'></div>");

        var $newLoad = $("<div id=\'loadContainer\' class=\'popUp\'></div>");
        $newPopCont.append($newLoad);
        $newLoad.css("top", ($("#displayArea").outerHeight() - $newLoad.outerHeight())/2 + "px");

        $newLoad.append("<p>Generating Puzzle</p>");

        var $ballCont = $("<div id=\'ballContainer\'></div>");
        $newLoad.append($ballCont);

        for(var i = 0; i < 5; i++) {
            $ballCont.append("<span></span>");
        }
    };

    this.clickHelp = function () {
        if(gameView.getInputVisibility() == true)
            gameView.closeInputGrid();
        if(gameControl.isPaused() == false) {
            gameControl.pauseTimer();
            gameView.blurGrid();
        }
        var newHelpWin = new HelpPop();
        gameView.togglePopupView(newHelpWin.view);
    };

    function HelpPop() {
        var $newPopCont = $("<div id=\'popContainer\'></div>");
        $('body').append($newPopCont);

        $newPopCont.append("<div id=\'haze\'></div>");

        var $newHelpPop = $("<div id=\'helpPop\' class=\'popUp\'></div>");
        $newHelpPop.css({
            "height": "260px",
            "top": ($("#displayArea").height() - $newHelpPop.height())/2 + "px"
        });
        $newPopCont.append($newHelpPop);

        var $closeHelpBtn = closeBtn();

        $closeHelpBtn.attr("id", "closeHelp");
        $closeHelpBtn.click(function () {
            gameView.togglePopupView($("#HelpPop"));
            if(gameView.isPauseLayerVisible() == false) {
                gameControl.resumeTimer();
                gameView.blurGrid();
            }
        });
        $newHelpPop.append($closeHelpBtn);

        // Add Help Title
        $newHelpPop.append("<h2>Game Instructions</h2>");

        var $helpList = $("<div id=\'explainCont\'></div>");

        //
        var $editExplanation = $("<div class=\'helpExplan\'>");
        $editExplanation.html("<i class='material-icons'>edit</i> toggle note mode<br>");
        $helpList.append($editExplanation);

        //
        var $checkExplanation = $("<div class=\'helpExplan\'>");
        $checkExplanation.html("<i class='material-icons'>done</i> show puzzle errors<br>");
        $helpList.append($checkExplanation);

        //
        var $highlightExplanation = $("<div class=\'helpExplan\'>");
        $highlightExplanation.html("Double click/tap any black puzzle number to highlight all numbers of that value");
        $helpList.append($highlightExplanation);

        $newHelpPop.append($helpList);

        this.view = $newHelpPop;
    }

    this.initEndGamePop = function () {
        var $newPopCont = $("<div id=\'popContainer\'></div>");
        $('body').append($newPopCont);
        $newPopCont.append("<div id=\'haze\'></div>");


        // Create the End Pop Up Form
        var $newEndPop = $("<div id=\'endGamePop\' class=\'popUp\'></div>");
        $newEndPop.css({
            "height": "100px",
            "top": ($("#displayArea").outerHeight() - $newEndPop.height())/2 + "px"
        });

        // Add End Pop Up Text
        $newEndPop.append("<p>End current game and <br> play a new puzzle?<br></p>");

        // Add Restart Button Div
        var $restart = $("<div id=\'restart\' class=\'endBtn\'>Restart</div>");
        $restart.click(function () {
            gameControl.clickRestart();
        });
        $newEndPop.append($restart);

        // Add Cancel Button Div
        var $cancel = $("<div id=\'cancel\' class=\'endBtn\'>Cancel</div>");

        $cancel.click( function () {
            if(gameControl.isPaused() == true && gameView.isPauseLayerVisible() == false) {
                gameControl.resumeTimer();
            }
            if(gameView.isBlurred() == true && gameControl.isPaused() == false) {
                gameView.blurGrid();
            }
            gameView.togglePopupView($("#endGamePop"));
        });
        $newEndPop.append($cancel);

        // Add the End Pop Up form to the Display Area
        $newPopCont.append($newEndPop);
    };

    this.clickRestart = function () {
        if(gameView.isPauseLayerVisible() == true){
            $("#pauseLayer").remove();
        }
        paused = false;
        gameView.togglePopupView($("#endGamePop"));
        gameView.slideStartOpen();
        gameControl.stopTimer();
        gameView.resetTimerDisplay();
        setTimeout(function() {
            gameControl.resetGameTable();
            gameView.blurGrid();
        },400);
    };

    this.gameEnd = function () {
        var finishWindow = new FinishPop();
        gameView.togglePopupView(finishWindow.view);
        gameModel.setCompleted(true);
    };

    this.checkClick = function () {
        if(gameView.getInputVisibility() == true)
            gameView.closeInputGrid();
        if (checkToggle == false) {
            checkToggle = true;
            $("#checkIcon").css("color", "rgb(144, 202, 249, 0.85)");
            gameControl.checkGrid("click");
        }
        else {
            gameView.uncheckNum();
            //$("#checkIcon").addClass("material-icons");
            $("#checkIcon").css("color", "rgba(255, 255, 255, 1.0)");
            checkToggle = false;
        }
    };

    this.checkGrid = function (_checkType) {
        var correct = 0;
        var noError = true;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var $checkCell = $("#cell" + i + "x" + j);
                var cellValue = parseInt($checkCell.children().text());

                //TODO: Skip input cells that contain a NoteCont on number check
                if ($checkCell.children().attr("class") == "inputNum" && cellValue > 0) {
                    if (gameModel.puzzle().solut[i][j] != cellValue && _checkType == "click") {
                        $checkCell.css("color", "rgba(255, 0, 0, 1.0)");
                        noError = false;
                    }
                    else if (gameModel.puzzle().solut[i][j] == cellValue) {
                        correct++;
                    }
                }
            }
        }

        if (correct == gameModel.inputNum() && _checkType == "endGame") {
            this.gameEnd();
        }
    };

    function FinishPop(){
        var $newPopCont = $("<div id=\'popContainer\'></div>");
        $('body').append($newPopCont);

        $newPopCont.append("<div id=\'haze\'></div>");

        var $newFinish = $("<div id=\'puzzleFinish\' class=\'popUp\'></div>");
        $newFinish.css({
            "height": "72px",
            "top": ($("#displayArea").outerHeight() - $newFinish.height())/2 + "px"
        });

        var $closeFinBtn = closeBtn();
        $closeFinBtn.attr("id", "closeFinish");
        $closeFinBtn.click(function () {
            gameView.togglePopupView($("#puzzleFinish"));
        });
        $newFinish.append($closeFinBtn);

        var score = gameControl.stopTimer();

        $newFinish.append("<p>Well done! Your score for this puzzle is " + score + "</p>");

        $newPopCont.append($newFinish);
        this.view = $newFinish;
    }

    this.editClick = function() {
        var $notesIcon = $("#notesIcon");
        if(noteMode == false) {
            $notesIcon.css("color", "#AED581");
            noteMode = true;
        }
        else if(noteMode == true){
            $notesIcon.css("color", "rgba(255, 255, 255, 1.0)");
            noteMode = false;
        }
    };

    //**********************
    // Needs to be rewritten
    //**********************

}

// Sudoku View Object
function SudokuView() {
    var isMobile;
    var viewWidth;
    var viewHeight;
    var cellSize = 0;
    var startOpen;
    var $startScreen;

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

    //TODO: Scale input dropdown on window resize

    this.setupStartScreen = function () {
        startOpen = true;
        $startScreen = $("#startPage");
        $startScreen.css("width", $(window).width() + "px");

        var $subMenu = $("#selDropCont");
        $subMenu.hide();

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
                        $currentCell.css("border-top", "solid black");
                    }
                    else if ((i + 1) % Math.sqrt(_rows) == 0) {
                        $currentCell.css("border-bottom", "solid black");
                    }
                    else {
                        $currentCell.css("border-color", "black");
                    }

                    if (j == 0)
                        $currentCell.css("border-left", "solid black");
                    else if ((j + 1) % Math.sqrt(_columns) == 0)
                        $currentCell.css("border-right", "solid black");
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
                $(".prevCell").css("font-weight", "bold");

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
            $(".previewGivenNums").css("opacity", "1");
        }, 50);
    };

    this.slideStartClose = function() {
        startOpen = false;
        console.log($startScreen.width());
        $startScreen.animate({left: '-='+ $startScreen.width() + "px"}, 500);

        setTimeout(function() {
            $startScreen.css("visibility", "hidden");
        },510);
    };

    this.slideStartOpen = function() {
        startOpen = true;
        $startScreen.css({"visibility": "visible", "width": $(window).outerWidth()+"px"});
        $startScreen.animate({left: "0px"}, 500);
    };

    this.drawGameGrid = function (_rows, _columns) {
        var $gameGrid = $("#gameGrid");
        for (var i = 0; i < _rows; i++) {
            $gameGrid.append('<div id=\"row' + i + '\" class=\"gridRow\">');
            var $currentRow = $(".gridRow:last");
            for (var j = 0; j < _columns; j++) {
                $currentRow.append('<div id=\"cell' + i + 'x' + j + '\" class=\"gridCell gameCell\">');

                var $currentCell = $(".gameCell:last");

                if (i == 0) {
                    $currentCell.css("border-top", "solid black");
                }
                else if ((i + 1) % Math.sqrt(_rows) == 0) {
                    $currentCell.css("border-bottom", "solid black");
                }
                else {
                    $currentCell.css("border-color", "black");
                }

                if (j == 0)
                    $currentCell.css("border-left", "solid black");
                else if ((j + 1) % Math.sqrt(_columns) == 0)
                    $currentCell.css("border-right", "solid black");
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
        fontNote = cellSize/3-3;
        fontNormal = cellSize - 14 + "px";
        fontBold = cellSize - 10 + "px";

        $(".gameCell").css({
            "height": gameView.getCellSize() + "px",
            "width": gameView.getCellSize() + "px",
            "font-size": fontNormal,
            "unselectable": "on",
            "opacity": "1"
        });

        $(".noteNum").css({
            "height": fontNote + "px",
            "width": fontNote + "px",
            "font-size": fontNote + "px"
        });
        
        console.log(gridSize);
        console.log(cellSize);

        //TODO: Script resizing preview grid
        //TODO: Script resizing font sizes
        //TODO: Adjust input grid position on resize
    };

    this.loadPuzzle = function (_passedPuzzle) {
        gameView.hideLoading();
        gameModel.setInputNum(0);

        // Repeat loop for each row in gameTable
        var inputCellCount = 0;
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                var $currentCell = $("#cell" + x + "x" + y);
                if (_passedPuzzle[x][y] != 0) {
                    $currentCell.append('<div class=\"puzzleNum\">' + _passedPuzzle[x][y] + '</div>');
                }
                else if (_passedPuzzle[x][y] == 0) {
                    // Create a new div element newInputText for the user to enter in numbers later
                    $currentCell.append('<div class=\"inputNum\"></div>');
                    $currentCell.css("color", "#1976D2");
                    inputCellCount++;
                }
            }
        }

        gameModel.setInputNum(inputCellCount);

        $(".gameCell").unbind();

        var $inputNum = $(".gameCell:has(.inputNum)");
        $inputNum.click(function () {
            if(gameView.getInputVisibility() == false) {
                gameControl.clickCell(this);
            }
            else
                gameView.closeInputGrid();
        });

        var $puzzleNum = $(".gameCell:has(.puzzleNum)");
        $puzzleNum.click(function () {
            if(gameView.getInputVisibility() == true)
                gameView.closeInputGrid();
            gameView.unhighlight(gameControl.lastClick());
        });

        // Number bolding on double click
        $puzzleNum.dblclick(function () {
            //  Bold Num
            var numToHighlight = $(this).children().text();
            var $inputNum = $(".inputNum");
            var $puzzleNum = $(".puzzleNum");
            if ($(this).text() == lastHighlighted || typeof lastHighlighted == 'undefined') {
                if (highToggle == true) {
                    $inputNum.each(function () {
                        if($(this).text() == lastHighlighted)
                            $(this).css("font-weight", "normal");
                    });

                    $puzzleNum.each(function () {
                        if($(this).text() == lastHighlighted)
                            $(this).css("font-weight", "normal");
                    });
                    highToggle = false;
                }
                else if (highToggle == false) {
                    $inputNum.each(function () {
                        if($(this).text() == numToHighlight)
                            $(this).css("font-weight", "bold");
                    });

                    $puzzleNum.each(function () {
                        if($(this).text() == numToHighlight)
                            $(this).css("font-weight", "bold");
                    });
                    highToggle = true;
                }
            }
            if ($(this).text() != lastHighlighted && typeof lastHighlighted != 'undefined') {
                $inputNum.each(function () {
                    if($(this).text() == lastHighlighted)
                        $(this).css("font-weight", "normal");
                    if($(this).text() == numToHighlight)
                        $(this).css("font-weight", "bold");
                });

                $puzzleNum.each(function () {
                    if($(this).text() == lastHighlighted)
                        $(this).css("font-weight", "normal");
                    if($(this).text() == numToHighlight)
                        $(this).css("font-weight", "bold");
                });
            }
            lastHighlighted = numToHighlight;
        });

        // Set puzzleLoaded to true so that the Start Game button can't load the puzzle again.
        puzzleLoaded = true;
        gameModel.setFilledInputs(0);
        gameControl.startTimer();
        setTimeout(function() {
            $(".gameCell").css("opacity", "1");
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

    this.selectToggle = function() {
        return selectToggle;
    };

    this.expandSelect = function() {
        if (gameView.getInputVisibility() == true)
            this.closeInputGrid();
        $("#selDropCont").css({"visibility": "visible", "display": "block", "height": "auto"});
        setTimeout(function(){
            $(".selOpt").css({"display": "block", "visibility": "visible"});
        }, 50);
        selectToggle = true;
    };

    this.collapseSelect = function() {
        $(".selOpt").css({"display": "none", "visibility": "hidden"});
        setTimeout(function(){
            $("#selDropCont").css({"visibility": "hidden", "display": "none", "height": "0"});
        }, 50);
        selectToggle = false;
    };

    this.getInputVisibility = function () {
        return inputGridVisible;
    };

    this.setInputVisibility = function (_state) {
        inputGridVisible = _state;
    };

    this.openInputGrid = function (thisCell) {
        gameControl.initInputGrid();

        if (gameControl.noteMode() == true) {
            var $cellContents = $(thisCell).children();
            if ($cellContents.children().length > 0) {
                $cellContents.find(".noteNum").each(function () {
                    if($(this).css("opacity") == "1"){
                        $("#numSelect" + $(this).text()).css("color", "rgba(255, 250, 240, 0.5)");
                    }
                });
            }
        }

        var expandHeight = 110;
        var $inCont = $("#inputBorder");
        $("#numberCont").css("height", expandHeight + "px");
        var cellViewCoords = thisCell.getBoundingClientRect();

        $inCont.css("top", cellViewCoords.top - ((expandHeight - $(thisCell).width())/2) + "px");

        if (isMobile && $(window).width() < 420 && thisCell.cellIndex == 0)
            $inCont.css("left", cellViewCoords.left + "px");
        else if (isMobile && $(window).width() < 420 && thisCell.cellIndex == 8)
            $inCont.css("left", cellViewCoords.left - (gameModel.inputGrid().width() - $(thisCell).width()) + "px");
        else
            $inCont.css("left", cellViewCoords.left - ((gameModel.inputGrid().width() - $(thisCell).width()) / 2) + "px");
        $inCont.css("display", "inline-block");
        setTimeout(function() {
            $inCont.css({"visibility": "visible", "height": expandHeight + "px"});
            gameModel.inputGrid().css("height", expandHeight + "px");
        }, 100);

        inputGridVisible = true;
    };

    this.closeInputGrid = function () {
        gameModel.inputGrid().css("height", "0px");
        $("#inputBorder").css("height", "0px");
        setTimeout(function() {
            gameModel.inputGrid().css({"visibility": "hidden", "display": "none"});
            $("#inputBorder").remove();
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

    this.resetTimerDisplay = function () {
        $("#gameTimerDisplay").text("00:00:00");
    };

    this.updateTimerDisplay = function () {
        $("#gameTimerDisplay").text(gameControl.getElapsedTime());
    };

    this.isBlurred = function() {
        return gridBlurred;
    };

    this.isPauseLayerVisible = function() {
        if($("#pauseLayer").is("div"))
            return true;
        else
            return false;
    };

    this.blurGrid = function() {
        if(this.isBlurred() == false) {
            $("#gameGrid").css({"filter": "blur(10px)", "-webkit-filter": "blur(10px)"});
            gridBlurred = true;
        }
        else if (this.isBlurred() == true) {
            $("#gameGrid").css({"filter": "blur(0px)", "-webkit-filter": "blur(0px)"});
            gridBlurred = false;
        }
    };

    this.showLoading = function () {
        gameControl.initLoading();
        gameView.togglePopupView($("#loadContainer"));
    };

    this.hideLoading = function() {
        gameView.togglePopupView($("#loadContainer"));
    };

    this.togglePopupView = function(_div) {
        var $popCont = $("#popContainer");
        if (popUpVisible == false) {
            $popCont.css("display", "inline-block");
            setTimeout(function() {
                $(_div).css("transform", "scale(1)");
            }, 10);
            popUpVisible = true;
        }
        else if(popUpVisible == true) {
            $(_div).css("transform", "scale(0.01)");
            setTimeout(function() {
                $popCont.remove();
            }, 200);
            popUpVisible = false;
        }
    };

    this.uncheckNum = function() {
        $(".inputNum").each(function () {
            if($(this).css("color") == "rgb(255, 0, 0)")
                $(this).parent().css("color", "#1976D2");
        });
    };

    this.lastHighlight = function () {
        return lastHighlighted;
    };

    this.highToggle = function () {
        return highToggle;
    };

    function changeColor(object, color) {
        $(object).css("background-color", color);
    }

    this.highlight = function (_cell) {
        var cellIDString = $(_cell).attr("id");
        var cellX = cellIDString.slice(4, 5);
        var cellY = cellIDString.slice(6, 7);
        for (var j = 0; j < 9; j++) {
            changeColor($("#cell" + cellX + "x" + j), "#E3F2FD");
        }
        for (j = 0; j < 9; j++) {
            changeColor($("#cell" + j + "x" + cellY), "#E3F2FD");
        }
        changeColor(_cell, "#BBDEFB");
    };

    this.unhighlight = function (_cell) {
        var cellIDString = $(_cell).attr("id");
        var cellX = cellIDString.slice(4, 5);
        var cellY = cellIDString.slice(6, 7);
        for (var i = 0; i < 9; i++) {
            changeColor($("#cell" + cellX + "x" + i), "rgba(255, 255, 255, 1.0)");
        }
        for (i = 0; i < 9; i++) {
            changeColor($("#cell" + i + "x" + cellY), "rgba(255, 255, 255, 1.0)");
        }
        changeColor(_cell, "rgba(255, 255, 255, 1.0)");
    };

    this.lastHighlight = function () {
        return lastHighlighted;
    };

    this.drawMiniGrid = function(_cell) {
        var $noteCont = $("<div class=\'noteCont\'></div>");
        _cell.append($noteCont);

        var $noteList = $("<div class=\'noteList\'></div>");
        $noteList.css("height", $noteCont.height() + "px");
        $noteCont.append($noteList);
        var valIncr = 1;

        for (var i = 0; i < 3; i++) {
            var $noteRow = $("<div class=\'noteRow\'></div>");

            fontNote = cellSize/3-3;

            for(var j = 0; j < 3; j++) {
                var $noteNumber = $("<div class=\'noteNum\'></div>");
                $noteNumber.value = valIncr;
                $noteNumber.css({
                    "height": fontNote + "px",  "width": fontNote + "px",  "font-size": fontNote + "px",
                    "opacity": "0"
                });

                $noteNumber.text(valIncr);
                $noteRow.append($noteNumber);
                valIncr++;
            }
            $noteList.append($noteRow);
        }
    };

    //****************
    // Needs Rewriting
    //****************

}