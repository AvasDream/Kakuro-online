var game;
var filed_ids = [];
var filed_ids_for_check = [];
var cell_id_old = "";
var clear_color = 0;
$(document).ready(function(){
    $("#initButton").click(function(){
        game = initGame();
    // Game is undefined, lookup var scope in js
    //console.log(game);
    });
    $("#clearButton").click(function(){
        clearGame();
    });
    $("#setButton").click(function() {
        game = setValue();
    });
    $("#undoButton").click(function() {
        game = undoGame();
    });
    $("#redoButton").click(function() {
        game = redoGame();
    });
    $("#saveButton").click(function() {
        saveGame();
    });
    $("#loadButton").click(function() {
        game = loadGame();
    });
    $("#clearValButton").click(function() {
        game = clearValue();
    });
    $("#checkButton").click(function() {
        checkGame();
    });
    $("td").mouseup(function(){
        setColor(this.id);
    });
});

function initGame() {
    filed_ids = [];
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";
    $.ajax({
        url: "/initGame",
        type: 'GET',
        success: function(data) {
            game = JSON.parse(data);
            fillIdsForCheck(game);
            for (i in game.grid.cells) {
                var row = game.grid.cells[i].row;
                var col = game.grid.cells[i].col;
                var type = game.grid.cells[i].cell.type;
                var id = String(row) + "." + String(col);

                //console.log(id,game.grid.cells[i].cell.type,row,col)
                switch (type) {
                    case 0:
                        // // leere Zelle
                        document.getElementById(id).style.backgroundColor = "black";
                        break;
                    case 1:
                        //Zelle zum ausfüllen
                        filed_ids.push(id);
                        document.getElementById(id).style.backgroundColor = "white";
                        document.getElementById(id).style.color = "black";
                        break;
                    case 2:
                        //Zelle die Werte angibt
                        if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                        } else if (game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        } else if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        }
                        document.getElementById(id).style.backgroundColor = "black";
                        document.getElementById(id).style.color = "white";
                        break;
                    default:
                        alert("This case should not be possible,look at initGame switch case");
                }
            }
        }
    });
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
    return game;
}

function clearGame(){
    for (i in game.grid.cells) {
        var row = game.grid.cells[i].row;
        var col = game.grid.cells[i].col;
        var type = game.grid.cells[i].cell.type;
        var id = String(row)+"."+String(col);
        //console.log(id,game.grid.cells[i].cell.type,row,col)
        switch(type) {
            case 0:
                // // leere Zelle
                document.getElementById(id).style.backgroundColor = "black";
                break;
            case 1:
                //Zelle zum ausfüllen
                document.getElementById(id).innerHTML = String("");
                document.getElementById(id).style.backgroundColor = "white";
                document.getElementById(id).style.color = "black";
                break;
            case 2:
                //Zelle die Werte angibt
                if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                    document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                } else if (game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0) {
                    document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                } else if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0) {
                    document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                    document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                }
                document.getElementById(id).style.backgroundColor = "black";
                document.getElementById(id).style.color = "white";
                break;
            default:
                alert("This case should not be possible,look at initGame switch case");
        }
    }
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
    $.ajax({
        url: "/initGame",
        type: 'GET',
        success: function (data) {
        }
    });
}

function setValue() {
    var rowF = document.getElementById("row").value;
    var colF = document.getElementById("col").value;
    var value = document.getElementById("value").value;
    if(!isNaN(parseInt(rowF))  && !isNaN(parseInt(colF)) && !isNaN(parseInt(value))) {
        if(rowF >= 1 && rowF <= 8 && colF >= 1 && colF <= 8 && value >= 1 && value <= 9 ) {
            var row = document.getElementById("row").value - 1;
            var col = document.getElementById("col").value - 1;
            document.getElementById("row").value = "";
            document.getElementById("col").value = "";
            document.getElementById("value").value = "";

            var cell_id = String(row) + "." + String(col);
            if (filed_ids.includes(cell_id)) {
                $.ajax({
                    url: '/setValue/' + row + '/' + col + '/' + value,
                    type: 'GET',
                    success: function(data) {
                        game = JSON.parse(data);
                        document.getElementById(cell_id).innerHTML = String(value);
                        document.getElementById(cell_id).style.backgroundColor = "white";
                        document.getElementById(cell_id).style.color = "black";
                    }
                });
                return game;
            } else {
                alert("You can only fill white cells");
            }
        }else{
            alert("Wrong input");
        }
    }else{
        alert("Wrong input");
    }
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
}

