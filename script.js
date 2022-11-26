let randomCoordinatesForMines = [];
let numberOfUnlockedCells = 0;
let numberOfFlagsLeft = 10;
let secondsPlayed = 0;
let gameStatus = -1;

createTable();
createMines();
markTheCellsAroundTheMines();

function createTable() {
    for (let i = 0; i < 10; ++i) {
        row = document.createElement("cellsRow");
        for (let j = 0; j < 10; ++j) {
            let cell = document.createElement("button");
            cell.id = [i + "," + j];
            cell.value = 0;
            cell.innerHTML = "&nbsp";
            cell.onclick = () => checkCell(i + "," + j);
            cell.oncontextmenu = () => flag(i + "," + j);
            row.appendChild(cell);
        }
        document.getElementById("table").appendChild(row);
    }
}

function createMines() {
    for (let i = 0; i < 10; ++i) {
        let numberOne = Math.floor(Math.random() * 10);
        let numberTwo = Math.floor(Math.random() * 10);
        let randomCoordinates = numberOne + "," + numberTwo;
        if (randomCoordinatesForMines.indexOf(randomCoordinates) >= 0) {
            --i;
        } else {
            document.getElementById(randomCoordinates).setAttribute("mina", true);
            document.getElementById(randomCoordinates).removeAttribute("value");
            randomCoordinatesForMines.push(randomCoordinates);
        }
    }
}

function markTheCellsAroundTheMines() {
    for (i = 0; i < randomCoordinatesForMines.length; ++i) {
        let row = Number(randomCoordinatesForMines[i][0]);
        let column = Number(randomCoordinatesForMines[i][2]);
        if (row > 0 && column > 0 && document.getElementById(row - 1 + "," + (column - 1)).value) {
            document.getElementById(row - 1 + "," + (column - 1)).value++;
        }
        if (row > 0 && document.getElementById(row - 1 + "," + column).value) {
            document.getElementById(row - 1 + "," + column).value++;
        }
        if (row > 0 && column < 9 && document.getElementById(row - 1 + "," + (column + 1)).value) {
            document.getElementById(row - 1 + "," + (column + 1)).value++;
        }
        if (column < 9 && document.getElementById(row + "," + (column + 1)).value) {
            document.getElementById(row + "," + (column + 1)).value++;
        }
        if (row < 9 && column < 9 && document.getElementById(row + 1 + "," + (column + 1)).value) {
            document.getElementById(row + 1 + "," + (column + 1)).value++;
        }
        if (row < 9 && document.getElementById(row + 1 + "," + column).value) {
            document.getElementById(row + 1 + "," + column).value++;
        }
        if ( row < 9 && column > 0 && document.getElementById(row + 1 + "," + (column - 1)).value) {
            document.getElementById(row + 1 + "," + (column - 1)).value++;
        }
        if (column > 0 && document.getElementById(row + "," + (column - 1)).value) {
            document.getElementById(row + "," + (column - 1)).value++;
        }
    }
}

function checkCell(id) {
    let row = Number(id[0]);
    let column = Number(id[2]);
    if (gameStatus == -1) {
        gameDuration();
        ++gameStatus;
    }
    if (gameStatus == 0) {
        document.getElementById(row + "," + column).style.background = "white";
        if ( document.getElementById(row + "," + column).hasAttribute("mina", true)) {
            gameStatus = 1;
            document.getElementById("restart").style.background = "url('img/sad.png')";

            for (let i = 0; i < 10; ++i) {
                document.getElementById(randomCoordinatesForMines[i]).style.background = "url('img/bomb.png')";
            }
        } 
        
        else if (document.getElementById(row + "," + column).value > 0) {
            ++numberOfUnlockedCells;
            document.getElementById(row + "," + column).textContent =document.getElementById(row + "," + column).value;
            document.getElementById(row + "," + column).value = -1;
            if(document.getElementById(id).hasAttribute("flag", true)) {
                ++numberOfFlagsLeft;
            }
        } else if (document.getElementById(row + "," + column).value == 0) {
            ++numberOfUnlockedCells;
            document.getElementById(row + "," + column).value = -1;
            document.getElementById(row + "," + column).innerHTML = "&nbsp";
            if(document.getElementById(id).hasAttribute("flag", true)) {
                ++numberOfFlagsLeft;
            }
            cells(row, column);
        }
    }
    if (numberOfUnlockedCells == 90) {
        document.getElementById("restart").style.background = "url('img/win.png')";
        gameStatus = 1;
    }
}

function cells(row, column) {
    if (row > 0) {
        checkCell(row - 1 + "," + column);
    }
    if (column < 9) {
        checkCell(row + "," + (column + 1));
    }
    if (row < 9) {
        checkCell(row + 1 + "," + column);
    }
    if (column > 0) {
        checkCell(row + "," + (column - 1));
    }
}

function flag(id) {
    if (
        document.getElementById(id).style.background == "white" || gameStatus == 1
    ) {
        return false;
    } else if (document.getElementById(id).hasAttribute("flag", true)) {
        numberOfFlagsLeft += 1;
        document.getElementById(id).removeAttribute("style");
        document.getElementById(id).removeAttribute("flag", true);
        document.getElementById(id).onclick = () => checkCell(id);
    } else {
        document.getElementById(id).style.background = "url('img/flag.png')";
        document.getElementById(id).setAttribute("flag", true);
        document.getElementById(id).onclick = "false";
        numberOfFlagsLeft -= 1;
    }
    if (numberOfFlagsLeft == 10) {
        document.getElementById("numberOfFlags").innerHTML = numberOfFlagsLeft;
    } else if (numberOfFlagsLeft >= 0 && numberOfFlagsLeft < 10) {
        document.getElementById("numberOfFlags").innerHTML ="0" + numberOfFlagsLeft;
    } else if (numberOfFlagsLeft < 0 && numberOfFlagsLeft > -10) {
        document.getElementById("numberOfFlags").innerHTML ="-0" + -numberOfFlagsLeft;
    } else {
        document.getElementById("numberOfFlags").innerHTML = numberOfFlagsLeft;
    }
    return false;
}

function gameDuration() {
    ++secondsPlayed;
    if (secondsPlayed < 10) {
        secondsPlayed = "00" + secondsPlayed;
    } else if (secondsPlayed < 100) {
        secondsPlayed = "0" + secondsPlayed;
    }
    document.getElementById("timer").innerHTML = secondsPlayed;
    addSeconds = setTimeout(gameDuration, 1000);
    if (gameStatus == 1) {
        clearTimeout(addSeconds);
    }
}
function restartGame() {
    document.location.reload();
}