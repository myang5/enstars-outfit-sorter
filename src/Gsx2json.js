export default function gsx2json(data, config = {}) {
  const query = config.query || '';
  const useIntegers = config.integers || true;
  const inclusiveSearch = config.inclusiveSearch || true; //whether row should match query partially (inclusive) or entirely (exclusive)
  const responseObj = [];
  if (data) {
    console.log(query);
    var headers = data.values[0];
    for (var i = 1; i < data.values.length; i++) {
      var row = data.values[i];
      var newRow = {};
      var queried = false;
      for (var j = 0; j < row.length; j++) {
        var header = headers[j];
        var value = row[j];
        if (!query.length) {queried = true} 
        else {
          query.forEach(function (queryStr) {
            if (value.toLowerCase().indexOf(queryStr.toLowerCase()) > -1) { queried = true }
          })
        }
        if (useIntegers === true && !isNaN(value)) {
          value = Number(value);
        }
        newRow[header.toLowerCase()] = value;
      }
      if (queried === true) {
        responseObj.push(newRow);
      }
    }
    return responseObj;
  }
}

