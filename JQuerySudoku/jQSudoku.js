/**
 * Created by jrnel on 6/20/2016.
 */
var gameView = new SudokuView();
var gameControl = new SudokuControl();
var gameModel = new SudokuModel();
var defaultGridLength = 9;

$(document).ready(function () {
    gameView.getBrowserInfo();
    gameView.setupStartScreen();
    $("#startPage").css({"opacity": "1"});

    // Create 9x9 Grid
    gameView.drawGameGrid(defaultGridLength, defaultGridLength);
    if($(window).width() < 600) {
        $("#middleButtons").append($("#help"));
        $("#middleButtons").css({"float": "right"});
    }
    setTimeout(function () {
        $("#displayArea").css({"opacity": "1"});
        $("#toolbar").css({"visibility": "visible"});
    },500);

    $("#back").click(function () {
        gameView.slideStartOpen();
    });

    $(window).resize(function () {
        gameView.resizeView();
    });
});

function SudokuModel() {
    var currentDifficulty = "medium";

 this.difficulty = function () {
        return currentDifficulty;
    };

    this.setDifficulty = function (_selection) {
        currentDifficulty = _selection;
    };

}

function SudokuControl(){
    this.toggleSelect = function () {
        if (gameView.selectToggle() == false) {
            gameView.expandSelect();
        } else {
            gameView.collapseSelect();
        }
    };
}

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

    this.setupStartScreen = function () {
        startOpen = true;
        // Create Start Page DIV
        $startScreen = $("#startPage");
        $startScreen.css({"width": window.innerWidth + "px"});
        $("#startBtn").click(function () {
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

        var $subMenu = $("#selDropCont");
        $subMenu.hide();
        var $menuText = $("#selText");
        $subMenu.css({"visibility": "visible"});
        $(".selOpt").css({"visibility": "visible"});

        $menuText.click(function () {
            $subMenu.slideDown(300).css({"opacity": "1"});
        });

        // When a Difficulty Selection Option is Clicked
        $(".selOpt").click(function () {
            $subMenu.slideUp(300).css({"opacity": "0"});
            $menuText.text($(this).text());
            gameModel.setDifficulty($(this).text().toLowerCase());
            $(".prevCell").text("").css({"opacity": "0"});
            setTimeout(function() {
                if ($menuText.text() == "Easy")
                    loadPreview(easyPreview);
                else if ($menuText.text() == "Medium")
                    loadPreview(medPreview);
                else if ($menuText.text() == "Hard")
                    loadPreview(hardPreview);
                else if ($menuText.text() == "Crazy")
                    loadPreview(crazyPreview);
            }, 300);
        });

        // Add Difficulty Preview Grid
        drawPreviewGrid(9,9);
        loadPreview(medPreview);

        function drawPreviewGrid(_rows, _columns) {
            for (var i = 0; i < _rows; i++) {
                $("#previewGrid").append('<div id=\"prevRow' + i + '\" class=\"prevRow\">');
                for (var j = 0; j < _columns; j++) {
                    $(".prevRow:last").append('<div id=\"prev' + i + 'x' + j + '\" class=\"gridCell prevCell\">');
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
            $(".prevCell").css({
                "height": prevCellSize + "px",
                "width": prevCellSize + "px",
            });
            console.log(prevGridSize);
            console.log(prevCellSize);
        }

        function loadPreview(_passedPuzzle) {
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 9; y++) {
                    if (_passedPuzzle[x][y]!= 0)
                        $("#prev" + x + "x" + y).text(_passedPuzzle[x][y]);
                }
            }
            setTimeout(function() {
                $(".prevCell").css({"opacity": "1"});
            }, 50);
        }
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

        if (startOpen == false)
            $("#startPage").css({"left": (0 - $(window).innerWidth()) + "px", "top": "0"});
        $("#startPage").css({"width": $(window).innerWidth() + "px", "height": $(window).innerHeight() + "px"});


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
        $(".gameCell").css({
            "height": gameView.getCellSize() + "px",
            "width": gameView.getCellSize() + "px",
            "opacity": "1"
        });
        console.log(gridSize);
        console.log(cellSize);
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