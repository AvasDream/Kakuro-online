var game;
$(document).ready(function(){
    $("#initButton").click(function(){
    game = initGame();
    // Game is undefined, lookup var scope in js
    //console.log(game);
    });
    $("#clearButton").click(function(){
        clearGame()
        });
});

function initGame() {
    $.get("/initGame", function(data, status){
            game = JSON.parse(data)
            for (i in game.grid.cells) {
                    var row = game.grid.cells[i].row
                    var col = game.grid.cells[i].col
                    var type = game.grid.cells[i].cell.type
                    var id = String(row)+"."+String(col)
                    //console.log(id,game.grid.cells[i].cell.type,row,col)
                    switch(type) {
                        case 0:
                            // leere Zelle
                            document.getElementById(id).innerHTML = String(id)
                            document.getElementById(id).style.color = "black";
                            break;
                        case 1:
                            //Zelle zum ausfüllen
                            document.getElementById(id).innerHTML = String(id)
                            document.getElementById(id).style.color = "white";
                            break;
                        case 2:
                            //Zelle die Werte angibt
                            document.getElementById(id).innerHTML = String(id)
                            document.getElementById(id).style.color = "red";
                            break;
                        default:
                            alert("This case should not be possible,look at initGame switch case")
                    }
                }
            return game;
        });
}
function clearGame(){
    for(var i = 0; i < 8; i++) {
       for(var j = 0; j < 8; j++) {
              var id = String(i)+"."+String(j)
              document.getElementById(id).innerHTML = ""
           }
    }
}
function fillField(game) {
    for (cell in game.grid.cells) {
        console.log(cell);
    }
}