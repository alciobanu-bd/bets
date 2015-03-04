
var isWindowActive = true;

$(window).focus(function() {
    isWindowActive = true;
});

$(window).blur(function() {
    isWindowActive = false;
});
