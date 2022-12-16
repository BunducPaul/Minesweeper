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
            Object.assign(cell, {
            id : [i + "," + j],
            value : 0,
            innerHTML : "&nbsp",
            onclick : () => checkCell(i + "," + j),
            oncontextmenu : () => flag(i + "," + j),
        });
            row.appendChild(cell);
        }
        document.getElementById("table").appendChild(row);
    }
}
        
function createMines() {
    for (let i = 0; i < 10; ++i) {
        let randomCoordinates = Math.floor(Math.random() * 10) + "," + Math.floor(Math.random() * 10);
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
        for (let i = row - 1; i < row + 2; ++i) {
            for (let j = column - 1; j < column + 2; ++j) {
                if (!(document.getElementById(i + "," + j) === null) && !(document.getElementById(i + "," + j).hasAttribute("mina", true))) {
                    document.getElementById(i + "," + j).value++;
                }
            }
        }
    }
}

function checkCell(coordinates) {
    let selectedCell = document.getElementById(coordinates);
    if (gameStatus == -1) {
        gameDuration();
        ++gameStatus;
    }
    if (gameStatus == 0) {
        selectedCell.style.background = "white";
        if (selectedCell.hasAttribute("mina", true)) {
            gameStatus = 1;
            document.getElementById("restart").style.background = "url('img/sad.png')";
            for (let i = 0; i < 10; ++i) {
                document.getElementById(randomCoordinatesForMines[i]).style.background = "url('img/bomb.png')";
            }
        } else if (selectedCell.value > 0 || selectedCell.value == 0) {
            ++numberOfUnlockedCells
            if (selectedCell.hasAttribute("flag", true)) {
                ++numberOfFlagsLeft;
                document.getElementById("numberOfFlags").innerHTML = numberOfFlagsLeft;
            }
            if (selectedCell.value > 0) {
                selectedCell.textContent = selectedCell.value;
                selectedCell.value = -1;
            } else if (selectedCell.value == 0) {
                selectedCell.value = -1;
                searchAroundTheEmptyCell(coordinates);
            }
        }
        if (numberOfUnlockedCells == 90) {
            document.getElementById("restart").style.background = "url('img/win.png')";
            gameStatus = 1;
        }
    }
}

function searchAroundTheEmptyCell(id) {
    let row = Number(id[0]);
    let column = Number(id[2]);
    for (let i = row - 1; i < row + 2; ++i) {
        for (let j = column - 1; j < column + 2; ++j) {
            if (!(document.getElementById(i + "," + j) === null)) {
                checkCell(i + "," + j);
            }
        }
    }
}

function flag(id) {
    let pressedCell = document.getElementById(id);
    if (document.getElementById(id).style.background == "white" || gameStatus == 1) {
        return false;
    } else if (document.getElementById(id).hasAttribute("flag", true)) {
        numberOfFlagsLeft += 1;
        pressedCell.removeAttribute("style");
        pressedCell.removeAttribute("flag", true);
        pressedCell.onclick = () => checkCell(id);
    } else {
        pressedCell.style.background = "url('img/flag.png')";
        pressedCell.setAttribute("flag", true);
        pressedCell.onclick = "false";
        numberOfFlagsLeft -= 1;
    }
    if (numberOfFlagsLeft == 10) {
        document.getElementById("numberOfFlags").innerHTML = numberOfFlagsLeft;
    } else if (numberOfFlagsLeft >= 0 && numberOfFlagsLeft < 10) {
        document.getElementById("numberOfFlags").innerHTML = "0" + numberOfFlagsLeft;
    } else if (numberOfFlagsLeft < 0 && numberOfFlagsLeft > -10) {
        document.getElementById("numberOfFlags").innerHTML = "-0" + -numberOfFlagsLeft;
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
    };
}

function restartGame() {
    document.location.reload();
}