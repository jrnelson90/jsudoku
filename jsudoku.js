/* JavaScript Sudoku Table Generation Assignment
 Author:		Justin Nelson
 Assignment:	Final Project
 File:		    jsudoku.js
 Instructor:    Lynn Thackeray
 Class:		    CS 2550 Section 001
 Date Written:  12/12/2015
 Description:   Generates a sudoku grid using js to define HTML and CSS
                and populates the grid from a passed puzzle setup array.
 */

var gameModel;
var gameControl;
var gameView;

document.onreadystatechange = function () {
    if(document.readyState == "complete") {
        setTimeout( function() {
            document.getElementById("startPage").style.opacity = "1";
            //var gameGrid = document.getElementById("gameGrid");
            if(document.body.offsetWidth < 600) {
                document.getElementById("middleButtons").appendChild(document.getElementById("help"));
                document.getElementById("middleButtons").style.float = "right";

            }
        },10);

        setTimeout( function() {
            document.getElementById("toolbar").style.visibility = "visible";
            document.getElementById("displayArea").style.opacity = "1";
        },1000);
    }
};

function programSetup() {
    gameView = new SudokuView();
    gameModel = new SudokuModel();
    gameControl = new SudokuControl();
    gameView.drawGameGrid(9, 9);
    gameView.resetTimerDisplay();
    gameControl.initEventListeners();
    document.getElementById("checkIcon").setAttribute("class", "material-icons inactive");
}

