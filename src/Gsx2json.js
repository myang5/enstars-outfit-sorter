export default function filterGsData(data, config = {}) {
  let query = config.query || []; //array of arrays of values selected for each filter
  const useIntegers = config.integers || true;
  const isInclusive = config.isInclusive || false; //whether row should match query partially (inclusive) or entirely (exclusive)
  const responseObj = [];
  // console.log('is inclusive: ' + isInclusive);
  if (data) {
    const headers = data.values[0];
    //if inclusive search queries don't need to be grouped
    if (isInclusive && query.length) { query = new Set( query.reduce( ( accumulator, currentVal ) => accumulator.concat( [...currentVal] ), [] ) ) }
    // console.log(query);
    for (let i = 1; i < data.values.length; i++) { //iterate over array of rows
      const row = data.values[i];
      let queried = false;
      if (query.size === 0 || query.length === 0) { queried = true; } //if no query just push all rows
      else if (isInclusive) {
        for (let j = 0; j < row.length; j++) { //if any query is found in row queried = true
          if (query.has(row[j])) { queried = true; break }
        }
      }
      else { //exclusive search
        const result = query.map((set) => { //for each filter, check if any query is found in row 
          for (let j = 0; j < row.length; j++) { //if any query is found in row queried = true
            if (set.has(row[j])) { return true }
          }
        });
        //if any query is not found in row queried = false
        queried = result.reduce(function (accumulator, currVal) { return accumulator && currVal }, true);
      }
      if (queried) {
        const newRow = {};
        for (let j = 0; j < row.length; j++) { //iterate over values in each row to add headers
          const header = headers[j];
          let value = row[j];
          if (useIntegers === true && !isNaN(value)) {
            value = Number(value);
          }
          newRow[header.toLowerCase()] = value;
        }
        responseObj.push(newRow);
      }
    }
    // console.log(responseObj);
    return responseObj;
  }
}

