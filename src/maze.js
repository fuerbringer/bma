const mazeHelper = require('./maze-helper')

/**
 * @param {Number} width
 * @param {Number} height
 * @param {Number} remainderFrequency - modulo rvalue - Can be used to control the frequency of walls
 */
const generatePseudoRandomMaze = (width, height, remainderFrequency) => {
  const matrix = []
  remainderFrequency = remainderFrequency ? remainderFrequency : 4
  for(let y = 0; y < height; y++) {
    const row = []
    for(let x = 0; x < width; x++) {
      const block = (((Math.random() * 100) % remainderFrequency).toFixed(0) == true) ? 1 : 0
      row.push(block)
    }
    matrix.push(row)
  }
  return markStartAndFinish(matrix, true)
}


/**
 * @param {Boolean} randomSelection - If true selects random start and finish within the possible elements.
 *  Otherwise start will be the first possible element and finish the last.
 */
const markStartAndFinish = (matrix, randomSelection) => {
  const possible = []
  for(let y = 0; y < matrix.length; y++) {
    for(let x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] == 0) {
        possible.push({ x: x, y: y })
      }
    }
  }
  const chosenStart = Math.floor(Math.random() * possible.length)
  if(randomSelection) {
    matrix[possible[chosenStart].y][possible[chosenStart].x] = 's'
  } else {
    matrix[possible[0].y][possible[0].x] = 's'
  }
  possible.splice(chosenStart, 1)
  const chosenFinish = Math.floor(Math.random() * possible.length)
  if(randomSelection) {
    matrix[possible[chosenFinish].y][possible[chosenFinish].x] = 'f'
  } else {
    matrix[possible[possible.length - 1].y][possible[possible.length - 1].x] = 'f'
  }
  return matrix
}


/**
 * Used to generate always solveable mazes
 * See https://en.wikipedia.org/wiki/Maze_generation#Recursive_backtracker
 * @param {Number} width
 * @param {Number} height
 */
const generateRecBacktrackerMaze = (width, height) => {
  // Border wall deltas
  width += 2
  height += 2
  let matrix = []
  for(let y = 0; y < height - 1; y++) {
    matrix.push([])
  }

  const world = {
    width: width - 1,
    height: height - 1,
    tiles: new Array((width - 1) * (height - 1)).fill('wall')
  }

  const nodes = mazeHelper.cells(world).filter(cell => cell.x % 2 && cell.y % 2)
  const maze = mazeHelper.generate(nodes, mazeHelper.adjacent, mazeHelper.choose)
  mazeHelper.connect(maze, world)

  let currentX = 0
  let currentY = 0
  for (let cell of mazeHelper.cells(world)) {
    const tile = world.tiles[mazeHelper.locate(world, cell)]
    if (!cell.x && cell.y) {
      currentY++
      currentX = 0
    } else {
      currentX++
    }
    if(currentX < width - 1 && currentY < height) {
      matrix[currentY][currentX] = (tile == 'wall' ? 1 : 0)
    }
  }

  const corridors = []
  for(let cY = 1; cY < height - 1; cY++) {
    for(let x = 1; x < width - 1; x++) {
      if(matrix[cY][x] == 0) {
        corridors.push({ x: x, y: cY })
      }
    }
  }

  matrix = markStartAndFinish(matrix, true)
  matrix[0][0] = 1 // Patch wall at (0,0)
  return matrix
}


module.exports = {
  generatePseudoRandomMaze,
  markStartAndFinish,
  generateRecBacktrackerMaze
}