function SudokuModel() {
    var gameGrid;
    var gameTable;
    var tableRowsNum;
    var tableColumnsNum;
    var currentDifficulty = "medium";
    var numOfInputs;
    var filledInputs;
    var puzzleCompleted;
    var generatedPuzzle = null;
    var currentStart = [];
    var currentSolution = [];
    var startingTime;
    var endTime;
    var inputGrid;


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

    this.difficulty = function () {
        return currentDifficulty;
    };

    this.setDifficulty = function (_selection) {
        currentDifficulty = _selection;
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

function SudokuControl() {
    var lastClicked;
    var viewUpdateInterval;
    var checkToggle = false;
    var noteMode = false;
    var paused = false;
    var currentTimeElapsed;
    var pausedTimeStart;
    var pausedTimeStop;
    var pausedTimeElapsed;

    this.initEventListeners = function() {

        /*var startButton = document.getElementById("start");
        startButton.addEventListener("click", function() {
            gameControl.clickStart();
        });*/
        document.getElementById("notes").addEventListener("click", gameControl.editClick);

        document.getElementById("pause").addEventListener("click", gameControl.pauseClick);

        var helpButton = document.getElementById("help");
        helpButton.addEventListener("click", function() {
            gameControl.clickHelp();
        });

        var backButton = document.getElementById("back");
        backButton.addEventListener("click", function() {
            if (gameModel.completed() == false && gameView.loaded() == true) {
                gameControl.pauseTimer();
                gameView.blurGrid();
                gameControl.initEndGamePop();
                var endPop = document.getElementById("endGamePop");
                gameView.togglePopupView(endPop);
            }
            else if (gameModel.completed() == true && gameView.loaded() == true) {
                gameView.slideStartOpen();
                gameModel.setCompleted(false);
            }
        });

        window.addEventListener("resize", gameView.resizeView);
    };

    this.checkClick = function () {
        if (checkToggle == false) {
            checkToggle = true;
            document.getElementById("checkIcon").style.color = "rgba(255, 255, 255, 0.85)";
            gameControl.checkGrid("click");
        }
        else {
            gameView.uncheckNum();
            document.getElementById("checkIcon").setAttribute("class", "material-icons");
            document.getElementById("checkIcon").style.color = "rgba(255, 255, 255, 1.0)";

            checkToggle = false;
        }
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
        gameView.highlight(clickedCell);
        if (gameView.getInputVisibility() == false) {
            gameView.openInputGrid(clickedCell);
        }
        lastClicked = clickedCell;
    };

    this.checkGrid = function (_checkType) {
        var correct = 0;
        var noError = true;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var checkCell = gameModel.table().rows[i].cells[j];
                var cellValue = parseInt(checkCell.innerHTML);
                if (checkCell.className == "gridCell gameCell inputNum" && isNaN(cellValue) == false) {
                    if (gameModel.puzzle().solut[i][j] != cellValue && _checkType == "click") {
                        checkCell.style.color = "red";
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
        else{
            if(noError == true) {
                var correctSound = document.getElementById("correctSound");
                correctSound.play();
            }
            else{
                var errorSound = document.getElementById("errorSound");
                errorSound.play();
            }
        }
    };

    this.editClick = function() {
        if(noteMode == false) {
            document.getElementById("notesIcon").style.color = "#AED581";
            noteMode = true;
        }
        else if(noteMode == true){
            document.getElementById("notesIcon").style.color = "rgba(255, 255, 255, 1.0)";
            noteMode = false;
        }
    };

    this.pauseClick = function() {
        if (paused == false) {
            gameControl.pauseTimer();
            var pauseScreen = document.createElement("div");
            pauseScreen.setAttribute("id", "pauseLayer");
            var pauseText = document.createElement("h1");
            pauseText.innerHTML = "Game Paused";
            pauseScreen.appendChild(pauseText);
            pauseScreen.style.height = window.innerHeight - 46 +"px";
            gameView.blurGrid();
            document.body.appendChild(pauseScreen);
            paused = true;
        }
        else if (paused == true) {
            gameControl.resumeTimer();
            gameView.blurGrid();
            var pauseRemove = document.getElementById("pauseLayer");
            pauseRemove.parentElement.removeChild(pauseRemove);
            paused = false;
        }
    };

    this.gameEnd = function () {
        var finishWindow = new FinishPop();
        gameView.togglePopupView(finishWindow.view);
        gameModel.setCompleted(true);
    };

    this.resetGameTable = function () {
        if(gameView.getInputVisibility()== true) {
            var input = document.body.querySelector("#inputBorder");
            input.parentNode.removeChild(input);
            gameView.setInputVisibility(false);
        }
        if(gameControl.noteMode() == true) {
            gameControl.editClick();
        }
        gameModel.table().parentNode.removeChild(gameModel.table());
        gameView.drawGameGrid(9, 9);
        gameView.setLoaded(false);
        document.getElementById("checkIcon").setAttribute("class", "material-icons inactive");
        document.getElementById("check").removeEventListener("click", gameControl.checkClick);
    };

    this.lastClick = function () {
        return lastClicked;
    };

    this.clickRestart = function () {
        var endPop = document.getElementById("endGamePop");
        gameView.togglePopupView(endPop);
        gameView.slideStartOpen();
        gameControl.stopTimer();
        gameView.resetTimerDisplay();
        setTimeout(function() {
            gameControl.resetGameTable();
            gameView.blurGrid();
        },400);
    };

    this.clickHelp = function () {
        gameControl.pauseTimer();
        gameView.blurGrid();
        var newHelpWin = new HelpPop();
        gameView.togglePopupView(newHelpWin.view);
    };

    /*this.clickLogin = function () {
        var MyInt = null;
    };*/

    // Game Pop Up Forms
    this.initInputGrid = function () {
        var inputBorder = document.createElement("DIV");
        inputBorder.setAttribute("id", "inputBorder");
        inputBorder.style.display = "none";
        inputBorder.style.visibility = "hidden";
        inputBorder.style.width = "80px";
        document.body.insertBefore(inputBorder, document.getElementById("displayArea"));
        inputBorder.style.top = 0;
        inputBorder.style.left = 0;

        if(!(gameView.isMobile() && document.body.offsetWidth < 420)) {
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

    this.initEndGamePop = function () {
        var newPopCont = document.createElement("DIV");
        newPopCont.setAttribute("id", "popContainer");
        document.body.appendChild(newPopCont);
        var newHaze = document.createElement("DIV");
        newHaze.setAttribute("id", "haze");
        newPopCont.appendChild(newHaze);

        // Create the End Pop Up Form
        var newEndPop = document.createElement("DIV");
        newEndPop.setAttribute("class", "popUp");
        newEndPop.setAttribute("id", "endGamePop");
        newEndPop.style.height = "100px";
        console.log(document.getElementById("displayArea").offsetHeight);
        newEndPop.style.top = (document.getElementById("displayArea").offsetHeight -  parseInt(newEndPop.style.height))/2 + "px";

        // Add End Pop Up Text
        var endText = document.createElement("P");
        endText.innerHTML = "End current game and <br> play a new puzzle?<br>";
        newEndPop.appendChild(endText);

        // Add Restart Button Div
        var restart = document.createElement("DIV");
        restart.setAttribute("class", "endBtn");
        restart.setAttribute("id", "restart");
        restart.addEventListener("click", function () {
            gameControl.clickRestart();
        });
        restart.innerHTML = "Restart";
        newEndPop.appendChild(restart);

        // Add Cancel Button Div
        var cancel = document.createElement("DIV");
        cancel.setAttribute("class", "endBtn");
        cancel.setAttribute("id", "cancel");
        cancel.addEventListener("click", function () {
            gameControl.resumeTimer();
            gameView.blurGrid();
            var endPop = document.getElementById("endGamePop");
            gameView.togglePopupView(endPop);
        });
        cancel.innerHTML = "Cancel";
        newEndPop.appendChild(cancel);

        // Add the End Pop Up form to the Display Area
        newPopCont.appendChild(newEndPop);
    };

    function FinishPop(){
        var winSound = document.getElementById("winSound");
        winSound.play();


        var newPopCont = document.createElement("DIV");
        newPopCont.setAttribute("id", "popContainer");
        document.body.appendChild(newPopCont);
        var newHaze = document.createElement("DIV");
        newHaze.setAttribute("id", "haze");
        newPopCont.appendChild(newHaze);

        var newFinish = document.createElement("DIV");
        newFinish.setAttribute("class", "popUp");
        newFinish.setAttribute("id", "puzzleFinish");
        newFinish.style.height = "150px";
        newFinish.style.top = (document.getElementById("displayArea").offsetHeight -  parseInt(newFinish.style.height))/2 + "px";
        var closeFinBtn = closeBtn();
        closeFinBtn.setAttribute("id", "closeFinish");
        closeFinBtn.addEventListener("click", function () {
            var FinishPop = document.getElementById("puzzleFinish");
            gameView.togglePopupView(FinishPop);
        });
        newFinish.appendChild(closeFinBtn);

        var score = gameControl.stopTimer();
        var finishMsg = document.createElement("P");
        finishMsg.innerHTML = "Well done! Your score for this puzzle is " + score;
        newFinish.appendChild(finishMsg);

        var highScoreMsg = document.createElement("P");
        highScoreMsg.setAttribute("id", "highScoreMsg");
        highScoreMsg.innerHTML = "Please enter your name for the highscore charts";
        newFinish.appendChild(highScoreMsg);

        var playerName = document.createElement("input");
        playerName.setAttribute("type", "text");
        newFinish.appendChild(playerName);
        newPopCont.appendChild(newFinish);
        this.view = newFinish;

        newPopCont.appendChild(newFinish);
        this.view = newFinish;
    }

    function HelpPop() {
        var newPopCont = document.createElement("DIV");
        newPopCont.setAttribute("id", "popContainer");
        document.body.appendChild(newPopCont);
        var newHaze = document.createElement("DIV");
        newHaze.setAttribute("id", "haze");
        newPopCont.appendChild(newHaze);

        // Created a new Help Popup Form
        var newHelpPop = document.createElement("DIV");
        newHelpPop.setAttribute("class", "popUp");
        newHelpPop.setAttribute("id", "HelpPop");
        newHelpPop.style.height = "260px";
        newHelpPop.style.top = (document.getElementById("displayArea").offsetHeight -  parseInt(newHelpPop.style.height))/2 + "px";

        var closeHelpBtn = closeBtn();
        closeHelpBtn.setAttribute("id", "closeHelp");
        closeHelpBtn.addEventListener("click", function () {
            var HelpPop = document.getElementById("HelpPop");
            gameView.togglePopupView(HelpPop);
            gameControl.resumeTimer();
            gameView.blurGrid();
        });
        newHelpPop.appendChild(closeHelpBtn);

        // Add Help Title
        var helpHeading = document.createElement("H2");
        helpHeading.innerHTML = "Game Instructions";
        newHelpPop.appendChild(helpHeading);

        var helpList = document.createElement("div");
        helpList.setAttribute("id", "explainCont");
        //
        var editExplanation = document.createElement("div");
        editExplanation.setAttribute("class", "helpExplan");
        editExplanation.innerHTML = "<i class='material-icons'>edit</i> toggle note mode<br>";
        helpList.appendChild(editExplanation);

        //
        var checkExplanation = document.createElement("div");
        checkExplanation.setAttribute("class", "helpExplan");
        checkExplanation.innerHTML = "<i class='material-icons'>done</i> show puzzle errors<br>";
        helpList.appendChild(checkExplanation);

        //
        var highlightExplanation = document.createElement("div");
        highlightExplanation.setAttribute("class", "helpExplan");
        highlightExplanation.innerHTML =
            "Double click/tap any black puzzle number to highlight all numbers of that value";
        helpList.appendChild(highlightExplanation);

        newHelpPop.appendChild(helpList);
        newPopCont.appendChild(newHelpPop);
        this.view = newHelpPop;
    }

    function LoginPop() {
        var newPopCont = document.createElement("DIV");
        newPopCont.setAttribute("id", "popContainer");
        document.body.appendChild(newPopCont);
        var newHaze = document.createElement("DIV");
        newHaze.setAttribute("id", "haze");
        newPopCont.appendChild(newHaze);

        // Created a new Login Popup Form
        var newLoginPop = document.createElement("DIV");
        newLoginPop.setAttribute("class", "popUp");
        newLoginPop.setAttribute("id", "LoginPop");
        newLoginPop.style.height = "260px";
        newLoginPop.style.top = (document.getElementById("displayArea").offsetHeight -  parseInt(newLoginPop.style.height))/2 + "px";
    }

    this.initLoading = function () {
        var newPopCont = document.createElement("DIV");
        newPopCont.setAttribute("id", "popContainer");
        document.body.appendChild(newPopCont);

        var newHaze = document.createElement("DIV");
        newHaze.setAttribute("id", "haze");
        newPopCont.appendChild(newHaze);

        var newLoad = document.createElement("div");
        newLoad.setAttribute("class", "popUp");
        newLoad.setAttribute("id", "loadContainer");
        newPopCont.appendChild(newLoad);
        newLoad.style.top = (document.getElementById("displayArea").offsetHeight - newLoad.offsetHeight)/2 + "px";

        var loadingText = document.createElement("p");
        loadingText.innerHTML = "Generating Puzzle";
        newLoad.appendChild(loadingText);

        var ballCont = document.createElement("div");
        ballCont.setAttribute("id", "ballContainer");
        newLoad.appendChild(ballCont);

        for(var i = 0; i < 5; i++) {
            var loadBall = document.createElement("span");
            ballCont.appendChild(loadBall);
        }
    };

    this.toggleSelect = function () {
        if (gameView.selectToggle() == false) {
            gameView.expandSelect();
        } else {
            gameView.collapseSelect();
        }
    };

    this.noteMode = function() {
        return noteMode;
    };


    // Puzzle Functions
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

    function solvePuzzle(_currentRow, _currentCol, _array) {
        if (_currentRow == 9) {
            return true;
        }
        // If cell is 0 and current col is not the end
        if (_array[_currentRow][_currentCol] != 0) {
            if (_currentCol == 8) {
                if (solvePuzzle(_currentRow + 1, 0, _array))
                    return true;
            }
            else if (solvePuzzle(_currentRow, _currentCol + 1, _array))
                return true;
        }
        else {
            var rand = generateRow();
            for (var i = 0; i < 9; i++) {
                if (checkValue(_currentRow, _currentCol, rand[i], _array) == true) {
                    _array[_currentRow][_currentCol] = rand[i];
                    if (solvePuzzle(_currentCol == 8 ? _currentRow + 1 : _currentRow, (_currentCol + 1) % 9, _array))
                        return true;
                    else
                        _array[_currentRow][_currentCol] = 0;
                }
            }
        }
        return false;
    }

    function checkValue(_row, _col, _value, _array) {
        for(var i = 0; i < 9; i++) {
            if (i != _col) {
                if (_array[_row][i] == _value)
                    return false;
            }
            if (i != _row) {
                if (_array[i][_col] == _value)
                    return false;
            }
        }
        var row1 = (_row+2)%3;
        var row2 = (_row+4)%3;
        var col1 = (_col+2)%3;
        var col2 = (_col+4)%3;
        var startRow = Math.floor(_row / 3) * 3;
        var startCol = Math.floor(_col / 3) * 3;
        if(_array[row1+startRow][col1+startCol] == _value||
            _array[row2+startRow][col1+startCol] == _value ||
            _array[row1+startRow][col2+startCol] == _value||
            _array[row2+startRow][col2+startCol] == _value)
            return false;
        return true;
    }

    function generateRow() {
        var row = [];
        while (row.length < 9) {
            var newRand = ((Math.floor(Math.random() * 1000)) % 9) + 1;
            var duplicate = false;
            for (var i = 0; i < row.length; i++) {
                if (row[i] == newRand)
                    duplicate = true;
            }
            if (duplicate == false)
                row.push(newRand);
        }
        return row;
    }

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

    this.startTimer = function () {
        gameModel.setEndTime("00:00:00");
        viewUpdateInterval = setInterval(function () {
            gameView.updateTimerDisplay();
        }, 1000);
        gameModel.setStart(currentTime());
    };

    this.pauseTimer = function() {
        currentTimeElapsed = this.getElapsedTime();
        this.stopTimer();
        pausedTimeStart = currentTime();
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
    };

    var currentTime = function () {
        return ((new Date()).getTime() / 1000);
    };

    var addZero = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    var formatTime = function (time) {

        var h = addZero(Math.floor(time / 3600));
        time %= 3600;

        var m = addZero(Math.floor(time / 60));
        time %= 60;

        var s = addZero(Math.floor(time));

        return (h + ':' + m + ':' + s);
    };

    this.stopTimer = function () {
        clearInterval(viewUpdateInterval);
        gameModel.setEndTime(this.getElapsedTime());
        return gameModel.endTime();
    };

    this.getElapsedTime = function () {
        return formatTime((currentTime() - gameModel.startTime()));
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

function SudokuView() {
    var startPg = new StartPage();
    var lastHighlighted;
    var highToggle = false;
    var popUpVisible = false;
    var puzzleLoaded = false;
    var clickTimer = null;
    var inputGridVisible = false;
    var isMobile;
    var viewWidth;
    var viewHeight;
    var selectToggle = false;
    var fontNormal;
    var fontBold;
    var fontNote;
    var cellSize;
    var gridBlurred = false;

    function StartPage() {
        this.open = true;
        getBrowserInfo();

        var startScreen = document.createElement("div");
        startScreen.setAttribute("id", "startPage");
        startScreen.style.width = window.innerWidth + "px";
        document.body.appendChild(startScreen);
        this.form = startScreen;

        var startLogo = document.createElement("img");
        startLogo.setAttribute("id", "startLogo");
        startLogo.src = "logo.png";
        startScreen.appendChild(startLogo);

        var startMenuCont = document.createElement("div");
        startMenuCont.setAttribute("id", "startMenuCont");
        startScreen.appendChild(startMenuCont);

        var startGameBtn = document.createElement("div");
        startGameBtn.setAttribute("id", "startBtn");
        startGameBtn.innerHTML = "START GAME";

        startGameBtn.addEventListener("click", function() {
            gameView.navTone();
            if(gameView.selectToggle() == true)
                gameView.collapseSelect();
            gameView.slideStartClose();

            setTimeout(function() {
                if (gameView.loaded() == false && gameModel.completed() == false) {
                    if (document.getElementById("selText").innerHTML == "Difficulty") {
                        document.getElementById("selText").innerHTML = "Medium";
                    }
                    document.getElementById("puzzleDiffText").innerHTML = document.getElementById("selText").innerHTML;
                    gameView.showLoading();
                    setTimeout(function() {
                        gameControl.loadSelectedPuzzle();
                    }, 300);
                }
            },350);
        });
        startMenuCont.appendChild(startGameBtn);

        var startDiffCont = document.createElement("div");
        startDiffCont.setAttribute("id", "selMenuCont");
        startMenuCont.appendChild(startDiffCont);

        var startDiffText = document.createElement("div");
        startDiffText.setAttribute("id", "selText");
        startDiffText.innerHTML = "Difficulty";
        startDiffText.addEventListener("click", function () {
            gameView.navTone();
            gameControl.toggleSelect();
        });
        startDiffCont.appendChild(startDiffText);

        var startDiffDrop = document.createElement("div");
        startDiffDrop.setAttribute("id", "selDropCont");
        startDiffCont.appendChild(startDiffDrop);

        var startDiffEasy = document.createElement("div");
        startDiffEasy.setAttribute("class", "selOpt");
        startDiffEasy.setAttribute("title", "Easy");
        startDiffEasy.innerHTML = "Easy";
        startDiffDrop.appendChild(startDiffEasy);

        var startDiffMed = document.createElement("div");
        startDiffMed.setAttribute("class", "selOpt");
        startDiffMed.setAttribute("title", "Medium");
        startDiffMed.innerHTML = "Medium";
        startDiffDrop.appendChild(startDiffMed);

        var startDiffHard = document.createElement("div");
        startDiffHard.setAttribute("class", "selOpt");
        startDiffHard.setAttribute("title", "Hard");
        startDiffHard.innerHTML = "Hard";
        startDiffDrop.appendChild(startDiffHard);

        var startDiffCrazy = document.createElement("div");
        startDiffCrazy.setAttribute("class", "selOpt");
        startDiffCrazy.setAttribute("title", "Crazy");
        startDiffCrazy.innerHTML = "Crazy";
        startDiffDrop.appendChild(startDiffCrazy);

        // Add event for clicking any of the drop down options
        var selOpts = document.getElementsByClassName("selOpt");
        for (var i = 0; i < selOpts.length; i++) {
            selOpts[i].addEventListener("click", function () {
                gameView.navTone();
                gameControl.toggleSelect();
                startDiffText.innerHTML = this.title;
                gameModel.setDifficulty(this.title.toLowerCase());
                resetPreview();
                setTimeout(function() {
                    if (startDiffText.innerHTML == "Easy")
                        loadPreview(easyPreview);
                    else if (startDiffText.innerHTML == "Medium")
                        loadPreview(medPreview);
                    else if (startDiffText.innerHTML == "Hard")
                        loadPreview(hardPreview);
                    else if (startDiffText.innerHTML == "Crazy")
                        loadPreview(crazyPreview);
                }, 300);
            });
        }

        var signInBtnBR = document.createElement("BR");
        startScreen.appendChild(signInBtnBR);

        var diffPreview = drawPreviewGrid(9,9);
        startScreen.appendChild(diffPreview);
        setTimeout(function() {
            loadPreview(medPreview);
        },100);


        function drawPreviewGrid(numOfRows, numOfColumns) {
            var newPreviewGrid = document.createElement("div");
            newPreviewGrid.setAttribute("id", "previewGrid");
            newPreviewGrid.setAttribute("class", "sudokuGrid");

            var prevCellSize;
            var prevGridSize;
            if(window.innerWidth < window.innerHeight) {
                if (isMobile && document.body.offsetWidth < 420){
                    prevGridSize = window.innerWidth * 0.7;
                    prevCellSize = ((prevGridSize/9));

                }
                else {
                    prevGridSize = window.innerWidth * 0.5;
                    prevCellSize = ((prevGridSize/9));
                }
            }
            else if (window.innerWidth > window.innerHeight)
            {
                prevGridSize = window.innerHeight * 0.5;
                prevCellSize = ((prevGridSize/9));
            }
            console.log(prevGridSize);
            console.log(prevCellSize);

            // Create a new element newTable of the HTML type Table
            var newPrevTable = document.createElement("table");
            newPrevTable.setAttribute("id", "prevTable");
            newPrevTable.setAttribute("style", "border-collapse: collapse; ");
            newPreviewGrid.appendChild(newPrevTable);

            for (var i = 0; i < numOfRows; i++) {
                var prevRow = document.createElement("tr");
                if (i == 0) {
                    prevRow.setAttribute("style", "border-top: solid; border-color: black;");
                }
                else if ((i + 1) % Math.sqrt(numOfRows) == 0) {
                    prevRow.setAttribute("style", "border-bottom: solid; border-color: black;");
                }
                else {
                    prevRow.setAttribute("style", "border-color: black;");
                }
                prevRow.setAttribute("id", "prevRow" + i);
                newPrevTable.appendChild(prevRow);
                for (var j = 0; j < numOfColumns; j++) {
                    var prevCell = document.createElement("TD");
                    prevCell.setAttribute("class", "gridCell prevCell");
                    prevCell.style.height = prevCellSize + "px";
                    prevCell.style.width = prevCellSize + "px";
                    prevCell.style.fontSize = prevCellSize - 14 + "px";
                    prevCell.setAttribute("unselectable", "on");
                    if (isMobile && document.body.offsetWidth < 420)
                        prevCell.style.fontWeight = "bold";
                    if (j == 0)
                        prevCell.style.borderLeft = "solid black";
                    else if ((j + 1) % Math.sqrt(numOfColumns) == 0)
                        prevCell.style.borderRight = "solid black";
                    prevRow.appendChild(prevCell);
                }
            }
            return newPreviewGrid;
        }

        function loadPreview(_passedPuzzle) {
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 9; y++) {
                    var newPrevNum = document.getElementById("prevTable").rows[x].cells[y];
                    if (_passedPuzzle[x][y]!= 0)
                        newPrevNum.innerHTML = _passedPuzzle[x][y];
                }
            }
            var cells = document.getElementsByClassName("prevCell");
            setTimeout(function() {
                for(var i = 0; i < cells.length; i++)
                    cells[i].style.opacity = "1";
            }, 50);
        }

        function resetPreview() {
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 9; y++) {
                    var newPrevNum = document.getElementById("prevTable").rows[x].cells[y];
                    newPrevNum.style.opacity = 0;
                    newPrevNum.innerHTML = "";
                }
            }
        }

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
    }

    this.start = function() {
        return startPg;
    };

    this.slideStartOpen = function() {
        startPg.open = true;
        startPg.form.style.visibility = "visible";
        startPg.form.style.width = window.innerWidth + "px";
        startPg.form.style.left = 0 + "px";
    };

    this.slideStartClose = function() {
        startPg.open = false;
        var startProperties = window.getComputedStyle(startPg.form);
        var currentStartWidth = startProperties.width;
        console.log(parseInt(currentStartWidth));
        startPg.form.style.left = (0 - parseInt(currentStartWidth)) + "px";
        setTimeout(function() {
            startPg.form.style.visibility = "hidden";
        },510);
    };

    this.drawGameGrid = function (numOfRows, numOfColumns) {

        // If the passed number of rows and number of columns are equal
        // AND these dimensions are perfect squares (evenly divisible by their square roots)
        var sqrtOfRows = Math.sqrt(numOfRows);
        var isPerfectSqr = (sqrtOfRows / Math.ceil(sqrtOfRows));
        if (numOfRows == numOfColumns && isPerfectSqr == 1 && numOfRows <= 16 && numOfRows >= 4) {
            // Create a variable newGameGrid for the gameGrid div element in the HTML file
            var newGameGrid = document.getElementById("gameGrid");
            gameModel.setGameGrid(newGameGrid);
            var gridSize;
            // Define the CSS style of gameGrid to have a black border with curved corners and a white background
            if(gameView.getViewWidth() < gameView.getViewHeight()) {
                if (isMobile && document.body.offsetWidth < 420){
                    gridSize = gameView.getViewWidth() * 0.9;
                    cellSize = ((gridSize/9));
                }
                else {
                    gridSize = gameView.getViewWidth() * 0.8;
                    cellSize = ((gridSize/9));
                }
            }

            else if (gameView.getViewWidth() > gameView.getViewHeight())
            {
                gridSize = gameView.getViewHeight() * 0.75;
                cellSize = ((gridSize/9));
            }
            console.log(gridSize);
            console.log(cellSize);

            // Create a new element newTable of the HTML type Table
            var newTable = document.createElement("TABLE");
            gameModel.setGameTable(newTable);
            // Set the ID of newTable to 'gameTable'
            gameModel.table().setAttribute("id", "gameTable");
            // Define the CSS style of newTable to have sans serif font of medium size, and cells with collapsed borders
            gameModel.table().setAttribute("style", "border-collapse: collapse; ");
            // Append the newTable element into the newGameGrid div
            newGameGrid.appendChild(gameModel.table());

            for (var i = 0; i < numOfRows; i++) {
                var row = document.createElement("TR");
                if (i == 0) {
                    row.setAttribute("style", "border-top: solid; border-color: black;");
                }
                else if ((i + 1) % Math.sqrt(numOfRows) == 0) {
                    row.setAttribute("style", "border-bottom: solid; border-color: black;");
                }
                else {
                    row.setAttribute("style", "border-color: black;");
                }
                row.setAttribute("id", "row" + i);
                gameModel.table().appendChild(row);
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
            }
            gameModel.setRows(numOfRows);
            gameModel.setColumnNum(numOfColumns);
        }
        else {
            gameModel.grid().innerHTML = "<br>Invalid grid size passed to generateGameGrid!<br><br>";
        }
        gameModel.setCompleted(false);
    };

    this.resizeView = function() {
        getBrowserInfo();
        var expandHeight = 110;
        if (gameView.start().open == false) {
            gameView.start().form.style.left = (0 - window.innerWidth) + "px";
            gameView.start().form.style.top = 0;
        }
        gameView.start().form.style.width = window.innerWidth + "px";
        gameView.start().form.style.height = window.innerHeight + "px";

        if(document.body.offsetWidth < 600) {
            document.getElementById("middleButtons").appendChild(document.getElementById("help"));
            document.getElementById("middleButtons").style.float = "right";
        }

        if(document.body.offsetWidth > 600) {
            document.getElementById("toolbar").appendChild(document.getElementById("help"));
            document.getElementById("help").style.float = "right";
            document.getElementById("middleButtons").style.float = "none";
        }

        var gridSize;
        if (gameView.getViewWidth() < gameView.getViewHeight()) {
            if (gameView.isMobile() && document.body.offsetWidth < 420)
                gridSize = gameView.getViewWidth() * 0.9;
            else
                gridSize = gameView.getViewWidth() * 0.8;
        }
        else if (gameView.getViewWidth() > gameView.getViewHeight())
            gridSize = gameView.getViewHeight() * 0.75;
        cellSize = ((gridSize / 9));
        fontNote = cellSize/3-3;
        var prevNormalFont = fontNormal;
        var prevBoldFont = fontBold;
        fontNormal = cellSize - 14 + "px";
        fontBold = cellSize - 10 + "px";
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var cell = gameModel.table().rows[i].cells[j];
                cell.style.height = cellSize + "px";
                cell.style.width = cellSize + "px";
                if (cell.style.fontSize = prevNormalFont + "px")
                    cell.style.fontSize = fontNormal;
                else if (cell.style.fontSize = prevBoldFont + "px")
                    cell.style.fontSize = fontBold;
                if((cell.childNodes[0]) && cell.childNodes[0].className == "noteCont") {
                    var currentNotes = cell.childNodes[0];
                    currentNotes.style.height = cellSize - 2 + "px";
                    var noteList = currentNotes.querySelector(".noteList");
                    var contDimen = getComputedStyle(currentNotes);
                    noteList.style.height = contDimen.height;
                    var noteNums = currentNotes.querySelectorAll(".noteNum");
                    for(var k = 0; k< noteNums.length; k++) {
                        noteNums[k].style.height = fontNote+"px";
                        noteNums[k].style.width = fontNote+"px";
                        noteNums[k].style.fontSize = fontNote+"px";
                    }
                }
            }
        }

        if (typeof gameControl.lastClick() != "undefined") {
            var inCont = document.getElementById("inputBorder");
            var thisCell = gameControl.lastClick();
            var rect = thisCell.getBoundingClientRect();
            inCont.style.top = rect.top - ((expandHeight - parseInt(thisCell.style.width)) / 2) + "px";
            inCont.style.left = rect.left - ((parseInt(gameModel.inputGrid().style.width) - parseInt(thisCell.style.width)) / 2) + "px";
            inCont.style.display = "inline-block";
        }

        var haze = document.body.querySelector("#haze");
        if (haze) {
            haze.style.top = 0;
            haze.style.left = 0;
            haze.style.height = window.innerHeight + "px";
            haze.style.width = window.innerWidth + "px";
        }

        var pauseScreen = document.getElementById("pauseLayer");
        if(pauseScreen) {
            pauseScreen.style.height = window.innerHeight - 50 +"px";
        }
    };

    this.blurGrid = function() {
        if(gridBlurred == false) {
            document.getElementById("gameGrid").style.filter = "blur(10px)";
            document.getElementById("gameGrid").style.webkitFilter = "blur(10px)";
            gridBlurred = true;
        }
        else if (gridBlurred == true) {
            document.getElementById("gameGrid").style.filter = "blur(0px)";
            document.getElementById("gameGrid").style.webkitFilter = "blur(0px)";
            gridBlurred = false;
        }
    };

    this.highlight = function (_cell) {
        for (var j = 0; j < 9; j++) {
            changeColor(_cell.parentElement.cells[j], "#E3F2FD");
        }
        for (j = 0; j < 9; j++) {
            changeColor(gameModel.table().rows[j].cells[_cell.cellIndex], "#E3F2FD");
        }
        changeColor(_cell, "#BBDEFB");
    };

    this.unhighlight = function (_cell) {
        for (var i = 0; i < 9; i++) {
            changeColor(_cell.parentElement.cells[i], "rgba(255, 255, 255, 1.0)");
        }
        for (i = 0; i < 9; i++) {
            changeColor(gameModel.table().rows[i].cells[_cell.cellIndex], "rgba(255, 255, 255, 1.0)");
        }
        changeColor(_cell, "rgba(255, 255, 255, 1.0)");
    };

    function changeColor(object, color) {
        object.style.backgroundColor = color;
    }

    this.emphasizeSimilar = function (_cell) {
        var boldSound = document.getElementById("clickSound");
        boldSound.play();
        if (_cell.innerHTML == lastHighlighted || typeof lastHighlighted == 'undefined') {
            if (highToggle == true) {
                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 9; j++) {
                        var checkCell = gameModel.table().rows[i].cells[j];
                        var cellValue = checkCell.innerHTML;
                        if (lastHighlighted == cellValue) {
                            checkCell.style.fontSize = fontNormal;
                            checkCell.style.fontWeight = "normal";
                        }
                    }
                }
                highToggle = false;
            }
            else if (highToggle == false) {
                for (i = 0; i < 9; i++) {
                    for (j = 0; j < 9; j++) {
                        checkCell = gameModel.table().rows[i].cells[j];
                        cellValue = checkCell.innerHTML;
                        if (_cell.innerHTML == cellValue) {
                            checkCell.style.font = fontBold;
                            checkCell.style.fontSize = fontBold;
                            checkCell.style.fontWeight = "bold";
                        }
                    }
                }
                highToggle = true;
            }
        }
        if (_cell.innerHTML != lastHighlighted && typeof lastHighlighted != 'undefined') {
            for (i = 0; i < 9; i++) {
                for (j = 0; j < 9; j++) {
                    checkCell = gameModel.table().rows[i].cells[j];
                    cellValue = checkCell.innerHTML;
                    if (lastHighlighted == cellValue) {
                        checkCell.style.fontSize = fontNormal;
                        checkCell.style.fontWeight = "normal";
                    }
                }
            }
            for (i = 0; i < 9; i++) {
                for (j = 0; j < 9; j++) {
                    checkCell = gameModel.table().rows[i].cells[j];
                    cellValue = checkCell.innerHTML;
                    if (_cell.innerHTML == cellValue) {
                        checkCell.style.fontSize = fontBold;
                        checkCell.style.fontWeight = "bold";
                    }
                }
            }
        }
        lastHighlighted = _cell.innerHTML;
    };

    this.lastHighlight = function () {
        return lastHighlighted;
    };

    this.highToggle = function () {
        return highToggle;
    };

    this.textBold = function () {
        return fontBold;
    };

    this.showLoading = function () {
        gameControl.initLoading();
        var load = document.getElementById("loadContainer");
        gameView.togglePopupView(load);
    };

    this.hideLoading = function() {
        var load = document.getElementById("loadContainer");
        gameView.togglePopupView(load);
    };

    this.textNorm = function () {
        return fontNormal;
    };

    this.uncheckNum = function() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var checkCell = gameModel.table().rows[i].cells[j];
                if (checkCell.className == "gridCell gameCell inputNum" && checkCell.style.color == "red") {
                    checkCell.style.color = "#1976D2";
                }
            }
        }
    };

    this.togglePopupView = function(_div) {
        var popCont = document.getElementById("popContainer");
        if (popUpVisible == false) {
            popCont.style.display = "inline-block";
            setTimeout(function() {
                _div.style.transform = "scale(1)";
            }, 10);
            popUpVisible = true;
        }
        else if(popUpVisible == true) {
            _div.style.transform = "scale(0.01)";
            setTimeout(function() {
                popCont.parentNode.removeChild(popCont);
            }, 200);
            popUpVisible = false;
        }
    };

    this.loadPuzzle = function (_passedPuzzle) {
        gameView.hideLoading();
        gameModel.setInputNum(0);
        // Repeat loop for each row in gameTable
        var inputCellCount = 0;
        for (var x = 0; x < gameModel.rowsNum(); x++) {
            // Repeat loop for each cell in the row
            for (var y = 0; y < gameModel.columnsNum(); y++) {
                // Create an integer currentPuzzleNum for the current read-in value from the passed puzzle array
                var currentPuzzleNum = _passedPuzzle[x][y];
                // If the read-in value is not 0 (blank)
                if (currentPuzzleNum != 0) {
                    // Create a new div element newGiveText for the number to be displayed in
                    var newGivenCell = gameModel.table().rows[x].cells[y];
                    newGivenCell.setAttribute("class", "gridCell gameCell puzzleNum");
                    newGivenCell.innerHTML = currentPuzzleNum;

                    // If game is on desktop, set double click event for
                    // emphasizing similar numbers
                    if(gameView.isMobile() == false) {
                        newGivenCell.addEventListener("dblclick", function () {
                            gameView.emphasizeSimilar(this);
                        });

                        newGivenCell.addEventListener("click", function() {
                            if (gameView.getInputVisibility() == true) {
                                gameView.closeInputGrid();
                                gameView.unhighlight(gameControl.lastClick());
                            }
                        });
                    }
                    // If game is on mobile, set double tap event for
                    // emphasizing similar numbers
                    else {
                        newGivenCell.addEventListener("touchstart", function(e){
                            if (clickTimer == null) {
                                clickTimer = setTimeout(function () {
                                    clickTimer = null;
                                    if (gameView.getInputVisibility() == true) {
                                        gameView.closeInputGrid();
                                        gameView.unhighlight(gameControl.lastClick());
                                    }
                                }, 300)
                            } else {
                                clearTimeout(clickTimer);
                                clickTimer = null;
                                gameView.emphasizeSimilar(this);
                            }
                            e.preventDefault();
                        }, false);
                    }

                }

                // If the read-in value is 0 (blank)
                else if (currentPuzzleNum == 0) {
                    // Create a new div element newInputText for the user to enter in numbers later
                    var newInputCell = gameModel.table().rows[x].cells[y];
                    // Assign the div element the class of 'inputNum'
                    newInputCell.setAttribute("class", "gridCell gameCell inputNum");
                    newInputCell.style.color = "#1976D2";
                    inputCellCount++;
                    newInputCell.addEventListener("click", function () {
                        if (gameView.getInputVisibility() == true) {
                            gameView.closeInputGrid();
                            gameView.unhighlight(gameControl.lastClick());
                        }
                        else {
                            gameControl.clickCell(this);
                        }
                    });
                }

            }
        }
        gameModel.setInputNum(inputCellCount);
        gameControl.startTimer();
        // Set puzzleLoaded to true so that the Start Game button can't load the puzzle again.
        puzzleLoaded = true;
        gameModel.setFilledInputs(0);
        var cells = document.querySelectorAll(".gameCell");
        setTimeout(function() {
            for(var i = 0; i < cells.length; i++)
                cells[i].style.opacity = 1;
        }, 100);
    };

    this.loaded = function () {
        return puzzleLoaded;
    };

    this.setLoaded = function (_state) {
        puzzleLoaded = _state;
    };

    this.openInputGrid = function (thisCell) {
        var openSound = document.getElementById("openingMenuSound");
        openSound.play();
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
        var closeSound = document.getElementById("closingMenuSound");
        closeSound.play();
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

    this.getInputVisibility = function () {
        return inputGridVisible;
    };

    this.setInputVisibility = function (_state) {
        inputGridVisible = _state;
    };

    this.resetTimerDisplay = function () {
        document.getElementById('gameTimerDisplay').innerHTML = "00:00:00";
    };

    this.updateTimerDisplay = function () {
        document.getElementById('gameTimerDisplay').innerHTML = gameControl.getElapsedTime();
    };

    this.isMobile = function() {
        return isMobile;
    };

    function setIsMobile(_mobileBool) {
        isMobile = _mobileBool;
    }

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

    this.selectToggle = function() {
        return selectToggle;
    };

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

    function getBrowserInfo() {
        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        var is_android = navigator.platform.toLowerCase().indexOf("android") > -1;

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || is_firefox && is_android)
            setIsMobile(true);
        else
            setIsMobile(false);

        setViewHeight(window.innerHeight);
        setViewWidth(window.innerWidth);

        console.log("isMobile = " + isMobile);
        console.log("Width: " + viewWidth);
        console.log("Height: " + viewHeight);
    }

    this.drawMiniGrid = function(_cell) {
        var noteCont = document.createElement("DIV");
        noteCont.setAttribute("class", "noteCont");
        _cell.appendChild(noteCont);

        var noteList = document.createElement("DIV");
        noteList.setAttribute("class", "noteList");
        var contDimen = getComputedStyle(noteCont);
        noteList.style.height = contDimen.height;

        noteCont.appendChild(noteList);
        var valIncr = 1;
        for (var i = 0; i < 3; i++) {
            var noteRow = document.createElement("DIV");
            noteRow.setAttribute("class", "noteRow");
            fontNote = cellSize/3-3;

            for(var j = 0; j < 3; j++) {
                var noteNumber = document.createElement("DIV");
                noteNumber.setAttribute("class", "noteNum");
                noteNumber.value = valIncr;
                noteNumber.style.height = fontNote+"px";
                noteNumber.style.width = fontNote+"px";
                noteNumber.style.fontSize = fontNote+"px";
                noteNumber.style.opacity = "0";
                noteNumber.innerHTML += valIncr;
                noteRow.appendChild(noteNumber);
                valIncr++;
            }
            noteList.appendChild(noteRow);
        }
    };

    this.isFirefox = function() {
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            console.log("This is Firefox");
            return true
        }
        else
            return false;
    };

    this.navTone = function() {
        var navSound = document.getElementById("navSound");
        navSound.play();
    };
}