/* JavaScript Sudoku Generator
 Author:		Justin Nelson
 File:		    genv5.js
 Date Written:  06/20/2016
 Description:   Generates a sudoku grid using js to define HTML and CSS
 and populates the grid from a passed puzzle setup array.
 */

function genPuzzle(_diff) {
    var puzzleGenerated = false;
    var newSolut;
    var givenPuzzle;
    var checkPuzzle;
    var startTime = new Date().getTime();
    var endTime;
    var givenNums;
    var lowerBound;
    var upperBound;
    var timeout;

    var diffSel = _diff;

    while (puzzleGenerated == false) {
        var digLoop = true;
        var cellCheck;
        var givenIndex = 0;
        if (diffSel == "Easy") {
            var easyRange = [32, 33, 34, 35];
            givenIndex = Math.floor(Math.random() * 1000) % 4;
            givenNums = easyRange[givenIndex];
            lowerBound = 3;
            upperBound = 6;
            timeout = 1500;
        }
        if (diffSel == "Medium") {
            var medRange = [28, 29, 30, 31];
            givenIndex = Math.floor(Math.random() * 1000) % 4;
            givenNums = medRange[givenIndex];
            lowerBound = 2;
            upperBound = 5;
            timeout = 1500;
        }
        if (diffSel == "Hard") {
            var hardRange = [25, 26, 27];
            givenIndex = Math.floor(Math.random() * 1000) % 3;
            givenNums = hardRange[givenIndex];
            lowerBound = 1;
            upperBound = 4;
            timeout = 1500;
        }
        if (diffSel == "Crazy") {
            var crazyRange = [21, 22, 23, 24];
            givenIndex = Math.floor(Math.random() * 1000) % 4;
            givenNums = crazyRange[givenIndex];
            lowerBound = 0;
            upperBound = 3;
            timeout = 8000;
        }

        while (digLoop == true) {
            newSolut = new blank;
            givenPuzzle = solve(newSolut.grid);

            //console.log(newSolut.grid);
            var genPosStart = new Date().getTime();
            var genPosEnd;

            var needToRemove = 81 - givenNums;
            var removed = 0;
            var digSuccess = false;
            var numOfGivensRow = [9, 9, 9, 9, 9, 9, 9, 9, 9];
            var numOfGivensCol = [9, 9, 9, 9, 9, 9, 9, 9, 9];
            var randRows = [];
            var equalizeRuns = 0;
            var blanks;
            var diggable;
            var deadEndCount = 0;
            while (digSuccess == false && deadEndCount <= 10) {
                if(needToRemove - 10 > removed || equalizeRuns > 12) {
                    if(randRows.length == 0) {
                        randRows = generateRow();
                        if (equalizeRuns > 12)
                            deadEndCount++;
                    }
                    var curRow = (randRows.pop() - 1);
                    blanks = scanRowBlanks(givenPuzzle[curRow]);
                    diggable = shuffleArray(blanks);
                }
                else {
                    equalizeRuns++;
                    var highestRow = 0;
                    for (var k = 1; k < numOfGivensRow.length; k++){
                        if(numOfGivensRow[highestRow] < numOfGivensRow[k])
                            highestRow = k;
                    }
                    curRow = highestRow;

                    var highestCol = 0;
                    for (k = 1; k < numOfGivensCol.length; k++){
                        if(numOfGivensCol[highestCol] < numOfGivensCol[k])
                            highestCol = k;
                    }
                    diggable = [highestCol];
                }
                var numToRemove = 0;
                while(numToRemove == 0){
                    numToRemove = Math.floor(Math.random() * 1000) % 6;
                }
                var removedOnPass = 0;
                var failedDigs = 0;
                while (removedOnPass < numToRemove && diggable.length > 0) {
                    var randomDig = diggable.pop();
                    if(givenPuzzle[curRow][randomDig] != 0){
                        var temp = givenPuzzle[curRow][randomDig];
                        givenPuzzle[curRow][randomDig] = 0;
                        cellCheck = candSolve(givenPuzzle, diffSel);
                        if (checkLowBound(lowerBound, curRow, randomDig, givenPuzzle) == true && cellCheck != false) {
                            removed++;
                            removedOnPass++;
                            numOfGivensRow[curRow]--;
                            numOfGivensCol[randomDig]--;
                            if (removed == needToRemove) {
                                genPosEnd = (new Date().getTime() - genPosStart) / 1000;
                                digSuccess = true;
                                removedOnPass = numToRemove;
                                console.log(genPosEnd);
                            }
                        }
                        else {
                            givenPuzzle[curRow][randomDig] = temp;
                            failedDigs++;
                            if (failedDigs == diggable.length) {
                                removedOnPass = numToRemove;
                            }
                            else if (failedDigs == numToRemove) {
                                removedOnPass = numToRemove;
                            }
                        }
                    }
                    else {
                        failedDigs++;
                        if (failedDigs == diggable.length) {
                            removedOnPass = numToRemove;
                        }
                        else if (failedDigs == numToRemove) {
                            removedOnPass = numToRemove;
                        }
                    }
                }
            }
            if (digSuccess == true) {
                digLoop = false;
            }
        }

        console.log((81 - removed) + " nums given");
        var isSolveable = true;
        var unique = true;

        for (var h = 0; h < 50; h++) {
            checkPuzzle = solve(givenPuzzle);
            if (checkPuzzle == false) {
                h = 100;
                isSolveable = false;
            }
            else {
                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 9; j++) {
                        if (cellCheck[i][j] != checkPuzzle[i][j]) {
                            unique = false;
                            i = 9;
                            j = 9;
                            h = 100;
                        }
                    }
                }
            }
        }
        //console.log(h);
        if (isSolveable == true && unique == true) {
            endTime = new Date().getTime();
            var totalTime = (endTime - startTime) / 1000;
            puzzleGenerated = true;
            //console.log("Found a solution! :)");
        }
        else {
            //console.log("Still looking for a valid puzzle :(");
        }
    }

    console.log(gameModel.difficulty() + " puzzle made in " + totalTime + " seconds, with " + givenNums + " given numbers.");

    console.log("Puzzle made:     " + givenPuzzle);

    console.log("Solution: " + checkPuzzle);

    return new Puzzle(givenPuzzle, checkPuzzle);
}

function convertGenerated(_genArray) {
    var copy = [];
    for (var k = 0; k < 9; k++) {
        var copyRow = [];
        for (var l = 0; l < 9; l++) {
            if (_genArray[k][l][9] == null)
                copyRow.push(0);
            else
                copyRow.push(_genArray[k][l][9]);
        }
        copy.push(copyRow);
    }
    return copy;
}

function solve(_grid) {
    var solveCopy = [];
    for (var i = 0; i < _grid.length; i++)
        solveCopy[i] = _grid[i].slice();
    if (solveHelper(0, 0, solveCopy) == true) {
        //console.log(solveCopy);
        return solveCopy;
    }
    else
        return false;
}

function solveHelper(_currentRow, _currentCol, _grid) {
    if (_currentRow == 9) {
        return true;
    }
    // If cell is 0 and current col is not the end
    if (_grid[_currentRow][_currentCol] != 0) {
        if (_currentCol == 8) {
            if (solveHelper(_currentRow + 1, 0, _grid))
                return true;
        }
        else if (solveHelper(_currentRow, _currentCol + 1, _grid))
            return true;
    }
    else {
        var rand = generateRow();
        for (var i = 0; i < 9; i++) {
            if (checkValue(_currentRow, _currentCol, rand[i], _grid) == true) {
                _grid[_currentRow][_currentCol] = rand[i];
                if (solveHelper(_currentCol == 8 ? _currentRow + 1 : _currentRow, (_currentCol + 1) % 9, _grid))
                    return true;
                else
                    _grid[_currentRow][_currentCol] = 0;
            }
        }
    }
}

function checkValue(_row, _col, _value, _grid) {
    var otherCells = otherBoxCells(_row, _col);
    for (var i = 0; i < 9; i++) {
        if (i != _col) {
            if (_grid[_row][i] == _value)
                return false;
        }
        if (i != _row) {
            if (_grid[i][_col] == _value)
                return false;
        }
        if(i < otherCells.length){
            if(_grid[otherCells[i][0]][otherCells[i][1]] == _value){
                return false;
            }
        }
    }
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

function scanRowBlanks(_grid) {
    var filledVals = [];
    if (typeof _grid != "undefined") {
        for (var i = 0; i < _grid.length; i++) {
            if (_grid[i] != 0)
                filledVals.push(i);
        }
        return filledVals;
    }
    else
        return 0;
}

function shuffleArray(_grid) {
    for (var i = 0; i < _grid.length; i++) {
        var randomIndex = Math.floor(Math.random() * 1000) % (_grid.length - 1);
        var popTemp = _grid.pop();
        _grid.splice(randomIndex, 0, popTemp);
    }
    return _grid;
}

function findCandidates(_grid) {
    var solveCopy = [];
    for (var i = 0; i < _grid.length; i++)
        solveCopy[i] = _grid[i].slice();
    for (i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (_grid[i][j] == 0) {
                var cands = [];
                for (var k = 0; k < 9; k++) {
                    if (checkValue(i, j, (k + 1), _grid)) {
                        cands.push(true);
                        //console.log((k+1) +" is a candidate for (" + i + ", " + j + ")");
                    }
                    else
                        cands.push(false);
                }
                cands.push(null);
                solveCopy[i][j] = cands;
            }
            else {
                var filled = [false, false, false, false, false, false, false, false, false, _grid[i][j]];
                solveCopy[i][j] = filled;
            }
        }
    }
    //console.log(solveCopy);
    return solveCopy;
}

