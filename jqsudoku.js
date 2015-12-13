/**
 * Created by jrnel on 12/13/2015.
 */
$(document).ready(function(){
    var gameModel;
    var gameControl;
    var gameView;
    setTimeout(function() {
        // Set the opacity of the start page to 1 so that it fades in on load
        $("#startPage").style.opacity = "1";
        // If the size of the body of the page is less than 600 px (aka mobile)
        if($("body").offsetWidth < 600) {
            $("#middleButtons").appendChild($("#help"));
            $("#middleButtons").style.float = "right";
        }
    }, 10);
    setTimeout(function(){
        $("#toolbar").style.visibility = "visible";
        $("#displayArea").style.opacity = "1";
    }, 1000);
});
