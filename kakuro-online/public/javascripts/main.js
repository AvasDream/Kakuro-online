$(document).ready(function(){
    $("#initButton").click(function(){
     initGame();
    });
});

function initGame() {
    $.get("/initGame", function(data, status){
            var game = JSON.parse(data);
            console.log(game);
        });
    return 1;
}