function candSolve(_grid, _diff) {
    var copy = findCandidates(_grid);
    var toSolve = numberOfPuzBlanks(copy);
    if(_diff == "Easy") {
        var foundNew = true;
        while (foundNew == true) {
            foundNew = false;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (copy[i][j][9] == null) {
                        if (nakedSingle(i, j, copy) == true) {
                            foundNew = true;
                            toSolve--;
                        }

                        if (hiddenSingle(i, j, copy) == true) {
                            foundNew = true;
                            toSolve--;
                        }
                    }
                }
            }
        }
        if(toSolve == 0){
            console.log("Solved with level 1");
            return convertGenerated(copy);
        }
        else
            return false;
    }
    if(_diff == "Medium"){
        foundNew = true;
        while (foundNew == true) {
            foundNew = false;
            for (i = 0; i < 9; i++) {
                for (j = 0; j < 9; j++) {
                    if (copy[i][j][9] == null) {
                        hiddenPair(i, j, copy);
                        nakedPair(i, j, copy);
                        boxLine(i, j, copy);
                        pointingPair(i, j, copy);
                        if (nakedSingle(i, j, copy) == true) {
                            foundNew = true;
                            toSolve--;
                        }

                        if (hiddenSingle(i, j, copy) == true) {
                            foundNew = true;
                            toSolve--;
                        }
                    }
                }
            }
        }
        if(toSolve == 0){
            console.log("Solved with level 1 and 2");
            return convertGenerated(copy);
        }
        else
            return false;
    }
    if(_diff == "Hard"){
        foundNew = true;
        while (foundNew == true) {
            foundNew = false;
            for (i = 0; i < 9; i++) {
                for (j = 0; j < 9; j++) {
                    if (copy[i][j][9] == null) {
                        hiddenPair(i, j, copy);
                        nakedPair(i, j, copy);
                        boxLine(i, j, copy);
                        pointingPair(i, j, copy);
                        ywing(i, j, copy);
                        hiddenTriple(i, j, copy);
                        nakedTriple(i, j, copy);
                        nakedQuad(i, j, copy);
                        xwing(i, j, copy);
                        if (nakedSingle(i, j, copy) == true) {
                            foundNew = true;
                            toSolve--;
                        }

                        if (hiddenSingle(i, j, copy) == true) {
                            foundNew = true;
                            toSolve--;
                        }
                    }
                }
            }
        }
        if (toSolve == 0) {
            console.log("Solved with level 1, 2, and 3");
            return convertGenerated(copy);
        }
        else
            return false;
    }
}

function nakedSingle(_row, _col, _grid) {
    //var found = [];
    //for(var k = 0; k < 9; k++) {
    //    if(_grid[_row][_col][k] == true)
    //        found.push(k);
    //}
    var possibleCands = getCellCands(_grid[_row][_col]);
    if (possibleCands.length == 1) {
        _grid[_row][_col][9] = possibleCands[0] + 1;
        //console.log("Naked single "+ (found[0]+1) +" found at (" + _row + ", " + _col + ")");
        clearFound(_row, _col,_grid);
        return true;
    }
    else
        return false;
}

function hiddenSingle(_row, _col,_grid) {
    var numsToTry = getCellCands(_grid[_row][_col]);

    var row1 = ((_row + 2) % 3) + boxStartRow(_row);
    var row2 = ((_row + 4) % 3) + boxStartRow(_row);
    var col1 = ((_col + 2) % 3) + boxStartCol(_col);
    var col2 = ((_col + 4) % 3) + boxStartCol(_col);
    while (numsToTry.length > 0) {
        var tryValue = numsToTry.pop() + 1;
        // If the other two rows in this column have values
        if (_grid[row1][_col][9] != null && _grid[row2][_col][9] != null) {
            var existsInCol1 = false;
            var existsInCol2 = false;
            for (var i = 0; i < 9; i++) {
                if (_grid[i][col1][9] == tryValue) {
                    existsInCol1 = true;
                }
                if (_grid[i][col2][9] == tryValue) {
                    existsInCol2 = true;
                }
            }
            if ((existsInCol1 && existsInCol2) == true){
                _grid[_row][_col][9] = tryValue;
                clearFound(_row, _col, _grid);
                return true;
            }
        }

        // If the first other column in this row has a value and the other doesn't
        if (_grid[row1][_col][9] != null && _grid[row2][_col][9] == null) {
            existsInCol1 = false;
            existsInCol2 = false;
            existsInRow2 = false;
            for (i = 0; i < 9; i++) {
                if (_grid[i][col1][9] == tryValue) {
                    existsInCol1 = true;
                }
                if (_grid[i][col2][9] == tryValue) {
                    existsInCol2 = true;
                }
                if (_grid[row2][i][9] == tryValue) {
                    existsInRow2 = true;
                }
            }
            if ((existsInCol1 && existsInCol2 && existsInRow2) == true){
                _grid[_row][_col][9] = tryValue;
                clearFound(_row, _col, _grid);
                return true;
            }
        }

        // If the first other column in this row has a value and the other doesn't
        if (_grid[row1][_col][9] == null && _grid[row2][_col][9] != null) {
            existsInCol1 = false;
            existsInCol2 = false;
            existsInRow1 = false;
            for (i = 0; i < 9; i++) {
                if (_grid[i][col1][9] == tryValue) {
                    existsInCol1 = true;
                }
                if (_grid[i][col2][9] == tryValue) {
                    existsInCol2 = true;
                }
                if (_grid[row1][i][9] == tryValue) {
                    existsInRow1 = true;
                }
            }
            if ((existsInCol1 && existsInCol2 && existsInRow1) == true){
                _grid[_row][_col][9] = tryValue;
                clearFound(_row, _col, _grid);
                return true;
            }
        }

        // If the other two columns in this row have values
        if (_grid[_row][col1][9] != null && _grid[_row][col2][9] != null) {
            var existsInRow1 = false;
            var existsInRow2 = false;
            for (i = 0; i < 9; i++) {
                if (_grid[row1][i][9] == tryValue) {
                    existsInRow1 = true;
                }
                if (_grid[row2][i][9] == tryValue) {
                    existsInRow2 = true;
                }
            }
            if ((existsInRow1 && existsInRow2) == true){
                _grid[_row][_col][9] = tryValue;
                clearFound(_row, _col, _grid);
                return true;
            }
        }

        // If the first other column in this row has a value and the other doesn't
        if (_grid[_row][col1][9] != null && _grid[_row][col2][9] == null) {
            existsInRow1 = false;
            existsInRow2 = false;
            existsInCol2 = false;
            for (i = 0; i < 9; i++) {
                if (_grid[row1][i][9] == tryValue) {
                    existsInRow1 = true;
                }
                if (_grid[row2][i][9] == tryValue) {
                    existsInRow2 = true;
                }
                if (_grid[i][col2][9] == tryValue) {
                    existsInCol2 = true;
                }
            }
            if ((existsInRow1 && existsInRow2 && existsInCol2) == true){
                _grid[_row][_col][9] = tryValue;
                clearFound(_row, _col, _grid);
                return true;
            }
        }

        // If the first other column in this row has a value and the other doesn't
        if (_grid[_row][col1][9] == null && _grid[_row][col2][9] != null) {
            existsInRow1 = false;
            existsInRow2 = false;
            existsInCol1 = false;
            for (i = 0; i < 9; i++) {
                if (_grid[row1][i][9] == tryValue) {
                    existsInRow1 = true;
                }
                if (_grid[row2][i][9] == tryValue) {
                    existsInRow2 = true;
                }
                if (_grid[i][col1][9] == tryValue) {
                    existsInCol1 = true;
                }
            }
            if ((existsInRow1 && existsInRow2 && existsInCol1) == true){
                _grid[_row][_col][9] = tryValue;
                clearFound(_row, _col, _grid);
                return true;
            }
        }

        if (_grid[row1][_col][9] != null && _grid[row2][_col][9] != null && _grid[_row][col1][9] == null && _grid[_row][col2][9] == null) {
            existsInRow1 = false;
            existsInRow2 = false;
            existsInCol1 = false;
            existsInCol2 = false;
            for (i = 0; i < 9; i++) {
                if (_grid[row1][i][9] == tryValue) {
                    existsInRow1 = true;
                }
                if (_grid[row2][i][9] == tryValue) {
                    existsInRow2 = true;
                }
                if (_grid[i][col1][9] == tryValue) {
                    existsInCol1 = true;
                }
                if (_grid[i][col2][9] == tryValue) {
                    existsInCol2 = true;
                }
            }
            if ((existsInRow1 && existsInRow2 && existsInCol1 && existsInCol2) == true){
                _grid[_row][_col][9] = tryValue;
                clearFound(_row, _col, _grid);
                return true;
            }
        }
    }
    return false;
}

function getCellCands(_location) {
    var numOfCands = [];
    for (var i = 0; i < 9; i++) {
        if (_location[i] == true)
            numOfCands.push(i);
    }
    return numOfCands;
}

function clearFound(_row, _col, _grid) {
    var foundValue = _grid[_row][_col][9] - 1;
    var otherBox = otherBoxCells(_row, _col);
    for (var i = 0; i < 9; i++) {
        if(_grid[_row][_col][i] == true){
            _grid[_row][_col][i] = false;
        }
        if(_grid[_row][i][foundValue] == true && i != _col){
            _grid[_row][i][foundValue] = false;
        }
        if(_grid[i][_col][foundValue] == true && i != _row){
            _grid[i][_col][foundValue] = false;
        }
        if(i < otherBox.length){
            var otherY = otherBox[i][0];
            var otherX = otherBox[i][1];
            if(_grid[otherY][otherX][foundValue] == true){
                _grid[otherY][otherX][foundValue] = false;
            }
        }
    }
}

function checkLowBound(_lowBound, _row, _col, _grid) {
    var rowCounter = 1;
    var colCounter = 1;
    var boxCounter = 1;
    var otherBox = otherBoxCells(_row, _col);
    for (var i = 0; i < 9; i++) {
        if (_grid[_row][i] != 0){
            rowCounter++;
        }
        if (_grid[i][_col] != 0){
            colCounter++;
        }
        if(_grid[_row][i] != 0 && boxStartCol(i) == boxStartCol(_col)) {
            boxCounter++;
        }
        if(_grid[i][_col] != 0 && boxStartRow(i) == boxStartRow(_row)) {
            boxCounter++;
        }
        if(i < otherBox.length){
            var otherY = otherBox[i][0];
            var otherX = otherBox[i][1];
            if(_grid[otherX][otherY] != 0)
                boxCounter++;
        }
    }
    if (colCounter >= _lowBound && rowCounter >= _lowBound && boxCounter >= _lowBound)
        return true;
    else
        return false;
}

function checkUpperBound(_upperBound, _row, _col, _grid) {
    var rowCounter = 0;
    var colCounter = 0;
    for (var i = 0; i < 9; i++) {
        if (_grid[_row][i] != 0)
            rowCounter++;
        if (_grid[i][_col] != 0)
            colCounter++;
    }
    if (colCounter > _upperBound || rowCounter > _upperBound)
        return false;
    else
        return true;
}

