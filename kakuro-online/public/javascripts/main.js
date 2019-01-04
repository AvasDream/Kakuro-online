var game;
var filed_ids = new Array();
var cell_id_old = "";
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
        game = setValue()
    });
    $("#undoButton").click(function() {
        game = undoGame()
    });
    $("#redoButton").click(function() {
        game = redoGame()
    });
    $("#saveButton").click(function() {
        saveGame()
    });
    $("#loadButton").click(function() {
        game = loadGame()
    });
    $("#clearValButton").click(function() {
        game = clearValue()
    });
    $("td").mouseup(function(){
        setColor(this.id)
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
                    var id = String(row)+"."+String(col)

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
        });
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = ""
    }
    return game;
}

function clearGame(){
    //filed_ids = new Array();
    for (i in game.grid.cells) {
        var row = game.grid.cells[i].row
        var col = game.grid.cells[i].col
        var type = game.grid.cells[i].cell.type
        var id = String(row)+"."+String(col)
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
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = ""
    }
}

function setValue() {
    var rowF = document.getElementById("row").value
    var colF = document.getElementById("col").value
    var value = document.getElementById("value").value
    if(!isNaN(parseInt(rowF))  && !isNaN(parseInt(colF)) && !isNaN(parseInt(value))) {
        if(rowF >= 1 && rowF <= 8 && colF >= 1 && colF <= 8 && value >= 1 && value <= 9 ) {
            var row = document.getElementById("row").value - 1
            var col = document.getElementById("col").value - 1
            document.getElementById("row").value = ""
            document.getElementById("col").value = ""
            document.getElementById("value").value = ""

            var cell_id = String(row) + "." + String(col)
            if (filed_ids.includes(cell_id)) {
                $.get("/set/" + row + "/" + col + "/" + value, function (data, status) {
                    game = JSON.parse(data)
                    document.getElementById(cell_id).innerHTML = String(value)
                    document.getElementById(cell_id).style.backgroundColor = "white";
                    document.getElementById(cell_id).style.color = "black";
                });
                return game;
            } else {
                alert("You can only fill white cells")
            }
        }else{
            alert("Wrong input")
        }
    }else{
        alert("Wrong input")
    }
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = ""
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
            var id = String(row)+"."+String(col)
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
                    }else{
                        document.getElementById(id).innerHTML = ""
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
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = ""
    }
    return game;
}

function redoGame() {
    $.get("/redoGame", function(data, status){
        game = JSON.parse(data)
        for (i in game.grid.cells) {
            var row = game.grid.cells[i].row
            var col = game.grid.cells[i].col
            var type = game.grid.cells[i].cell.type
            //var id = String(row)+"."+String(col)
            var id = String(row)+"."+String(col)
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
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = ""
    }
    return game;
}

function saveGame() {
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = ""
    }
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
            var id = String(row)+"."+String(col)
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
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = ""
    }
    return game;
}

function setColor(cell_id){

    if(filed_ids.includes(cell_id)) {
        if(cell_id != cell_id_old){

            document.getElementById(cell_id).style.backgroundColor = "lightgray";
            if(cell_id_old.length > 2) {
                document.getElementById(cell_id_old).style.backgroundColor = "white";
            }
            cell_id_old = cell_id
        }else{
            document.getElementById(cell_id).style.backgroundColor = "white";
            cell_id_old = ""
        }
    }
}

function clearValue(){

    if(filed_ids.includes(cell_id_old)) {
        var res = cell_id_old.split(".")
        var rowF = parseInt(res[0])
        var colF = parseInt(res[1])
        $.get("/clearVal/" + rowF + "/" + colF, function (data, status) {
            game = JSON.parse(data)
            document.getElementById(cell_id_old).innerHTML = String("")
            document.getElementById(cell_id_old).style.backgroundColor = "white";
            document.getElementById(cell_id_old).style.color = "black";
        });
        return game;
    }else{
        alert("Choose a cell")
    }
    cell_id_old = ""
    document.getElementById("row").value = ""
    document.getElementById("col").value = ""
    document.getElementById("value").value = ""
}

function fillField(game) {
    for (cell in game.grid.cells) {
        console.log(cell);
    }
}