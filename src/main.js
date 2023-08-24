/**
 * Multiplies the input value by 2.
 *
 * @param {number|Array<Array<number>>} input The value or range of cells
 *     to multiply.
 * @return The input multiplied by 2.
 * @customfunction
 */
function DOUBLE(input) {
    return Array.isArray(input) ?
        input.map(row => row.map(cell => cell * 2)) :
        input * 2;
  }

/**
 * Extract the month of a Date Range.
 * @param {number|Array<Array<number>>} input the value or range of cells to
 * process
 * @return the month value 
 * @customfunction
 */
function getMonth(input) {
    return Array.isArray(input) ?
        input.map(row => row.map(cell => {
            let formattedDate = new Date(cell)
            let month = formattedDate.getMonth() + 1;
            return month;
        })) : singleMonth(input)
}

function singleMonth(input) {
  let formattedDate = new Date(input);
  let month = formattedDate.getMonth() + 1;
  return month;
}