function nakedPair(_row, _col, _grid) {
    var found = false;
    var cellCands;
    var nakedBoxPairs;
    var nakedRowPairs;
    var nakedColPairs;

    if (_grid[_row][_col][9] == null) {
        cellCands = getCellCands(_grid[_row][_col]);
        if (cellCands.length == 2) {
            //console.log("Naked Pair " + (cellCands[0] + 1) + ", " + (cellCands[1] + 1) + " found in (" + (_row + 1) + ", " + (_col + 1) + ")");

            /*//Check Box
             var curRow = boxStartRow(_row);
             for (var i = curRow; i < curRow + 3; i++) {
             var curCol = boxStartCol(_col);
             for (var j = curCol; j < curCol + 3; j++) {
             if (_grid[i][j][9] == null && _grid[i][j] != _grid[_row][_col]) {
             var checkBox = getCellCands(_grid[i][j]);
             if (checkBox.length == 2 && checkBox[0] == cellCands[0] && checkBox[1] == cellCands[1]) {
             // Eliminate candidates from other cells
             nakedPairRemove(cellCands[0], cellCands[1], _row, _col, i, j, _grid);
             //console.log("Matching pair " + (cellCands[0]+1) + ", " + (cellCands[1]+1) + " found in (" + (_row+1) + ", " + (_col+1) + ")  and (" + (i+1) + ", " + (j+1) + ")");
             found = true;
             }
             }

             }
             }

             //Check Row
             for (i = 0; i < 9; i++) {
             if (_grid[_row][i][9] == null && _grid[_row][i] != _grid[_row][_col]) {
             var checkRow = getCellCands(_grid[_row][i]);
             if (checkRow.length == 2 && checkRow[0] == cellCands[0] && checkRow[1] == cellCands[1]) {
             // Eliminate candidates from other cells
             nakedPairRemove(cellCands[0], cellCands[1], _row, _col, _row, i, _grid);
             //console.log("Matching pair " + (cellCands[0]+1) + ", " + (cellCands[1]+1) + " found in (" + (_row+1) + ", " + (_col+1) + ")  and (" + (_row+1) + ", " + (i+1) + ")");
             found = true;
             }
             }
             }

             //Check Column
             for (i = 0; i < 9; i++) {
             if (_grid[i][_col][9] == null && _grid[i][_col] != _grid[_row][_col]) {
             var checkCol = getCellCands(_grid[i][_col]);
             if (checkCol.length == 2 && checkCol[0] == cellCands[0] && checkCol[1] == cellCands[1]) {
             // Eliminate candidates from other cells
             nakedPairRemove(cellCands[0], cellCands[1], _row, _col, i, _col, _grid);
             //console.log("Matching pair " + (cellCands[0]+1) + ", " + (cellCands[1]+1) + " found in (" + (_row+1) + ", " + (_col+1) + ")  and (" + (i+1) + ", " + (_col+1) + ")");
             found = true;
             }
             }
             }*/
            nakedBoxPairs = [];
            nakedRowPairs = [];
            nakedColPairs = [];
            var otherCells = otherBoxCells(_row, _col);

            for (var i = 0; i < 9; i++) {
                var checkBox;
                // Row Search
                if (_grid[_row][i][9] == null && i != _col) {
                    if (boxStartCol(i) != boxStartCol(_col)) {
                        var checkRow = getCellCands(_grid[_row][i]);
                        if (checkRow.length == 2 && checkRow[0] == cellCands[0] && checkRow[1] == cellCands[1]) {
                            nakedRowPairs.push([_row, i]);
                        }
                    }
                    if (boxStartCol(i) == boxStartCol(_col)) {
                        checkBox = getCellCands(_grid[_row][i]);
                        if (checkBox.length == 2 && checkBox[0] == cellCands[0] && checkBox[1] == cellCands[1]) {
                            nakedBoxPairs.push([_row, i]);
                        }
                    }
                }

                // Col Search
                if (_grid[i][_col][9] == null && i != _row) {
                    if(boxStartRow(i) != boxStartRow(_row)) {
                        var checkCol = getCellCands(_grid[i][_col]);
                        if (checkCol.length == 2 && checkCol[0] == cellCands[0] && checkCol[1] == cellCands[1]) {
                            nakedColPairs.push([i, _col]);
                        }
                    }
                    if(boxStartRow(i) == boxStartRow(_row)) {
                        checkBox = getCellCands(_grid[i][_col]);
                        if (checkBox.length == 2 && checkBox[0] == cellCands[0] && checkBox[1] == cellCands[1]) {
                            nakedBoxPairs.push([i, _col]);
                        }
                    }
                }

                // Other Box Cells Search
                if(i < otherCells.length){
                    var otherRow = otherCells[i][0];
                    var otherCol = otherCells[i][1];
                    if (_grid[otherRow][otherCol][9] == null) {
                        checkBox = getCellCands(_grid[otherRow][otherCol]);
                        if (checkBox.length == 2 && checkBox[0] == cellCands[0] && checkBox[1] == cellCands[1]) {
                            nakedBoxPairs.push([otherRow, otherCol]);
                        }
                    }
                }
            }
            if(nakedBoxPairs.length == 1){
                nakedPairRemove(nakedBoxPairs[0][0], nakedBoxPairs[0][1], "Box");
            }
            if(nakedRowPairs.length == 1){
                nakedPairRemove(nakedRowPairs[0][0], nakedRowPairs[0][1], "Row");
            }
            if(nakedColPairs.length == 1) {
                nakedPairRemove(nakedColPairs[0][0], nakedColPairs[0][1], "Col");
            }

        }
    }

    function nakedPairRemove(_cell2Row, _cell2Col, _type) {
        if (_type = "Box") {
            var curRow = boxStartRow(_row);
            var curCol = boxStartCol(_col);
            if (curRow == boxStartRow(_cell2Row) && curCol == boxStartCol(_cell2Col)) {
                for (var i = curRow; i < curRow + 3; i++) {
                    for (var j = curCol; j < curCol + 3; j++) {
                        if (_grid[i][j][9] == null && _grid[_cell2Row][_cell2Col] != _grid[i][j] && _grid[_row][_col] != _grid[i][j]) {
                            if (_grid[i][j][cellCands[0]] == true) {
                                _grid[i][j][cellCands[0]] = false;
                                found = true;
                            }
                            if (_grid[i][j][cellCands[1]] == true) {
                                _grid[i][j][cellCands[1]] = false;
                                found = true;
                            }
                        }
                    }
                }
            }
        }
        if(_type == "Row") {
            for (var x = 0; x < 9; x++) {
                if (_row == _cell2Row) {
                    if (x != _col && x != _cell2Col && _grid[_row][x][9] == null) {
                        if (_grid[_row][x][cellCands[0]] == true) {
                            _grid[_row][x][cellCands[0]] = false;
                            found = true;
                        }
                        if (_grid[_row][x][cellCands[1]] == true) {
                            _grid[_row][x][cellCands[1]] = false;
                            found = true;
                        }
                    }
                }
            }
        }
        if(_type == "Col") {
            for (x = 0; x < 9; x++) {
                if (_col == _cell2Col) {
                    if (x != _row && x != _cell2Row && _grid[x][_col][9] == null) {
                        if (_grid[x][_col][cellCands[0]] == true) {
                            _grid[x][_col][cellCands[0]] = false;
                            found = true;
                        }
                        if (_grid[x][_col][cellCands[1]] == true) {
                            _grid[x][_col][cellCands[1]] = false;
                            found = true;
                        }
                    }
                }
            }
        }
    }

    return found;
}

function hiddenPair(_row, _col, _grid) {
    var hiddenBoxCands;
    var hiddenBoxCoords;
    var hiddenRowCands;
    var hiddenRowCoords;
    var hiddenColCands;
    var hiddenColCoords;
    var cellCands;
    var found = false;
    if (_grid[_row][_col][9] == null) {
        cellCands = getCellCands(_grid[_row][_col]);
        if (cellCands.length > 2) {
            //Check Box, Row, and Column for Candidates
            hiddenBoxCands = [];
            hiddenBoxCoords = [];
            hiddenRowCands = [];
            hiddenRowCoords = [];
            hiddenColCands = [];
            hiddenColCoords = [];
            var otherCells = otherBoxCells(_row, _col);

            for (var i = 0; i < 9; i++) {
                var checkBox;
                if (_grid[_row][i][9] == null && _grid[_row][i] != _grid[_row][_col]) {
                    if (boxStartCol(i) != boxStartCol(_col)) {
                        // Eliminate candidates from other cells
                        var checkRow = getCellCands(_grid[_row][i]);
                        hiddenRowCands.push(checkRow);
                        hiddenRowCoords.push([_grid[_row][i], _row, i]);
                    }
                    if (boxStartCol(i) == boxStartCol(_col)) {
                        checkBox = getCellCands(_grid[_row][i]);
                        hiddenBoxCands.push(checkBox);
                        hiddenBoxCoords.push([_grid[_row][i], _row, i]);
                    }
                }
                if (_grid[i][_col][9] == null && _grid[i][_col] != _grid[_row][_col]) {
                    if(boxStartRow(i) != boxStartRow(_row)) {
                        //Eliminate candidates from other cells
                        var checkCol = getCellCands(_grid[i][_col]);
                        hiddenColCands.push(checkCol);
                        hiddenColCoords.push([_grid[i][_col], i, _col]);
                    }
                    if(boxStartRow(i) == boxStartRow(_row)) {
                        checkBox = getCellCands(_grid[i][_col]);
                        hiddenBoxCands.push(checkBox);
                        hiddenBoxCoords.push([_grid[i][_col], i, _col]);
                    }
                }
                if(i < otherCells.length){
                    var otherRow = otherCells[i][0];
                    var otherCol = otherCells[i][1];
                    if (_grid[otherRow][otherCol][9] == null) {
                        checkBox = getCellCands(_grid[otherRow][otherCol]);
                        hiddenBoxCands.push(checkBox);
                        hiddenBoxCoords.push([_grid[otherRow][otherCol], otherRow, otherCol]);
                    }
                }
            }
            if(hiddenBoxCands.length > 0){
                hiddenPairRemove(hiddenBoxCands, hiddenBoxCoords);
            }
            if(hiddenRowCands.length > 0){
                hiddenPairRemove(hiddenRowCands, hiddenRowCoords);
            }
            if(hiddenColCands.length > 0) {
                hiddenPairRemove(hiddenColCands, hiddenColCoords);
            }
        }
    }

    function hiddenPairRemove(_hiddenCands, _hiddenCoords) {
        var candCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var k = 0; k < cellCands.length; k++) {
            for (var i = 0; i < _hiddenCands.length; i++) {
                for (var j = 0; j < _hiddenCands[i].length; j++) {
                    if (cellCands[k] == _hiddenCands[i][j]) {
                        candCounts[cellCands[k]]++;
                    }
                }
            }
        }
        var pairs = [];
        for (i = 0; i < candCounts.length; i++) {
            if (candCounts[i] == 1) {
                pairs.push(i);
            }
        }
        if (pairs.length == 2) {
            var verCount = 0;
            var verCoord = [];
            for (i = 0; i < _hiddenCoords.length; i++) {
                if (_hiddenCoords[i][0][pairs[0]] == true && _hiddenCoords[i][0][pairs[1]] == true) {
                    verCount++;
                    verCoord.push([_hiddenCoords[i][1], _hiddenCoords[i][2]]);
                }
            }
            if (verCount == 1) {
                //console.log("Hidden Pair " + (pairs[0] + 1) + ", " + (pairs[1] + 1) + " found in (" + (_row + 1) + ", " + (_col + 1) + ") and (" + (verCoord[0][0]+1) + ", " + (verCoord[0][1]+ 1) + ")");
                for (i = 0; i < 9; i++) {
                    if (i != pairs[0] && i != pairs[1]) {
                        if(_grid[_row][_col][i] == true){
                            _grid[_row][_col][i] = false;
                            found = true;
                        }
                        if(_grid[verCoord[0][0]][verCoord[0][1]][i] == true){
                            _grid[verCoord[0][0]][verCoord[0][1]][i] = false;
                            found = true;
                        }
                    }
                }
            }
        }
    }
    return found;
}

