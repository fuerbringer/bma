var randomIntFromInterval = function(min, max) {
  return Math.floor(Math.random() * (max - min+1) + min);
}


/**
 * Finds "s" and "f" inside a 2d matrix, representing start and finish, and returns their coords.
 */
var findStartAndFinish = function(matrix) {
  var startAndFinish = {
    start: {
      x: false,
      y: false
    },
    finish: {
      x: false, y: false
    }
  };
  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] === "s") {
        startAndFinish.start.x = x;
        startAndFinish.start.y = y;
      } else if(matrix[y][x] === "f") {
        startAndFinish.finish.x = x;
        startAndFinish.finish.y = y;
      }
    }
  }
  return startAndFinish;
}

/**
 * Prepares a 2d matrix for PathFinding.js
 * Removes Start and Finish ("s", "f") elements
 */
var sanitizeMatrix = function(matrix) {
  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] != 0 && matrix[y][x] != 1) {
        matrix[y][x] = 0;
      }
    }
  }
  return matrix;
}

module.exports = {
  randomIntFromInterval,
  findStartAndFinish,
  sanitizeMatrix
}
