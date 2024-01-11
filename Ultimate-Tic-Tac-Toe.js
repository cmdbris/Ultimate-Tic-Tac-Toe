// [...document.getElementsByClassName("someClass")].forEach() {
// also works instead of using 
// document.querySelectorAll(".someClass").forEach {

// Get Root Styles from CSS



let rootStyles = document.querySelector(':root');



// Sets Player Turns and Maps Symbols to HTML Code



let player_1_turn = true;
let player_2_turn = false;
let symbols = { 'x': '&#215;', 'o': '&#9900;' };



// Event Listeners for Outer and Inner Table Cells



let errorMessage = document.querySelector('.error-message');
let coin = document.querySelector('.coin');
let coinContainer = document.querySelector('.coin-container');

let body = document.querySelector('body');
let outerTable = document.querySelector('.outer-game-table');
let outerTableCell = document.querySelectorAll('.outer-game-table-cell');
let innerTableCell = document.querySelectorAll('.inner-game-table-cell');

outerTableCell.forEach(outerCell => {
    outerCell.addEventListener('click', function () {
        if (!outerCell.classList.contains('winner') && !outerTable.classList.contains('winner')) {
            toggleZoom(outerCell);
        }
    });

    outerCell.querySelectorAll('.inner-game-table-cell').forEach(innerCell => {
        innerCell.addEventListener('mouseover', function () {
            let [outerCell_row, outerCell_column] = extractRowColumn(outerCell.id.toString());
            let [innerCell_row, innerCell_column] = extractRowColumn(innerCell.id.toString());
            if (outerCell.classList.contains('zoomed') && innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] === '') {
                if (player_1_turn && !outerCell.classList.contains('winner')) {
                    body.style.setProperty('--gradient-color', 'rgba(255, 82, 82, 0.5)');
                    innerCell.style.setProperty('--inner-cell-hover-color', 'rgba(255, 82, 82, 0.5)');
                }
                if (player_2_turn && !outerCell.classList.contains('winner')) {
                    body.style.setProperty('--gradient-color', 'rgba(73, 205, 245, 0.5)');
                    innerCell.style.setProperty('--inner-cell-hover-color', 'rgba(73, 205, 245, 0.5)');
                }
            }
        });
        innerCell.addEventListener('click', function () {
            if (outerCell.classList.contains('zoomed') && !outerCell.classList.contains('winner')) {
                innerCell.style.setProperty('--inner-cell-hover-color', 'rgba(0, 0, 0, 0)');
                placeSymbol(outerCell, this);
            }
        });
    });
});



// Function for Zooming onto Inner Table



function toggleZoom(outerCell) {
    let innerTable = outerCell.querySelector('.inner-game-table');
    outerCell.classList.add('zoomed');
    innerTable.classList.add('zoomed');
    outerTableCell.forEach(otherOuterCell => {
        if (otherOuterCell !== outerCell) {
            let otherInnerTable = otherOuterCell.querySelector('.inner-game-table');
            if (otherOuterCell.classList.contains('zoomed') && otherInnerTable.classList.contains('zoomed')) {
                otherOuterCell.classList.remove('zoomed');
                otherInnerTable.classList.remove('zoomed');
            }
        }
    });
}



// Arrays to keep track of position history



let outerCell_position_history = [['', '', ''], ['', '', ''], ['', '', '']];
let innerCell_position_history = [['', '', ''], ['', '', ''], ['', '', '']];
let innerTable_position_history = [];

for (let i = 0; i < 3; i++) {
    innerTable_position_history[i] = [];  // Initialize inner arrays
    for (let j = 0; j < 3; j++) {
        innerTable_position_history[i][j] = [['', '', ''], ['', '', ''], ['', '', '']];
    }
}



// Function for Placing Game Symbol and turn changing