function pointingPair(_row, _col, _grid) {
    var found = false;
    // Find cands for all cells in this row
    if (_grid[_row][_col][9] == null) {
        var pointCands = [];
        var curRow = boxStartRow(_row);
        var curCol = boxStartCol(_col);
        for (var i = curRow; i < curRow + 3; i++) {
            var rowCands = [];
            for (var j = curCol; j < curCol + 3; j++) {
                if (_grid[i][j][9] == null) {
                    var checkBox = getCellCands(_grid[i][j]);
                    rowCands.push(checkBox);
                }
                else rowCands.push(null);
            }
            pointCands.push(rowCands);
        }

        var inRow = [];
        var inCol = [];
        for (i = 0; i < 3; i++) {
            var rowFound = [];
            var colFound = [];
            for (j = 0; j < 3; j++) {
                if (pointCands[i][j] != null) {
                    for (var k = 0; k < pointCands[i][j].length; k++) {
                        if (rowFound.length == 0) {
                            rowFound.push([pointCands[i][j][k], 1]);
                        }
                        else {
                            var exists = false;
                            for (var l = 0; l < rowFound.length; l++) {
                                if (rowFound[l][0] == pointCands[i][j][k]) {
                                    exists = true;
                                    rowFound[l][1] += 1;
                                }
                            }
                            if (exists == false)
                                rowFound.push([pointCands[i][j][k], 1]);
                        }
                    }
                }
                if (pointCands[j][i] != null) {
                    for (k = 0; k < pointCands[j][i].length; k++) {
                        if (colFound.length == 0) {
                            colFound.push([pointCands[j][i][k], 1]);
                        }
                        else {
                            exists = false;
                            for (l = 0; l < colFound.length; l++) {
                                if (colFound[l][0] == pointCands[j][i][k]) {
                                    exists = true;
                                    colFound[l][1] += 1;
                                }
                            }
                            if (exists == false)
                                colFound.push([pointCands[j][i][k], 1]);
                        }
                    }
                }
            }
            inRow.push(rowFound);
            inCol.push(colFound);
        }

        for (i = 0; i < 3; i++) {
            for (j = 0; j < inRow[i].length; j++) {
                if (inRow[i][j][1] != 1) {
                    var onlyThisRow = true;
                    var row1 = boxSecond(i);
                    for (k = 0; k < inRow[row1].length; k++) {
                        if (inRow[row1][k][0] == inRow[i][j][0])
                            onlyThisRow = false;
                    }
                    var row2 = boxThird(i);
                    for (k = 0; k < inRow[row2].length; k++) {
                        if (inRow[row2][k][0] == inRow[i][j][0])
                            onlyThisRow = false;
                    }
                    if (onlyThisRow == true) {
                        for (k = 0; k < 9; k++) {
                            if (_grid[curRow + i][k][9] == null && boxStartCol(k) != curCol) {
                                if(_grid[curRow + i][k][inRow[i][j][0]] == true) {
                                    //console.log(inRow[i][j][0] + " is only in box "+ boxNum(curRow, curCol) + " on row " + (curRow+i));
                                    //console.log("Removing cand " + inRow[i][j][0] + " from  " + (curRow + i) + ", " + k);
                                    _grid[curRow + i][k][inRow[i][j][0]] = false;
                                    found = true;
                                }
                            }
                        }
                    }
                }
            }

            for (j = 0; j < inCol[i].length; j++) {
                if (inCol[i][j][1] != 1) {
                    var onlyThisCol = true;
                    var col1 = boxSecond(i);
                    for (k = 0; k < inCol[col1].length; k++) {
                        if (inCol[col1][k][0] == inCol[i][j][0])
                            onlyThisCol = false;
                    }
                    var col2 = boxThird(i);
                    for (k = 0; k < inCol[col2].length; k++) {
                        if (inCol[col2][k][0] == inCol[i][j][0])
                            onlyThisCol = false;
                    }
                    if (onlyThisCol == true) {
                        for (k = 0; k < 9; k++) {
                            if (_grid[k][curCol + i][9] == null && boxStartRow(k) != curRow) {
                                if(_grid[k][curCol + i][inCol[i][j][0]] == true) {
                                    //console.log(inCol[i][j][0] + " is only in box "+ boxNum(curRow, curCol) + " on col " + (curCol+i));
                                    //console.log("Removing cand " + inCol[i][j][0] + " from  " + k + ", " + (curCol + i));
                                    _grid[k][curCol + i][inCol[i][j][0]] = false;
                                    found = true;
                                }
                            }
                        }
                    }
                }
            }

        }
    }
    return found;
}

function boxLine(_row, _col, _grid) {
    var found = false;
    // Find cands for all cells in this row
    if (_grid[_row][_col][9] == null) {
        var rowCands = [];
        var colCands = [];
        for (var i = 0; i < 9; i++) {
            if (_grid[_row][i][9] == null) {
                var checkRow = getCellCands(_grid[_row][i]);
                rowCands.push([checkRow, i]);
            }
            if (_grid[i][_col][9] == null) {
                var checkCol = getCellCands(_grid[i][_col]);
                colCands.push([checkCol, i]);
            }
        }

        var rowFound = [];
        var colFound = [];
        for (i = 0; i < rowCands.length; i++) {

            for (var j = 0; j < rowCands[i][0].length; j++) {
                if (rowFound.length == 0) {
                    rowFound.push([rowCands[i][0][j], [rowCands[i][1]]]);
                }
                else {
                    var exists = false;
                    for (var k = 0; k < rowFound.length; k++) {
                        if (rowFound[k][0] == rowCands[i][0][j]) {
                            exists = true;
                            rowFound[k][1].push(rowCands[i][1]);
                        }
                    }
                    if (exists == false)
                        rowFound.push([rowCands[i][0][j], [rowCands[i][1]]]);
                }
            }
        }
        for (i = 0; i < colCands.length; i++) {

            for (j = 0; j < colCands[i][0].length; j++) {
                if (colFound.length == 0) {
                    colFound.push([colCands[i][0][j], [colCands[i][1]]]);
                }
                else {
                    exists = false;
                    for (k = 0; k < colFound.length; k++) {
                        if (colFound[k][0] == colCands[i][0][j]) {
                            exists = true;
                            colFound[k][1].push(colCands[i][1]);
                        }
                    }
                    if (exists == false)
                        colFound.push([colCands[i][0][j], [colCands[i][1]]]);
                }
            }
        }

        var row1 = ((_row + 2) % 3) + boxStartRow(_row);
        var row2 = ((_row + 4) % 3) + boxStartRow(_row);
        var col1 = ((_col + 2) % 3) + boxStartCol(_col);
        var col2 = ((_col + 4) % 3) + boxStartCol(_col);

        for (i = 0; i < rowFound.length; i++) {
            if (rowFound[i][1].length == 2) {
                if ((Math.floor(rowFound[i][1][0] / 3) * 3) == (Math.floor(rowFound[i][1][1] / 3) * 3) && (Math.floor(rowFound[i][1][0] / 3) * 3) == boxStartCol(_col)) {
                    for (j = 0; j < 3; j++) {
                        if (_grid[row1][j + boxStartCol(_col)][rowFound[i][0]] == true) {
                            //console.log(rowFound[i][0] + " removed from " + row1 + ", " + [j + boxStartCol(_col)]);
                            _grid[row1][j + boxStartCol(_col)][rowFound[i][0]] = false;
                            found = true;
                        }
                        if (_grid[row2][j + boxStartCol(_col)][rowFound[i][0]] == true) {
                            //console.log(rowFound[i][0] + " removed from " + row2 + ", " + [j + boxStartCol(_col)]);
                            _grid[row2][j + boxStartCol(_col)][rowFound[i][0]] = false;
                            found = true;
                        }
                    }
                    if (rowFound[i][1][0] != col1 && rowFound[i][1][1] != col1 && _grid[_row][col1][rowFound[i][0]] == true) {
                        //console.log(rowFound[i][0] + " removed from " + _row + ", " + col1);
                        _grid[_row][col1][rowFound[i][0]] = false;
                        found = true;
                    }
                    if (rowFound[i][1][0] != col2 && rowFound[i][1][1] != col2 && _grid[_row][col2][rowFound[i][0]] == true) {
                        //console.log(rowFound[i][0] + " removed from " + _row + ", " + col2);
                        _grid[_row][col2][rowFound[i][0]] = false;
                        found = true;
                    }
                }
            }
            if (rowFound[i][1].length == 3) {
                if ((Math.floor(rowFound[i][1][0] / 3) * 3) == (Math.floor(rowFound[i][1][1] / 3) * 3) && (Math.floor(rowFound[i][1][0] / 3) * 3) == (Math.floor(rowFound[i][1][2] / 3) * 3) && (Math.floor(rowFound[i][1][0] / 3) * 3) == boxStartCol(_col)) {
                    for (j = 0; j < 3; j++) {
                        if (_grid[row1][j + boxStartCol(_col)][rowFound[i][0]] == true) {
                            //console.log(rowFound[i][0] + " removed from " + row1 + ", " + [j + boxStartCol(_col)]);
                            _grid[row1][j + boxStartCol(_col)][rowFound[i][0]] = false;
                            found = true;
                        }
                        if (_grid[row2][j + boxStartCol(_col)][rowFound[i][0]] == true) {
                            //console.log(rowFound[i][0] + " removed from " + row2 + ", " + [j + boxStartCol(_col)]);
                            _grid[row2][j + boxStartCol(_col)][rowFound[i][0]] = false;
                            found = true;
                        }
                    }
                }
            }
        }

        for (i = 0; i < colFound.length; i++) {
            if (colFound[i][1].length == 2) {
                if ((Math.floor(colFound[i][1][0] / 3) * 3) == (Math.floor(colFound[i][1][1] / 3) * 3) && (Math.floor(colFound[i][1][0] / 3) * 3) == boxStartRow(_row)) {
                    for (j = 0; j < 3; j++) {
                        if (_grid[j + boxStartRow(_row)][col1][colFound[i][0]] == true) {
                            //console.log(colFound[i][0] + " removed from " + (j + boxStartRow(_row)) + ", " + col1);
                            _grid[j + boxStartRow(_row)][col1][colFound[i][0]] = false;
                            found = true;
                        }
                        if (_grid[j + boxStartRow(_row)][col2][colFound[i][0]] == true) {
                            //console.log(colFound[i][0] + " removed from " + (j + boxStartRow(_row)) + ", " + col2);
                            _grid[j + boxStartRow(_row)][col2][colFound[i][0]] = false;
                            found = true;
                        }
                    }
                    if (colFound[i][1][0] != row1 && colFound[i][1][1] != row1 && _grid[row1][_col][colFound[i][0]] == true) {
                        //console.log(colFound[i][0] + " removed from " + row1 + ", " + _col);
                        _grid[row1][_col][colFound[i][0]] = false;
                        found = true;
                    }
                    if (colFound[i][1][0] != row2 && colFound[i][1][1] != row2 && _grid[row2][_col][colFound[i][0]] == true) {
                        //console.log(colFound[i][0] + " removed from " + row2 + ", " + _col);
                        _grid[row2][_col][colFound[i][0]] = false;
                        found = true;
                    }
                }
            }
            if (colFound[i][1].length == 3) {
                if ((Math.floor(colFound[i][1][0] / 3) * 3) == (Math.floor(colFound[i][1][1] / 3) * 3) && (Math.floor(colFound[i][1][0] / 3) * 3) == (Math.floor(colFound[i][1][2] / 3) * 3) && (Math.floor(colFound[i][1][0] / 3) * 3) == boxStartRow(_row)) {
                    for (j = 0; j < 3; j++) {
                        if (_grid[j + boxStartRow(_row)][col1][colFound[i][0]] == true) {
                            //console.log(colFound[i][0] + " removed from " + (j + boxStartRow(_row)) + ", " + col1);
                            _grid[j + boxStartRow(_row)][col1][colFound[i][0]] = false;
                            found = true;
                        }
                        if (_grid[j + boxStartRow(_row)][col2][colFound[i][0]] == true) {
                            //console.log(colFound[i][0] + " removed from " + (j + boxStartRow(_row)) + ", " + col2);
                            _grid[j + boxStartRow(_row)][col2][colFound[i][0]] = false;
                            found = true;
                        }
                    }
                }
            }
        }
    }
    return found;
}

