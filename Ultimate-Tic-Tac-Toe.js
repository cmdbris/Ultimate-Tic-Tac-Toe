// [...document.getElementsByClassName("someClass")].forEach() {
// also works instead of using 
// document.querySelectorAll(".someClass").forEach {

// Event Listeners for Outer and Inner Table Cells


let outerTableCell = document.querySelectorAll('td.outer-game-table-cell');
let innerTableCell = document.querySelectorAll('.inner-game-table-cell');

function handleClick() {
    placeSymbol(selectedOuterCell, selectedInnerCell, handleClick);
}

outerTableCell.forEach(outerCell => {
    outerCell.addEventListener('click', function () {
        let selectedOuterCell = this;
        toggleZoom(selectedOuterCell);

        // Remove event listener from all innerTableCells
        innerTableCell.forEach(innerCell => {
            innerCell.removeEventListener('click', handleClick);
        });

        // Add event listener for innerTableCells of the clicked outerTableCell
        outerCell.querySelectorAll('.inner-game-table-cell').forEach(innerCell => {
            innerCell.addEventListener('click', function handleClick() {
                let selectedInnerCell = this;
                placeSymbol(selectedOuterCell, selectedInnerCell, handleClick);
            });
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

const empty_2d_table = [['', '', ''], ['', '', ''], ['', '', '']];


let outerCell_position_history = [...empty_2d_table];
let innerCell_position_history = [...empty_2d_table];
let innerTable_position_history = [];

for (let i = 0; i < 3; i++) {
    innerTable_position_history[i] = [];  // Initialize inner arrays
    for (let j = 0; j < 3; j++) {
        innerTable_position_history[i][j] = [...empty_2d_table];
    }
}


// Function for Placing Game Symbol and turn changing


let player_1_turn = true;
let player_2_turn = false;
let symbols = { 'x': '&#215;', 'o': '&#9900;' };

function placeSymbol(outerCell, innerCell, handleClick) {

    let [outerCell_row, outerCell_column] = extractRowColumn(outerCell.id.toString());
    let [innerCell_row, innerCell_column] = extractRowColumn(innerCell.id.toString());

    if (innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] === '') {
        if (player_1_turn) {
            innerCell.innerHTML = symbols['x'];
            innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] = 'x';
        }
        if (player_2_turn) {
            innerCell.innerHTML = symbols['o'];
            innerTable_position_history[outerCell_row][outerCell_column][innerCell_row][innerCell_column] = 'o';
        }
        player_1_turn = !player_1_turn;
        player_2_turn = !player_2_turn;
        innerCell.removeEventListener('click', handleClick);
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