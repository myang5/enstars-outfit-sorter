//filter Array of Objs based on query and job conditions
//returns deep copy of new Array (with new copy of Objs)
export function filterData(data, config = {}) {
  let query = config.query || {}; //Object with Sets of values selected for each filter
  let conditions = config.conditions || []; //Array with values of job conditions
  const isInclusive = config.isInclusive || false; //whether row should match query with OR (inclusive) or AND (exclusive)
  const result = [];
  if (data) { //should be Array of Objects
    //console.log('filterGsData',config);
    //case 1: no conditions or queries -> return data as is
    //case 2: conditions but no queries -> filter by conditions
    //case 3: no conditions but has queries -> filter by queries
    //case4 4: queries and conditions -> must filter by condition, then queries inclusive/exclusive
    for (let i = 0; i < data.length; i++) { //iterate over Array of rows
      const row = data[i];
      let meetsConditions = conditions.length <= 0; //if no condition then all rows meet condition (true)
      let queried = Object.keys(query).length <= 0; //if no queries then all rows are queried (true)
      if (Object.keys(query).length === 0 && conditions.length === 0) { queried = true; } //if no query just push all rows
      else {
        if (conditions.length > 0) {
          conditions.forEach(condition => { if (Object.values(row).includes(condition)) meetsConditions = true });
        }
        if (Object.keys(query).length > 0) {
          //map which filters match values in the row
          let result = matchFilters(query, row);
          if (isInclusive) {
            //if any filter is matched queried = true
            queried = result.reduce(function (accumulator, currVal) { return accumulator || currVal }, false);
          }
          else { //exclusive 
            //if any filter is not matched queried = false
            queried = result.reduce(function (accumulator, currVal) { return accumulator && currVal }, true);
          }
        }
      }
      if (meetsConditions && queried) {
        result.push(JSON.parse(JSON.stringify(row))
        );
      }
    }
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

//convert Array of Arrays to Array of objects assuming first Array holds key values
//does not mutate original Array
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