function xwing(_row, _col, _grid) {
    var found = false;
    if (_grid[_row][_col][9] == null) {
        var rowCands = [];
        var colCands = [];
        for (var i = 0; i < 9; i++) {
            if (_grid[_row][i][9] == null) {
                var checkRow = getCellCands(_grid[_row][i]);
                rowCands.push([checkRow, i]);
            }
            if (_grid[i][_col][9] == null) {
                var checkCol = getCellCands(_grid[i][_col]);
                colCands.push([checkCol, i]);
            }
        }

        var rowFound = [];
        var colFound = [];
        for (i = 0; i < rowCands.length; i++) {

            for (var j = 0; j < rowCands[i][0].length; j++) {
                if (rowFound.length == 0) {
                    rowFound.push([rowCands[i][0][j], [rowCands[i][1]]]);
                }
                else {
                    var exists = false;
                    for (var k = 0; k < rowFound.length; k++) {
                        if (rowFound[k][0] == rowCands[i][0][j]) {
                            exists = true;
                            rowFound[k][1].push(rowCands[i][1]);
                        }
                    }
                    if (exists == false)
                        rowFound.push([rowCands[i][0][j], [rowCands[i][1]]]);
                }
            }
        }
        for (i = 0; i < colCands.length; i++) {

            for (j = 0; j < colCands[i][0].length; j++) {
                if (colFound.length == 0) {
                    colFound.push([colCands[i][0][j], [colCands[i][1]]]);
                }
                else {
                    exists = false;
                    for (k = 0; k < colFound.length; k++) {
                        if (colFound[k][0] == colCands[i][0][j]) {
                            exists = true;
                            colFound[k][1].push(colCands[i][1]);
                        }
                    }
                    if (exists == false)
                        colFound.push([colCands[i][0][j], [colCands[i][1]]]);
                }
            }
        }

        for (i = 0; i < rowFound.length; i++) {
            if (rowFound[i][1].length == 2 && (Math.floor(rowFound[i][1][0] / 3) * 3) != (Math.floor(rowFound[i][1][1] / 3) * 3)) {
                for (j = 0; j < 9; j++) {
                    var searchRowFound = rowExclusive(j, _grid);
                    for(k = 0; k<searchRowFound.length; k++) {
                        if (searchRowFound[k][0] == rowFound[i][0] && _row != j && searchRowFound[k][1].length == 2) {
                            if(searchRowFound[k][1][0] == rowFound[i][1][0] && searchRowFound[k][1][1] == rowFound[i][1][1]) {
                                /*console.log(rowFound[i][0] + " exists in an row xwing on " + _row + ", " + rowFound[i][1][0]);
                                 console.log(rowFound[i][0] + " exists in an row xwing on " + _row + ", " + rowFound[i][1][1]);
                                 console.log(searchRowFound[k][0] + " exists in an row xwing on " + j + ", " + searchRowFound[k][1][0]);
                                 console.log(searchRowFound[k][0] + " exists in an row xwing on " + j + ", " + searchRowFound[k][1][1]);*/
                                for(var x = 0; x < 9; x++) {
                                    if(x != _row && x != j) {
                                        if(_grid[x][rowFound[i][1][0]][rowFound[i][0]] == true) {
                                            //console.log(rowFound[i][0] + " cand removed from row " + x + ", " + rowFound[i][1][0]);
                                            _grid[x][rowFound[i][1][0]][rowFound[i][0]] = false;
                                            found = true;
                                        }

                                        if(_grid[x][rowFound[i][1][1]][rowFound[i][0]] == true){
                                            //console.log(rowFound[i][0] + " cand removed from row " + x + ", " + rowFound[i][1][1]);
                                            _grid[x][rowFound[i][1][1]][rowFound[i][0]] = false;
                                            found = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        for (i = 0; i < colFound.length; i++) {
            if (colFound[i][1].length == 2 && (Math.floor(colFound[i][1][0] / 3) * 3) != (Math.floor(colFound[i][1][1] / 3) * 3)) {
                for (j = 0; j < 9; j++) {
                    var searchColFound = colExclusive(j, _grid);
                    for(k = 0; k<searchColFound.length; k++) {
                        if (searchColFound[k][0] == colFound[i][0] && _col != j && searchColFound[k][1].length == 2) {
                            if(searchColFound[k][1][0] == colFound[i][1][0] && searchColFound[k][1][1] == colFound[i][1][1]) {
                                /*console.log(colFound[i][0] + " exists in an col xwing on " + colFound[i][1][0] + ", " + _col);
                                 console.log(searchColFound[k][0] + " exists in an col xwing on " + searchColFound[k][1][0] + ", " + j);
                                 console.log(colFound[i][0] + " exists in an col xwing on " + colFound[i][1][1] + ", " + _col);
                                 console.log(searchColFound[k][0] + " exists in an col xwing on " + searchColFound[k][1][1] + ", " + j);*/
                                for(x = 0; x < 9; x++) {
                                    if(x != _col && x != j) {
                                        if(_grid[colFound[i][1][0]][x][colFound[i][0]] == true) {
                                            //console.log(colFound[i][0] + " cand removed from col " + colFound[i][1][0]  + ", " + x);
                                            _grid[colFound[i][1][0]][x][colFound[i][0]] = false;
                                            found = true;
                                        }
                                        if(_grid[colFound[i][1][1]][x][colFound[i][0]] == true){
                                            //console.log(colFound[i][0] + " cand removed from col " + colFound[i][1][1] + ", " + x);
                                            _grid[colFound[i][1][1]][x][colFound[i][0]] = false;
                                            found = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return found;
}

function nakedTriple(_row, _col, _grid) {
    var found = false;
    if (_grid[_row][_col][9] == null) {
        var cellCands = getCellCands(_grid[_row][_col]);
        if (cellCands.length == 3 || cellCands.length == 2) {

            //Check Box
            var boxCands = [];
            var curRow = boxStartRow(_row);
            for (var i = curRow; i < curRow + 3; i++) {
                var curCol = boxStartCol(_col);
                for (var j = curCol; j < curCol + 3; j++) {
                    if (_grid[i][j][9] == null) {
                        var checkBox = getCellCands(_grid[i][j]);
                        if (checkBox.length == 2 || checkBox.length == 3) {
                            boxCands.push([i, j, checkBox]);
                        }
                    }
                }
            }

            nakedTripleRemove(boxCands, "Box");

            //Check Row
            var rowCands = [];
            var colCands = [];
            for (i = 0; i < 9; i++) {
                var checkRow = [];
                var checkCol = [];
                if (_grid[_row][i][9] == null && i != _col) {
                    checkRow = getCellCands(_grid[_row][i]);
                    if (checkRow.length == 2 || checkRow.length == 3) {
                        rowCands.push([_row, i, checkRow]);
                    }
                }
                if (_grid[i][_col][9] == null && i != _row) {
                    checkCol = getCellCands(_grid[i][_col]);
                    if (checkCol.length == 2 || checkCol.length == 3) {
                        colCands.push([i, _col, checkCol]);
                    }
                }
            }
            nakedTripleRemove(rowCands, "Row");
            nakedTripleRemove(colCands, "Col");
        }
    }
    function nakedTripleRemove(_candList, _type) {
        var counts = [];
        if(_candList.length >= 3){
            for(var i=0; i < _candList.length; i++) {
                for(var j=0; j< _candList[i][2].length; j++){
                    if(counts.length == 0) {
                        counts.push([_candList[i][2][j], [[_candList[i][0], _candList[i][1]]]]);
                    }
                    else{
                        var exists = false;
                        for(var k = 0; k < counts.length; k++){
                            if(counts[k][0] == _candList[i][2][j]) {
                                exists = true;
                                counts[k][1].push([_candList[i][0], _candList[i][1]]);
                            }
                        }
                        if(exists == false) {
                            counts.push([_candList[i][2][j], [[_candList[i][0], _candList[i][1]]]]);
                        }
                    }
                }
            }
        }
        var filtCount = [];
        for(i = 0; i < counts.length; i++) {
            if(counts[i][1].length == 2 || counts[i][1].length == 3){
                filtCount.push(counts[i]);
            }
        }

        var checkCoords = [];
        var checkValues = [];
        if(filtCount.length >= 3){
            for(i=0; i < filtCount.length; i++) {
                for(j=0; j< filtCount[i][1].length; j++){
                    if(checkCoords.length == 0)
                        checkCoords.push(filtCount[i][1][j]);
                    else{
                        exists = false;
                        for(k = 0; k < checkCoords.length; k++){
                            if(checkCoords[k][0] == filtCount[i][1][j][0] && checkCoords[k][1] == filtCount[i][1][j][1])
                                exists = true;
                        }
                        if(exists == false)
                            checkCoords.push(filtCount[i][1][j]);
                    }

                }
                if(checkValues.length == 0)
                    checkValues.push(filtCount[i][0]);
                else{
                    exists = false;
                    for(k = 0; k < checkValues.length; k++){
                        if(checkValues[k] == filtCount[i][0])
                            exists = true;
                    }
                    if(exists == false)
                        checkValues.push(filtCount[i][0]);
                }
            }
        }
        if(checkCoords.length == 3) {
            var valid = true;
            for (i = 0; i < _candList.length; i++) {
                for (var x = 0; x < checkCoords.length; x++) {
                    if (_candList[i][0] == checkCoords[x][0] && _candList[i][1] == checkCoords[x][1]) {
                        var foundNew = 0;
                        for (j = 0; j < _candList[i][2].length; j++) {
                            if (_candList[i][2][j] != checkValues[0] && _candList[i][2][j] != checkValues[1] && _candList[i][2][j] != checkValues[2])
                                foundNew++;
                        }
                        if (foundNew > 0)
                            valid = false;
                    }
                }
            }
            if (valid == true) {
                if(_type == "Box"){
                    //console.log("Naked box triple found of " + checkValues[0] + ", " + checkValues[1] + ", " + checkValues[2]);
                    var curRow = (Math.floor(checkCoords[0][0] / 3) * 3);
                    for (x = curRow; x < curRow + 3; x++) {
                        var curCol = (Math.floor(checkCoords[0][1] / 3) * 3);
                        for (var y = curCol; y < curCol + 3; y++) {
                            if (_grid[x][y][9] == null) {
                                if (!(x == checkCoords[0][0] && y == checkCoords[0][1]) && !(x == checkCoords[1][0] && y == checkCoords[1][1]) && !(x == checkCoords[2][0] && y == checkCoords[2][1])){
                                    //console.log("Remove box things");
                                    if(_grid[x][y][checkValues[0]] == true) {
                                        _grid[x][y][checkValues[0]] = false;
                                        found = true;
                                    }
                                    if(_grid[x][y][checkValues[1]] == true) {
                                        _grid[x][y][checkValues[1]] = false;
                                        found = true;
                                    }
                                    if(_grid[x][y][checkValues[2]] == true) {
                                        _grid[x][y][checkValues[2]] = false;
                                        found = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(_type == "Row"){
                    //console.log("Naked row triple found of " + checkValues[0] + ", " + checkValues[1] + ", " + checkValues[2]);
                    for (x = 0; x < 9; x++) {
                        if (x != checkCoords[0][1] && x != checkCoords[1][1] && x != checkCoords[2][1] && _grid[checkCoords[0][0]][x][9] == null) {
                            if(_grid[checkCoords[0][0]][x][checkValues[0]] == true) {
                                _grid[checkCoords[0][0]][x][checkValues[0]] = false;
                                found = true;
                            }
                            if(_grid[checkCoords[0][0]][x][checkValues[1]] == true) {
                                _grid[checkCoords[0][0]][x][checkValues[1]] = false;
                                found = true;
                            }
                            if(_grid[checkCoords[0][0]][x][checkValues[2]] == true) {
                                _grid[checkCoords[0][0]][x][checkValues[2]] = false;
                                found = true;
                            }
                        }
                    }
                }
                if(_type == "Col"){
                    //console.log("Naked column triple found of " + checkValues[0] + ", " + checkValues[1] + ", " + checkValues[2]);
                    for (x = 0; x < 9; x++) {
                        if (x != checkCoords[0][0] && x != checkCoords[1][0] && x != checkCoords[2][0] && _grid[x][checkCoords[0][1]][9] == null) {
                            if(_grid[x][checkCoords[0][1]][checkValues[0]] == true) {
                                _grid[x][checkCoords[0][1]][checkValues[0]] = false;
                                found = true;
                            }
                            if(_grid[x][checkCoords[0][1]][checkValues[1]] == true) {
                                _grid[x][checkCoords[0][1]][checkValues[1]]= false;
                                found = true;
                            }
                            if(_grid[x][checkCoords[0][1]][checkValues[2]] == true) {
                                _grid[x][checkCoords[0][1]][checkValues[2]] = false;
                                found = true;
                            }
                        }
                    }
                }
            }
        }
    }
    return found;
}

function hiddenTriple(_row, _col, _grid) {
    var found = false;
    if (_grid[_row][_col][9] == null) {
        var cellCands = getCellCands(_grid[_row][_col]);
        if (cellCands.length >= 2) {
            //Check Box
            var boxCands = [];
            var curRow = boxStartRow(_row);
            for (var i = curRow; i < curRow + 3; i++) {
                var curCol = boxStartCol(_col);
                for (var j = curCol; j < curCol + 3; j++) {
                    if (_grid[i][j][9] == null) {
                        var checkBox = getCellCands(_grid[i][j]);
                        if (checkBox.length > 1) {
                            boxCands.push([i, j, checkBox]);
                        }
                    }
                }
            }

            hiddenTripleRemove(boxCands);

            //Check Row
            var rowCands = [];
            var colCands = [];
            for (i = 0; i < 9; i++) {
                var checkRow = [];
                if (_grid[_row][i][9] == null) {
                    checkRow = getCellCands(_grid[_row][i]);
                    if (checkRow.length > 1) {
                        rowCands.push([_row, i, checkRow]);
                    }
                }
                var checkCol = [];

                if (_grid[i][_col][9] == null) {
                    checkCol = getCellCands(_grid[i][_col]);
                    if (checkCol.length > 1) {
                        colCands.push([i, _col, checkCol]);
                    }
                }
            }
            hiddenTripleRemove(rowCands);
            hiddenTripleRemove(colCands);
        }
    }
    function hiddenTripleRemove(_candList) {
        var counts = [];
        if(_candList.length >= 3){
            for(var i=0; i < _candList.length; i++) {
                for(var j=0; j< _candList[i][2].length; j++){
                    if(counts.length == 0) {
                        counts.push([_candList[i][2][j], [[_candList[i][0], _candList[i][1]]]]);
                    }
                    else{
                        var exists = false;
                        for(var k = 0; k < counts.length; k++){
                            if(counts[k][0] == _candList[i][2][j]) {
                                exists = true;
                                counts[k][1].push([_candList[i][0], _candList[i][1]]);
                            }
                        }
                        if(exists == false) {
                            counts.push([_candList[i][2][j], [[_candList[i][0], _candList[i][1]]]]);
                        }
                    }
                }
            }
        }
        var filtCount = [];
        for(i = 0; i < counts.length; i++) {
            if(counts[i][1].length == 2 || counts[i][1].length == 3){
                filtCount.push(counts[i]);
            }
        }

        var checkCoords = [];
        var checkValues = [];
        if(filtCount.length == 3){
            for(i=0; i < filtCount.length; i++) {
                for(j=0; j< filtCount[i][1].length; j++){
                    if(checkCoords.length == 0)
                        checkCoords.push(filtCount[i][1][j]);
                    else{
                        exists = false;
                        for(k = 0; k < checkCoords.length; k++){
                            if(checkCoords[k][0] == filtCount[i][1][j][0] && checkCoords[k][1] == filtCount[i][1][j][1])
                                exists = true;
                        }
                        if(exists == false)
                            checkCoords.push(filtCount[i][1][j]);
                    }

                }
                if(checkValues.length == 0)
                    checkValues.push(filtCount[i][0]);
                else{
                    exists = false;
                    for(k = 0; k < checkValues.length; k++){
                        if(checkValues[k] == filtCount[i][0])
                            exists = true;
                    }
                    if(exists == false)
                        checkValues.push(filtCount[i][0]);
                }
            }
        }
        if(checkCoords.length == 3){
            var valid = true;
            for(i=0; i<_candList.length; i++){
                for(var x = 0; x< checkCoords.length; x++) {
                    if (_candList[i][0] == checkCoords[x][0] && _candList[i][1] == checkCoords[x][1]) {
                        var foundNew = 0;
                        for (j = 0; j < _candList[i][2].length; j++) {
                            if (_candList[i][2][j] == checkValues[0] || _candList[i][2][j] == checkValues[1] || _candList[i][2][j] == checkValues[2])
                                foundNew++;
                        }
                        if(foundNew < 2)
                            valid = false;
                    }
                }
            }
            if(valid == true) {
                for (i = 0; i < 3; i++) {
                    for (j = 0; j < 9; j++) {
                        if (_grid[checkCoords[i][0]][checkCoords[i][1]][j] == true && j != checkValues[0] && j != checkValues[1] && j != checkValues[2]) {
                            _grid[checkCoords[i][0]][checkCoords[i][1]][j] = false;
                            found = true;
                        }
                    }
                }
            }
        }
    }
    return found;
}

function nakedQuad(_row, _col, _grid) {
    var found = false;
    if (_grid[_row][_col][9] == null) {
        var cellCands = getCellCands(_grid[_row][_col]);
        if (cellCands.length == 2 || cellCands.length == 3 || cellCands.length == 4) {

            //Check Box
            var boxCands = [];
            var curRow = boxStartRow(_row);
            for (var i = curRow; i < curRow + 3; i++) {
                var curCol = boxStartCol(_col);
                for (var j = curCol; j < curCol + 3; j++) {
                    if (_grid[i][j][9] == null) {
                        var checkBox = getCellCands(_grid[i][j]);
                        if (checkBox.length == 2 || checkBox.length == 3 || checkBox.length == 4) {
                            boxCands.push([i, j, checkBox]);
                        }
                    }
                }
            }

            nakedQuadRemove(boxCands, "Box", _grid);

            //Check Row
            var rowCands = [];
            var colCands = [];
            for (i = 0; i < 9; i++) {
                var checkRow = [];
                if (_grid[_row][i][9] == null) {
                    checkRow = getCellCands(_grid[_row][i]);
                    if (checkRow.length == 2 || checkRow.length == 3 || checkRow.length == 4) {
                        rowCands.push([_row, i, checkRow]);
                    }
                }
                var checkCol = [];
                if (_grid[i][_col][9] == null) {
                    checkCol = getCellCands(_grid[i][_col]);
                    if (checkCol.length == 2 || checkCol.length == 3 || checkCol.length == 4) {
                        colCands.push([i, _col, checkCol]);
                    }
                }
            }
            nakedQuadRemove(rowCands, "Row");
            nakedQuadRemove(colCands, "Col");
        }
    }

    function nakedQuadRemove(_candList, _type) {
        var counts = [];
        if(_candList.length >= 4){
            for(var i=0; i < _candList.length; i++) {
                for(var j=0; j< _candList[i][2].length; j++){
                    if(counts.length == 0) {
                        counts.push([_candList[i][2][j], [[_candList[i][0], _candList[i][1]]]]);
                    }
                    else{
                        var exists = false;
                        for(var k = 0; k < counts.length; k++){
                            if(counts[k][0] == _candList[i][2][j]) {
                                exists = true;
                                counts[k][1].push([_candList[i][0], _candList[i][1]]);
                            }
                        }
                        if(exists == false) {
                            counts.push([_candList[i][2][j], [[_candList[i][0], _candList[i][1]]]]);
                        }
                    }
                }
            }
        }
        var filtCount = [];
        for(i = 0; i < counts.length; i++) {
            if(counts[i][1].length == 2 || counts[i][1].length == 3 || counts[i][1].length == 4){
                filtCount.push(counts[i]);
            }
        }

        var checkCoords = [];
        var checkValues = [];
        if(filtCount.length >= 4){
            for(i=0; i < filtCount.length; i++) {
                for(j=0; j< filtCount[i][1].length; j++){
                    if(checkCoords.length == 0)
                        checkCoords.push(filtCount[i][1][j]);
                    else{
                        exists = false;
                        for(k = 0; k < checkCoords.length; k++){
                            if(checkCoords[k][0] == filtCount[i][1][j][0] && checkCoords[k][1] == filtCount[i][1][j][1])
                                exists = true;
                        }
                        if(exists == false)
                            checkCoords.push(filtCount[i][1][j]);
                    }

                }
                if(checkValues.length == 0)
                    checkValues.push(filtCount[i][0]);
                else{
                    exists = false;
                    for(k = 0; k < checkValues.length; k++){
                        if(checkValues[k] == filtCount[i][0])
                            exists = true;
                    }
                    if(exists == false)
                        checkValues.push(filtCount[i][0]);
                }
            }
        }
        if(checkCoords.length == 4) {
            var valid = true;
            for (i = 0; i < _candList.length; i++) {
                for (var x = 0; x < checkCoords.length; x++) {
                    if (_candList[i][0] == checkCoords[x][0] && _candList[i][1] == checkCoords[x][1]) {
                        var foundMatch = 0;
                        for (j = 0; j < _candList[i][2].length; j++) {
                            if (_candList[i][2][j] != checkValues[0] && _candList[i][2][j] != checkValues[1] && _candList[i][2][j] != checkValues[2] && _candList[i][2][j] != checkValues[3])
                                foundMatch++;
                        }
                        if (foundMatch > 0)
                            valid = false;
                    }
                }
            }
            if (valid == true) {
                if(_type == "Box"){
                    //console.log("Naked box triple found of " + checkValues[0] + ", " + checkValues[1] + ", " + checkValues[2]);
                    var curRow = (Math.floor(checkCoords[0][0] / 3) * 3);
                    for (x = curRow; x < curRow + 3; x++) {
                        var curCol = (Math.floor(checkCoords[0][1] / 3) * 3);
                        for (var y = curCol; y < curCol + 3; y++) {
                            if (_grid[x][y][9] == null) {
                                if (!(x == checkCoords[0][0] && y == checkCoords[0][1]) && !(x == checkCoords[1][0] && y == checkCoords[1][1]) && !(x == checkCoords[2][0] && y == checkCoords[2][1]) && !(x == checkCoords[3][0] && y == checkCoords[3][1])){
                                    //console.log("Remove box things");
                                    if(_grid[x][y][checkValues[0]] == true) {
                                        _grid[x][y][checkValues[0]] = false;
                                        found = true;
                                    }
                                    if(_grid[x][y][checkValues[1]] == true){
                                        _grid[x][y][checkValues[1]] = false;
                                        found = true;
                                    }
                                    if(_grid[x][y][checkValues[2]] == true) {
                                        _grid[x][y][checkValues[2]] = false;
                                        found = true;
                                    }
                                    if(_grid[x][y][checkValues[3]] == true) {
                                        _grid[x][y][checkValues[3]] = false;
                                        found = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(_type == "Row"){
                    //console.log("Naked row triple found of " + checkValues[0] + ", " + checkValues[1] + ", " + checkValues[2]);
                    for (x = 0; x < 9; x++) {
                        if (x != checkCoords[0][1] && x != checkCoords[1][1] && x != checkCoords[2][1] && x != checkCoords[3][1] && _grid[checkCoords[0][0]][x][9] == null) {
                            if(_grid[checkCoords[0][0]][x][checkValues[0]] == true) {
                                _grid[checkCoords[0][0]][x][checkValues[0]] = false;
                                found = true;
                            }
                            if(_grid[checkCoords[0][0]][x][checkValues[1]] == true) {
                                _grid[checkCoords[0][0]][x][checkValues[1]] = false;
                                found = true;
                            }
                            if(_grid[checkCoords[0][0]][x][checkValues[2]] == true) {
                                _grid[checkCoords[0][0]][x][checkValues[2]] = false;
                                found = true;
                            }
                            if(_grid[checkCoords[0][0]][x][checkValues[3]] == true) {
                                _grid[checkCoords[0][0]][x][checkValues[3]] = false;
                                found = true;
                            }
                        }
                    }
                }
                if(_type == "Col"){
                    //console.log("Naked column triple found of " + checkValues[0] + ", " + checkValues[1] + ", " + checkValues[2]);
                    for (x = 0; x < 9; x++) {
                        if (x != checkCoords[0][0] && x != checkCoords[1][0] && x != checkCoords[2][0] && x != checkCoords[3][0] && _grid[x][checkCoords[0][1]][9] == null) {
                            if(_grid[x][checkCoords[0][1]][checkValues[0]] == true) {
                                _grid[x][checkCoords[0][1]][checkValues[0]] = false;
                                found = true;
                            }
                            if(_grid[x][checkCoords[0][1]][checkValues[1]] == true) {
                                _grid[x][checkCoords[0][1]][checkValues[1]]= false;
                                found = true;
                            }
                            if(_grid[x][checkCoords[0][1]][checkValues[2]] == true) {
                                _grid[x][checkCoords[0][1]][checkValues[2]] = false;
                                found = true;
                            }
                            if(_grid[x][checkCoords[0][1]][checkValues[3]] == true) {
                                _grid[x][checkCoords[0][1]][checkValues[3]] = false;
                                found = true;
                            }
                        }
                    }
                }
            }
        }
    }
    return found
}

function rowExclusive (_row, _grid) {
    var rowCands = [];
    for (var i = 0; i < 9; i++) {
        if (_grid[_row][i][9] == null) {
            var checkRow = getCellCands(_grid[_row][i]);
            rowCands.push([checkRow, i]);
        }
    }
    var rowFound = [];
    for (i = 0; i < rowCands.length; i++) {
        for (var j = 0; j < rowCands[i][0].length; j++) {
            if (rowFound.length == 0) {
                rowFound.push([rowCands[i][0][j], [rowCands[i][1]]]);
            }
            else {
                var exists = false;
                for (var k = 0; k < rowFound.length; k++) {
                    if (rowFound[k][0] == rowCands[i][0][j]) {
                        exists = true;
                        rowFound[k][1].push(rowCands[i][1]);
                    }
                }
                if (exists == false)
                    rowFound.push([rowCands[i][0][j], [rowCands[i][1]]]);
            }
        }
    }
    return rowFound;
}

function colExclusive(_col, _grid) {
    var colCands = [];
    for (var i = 0; i < 9; i++) {
        if (_grid[i][_col][9] == null) {
            var checkCol = getCellCands(_grid[i][_col]);
            colCands.push([checkCol, i]);
        }
    }
    var colFound = [];
    for (i = 0; i < colCands.length; i++) {

        for (j = 0; j < colCands[i][0].length; j++) {
            if (colFound.length == 0) {
                colFound.push([colCands[i][0][j], [colCands[i][1]]]);
            }
            else {
                var exists = false;
                for (k = 0; k < colFound.length; k++) {
                    if (colFound[k][0] == colCands[i][0][j]) {
                        exists = true;
                        colFound[k][1].push(colCands[i][1]);
                    }
                }
                if (exists == false)
                    colFound.push([colCands[i][0][j], [colCands[i][1]]]);
            }
        }
    }
    return colFound;
}

function ywing(_row, _col, _grid){
    var boxPairMatch;
    var rowPairMatch;
    var colPairMatch;
    var cellCands;
    var found = false;
    if (_grid[_row][_col][9] == null) {
        cellCands = getCellCands(_grid[_row][_col]);
        if (cellCands.length == 2) {
            //Search the box, row, and column of this cell for another pair with only one shared number
            boxPairMatch = [];
            rowPairMatch = [];
            colPairMatch = [];
            var checkBox;
            var otherCells = otherBoxCells(_row, _col);
            for (var i = 0; i < 9; i++) {
                // Traverse checking cell row
                if (_grid[_row][i][9] == null && _grid[_row][i] != _grid[_row][_col]) {
                    if(boxStartCol(i) != boxStartCol(_col)) {
                        var checkRow = getCellCands(_grid[_row][i]);
                        if (checkRow.length == 2) {
                            if (checkRow[0] == cellCands[0] && checkRow[1] != cellCands[1])
                                rowPairMatch.push([checkRow[0], checkRow[1], [_row, i]]);
                            else if (checkRow[0] != cellCands[0] && checkRow[1] == cellCands[1])
                                rowPairMatch.push([checkRow[1], checkRow[0], [_row, i]]);
                        }
                    }
                    if(boxStartCol(i) == boxStartCol(_col)) {
                        checkBox = getCellCands(_grid[_row][i]);
                        if (checkBox.length == 2) {
                            if(checkBox[0] == cellCands[0] && checkBox[1] != cellCands[1])
                                boxPairMatch.push([checkBox[0], checkBox[1], [_row, i]]);
                            else if(checkBox[0] != cellCands[0] && checkBox[1] == cellCands[1])
                                boxPairMatch.push([checkBox[1], checkBox[0], [_row, i]]);
                        }
                    }
                }

                // Traverse checking cell column
                if (_grid[i][_col][9] == null && _grid[i][_col] != _grid[_row][_col]) {
                    if(boxStartRow(i) != boxStartRow(_row)) {
                        var checkCol = getCellCands(_grid[i][_col]);
                        if (checkCol.length == 2) {
                            if (checkCol[0] == cellCands[0] && checkCol[1] != cellCands[1])
                                colPairMatch.push([checkCol[0], checkCol[1], [i, _col]]);
                            else if (checkCol[0] != cellCands[0] && checkCol[1] == cellCands[1])
                                colPairMatch.push([checkCol[1], checkCol[0], [i, _col]]);
                        }
                    }
                    if(boxStartRow(i) == boxStartRow(_row)) {
                        checkBox = getCellCands(_grid[i][_col]);
                        if (checkBox.length == 2) {
                            if(checkBox[0] == cellCands[0] && checkBox[1] != cellCands[1])
                                boxPairMatch.push([checkBox[0], checkBox[1], [i, _col]]);
                            else if(checkBox[0] != cellCands[0] && checkBox[1] == cellCands[1])
                                boxPairMatch.push([checkBox[1], checkBox[0], [i, _col]]);
                        }
                    }
                }

                // Check the other four box cells not in the row or column
                if(i < otherCells.length){
                    var otherRow = otherCells[i][0];
                    var otherCol = otherCells[i][1];
                    if (_grid[otherRow][otherCol][9] == null) {
                        checkBox = getCellCands(_grid[otherRow][otherCol]);
                        if (checkBox.length == 2) {
                            if (checkBox[0] == cellCands[0] && checkBox[1] != cellCands[1])
                                boxPairMatch.push([checkBox[0], checkBox[1], [otherRow, otherCol]]);
                            else if (checkBox[0] != cellCands[0] && checkBox[1] == cellCands[1])
                                boxPairMatch.push([checkBox[1], checkBox[0], [otherRow, otherCol]]);
                        }
                    }
                }
            }

            //Four box formation
            if(colPairMatch.length >= 1 && rowPairMatch.length >= 1 && boxPairMatch.length == 0)
                fourBox();
            if(colPairMatch.length == 0 && rowPairMatch.length >= 1 && boxPairMatch.length >= 1)
                rowBox();
            if(colPairMatch.length >= 1 && rowPairMatch.length == 0 && boxPairMatch.length >= 1)
                colBox();
            if(colPairMatch.length >= 1 && rowPairMatch.length >= 1 && boxPairMatch.length >= 1) {
                fourBox();
                rowBox();
                colBox();
            }
        }
    }

    function fourBox(){
        for(i = 0; i < rowPairMatch.length; i++) {
            for(var j = 0; j < colPairMatch.length; j++) {
                var rowPairA = rowPairMatch[i][0];
                var rowPairC = rowPairMatch[i][1];
                var rowCellY = rowPairMatch[i][2][0];
                var rowCellX = rowPairMatch[i][2][1];

                var colPairB = colPairMatch[j][0];
                var colPairC = colPairMatch[j][1];
                var colCellY = colPairMatch[j][2][0];
                var colCellX = colPairMatch[j][2][1];

                if (rowPairA != colPairB && rowPairC == colPairC && _grid[colCellY][rowCellX][rowPairC] == true) {
                    _grid[colCellY][rowCellX][rowPairC] = false;
                    //console.log("Eliminated candidate " + rowPairC + " from "+ colCellY + ", " + rowCellX);
                    //console.log(_row + "," + _col + " has cands " + cellCands[0] + " and " + cellCands[1]);
                    //console.log(rowCellY + "," + rowCellX + " has cands " + rowPairA + " and " + rowPairC);
                    //console.log(colCellY + "," + colCellX + " has cands " + colPairB + " and " + colPairC);
                    found = true;
                }
            }
        }
    }

    function rowBox(){
        for(i = 0; i < rowPairMatch.length; i++) {
            for (var j = 0; j < boxPairMatch.length; j++) {
                var rowPairA = rowPairMatch[i][0];
                var rowPairC = rowPairMatch[i][1];
                var rowCellY = rowPairMatch[i][2][0];
                var rowCellX = rowPairMatch[i][2][1];

                var boxPairB = boxPairMatch[j][0];
                var boxPairC = boxPairMatch[j][1];
                var boxCellY = boxPairMatch[j][2][0];
                var boxCellX = boxPairMatch[j][2][1];

                if (rowPairA != boxPairB && rowPairC == boxPairC && _row != boxCellY) {
                    var boxCol = boxStartCol(rowCellX);
                    for (var k = boxCol; k < boxCol + 3; k++) {
                        if (_grid[boxCellY][k][rowPairC] == true){
                            _grid[boxCellY][k][rowPairC] = false;
                            //console.log("Eliminated candidate " + rowPairC + " from "+ boxCellY + ", " + k);
                            //console.log(_row + "," + _col + " has cands " + cellCands[0] + " and " + cellCands[1]);
                            //console.log(_row + "," + rowCellX + " has cands " + rowPairA + " and " + rowPairC);
                            //console.log(boxCellY + "," + boxCellX + " has cands " + boxPairB + " and " + boxPairC);
                            found = true;
                        }
                    }
                    if (_grid[rowCellY][boxCellX][rowPairC] == true) {
                        _grid[rowCellY][boxCellX][rowPairC] = false;
                        //console.log("Eliminated candidate " + rowPairC + " from "+ rowCellY + ", " + boxCellX);
                        //console.log(_row + "," + _col + " has cands " + cellCands[0] + " and " + cellCands[1]);
                        //console.log(_row + "," + rowCellX + " has cands " + rowPairA + " and " + rowPairC);
                        //console.log(boxCellY + "," + boxCellX + " has cands " + boxPairB + " and " + boxPairC);
                        found = true;
                    }
                }
            }
        }
    }

    function colBox(){
        for(i = 0; i < colPairMatch.length; i++) {
            for (var j = 0; j < boxPairMatch.length; j++) {
                var colPairA = colPairMatch[i][0];
                var colPairC = colPairMatch[i][1];
                var colCellY = colPairMatch[i][2][0];
                var colCellX = colPairMatch[i][2][1];

                var boxPairB = boxPairMatch[j][0];
                var boxPairC = boxPairMatch[j][1];
                var boxCellY = boxPairMatch[j][2][0];
                var boxCellX = boxPairMatch[j][2][1];

                if (colPairA != boxPairB && colPairC == boxPairC && _col != boxCellX) {

                    var boxRow = boxStartRow(colCellY);
                    for (var k = boxRow; k < boxRow + 3; k++) {
                        if (_grid[k][boxCellX][colPairC] == true){
                            _grid[k][boxCellX][colPairC] = false;
                            //console.log("Eliminated candidate " + colPairC + " from "+ k + ", " + boxCellX);
                            //console.log(_row + "," + _col + " has cands " + cellCands[0] + " and " + cellCands[1]);
                            //console.log(boxCellY + "," + boxCellX + " has cands " + boxPairB + " and " + boxPairC);
                            //console.log(colCellY + "," + _col + " has cands " + colPairA + " and " + colPairC);
                            found = true;
                        }
                    }
                    if (_grid[boxCellY][colCellX][colPairC] == true) {
                        _grid[boxCellY][colCellX][colPairC] = false;
                        //console.log("Eliminated candidate " + colPairC + " from "+ boxCellY + ", " + colCellX);
                        //console.log(_row + "," + _col + " has cands " + cellCands[0] + " and " + cellCands[1]);
                        //console.log(boxCellY + "," + boxCellX + " has cands " + boxPairB + " and " + boxPairC);
                        //console.log(colCellY + "," + _col + " has cands " + colPairA + " and " + colPairC);
                        found = true;
                    }
                }
            }
        }
    }
    return found;
}

function numberOfPuzBlanks(_grid) {
    var howManyBlanks = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (_grid[i][j][9] == null)
                howManyBlanks++;
        }
    }
    return howManyBlanks;
}

function boxStartRow(_row){
    return (Math.floor(_row / 3) * 3);
}

function boxStartCol(_col){
    return (Math.floor(_col / 3) * 3);
}

function boxSecond(_unit){
    return ((_unit + 2) % 3);
}

function boxThird(_unit){
    return ((_unit + 4) % 3);
}

function boxNum(_row, _col){
    return ((boxStartCol(_col)/3) + boxStartRow(_row)) ;
}

function otherBoxCells(_row, _col){
    var row1 =  boxSecond(_row)+ boxStartRow(_row);
    var row2 =  boxThird(_row) + boxStartRow(_row);
    var col1 =  boxSecond(_col) + boxStartCol(_col);
    var col2 =  boxThird(_col) + boxStartCol(_col);
    return [[row1, col1], [row1, col2], [row2, col1], [row2, col2]];
}

var blank = function () {
    this.grid = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]];
};

function Puzzle(_given, _solut) {
    this.given = _given;
    this.solut = _solut;
    this.setGiven = function (_grid) {
        for (var i = 0; i < _grid.length; i++)
            this.given[i] = _grid[i].slice();
    };

    this.getGiven = function () {
        return this.given;
    };

    this.setSolution = function (_grid) {
        for (var i = 0; i < _grid.length; i++)
            this.solut[i] = _grid[i].slice();
    };

    this.getSolution = function () {
        return this.solut;
    };
}