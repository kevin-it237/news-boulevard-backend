/**
 * Returns an array with arrays of the given size.
 *
 * @param {Array} myArray array to split
 * @param {Integer} chunk_size Size of every group
 */
const chunkArray = (myArray, chunk_size) => {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
};

module.exports = chunkArray;