function undoGame() {
    $.ajax({
        url: "/undoGame",
        type: 'GET',
        success: function(data) {
            game = JSON.parse(data);
            for (i in game.grid.cells) {
                var row = game.grid.cells[i].row;
                var col = game.grid.cells[i].col;
                var type = game.grid.cells[i].cell.type;
                var id = String(row) + "." + String(col);
                //console.log(id,game.grid.cells[i].cell.type,row,col)
                switch (type) {
                    case 0:
                        // // leere Zelle
                        document.getElementById(id).style.backgroundColor = "black";
                        break;
                    case 1:
                        //Zelle zum ausfüllen
                        if (game.grid.cells[i].cell.value != 0) {
                            document.getElementById(id).innerHTML = String(game.grid.cells[i].cell.value);
                        } else {
                            document.getElementById(id).innerHTML = "";
                        }
                        document.getElementById(id).style.backgroundColor = "white";
                        document.getElementById(id).style.color = "black";
                        break;
                    case 2:
                        //Zelle die Werte angibt
                        if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                        } else if (game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        } else if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        }
                        document.getElementById(id).style.backgroundColor = "black";
                        document.getElementById(id).style.color = "white";
                        break;
                    default:
                        alert("This case should not be possible,look at initGame switch case");
                }
            }
        }
    });
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
    return game;
}

function redoGame() {
    $.ajax({
        url: "/redoGame",
        type: 'GET',
        success: function(data) {
            game = JSON.parse(data);
            for (i in game.grid.cells) {
                var row = game.grid.cells[i].row;
                var col = game.grid.cells[i].col;
                var type = game.grid.cells[i].cell.type;
                var id = String(row) + "." + String(col);
                //console.log(id,game.grid.cells[i].cell.type,row,col)
                switch (type) {
                    case 0:
                        // // leere Zelle
                        document.getElementById(id).style.backgroundColor = "black";
                        break;
                    case 1:
                        //Zelle zum ausfüllen
                        if (game.grid.cells[i].cell.value != 0) {
                            document.getElementById(id).innerHTML = String(game.grid.cells[i].cell.value);
                        }
                        document.getElementById(id).style.backgroundColor = "white";
                        document.getElementById(id).style.color = "black";
                        break;
                    case 2:
                        //Zelle die Werte angibt
                        if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                        } else if (game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        } else if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        }
                        document.getElementById(id).style.backgroundColor = "black";
                        document.getElementById(id).style.color = "white";
                        break;
                    default:
                        alert("This case should not be possible,look at initGame switch case");
                }
            }
        }
    });
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
    return game;
}

function saveGame() {
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    $.ajax({
        url: "/saveGame",
        type: 'GET',
        success: function(data) {}
    });
    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
}

function loadGame() {
    filed_ids = [];
    $.ajax({
        url: "/loadGame",
        type: 'GET',
        success: function(data) {
            game = JSON.parse(data);
            fillIdsForCheck(game);
            for (i in game.grid.cells) {
                var row = game.grid.cells[i].row;
                var col = game.grid.cells[i].col;
                var type = game.grid.cells[i].cell.type;
                var id = String(row) + "." + String(col);
                //console.log(id,game.grid.cells[i].cell.type,row,col)
                switch (type) {
                    case 0:
                        // // leere Zelle
                        document.getElementById(id).style.backgroundColor = "black";
                        break;
                    case 1:
                        //Zelle zum ausfüllen
                        filed_ids.push(id)
                        if (game.grid.cells[i].cell.value != 0) {
                            document.getElementById(id).innerHTML = String(game.grid.cells[i].cell.value);
                        }
                        document.getElementById(id).style.backgroundColor = "white";
                        document.getElementById(id).style.color = "black";
                        break;
                    case 2:
                        //Zelle die Werte angibt
                        if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                        } else if (game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        } else if (game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0) {
                            document.getElementById(id + ".1.2").innerHTML = String(game.grid.cells[i].cell.right);
                            document.getElementById(id + ".2.1").innerHTML = String(game.grid.cells[i].cell.down);
                        }
                        document.getElementById(id).style.backgroundColor = "black";
                        document.getElementById(id).style.color = "white";
                        break;
                    default:
                        alert("This case should not be possible,look at initGame switch case");
                }
            }
        }
    });
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
    return game;
}

function setColor(cell_id){

    if(filed_ids.includes(cell_id)) {
        if(cell_id != cell_id_old){

            document.getElementById(cell_id).style.backgroundColor = "lightgray";
            if(cell_id_old.length > 2) {
                document.getElementById(cell_id_old).style.backgroundColor = "white";
            }
            cell_id_old = cell_id;
        }else{
            document.getElementById(cell_id).style.backgroundColor = "white";
            cell_id_old = "";
        }
    }
}

