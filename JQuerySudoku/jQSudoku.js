/**
 * Created by jrnel on 6/20/2016.
 */
var gameView = new SudokuView();
var defaultGridLength = 9;

$(document).ready(function () {
    gameView.getBrowserInfo();
    gameView.drawStartScreen();
    $("#startPage").css({"opacity": "1"});
    // Create 9x9 Grid
    gameView.drawGameGrid(defaultGridLength, defaultGridLength);
    if(document.body.offsetWidth < 600) {
        $("#middleButtons").append($("#help"));
        $("#middleButtons").css({"float": "right"});
    }
    setTimeout(function () {
        $("#displayArea").css({"opacity": "1"});
        $("#toolbar").css({"visibility": "visible"});
    },300);

    $(window).resize(function () {
        gameView.resizeView();
    });

    $(".gridCell").click(function () {

    });
});

function SudokuView() {
    var cellSize = 0;
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
    var gridBlurred = false;
    var startOpen;
    var $startScreen;

    this.drawStartScreen = function () {
        startOpen = true;
        // Create Start Page DIV
        $("body").append('<div id=\"startPage\">');
        $startScreen = $("#startPage");
        $startScreen.css({"width": window.innerWidth + "px"});

        $startScreen.append('<img src=\"logo.png\" id=\"startLogo\">');
        $startScreen.append('<div id=\"startMenuCont\">');
        $("#startMenuCont").append('<div id=\"startBtn\">');
        $("#startBtn").html("START GAME");
        $("#startBtn").click(function () {
            //gameView.navTone();

            // if(gameView.selectToggle() == true)
            //     gameView.collapseSelect();
            gameView.slideStartClose();

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
    };

    this.slideStartClose = function() {
        startOpen = false;
        var currentStartWidth = parseInt($startScreen.css("width"));
        console.log(currentStartWidth);
        $startScreen.css({"left": (0 - currentStartWidth) + "px"});
        setTimeout(function() {
            $startScreen.css({"visibility": "hidden"});
        },510);
    };

    this.drawGameGrid = function (_rows, _columns) {
        var $gameGrid = $("#gameGrid");
        for (var i = 0; i < _rows; i++) {
            $gameGrid.append('<div id=\"row' + i + '\" class=\"gridRow\">');
            for (var j = 0; j < _columns; j++) {
                $(".gridRow:last").append('<div id=\"' + i + 'x' + j + '\" class=\"gridCell gameCell\">');
            }
        }
        this.resizeView();
    };

    this.resizeView = function() {
        var cellSize;
        var gridSize;
        this.getBrowserInfo();
        // Define the CSS style of gameGrid to have a black border with curved corners and a white background
        if(this.getViewWidth() < this.getViewHeight()) {
            if (gameView.getIsMobile() && document.body.offsetWidth < 420){
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
        $(".gridCell").css({
            "height": gameView.getCellSize() + "px",
            "width": gameView.getCellSize() + "px",
            "opacity": "1"
        });
        console.log(gridSize);
        console.log(cellSize);
    }

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

    this.navTone = function() {
        $("#navSound").play();
    };

}