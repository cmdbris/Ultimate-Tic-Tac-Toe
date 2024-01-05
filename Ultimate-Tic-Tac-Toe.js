let outerTableCell = document.querySelectorAll('td.outer-game-table-cell');
let innerTableCell = document.querySelectorAll('.inner-game-table');

// [...document.getElementsByClassName("someClass")].forEach() {
// also works instead of using 
// document.querySelectorAll(".someClass").forEach {

// Event Listeners for Outer and Inner Table Cells

outerTableCell.forEach(outerCell => {
    outerCell.addEventListener('click', function () {
        toggleZoom(this);
    });
});


// Functions for Outer and Inner Table Cells


function toggleZoom(outerCell) {
    outerCell.classList.toggle('zoomed');
    let innerTable = outerCell.querySelector('.inner-game-table');
    innerTable.classList.toggle('zoomed');
    outerTableCell.forEach(otherOuterCell => {
        if (otherOuterCell !== outerCell) {
            otherOuterCell.classList.remove('zoomed');
            let otherInnerTable = otherOuterCell.querySelector('.inner-game-table');
            otherInnerTable.classList.remove('zoomed');
        }
    });
}