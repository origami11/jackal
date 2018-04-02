var isRecord = false;
var steps = [];
window.startRecord = function () {
    isRecord = true;
    steps = [];
}
window.stopRecord = function () {
    isRecord = false;
    localStorage.setItem('game', JSON.stringify(steps));
}
window.playRecord = function () {
    var n = JSON.parse(localStorage.getItem('game'));
            
    if (n) {
        n.forEach(message => socket.send(message));
    }
}
