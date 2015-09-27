// JavaScript Sudoku Table Generation Assignment
// Author:		 Justin Nelson
// Assignment:	 Assignment 2
// File:		 grid.js
// Instructor:   Lynn Thackeray
// Class:		 CS 2550 Section 001
// Date Written: 9/23/2015
// Description:  Generates a sudoku grid using js to define HTML and CSS
//               and populates the grid from a passed puzzle setup array.

// A sample puzzle setup for a 9x9 sudoku grid
var easyGrid = [[5, 3, 0, 0, 7, 0, 9, 4, 0],
    [6, 0, 8, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [2, 4, 0, 0, 8, 0, 0, 7, 9]];

var mediumGrid = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]];

var hardGrid = [[0, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 0, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 0, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 0]];

// Create a variable gameTable for the gameTable table element in the HTML file
var gameTable;
// Create a variable tableRows for the number of rows in the table grid
var tableRowsNum;
// Create a variable tableCells for the number of cells in the given row (row[x])
var tableCellsNum;

var currentDifficulty = 1;

function setSelectedDiff(value) {
    currentDifficulty = value;
    console.log(currentDifficulty);
}

function clickStart() {
    if (puzzleLoaded !== false) {
        if (confirm("Are you sure you want to end your current game?")) {
            resetGameTable();
            loadSelectedPuzzle();
        }
    }
    else {
        loadSelectedPuzzle();
    }
}

function loadSelectedPuzzle() {
    if (currentDifficulty == 0) {
        loadPuzzle(easyGrid);
    }
    else if (currentDifficulty == 1) {
        loadPuzzle(mediumGrid);
    }
    else if (currentDifficulty == 2) {
        loadPuzzle(hardGrid);
    }
}

// generateGameGrid function
// Purpose: Generate a sudoku game grid of a given size using passed values
// Parameters: Integers for the number of rows and number of columns to generate
// Returns: None
function generateGameGrid(numOfRows, numOfColumns) {

    // If the passed number of rows and number of columns are equal
    // AND these dimensions are perfect squares (evenly divisible by their square roots)
    var sqrtOfRows = Math.sqrt(numOfRows);
    var isPerfectSqr = (sqrtOfRows / Math.ceil(sqrtOfRows));
    if (numOfRows == numOfColumns && isPerfectSqr == 1 && numOfRows <= 16 && numOfRows >= 4) {
        // Create a variable newGameGrid for the gameGrid div element in the HTML file
        var newGameGrid = document.getElementById("gameGrid");
        // Create a variable gridSize and calculate the width and height of the div element.
        var gridSize = ((numOfRows * 33) + (2 * sqrtOfRows) - 1);
        // Define the CSS style of gameGrid to have a black border with curved corners and a white background
        newGameGrid.setAttribute("style", "border: solid; background: #ffffff; margin-left: auto; margin-right: auto;" +
            "border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px;" +
            "width: " + gridSize + "px; height: " + gridSize + "px;");

        // Create a new element newTable of the HTML type Table
        var newTable = document.createElement("TABLE");
        // Set the ID of newTable to 'gameTable'
        newTable.setAttribute("id", "gameTable");
        // Define the CSS style of newTable to have sans serif font of medium size, and cells with collapsed borders
        newTable.setAttribute("style", "font-family: sans-serif; font-size: medium; border-collapse: collapse;");
        // Append the newTable element into the newGameGrid div
        newGameGrid.appendChild(newTable);
        gameTable = document.getElementById("gameTable");
        for (var i = 0; i < numOfRows; i++) {
            var row = document.createElement("TR");
            if ((i + 1) % Math.sqrt(numOfRows) == 0 && i != (numOfRows - 1)) {
                row.setAttribute("style", "border-bottom: solid; border-color: black;");
            }
            else {
                row.setAttribute("style", "border-color: black;");
            }
            row.setAttribute("id", "row" + i);
            newTable.appendChild(row);
            for (var j = 0; j < numOfColumns; j++) {
                var cell = document.createElement("TD");
                if ((j + 1) % Math.sqrt(numOfColumns) == 0 && j != (numOfColumns - 1)) {
                    cell.setAttribute("style", "border: 1px solid black; height: 30px; width: 30px; text-align: center; border-right: solid;");
                }
                else {
                    cell.setAttribute("style", "border: 1px solid black; height: 30px; width: 30px; text-align: center;");
                }

                row.appendChild(cell);
            }
        }

        tableRowsNum = numOfRows;
        tableCellsNum = numOfColumns;
    }
    else {
        document.getElementById("gameGrid").innerHTML = "<br>Invalid grid size passed to generateGameGrid!<br><br>";
    }
}