function placeSymbol(outerCell, innerCell) {

    let [outerCell_row, outerCell_column] = extractRowColumn(outerCell.id.toString());
    let [innerCell_row, innerCell_column] = extractRowColumn(innerCell.id.toString());

    if (innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] !== '') {
        errorMessage.innerHTML = 'ERROR: ' + 'This space is already occupied by ' + innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column];
        errorMessage.style.opacity = "1";
        setTimeout(() => {
            errorMessage.style.opacity = "0";
        }, 2000);
    }
    else if (innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] === '') {
        if (player_1_turn) {
            innerCell.innerHTML = symbols['x'];
            innerCell.style.setProperty('--inner-game-table-cell-symbol-color', 'rgb(255, 82, 82)');
            innerCell.style.setProperty('--symbol-font-weight', 'bolder');
            innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] = 'x';
            if (!outerCell.classList.contains('winner')) {
                body.style.setProperty('--gradient-color', 'rgba(73, 205, 245, 0.5)');
            }
        }
        if (player_2_turn) {
            innerCell.innerHTML = symbols['o'];
            innerCell.style.setProperty('--inner-game-table-cell-symbol-color', 'rgb(73, 205, 245)');
            innerCell.style.setProperty('--symbol-font-weight', 'normal');
            innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] = 'o';
            if (!outerCell.classList.contains('winner')) {
                body.style.setProperty('--gradient-color', 'rgba(255, 82, 82, 0.5)');
            }
        }
        player_1_turn = !player_1_turn;
        player_2_turn = !player_2_turn;

        let inner_matchResult = check_TableWin(innerTable_position_history[outerCell_row][outerCell_column]);

        if ((inner_matchResult.result === 'x' || inner_matchResult.result === 'o') && !outerCell.classList.contains('winner')) {
            console.log(inner_matchResult.result, 'via', inner_matchResult.type, 'with winning coords:', inner_matchResult.winningCoords);
            body.style.setProperty('--gradient-color', 'rgba(254, 241, 162, 1)');
            draw_innerTable_WinningLine(outerCell, inner_matchResult.result, inner_matchResult.type, inner_matchResult.winningCoords);
            outerCell_position_history[outerCell_row][outerCell_column] = inner_matchResult.result;
        }
        else if (inner_matchResult.result === 'Tie') {
            let innerTable = outerCell.querySelector('.inner-game-table');
            setTimeout(() => {
                body.style.setProperty('--gradient-color', 'rgba(255, 255, 255, 0.5)');
                outerCell.classList.remove('zoomed');
                innerTable.classList.remove('zoomed');
            }, 500);
            setTimeout(() => {
                outerCell.style.opacity = '0';
                innerTable.style.opacity = '0';
            }, 750);
            let randomWinner = flipCoin();
            outerCell_position_history[outerCell_row][outerCell_column] = randomWinner;
            outerCell.classList.add('winner');
        }

        let outer_matchResult = check_TableWin(outerCell_position_history);

        if ((outer_matchResult.result === 'x' || outer_matchResult.result === 'o') && !outerTable.classList.contains('winner')) {
            console.log(outer_matchResult.result, 'via', outer_matchResult.type, 'with winning coords:', outer_matchResult.winningCoords);
            draw_outerTable_WinningLine(outer_matchResult.result, outer_matchResult.type, outer_matchResult.winningCoords);
        }
        else if (outer_matchResult.result === 'Tie') {
            let randomWinner = flipCoin();
            outerTable.classList.add('winner');
        }
    }
}



// Function to Check for Player Victory, Tie, or Ongoing Match, and Returns an Object Containing the Winner, the Type of Victory, and the Winning Coordinates



function check_TableWin(Table_position_history) {
    let flattened_Table_position_history = FlattenArrayDimension(Table_position_history);
    let winningCoordinates = [
        ['horizontal', 0, 1, 2],
        ['horizontal', 3, 4, 5],
        ['horizontal', 6, 7, 8],

        ['vertical', 0, 3, 6],
        ['vertical', 1, 4, 7],
        ['vertical', 2, 5, 8],

        ['diagonal', 0, 4, 8],
        ['diagonal', 2, 4, 6]
    ];
    for (let i = 0; i < winningCoordinates.length; i++) {
        let [victoryType, coord1, coord2, coord3] = winningCoordinates[i];
        if (flattened_Table_position_history[coord1] === 'x' && flattened_Table_position_history[coord2] === 'x' && flattened_Table_position_history[coord3] === 'x') {
            return { result: 'x', type: victoryType, winningCoords: [coord1, coord2, coord3] };
        } else if (flattened_Table_position_history[coord1] === 'o' && flattened_Table_position_history[coord2] === 'o' && flattened_Table_position_history[coord3] === 'o') {
            return { result: 'o', type: victoryType, winningCoords: [coord1, coord2, coord3] };
        }
    }

    // Check for a tie (no empty spaces left)
    if (!flattened_Table_position_history.includes('')) {
        return { result: 'Tie', type: 'TIE' };
    }

    // If none of the above conditions are met, the game is still ongoing
    return { result: 'Ongoing', type: 'ONGOING' };

    // example usage
    // const innerTablePositionHistory = [['X', 'O', 'X'], ['O', 'X', 'O'], ['X', 'X', 'O']];
    // const matchResult = check_InnerTableWin(innerTablePositionHistory);
    // console.log(matchResult.result, 'via', matchResult.victoryType, 'with winning coords:', matchResult.winningCoords);

}



// Function to draw the Winning Line



