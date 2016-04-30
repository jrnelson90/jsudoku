function expandPaper() {
    var paper = document.getElementById("materialCont");
    paper.style.visibility = "visible";
    paper.style.top = "0";
}

document.onreadystatechange = function () {
    if(document.readyState == "complete") {
        setTimeout( function() {
            expandPaper();
        },1000);
    }
};