function clearValue(){
    if(filed_ids.includes(cell_id_old)) {
        var res = cell_id_old.split(".");
        var rowF = parseInt(res[0]);
        var colF = parseInt(res[1]);
        $.ajax({
            url: '/clearVal/' + rowF + '/' + colF,
            type: 'GET',
            success: function(data) {
                game = JSON.parse(data);
                document.getElementById(cell_id_old).innerHTML = String("");
                document.getElementById(cell_id_old).style.backgroundColor = "white";
                document.getElementById(cell_id_old).style.color = "black";
            }
        });
        return game;
    }else{
        alert("Choose a cell");
    }
    cell_id_old = "";
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";

    filed_ids.forEach(function(id) {
        document.getElementById(id).style.backgroundColor = "white";
    });
}

function fillIdsForCheck(game) {

    var id_and_types = [];
    filed_ids_for_check = [];
    for (i in game.grid.cells) {
        var row = game.grid.cells[i].row;
        var col = game.grid.cells[i].col;
        var type = game.grid.cells[i].cell.type;
        var id = String(row)+"."+String(col);

        if(type == 2) {
                //Zelle die Werte angibt
            if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down == 0) {
                id_and_types.push(id+".1.2" + ":right");
            }else if(game.grid.cells[i].cell.right == 0 && game.grid.cells[i].cell.down != 0){
                id_and_types.push(id+".2.1" + ":down");
            }else if(game.grid.cells[i].cell.right != 0 && game.grid.cells[i].cell.down != 0){
                id_and_types.push(id+".1.2" + ":right");
                id_and_types.push(id+".2.1" + ":down");
            }
        }
    }

    for(var j = 0; j <  id_and_types.length; j++) {

        var id_and_typ = id_and_types[j].split(":");
        var id_begin = id_and_typ[0].split(".");
        var end_of_row = false;
        var sum_ids = id_and_typ[0];

        for (l in game.grid.cells) {

            var row = game.grid.cells[l].row;
            var col = game.grid.cells[l].col;
            var type = game.grid.cells[l].cell.type;
            var id = String(row) + "." + String(col);
            //console.log(id,game.grid.cells[i].cell.type,row,col)
            if(id_and_typ[1] == "right" && id.startsWith(id_begin[0]) && !id.endsWith(id_begin[1]) && !end_of_row && col > id_begin[1]) {
                switch (type) {
                    case 0:
                        // // leere Zelle
                        end_of_row = true;
                        break;
                    case 1:
                        //Zelle zum ausfüllen
                        sum_ids += "," + id;
                        break;
                    case 2:
                        //Zelle die Werte angibt
                        end_of_row = true;
                        break;
                    default:
                        alert("This case should not be possible,look at initGame switch case");
                }
            }

            if(id_and_typ[1] == "down" && !id.startsWith(id_begin[0]) && id.endsWith(id_begin[1]) && !end_of_row && row > id_begin[0]) {
                switch (type) {
                    case 0:
                        // // leere Zelle
                        end_of_row = true;
                        break;
                    case 1:
                        //Zelle zum ausfüllen
                        sum_ids += "," + id;
                        break;
                    case 2:
                        //Zelle die Werte angibt
                        end_of_row = true;
                        break;
                    default:
                        alert("This case should not be possible,look at initGame switch case");
                }
            }
        }
        filed_ids_for_check.push(sum_ids);
    }

}

function checkGame(){
    if(clear_color == 0) {
        for (var i = 0; i < filed_ids_for_check.length; i++) {
            var ids = filed_ids_for_check[i].split(",");
            var values = [];
            var values_equals = false;
            var res = 0;
            var sum = parseInt(document.getElementById(ids[0]).textContent);
            for (var j = 0; j < ids.length; j++) {
                if (j != 0) {
                    res += parseInt(document.getElementById(ids[j]).textContent);
                    values.push(parseInt(document.getElementById(ids[j]).textContent));
                }
            }
            for (var j = 0; j < values.length; j++) {
                for (var k = j + 1; k < values.length; k++) {
                    if (values[j] == values[k]) {
                        values_equals = true;
                    }
                }
            }
            if (!isNaN(res)) {
                if ((values_equals || sum != res)) {
                    for (var j = 0; j < ids.length; j++) {
                        if (j != 0) {
                            document.getElementById(ids[j]).style.backgroundColor = "red";
                        }
                    }
                }
            }
        }
        clear_color = 1;
    }else{
        filed_ids.forEach(function(id) {
            document.getElementById(id).style.backgroundColor = "white";
        });
        clear_color = 0;
    }
    if(cell_id_old.length > 2) {
        document.getElementById(cell_id_old).style.backgroundColor = "white";
        cell_id_old = "";
    }
    document.getElementById("row").value = "";
    document.getElementById("col").value = "";
    document.getElementById("value").value = "";
}

function fillField(game) {
    for (cell in game.grid.cells) {
        console.log(cell);
    }
}
