export default function addHeadersToData(data, config = {}) {
  const query = config.query || '';
  const useIntegers = config.integers || true;
  const isInclusive = config.isInclusive || false; //whether row should match query partially (inclusive) or entirely (exclusive)
  const responseObj = [];
  console.log('is inclusive: ' + isInclusive);
  console.log(query);
  if (data) {
    const headers = data.values[0];
    for (let i = 1; i < data.values.length; i++) { //iterate over array of rows
      const row = data.values[i];
      let queried = false;
      if (!query.length) { queried = true; } //if no query just push all rows
      else if (isInclusive) {
        for (let j = 0; j < query.length; j++) { //if any query is found in row queried = true
          if (row.indexOf(query[j]) > -1) { queried = true; break }
        }
      }
      else { //exclusive search
        const result = query.map((queryStr) => row.indexOf(queryStr) > -1); 
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
    return responseObj;
  }
}

