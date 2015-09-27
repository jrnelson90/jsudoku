/**
 * Created by jrnel on 9/27/2015.
 */
var inputDisplay;
function createPopupMenu() {
    inputDisplay = new inputPopup();
}

var inputPopup = function () {
    var popMenu;
    var menuVisible;

    this.initializePopMenu = function() {
        popMenu = document.createElement("DIV");
        popMenu.setAttribute("id", "popMenu");
        popMenu.style.zIndex = 2;
        popMenu.style.opacity = 0;
        popMenu.style.visibility = "hidden";
        document.getElementById("gameGrid").appendChild(popMenu);

        var popMenuList = document.createElement("UL");
        popMenu.appendChild(popMenuList);

        for (var i = 0; i < 9; i++) {
            var selectNum = document.createElement("LI");
            selectNum.setAttribute("class", "numSelect");
            var optText = i + 1;
            selectNum.innerHTML = optText.toString();
            popMenuList.appendChild(selectNum);
            if ((i + 1) % 3 == 0) {
                var newLine = document.createElement("BR");
                popMenuList.appendChild(newLine);
            }
        }
        menuVisible = false;
        for (i = 0; i < 9; i++) {
            var numbers = document.getElementsByClassName("numSelect");
            numbers[i].onclick = function () {
                lastClicked.innerHTML = this.innerHTML;
                inputDisplay.close();
            };

        }
    };

    this.open = function(thisCell) {
        popMenu.style.top = thisCell.offsetTop - 320 + "px";
        popMenu.style.left = thisCell.offsetLeft - 20 + "px";
        popMenu.style.visibility = "visible";
        popMenu.style.opacity = 1;
        menuVisible = true;
    };

    this.close = function() {
        popMenu.style.opacity = 0;
        popMenu.style.visibility = "hidden";
        menuVisible = false;
    };

    this.getVisibility = function() {
        return menuVisible;
    };
};