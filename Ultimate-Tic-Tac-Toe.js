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
        let checkResult = check_InnerTableWin(innerTable_position_history[outerCell_row][outerCell_column]);
        console.log(checkResult.result, 'via', checkResult.type, 'with winning coords:', checkResult.winningCoords);
    }
}



// Function to Check for Player Victory, Tie, or Ongoing Match, and Returns an Object Containing the Winner, the Type of Victory, and the Winning Coordinates



function check_InnerTableWin(innerTable_position_history) {
    let flattened_innerTable_position_history = FlattenArrayDimension(innerTable_position_history);
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
        if (flattened_innerTable_position_history[coord1] === 'x' && flattened_innerTable_position_history[coord2] === 'x' && flattened_innerTable_position_history[coord3] === 'x') {
            return { result: 'x wins', type: victoryType, winningCoords: [coord1, coord2, coord3] };
        } else if (flattened_innerTable_position_history[coord1] === 'o' && flattened_innerTable_position_history[coord2] === 'o' && flattened_innerTable_position_history[coord3] === 'o') {
            return { result: 'o wins', type: victoryType, winningCoords: [coord1, coord2, coord3] };
        }
    }

    // Check for a tie (no empty spaces left)
    if (!flattened_innerTable_position_history.includes('')) {
        return { result: 'Tie', type: 'TIE' };
    }

    // If none of the above conditions are met, the game is still ongoing
    return { result: 'Ongoing', type: 'ONGOING' };

    // example usage
    // const innerTablePositionHistory = [['X', 'O', 'X'], ['O', 'X', 'O'], ['X', 'X', 'O']];
    // const checkResult = check_InnerTableWin(innerTablePositionHistory);
    // console.log(checkResult.result, 'via', checkResult.victoryType, 'with winning coords:', checkResult.winningCoords);

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