function resetGameTable() {
    var gTable = document.getElementById("gameTable");
    var popMenu = document.getElementById("popMenu");
    gTable.parentNode.removeChild(popMenu);
    gTable.parentNode.removeChild(gTable);
    generateGameGrid(9, 9);
    puzzleLoaded = false;
}

// Boolean value for whether a puzzle has already been loaded into the game grid.
var puzzleLoaded = false;

// loadPuzzle function
// Purpose: Populate a sudoku grid with values from a passed multi-dimensional array
// Parameters: A multi-dimensional array of values for the initial puzzle setup
// Returns: None
function loadPuzzle(puzzleName) {
    // If a puzzle has not been previously loaded into the game grid
    if (puzzleLoaded == false) {
        // If the dimensions of the puzzle and the dimensions of the table are the same
        if (puzzleName.length == tableRowsNum) {
            // Repeat loop for each row in gameTable
            for (var x = 0; x < tableRowsNum; x++) {
                // Repeat loop for each cell in the row
                for (var y = 0; y < tableCellsNum; y++) {

                    // Create an integer currentGivenNum for the current read-in value from the passed puzzle array
                    var currentGivenNum = puzzleName[x][y];

                    // If the read-in value is not 0 (blank)
                    if (currentGivenNum != 0) {

                        // Create a new div element newGiveText for the number to be displayed in
                        var newGivenText = gameTable.rows[x].cells[y];

                        // Assign the div element the class of 'puzzleNum'
                        newGivenText.setAttribute("class", "puzzleNum");
                        newGivenText.setAttribute("id", x + "," + y);
                        // Set the CSS style for the puzzleNum class to have black, bold font
                        newGivenText.style.fontWeight = "bold";
                        // Set the innerHTML text value for the div element to the value of the current array element
                        newGivenText.innerHTML = currentGivenNum;
                    }

                    // If the read-in value is 0 (blank)
                    else if (currentGivenNum == 0) {
                        // Create a new div element newInputText for the user to enter in numbers later
                        var newInputText = gameTable.rows[x].cells[y];
                        // Assign the div element the class of 'inputNum'
                        newInputText.setAttribute("class", "inputNum");
                        newInputText.setAttribute("id", x + "," + y);
                        newInputText.style.fontStyle = "italics";
                        newInputText.style.fontWeight = "bold";
                        newInputText.style.color = "#1c86ee";
                        newInputText.style.borderColor = "black";
                    }
                }
            }

            for (x = 0; x < tableRowsNum; x++) {
                for (y = 0; y < tableCellsNum; y++) {
                    var currentCell = gameTable.rows[x].cells[y];
                    if (currentCell.className == "inputNum") {
                        currentCell.onclick = function () {
                            clickCell(this);
                        };
                    }
                }
            }
            // Set puzzleLoaded to true so that the Start Game button can't load the puzzle again.
            timerInstance.start();
            puzzleLoaded = true;
            inputDisplay.initializePopMenu();
        }
    }
}

var lastClicked;
function clickCell(clickedCell) {
    if (typeof lastClicked != 'undefined' && lastClicked != clickedCell) {
        if (lastClicked.parentElement != clickedCell.parentElement) {
            for (var i = 0; i < 9; i++) {
                highlight(lastClicked.parentElement.cells[i], "white");
            }
        }
        if (lastClicked.cellIndex != clickedCell.cellIndex) {
            for (i = 0; i < 9; i++) {
                highlight(gameTable.rows[i].cells[lastClicked.cellIndex], "white");
            }
        }
        highlight(lastClicked, "white");
        inputDisplay.close();
    }
    for (var j = 0; j < 9; j++) {
        highlight(clickedCell.parentElement.cells[j], "#d6ebf2");
    }
    for (j = 0; j < 9; j++) {
        highlight(gameTable.rows[j].cells[clickedCell.cellIndex], "#d6ebf2");
    }
    highlight(clickedCell, "#add8e6");
    lastClicked = clickedCell;
    if (inputDisplay.getVisibility() == false) {
        inputDisplay.open(lastClicked);
    }
}

function highlight(object, color) {
    object.style.backgroundColor = color;
}
