var game;
var filed_ids = new Array();
$(document).ready(function(){
    $("#initButton").click(function(){
        game = initGame()
    // Game is undefined, lookup var scope in js
    //console.log(game);
    });
    $("#clearButton").click(function(){
        clearGame()
    });
    $("#setButton").click(function() {
        setValue()
    });
    $("#undoButton").click(function() {
        undoGame()
    });
    $("#redoButton").click(function() {
        redoGame()
    });
    $("#saveButton").click(function() {
        saveGame()
    });
    $("#loadButton").click(function() {
        loadGame()
    });
});

function initGame() {
    filed_ids = new Array();
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""
    $.get("/initGame", function(data, status){
            game = JSON.parse(data)
            for (i in game.grid.cells) {
                    var row = game.grid.cells[i].row
                    var col = game.grid.cells[i].col
                    var type = game.grid.cells[i].cell.type
                    //var id = String(row)+"."+String(col)
                    var id = String(col)+"."+String(row)

                    //console.log(id,game.grid.cells[i].cell.type,row,col)
                    switch(type) {
                        case 0:
                            // // leere Zelle
                            document.getElementById(id).style.backgroundColor = "black";
                            break;
                        case 1:
                            //Zelle zum ausfüllen
                            filed_ids.push(id)
                            document.getElementById(id).style.backgroundColor = "white";
                            document.getElementById(id).style.color = "black";
                            break;
                        case 2:
                            //Zelle die Werte angibt
                            if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                                document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                            }else if(game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0){
                                document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                            }else if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0){
                                document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                                document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                            }
                            document.getElementById(id).style.backgroundColor = "black";
                            document.getElementById(id).style.color = "white";
                            break;
                        default:
                            alert("This case should not be possible,look at initGame switch case")
                    }
                }
            return game;
        });
}

function clearGame(){
    //filed_ids = new Array();
    for (i in game.grid.cells) {
        var row = game.grid.cells[i].row
        var col = game.grid.cells[i].col
        var type = game.grid.cells[i].cell.type
        var id = String(col)+"."+String(row)
        //console.log(id,game.grid.cells[i].cell.type,row,col)
        switch(type) {
            case 0:
                // // leere Zelle
                document.getElementById(id).style.backgroundColor = "black";
                break;
            case 1:
                //Zelle zum ausfüllen
                document.getElementById(id).innerHTML = String("")
                document.getElementById(id).style.backgroundColor = "white";
                document.getElementById(id).style.color = "black";
                break;
            case 2:
                //Zelle die Werte angibt
                if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                    document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                } else if (game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0) {
                    document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                } else if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0) {
                    document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                    document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                }
                document.getElementById(id).style.backgroundColor = "black";
                document.getElementById(id).style.color = "white";
                break;
            default:
                alert("This case should not be possible,look at initGame switch case")
        }
    }
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""
}

function setValue() {
    var rowF = document.getElementById("row").value - 1
    var colF = document.getElementById("col").value - 1
    var valueF = document.getElementById("value").value
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""

    var cell_id = String(rowF)+"."+String(colF)
    if(filed_ids.includes(cell_id)) {
        $.get("/set/" + rowF + "/" + colF + "/" + valueF, function (data, status) {
            game = JSON.parse(data)
            for (i in game.grid.cells) {
                var row = game.grid.cells[i].row
                var col = game.grid.cells[i].col
                var type = game.grid.cells[i].cell.type
                //var id = String(row)+"."+String(col)
                var id = String(col) + "." + String(row)
                //console.log(id,game.grid.cells[i].cell.type,row,col)
                switch (type) {
                    case 0:
                        // // leere Zelle
                        document.getElementById(id).style.backgroundColor = "black";
                        break;
                    case 1:
                        //Zelle zum ausfüllen
                        if (game.grid.cells[i].cell.value != 0) {
                            document.getElementById(id).innerHTML = String(game.grid.cells[i].cell.value)
                        }
                        document.getElementById(id).style.backgroundColor = "white";
                        document.getElementById(id).style.color = "black";
                        break;
                    case 2:
                        //Zelle die Werte angibt
                        if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                        } else if (game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                        } else if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                        }
                        document.getElementById(id).style.backgroundColor = "black";
                        document.getElementById(id).style.color = "white";
                        break;
                    default:
                        alert("This case should not be possible,look at initGame switch case")
                }
            }
        });
    }else{
        alert("You can only fill white cells")
    }

}

