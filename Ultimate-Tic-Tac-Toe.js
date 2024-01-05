let outerTableCell = document.querySelectorAll('td.outer-game-table-cell');
let innerTableCell = document.querySelectorAll('.inner-game-table');

// [...document.getElementsByClassName("someClass")].forEach() {
// also works instead of using 
// document.querySelectorAll(".someClass").forEach {

outerTableCell.forEach(cell => {
    cell.addEventListener('click', function (event) {
        event.target.classList.toggle('zoomed');

        let innerTable = this.querySelector('.inner-game-table');
        innerTable.classList.toggle('zoomed');
    })
})