function draw_innerTable_WinningLine(outerCell, winner, victoryType, winningCoords) {
    outerCell.classList.add('winner');

    let innerTable = outerCell.querySelector('.inner-game-table');
    let innerTableBody = innerTable.querySelector("tbody");

    // let centredContainer = document.querySelector('.winning-line-container');
    // let winningLine = document.querySelector('.winning-line');

    let centredContainer = document.createElement('div');
    let winningLine = document.createElement('div');

    centredContainer.appendChild(winningLine);
    innerTableBody.appendChild(centredContainer);

    centredContainer.classList.add('winning-line-container');
    winningLine.classList.add('winning-line');

    if (winner === 'x') {
        winningLine.style.setProperty('--winning-line-color', 'rgb(255, 82, 82)');
    }
    else if (winner === 'o') {
        winningLine.style.setProperty('--winning-line-color', 'rgb(73, 205, 245)');
    }

    if (victoryType === 'horizontal') {
        winningLine.style.setProperty('--winning-line-angle', '0deg');
        if (winningCoords[0] === 0) {
            winningLine.style.setProperty('--winning-line-y-translation', '25px');
        }
        else if (winningCoords[0] === 6) {
            winningLine.style.setProperty('--winning-line-y-translation', '-25px');
        }
    }
    else if (victoryType === 'vertical') {
        winningLine.style.setProperty('--winning-line-angle', '90deg');
        if (winningCoords[0] === 0) {
            winningLine.style.setProperty('--winning-line-x-translation', '-25px');
        }
        else if (winningCoords[0] === 2) {
            winningLine.style.setProperty('--winning-line-x-translation', '25px');
        }
    }
    else if (victoryType === 'diagonal') {
        if (winningCoords[0] === 0) {
            winningLine.style.setProperty('--winning-line-angle', '45deg');
        }
        else if (winningCoords[0] === 2) {
            winningLine.style.setProperty('--winning-line-angle', '-45deg');
        }
    }

    setTimeout(() => {
        winningLine.style.width = '70px';
    }, 10);
    setTimeout(() => {
        body.style.setProperty('--gradient-color', 'rgba(255, 255, 255, 0.5)');
        outerCell.classList.remove('zoomed');
        innerTable.classList.remove('zoomed');
    }, 2500);
    setTimeout(() => {
        outerCell.style.opacity = '0';
        innerTable.style.opacity = '0';
    }, 2750);
    setTimeout(() => {
        outerCell.classList.add('winning-cell');
        outerCell.innerHTML = symbols[winner];
        outerCell.style.opacity = '1';
    }, 4000);
}

function draw_outerTable_WinningLine(winner, victoryType, winningCoords) {
    outerTable.classList.add('winner');
    setTimeout(() => {
        let centredContainer = document.createElement('div');
        let deluxeWinningLine = document.createElement('div');

        centredContainer.appendChild(deluxeWinningLine);
        outerTable.appendChild(centredContainer);

        centredContainer.classList.add('winning-line-container');
        deluxeWinningLine.classList.add('deluxe-winning-line');

        // if (winner === 'x') {
        //     deluxeWinningLine.style.setProperty('--winning-line-color', 'rgb(255, 82, 82)');
        // }
        // else if (winner === 'o') {
        //     deluxeWinningLine.style.setProperty('--winning-line-color', 'rgb(73, 205, 245)');
        // }

        if (victoryType === 'horizontal') {
            deluxeWinningLine.style.setProperty('--winning-line-angle', '0deg');
            if (winningCoords[0] === 0) {
                deluxeWinningLine.style.setProperty('--winning-line-y-translation', '150px');
            }
            else if (winningCoords[0] === 6) {
                deluxeWinningLine.style.setProperty('--winning-line-y-translation', '-150px');
            }
        }
        else if (victoryType === 'vertical') {
            deluxeWinningLine.style.setProperty('--winning-line-angle', '90deg');
            if (winningCoords[0] === 0) {
                deluxeWinningLine.style.setProperty('--winning-line-x-translation', '-150px');
            }
            else if (winningCoords[0] === 2) {
                deluxeWinningLine.style.setProperty('--winning-line-x-translation', '150px');
            }
        }
        else if (victoryType === 'diagonal') {
            if (winningCoords[0] === 0) {
                deluxeWinningLine.style.setProperty('--winning-line-angle', '45deg');
            }
            else if (winningCoords[0] === 2) {
                deluxeWinningLine.style.setProperty('--winning-line-angle', '-45deg');
            }
        }

        setTimeout(() => {
            deluxeWinningLine.style.width = '450px';
        }, 10);
    }, 5500);
}



// Tie Breaker Function -----> Flips Coin to Determine Winner



coin.classList.add('disable');
coin.classList.add('visually-hidden');

function flipCoin() {
    coin.classList.remove('heads');
    coin.classList.remove('tails');
    coin.classList.remove('disable');

    // coin.style.display = 'block';
    let flipResult = Math.random();

    setTimeout(function () {
        coin.classList.remove('visually-hidden');
        setTimeout(() => {
            if (flipResult <= 0.5) {
                coin.classList.add('heads');
                return 'x';
            }
            else {
                coin.classList.add('tails');
                return 'o';
            }
        }, 1000);
    }, 500);
}



// Auxiliary Functions to Support Other Functions



function extractRowColumn(cellId) {
    // Cell ID's follow pattern of "cell-row-column"
    // Remember that strings end with an empty element
    // - 1 to adjust for arrays starting at 0 and not 1
    let row = parseInt(cellId[cellId.length - 3]) - 1;
    let column = parseInt(cellId[cellId.length - 1]) - 1;
    return [row, column];
}

function FlattenArrayDimension(Array2D) {
    // Converts 2D arrays into 1D arrays
    let Array1D = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            Array1D.push(Array2D[i][j])
        }
    }
    return Array1D;
    // Alternatively
    // return [].concat(...Array2D);
}