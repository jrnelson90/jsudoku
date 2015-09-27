// JavaScript Sudoku Table Generation Assignment
// Author:		 Justin Nelson
// Assignment:	 Assignment 2
// File:		 timer.js
// Instructor:   Lynn Thackeray
// Class:		 CS 2550 Section 001
// Date Written: 9/23/2015
// Description:  Defines the timerObject related functions

var timerObject;
timerObject = function () {

    var startingTime;

    var timerController;

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

        var timeString = (h + ':' + m + ':' + s);
        return timeString;
    };

    // The amount of elapsed time since game began
    var getElapsedTime = function () {
        return formatTime((currentTime() - startingTime));
    };

    // Start game timer
    this.start = function () {
        timerController = setInterval("timerInstance.updateDisplay()", 1000);
        startingTime = currentTime();
    };


    this.updateDisplay = function () {
        document.getElementById('gameTimerDisplay').innerHTML = getElapsedTime();
    };
};

var timerInstance;
function createTimer() {
    document.getElementById('gameTimerDisplay').innerHTML = "00:00:00";
    timerInstance = new timerObject();
}