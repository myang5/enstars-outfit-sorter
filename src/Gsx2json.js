export function filterData(data, config = {}) {
  let query = config.query || {}; //Object with Sets of values selected for each filter
  let conditions = config.conditions || []; //Array with values of job conditions
  const isInclusive = config.isInclusive || false; //whether row should match query with OR (inclusive) or AND (exclusive)
  const result = [];
  if (data) { //should be Array of Objects
    console.log('filterGsData', config);
    for (let i = 0; i < data.length; i++) { //iterate over Array of rows
      const row = data[i];
      let queried = false;
      if (Object.keys(query).length === 0 && conditions.length === 0) { queried = true; } //if no query just push all rows
      else {
        //map which filters match values in the row
        let result = matchFilters(query, row, conditions);
        if (isInclusive) {
          //if any filter is matched queried = true
          queried = result.reduce(function (accumulator, currVal) { return accumulator || currVal }, false);
        }
        else { //exclusive 
          //if any filter is not matched queried = false
          queried = result.reduce(function (accumulator, currVal) { return accumulator && currVal }, true);
        }
        conditions.forEach(condition => { if (!Object.values(row).includes(condition)) queried = false });
      }
      if (queried) {
        result.push(row);
      }
    }
    //console.log(responseObj);
    return result;
  }
}

//helper function to map which filters match values in the row
function matchFilters(query, row) {
  //check if values queried in each filter match the row value at least once
  const result = Object.keys(query).map((key) => { //for each query Set
    const queriedHeader = key.replace('sel', ''); //get name of relevant column
    const set = query[key]; //get query Set from query Object
    const queriedValue = row[queriedHeader]; //find which index represents the relevant column in the row Array
    //console.log(queriedValue);
    if (set.has(queriedValue)) { return true }
  });
  return result;
}

export function convertArraysToObjects(arrs) {
  const result = [];
  const headers = arrs[0]; //first row is header row
  for (let i = 1; i < arrs.length; i++) {
    const row = arrs[i];
    const newRow = {};
    for (let j = 0; j < row.length; j++) { //iterate over values in each row to add headers
      const header = headers[j];
      let value = row[j];
      if (!isNaN(value)) {
        value = Number(value);
      }
      newRow[header] = value;
    }
    result.push(newRow);
  }
  return result;
}

