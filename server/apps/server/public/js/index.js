$(function () {
   initWindow();
   window.onresize = initWindow;
});


function initWindow() {
    $(".main").width(window.innerWidth-66).height(window.innerHeight-66)
}