function undoGame() {
    $.get("/undoGame", function(data, status){
        game = JSON.parse(data)
        for (i in game.grid.cells) {
            var row = game.grid.cells[i].row
            var col = game.grid.cells[i].col
            var type = game.grid.cells[i].cell.type
            //var id = String(row)+"."+String(col)
            var id = String(col)+"."+String(row)
            //console.log(id,game.grid.cells[i].cell.type,row,col)
            switch(type) {
                case 0:
                    // // leere Zelle
                    document.getElementById(id).style.backgroundColor = "black";
                    break;
                case 1:
                    //Zelle zum ausfüllen
                    if(game.grid.cells[i].cell.value != 0) {
                        document.getElementById(id).innerHTML = String(game.grid.cells[i].cell.value)
                    }
                    document.getElementById(id).style.backgroundColor = "white";
                    document.getElementById(id).style.color = "black";
                    break;
                case 2:
                    //Zelle die Werte angibt
                    if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                        document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                    }else if(game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0){
                        document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                    }else if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0){
                        document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                        document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                    }
                    document.getElementById(id).style.backgroundColor = "black";
                    document.getElementById(id).style.color = "white";
                    break;
                default:
                    alert("This case should not be possible,look at initGame switch case")
            }
        }

    });
}

function redoGame() {
    $.get("/redoGame", function(data, status){
        game = JSON.parse(data)
        for (i in game.grid.cells) {
            var row = game.grid.cells[i].row
            var col = game.grid.cells[i].col
            var type = game.grid.cells[i].cell.type
            //var id = String(row)+"."+String(col)
            var id = String(col)+"."+String(row)
            //console.log(id,game.grid.cells[i].cell.type,row,col)
            switch(type) {
                case 0:
                    // // leere Zelle
                    document.getElementById(id).style.backgroundColor = "black";
                    break;
                case 1:
                    //Zelle zum ausfüllen
                    if(game.grid.cells[i].cell.value != 0) {
                        document.getElementById(id).innerHTML = String(game.grid.cells[i].cell.value)
                    }
                    document.getElementById(id).style.backgroundColor = "white";
                    document.getElementById(id).style.color = "black";
                    break;
                case 2:
                    //Zelle die Werte angibt
                    if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                        document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                    }else if(game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0){
                        document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                    }else if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0){
                        document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                        document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                    }
                    document.getElementById(id).style.backgroundColor = "black";
                    document.getElementById(id).style.color = "white";
                    break;
                default:
                    alert("This case should not be possible,look at initGame switch case")
            }
        }

    });
}

function saveGame() {
    $.get("/saveGame", function(){});
}

function loadGame() {
    filed_ids = new Array();
    $.get("/loadGame", function(data, status){
        game = JSON.parse(data)
        for (i in game.grid.cells) {
            var row = game.grid.cells[i].row
            var col = game.grid.cells[i].col
            var type = game.grid.cells[i].cell.type
            //var id = String(row)+"."+String(col)
            var id = String(col)+"."+String(row)
            //console.log(id,game.grid.cells[i].cell.type,row,col)
            switch(type) {
                case 0:
                    // // leere Zelle
                    document.getElementById(id).style.backgroundColor = "black";
                    break;
                case 1:
                    //Zelle zum ausfüllen
                    filed_ids.push(id)
                    if(game.grid.cells[i].cell.value != 0) {
                        document.getElementById(id).innerHTML = String(game.grid.cells[i].cell.value)
                    }
                    document.getElementById(id).style.backgroundColor = "white";
                    document.getElementById(id).style.color = "black";
                    break;
                case 2:
                    //Zelle die Werte angibt
                    if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                        document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                    }else if(game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0){
                        document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                    }else if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0){
                        document.getElementById(id+".1.2").innerHTML = String(game.grid.cells[i].cell.right)
                        document.getElementById(id+".2.1").innerHTML = String(game.grid.cells[i].cell.down)
                    }
                    document.getElementById(id).style.backgroundColor = "black";
                    document.getElementById(id).style.color = "white";
                    break;
                default:
                    alert("This case should not be possible,look at initGame switch case")
            }
        }

    });
}


function fillField(game) {
    for (cell in game.grid.cells) {
        console.log(cell);
    }
}