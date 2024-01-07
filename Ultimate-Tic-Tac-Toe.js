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

let outerTableCell = document.querySelectorAll('.outer-game-table-cell');
let innerTableCell = document.querySelectorAll('.inner-game-table-cell');

outerTableCell.forEach(outerCell => {
    outerCell.addEventListener('click', function () {
        toggleZoom(outerCell);
    });

    outerCell.querySelectorAll('.inner-game-table-cell').forEach(innerCell => {
        innerCell.addEventListener('mouseover', function () {
            let [outerCell_row, outerCell_column] = extractRowColumn(outerCell.id.toString());
            let [innerCell_row, innerCell_column] = extractRowColumn(innerCell.id.toString());
            if (outerCell.classList.contains('zoomed') && innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] === '') {
                if (player_1_turn) {
                    innerCell.style.setProperty('--inner-cell-hover-color', 'rgba(255, 82, 82, 0.5)');
                }
                if (player_2_turn) {
                    innerCell.style.setProperty('--inner-cell-hover-color', 'rgba(73, 205, 245, 0.5)');
                }
            }
        });
        innerCell.addEventListener('click', function () {
            if (outerCell.classList.contains('zoomed')) {
                innerCell.style.setProperty('--inner-cell-hover-color', 'rgba(0, 0, 0, 0)');
                placeSymbol(outerCell, this);
            }
        });
    });
});


// Function for Zooming onto Inner Table


function toggleZoom(outerCell) {
    outerCell.classList.add('zoomed');
    let innerTable = outerCell.querySelector('.inner-game-table');
    innerTable.classList.add('zoomed');
    outerTableCell.forEach(otherOuterCell => {
        if (otherOuterCell !== outerCell) {
            otherOuterCell.classList.remove('zoomed');
            let otherInnerTable = otherOuterCell.querySelector('.inner-game-table');
            otherInnerTable.classList.remove('zoomed');
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
        }
        if (player_2_turn) {
            innerCell.innerHTML = symbols['o'];
            innerCell.style.setProperty('--inner-game-table-cell-symbol-color', 'rgb(73, 205, 245)');
            innerCell.style.setProperty('--symbol-font-weight', 'normal');
            innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] = 'o';
        }
        player_1_turn = !player_1_turn;
        player_2_turn = !player_2_turn;
        check_InnerTableWin(innerTable_position_history[outerCell_row][outerCell_column]);
    }
}


// Function to Check for Player Victory or Tie


function check_InnerTableWin(innerTable_position_history) {
    // console.log(innerTable_position_history[2][2]);
    oneDimensional = FlattenArrayDimension(innerTable_position_history);
    console.log(oneDimensional);
    let victoryType = { 0: 'horizontal', 1: 'diagonal', 2: 'vertical' }
    let winningCoordinates = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7],
        [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    for (i = 0; i < 3; i++) {

    }
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


// gamestate TicTacToe::check_win(char board_info[9]) {
//     gamestate state;
//     int empty_spaces = 0;
//     int winning_coordinates[8][3] = {
//         {0, 1, 2},
//         {3, 4, 5},
//         {6, 7, 8},
//         {0, 3, 6},
//         {1, 4, 7},
//         {2, 5, 8},
//         {0, 4, 8},
//         {2, 4, 6}
//     };

//     for (int i = 0; i < 8; i++) {                                                   // Checks if either player has winning coordinates combination
//         char coord_1 = board_info[winning_coordinates[i][0]];
//         char coord_2 = board_info[winning_coordinates[i][1]];
//         char coord_3 = board_info[winning_coordinates[i][2]];
//         if (coord_1 == 'X' && coord_2 == 'X' && coord_3 == 'X') {
//             return PLAYER_1_WINS;
//         }
//         else if (coord_1 == 'O' && coord_2 == 'O' && coord_3 == 'O') {
//             return PLAYER_2_WINS;
//         }
//         else if (board_info[i] == ' ') {
//             empty_spaces++;
//         }
//     }
//     return state = (empty_spaces == 0) ? state = TIE : state = ONGOING;             // If there are no empty spaces on the board and no one has won, the players are tied
// }