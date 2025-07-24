const querySavings = 'SELECT * FROM savings WHERE userid = $1'
const queryExpenses = 'SELECT * FROM expenses WHERE userid = $1'

export { querySavings, queryExpenses }
