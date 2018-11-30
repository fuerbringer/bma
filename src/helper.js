/**
 * Random integer generator with interval [min, max]
 * @param {Number} min
 * @param {Number} max
 */
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min+1) + min)
}


/**
 * Finds "s" and "f" inside a 2d matrix, representing start and finish, and returns their coords.
 * @param {Array} matrix - 2d matrix with or without walls. Must contain 's' and 'f' rect
 */
const findStartAndFinish = (matrix = []) => {
  let startAndFinish = {
    start: {
      x: undefined, y: undefined
    },
    finish: {
      x: undefined, y: undefined
    }
  }
  for(let y = 0; y < matrix.length; y++) {
    for(let x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] === 's') {
        startAndFinish.start.x = x
        startAndFinish.start.y = y
      } else if(matrix[y][x] === 'f') {
        startAndFinish.finish.x = x
        startAndFinish.finish.y = y
      }
    }
  }
  return startAndFinish
}

/**
 * Prepares a 2d matrix for PathFinding.js
 * Removes Start and Finish ("s", "f") elements (and other values)
 * @param {Array} matrix - 2d array
 */
const sanitizeMatrix = (matrix = []) => {
  for(let y = 0; y < matrix.length; y++) {
    for(let x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] != 0 && matrix[y][x] != 1) {
        matrix[y][x] = 0
      }
    }
  }
  return matrix
}

module.exports = {
  randomIntFromInterval,
  findStartAndFinish,
  sanitizeMatrix
}
