var generatePseudoRandomMaze = function(width, height, remainderFrequency) {
  var matrix = []
  remainderFrequency = remainderFrequency ? remainderFrequency : 4
  for(var y = 0; y < height; y++) {
    var row = []
    for(var x = 0; x < width; x++) {
      var block = (((Math.random() * 100) % remainderFrequency).toFixed(0) == true) ? 1 : 0
      row.push(block)
    }
    matrix.push(row)
  }
  matrix = markStartAndFinish(matrix, true)
  return matrix
}


/**
 * @param randomSelection If true selects random start and finish within the possible elements.
 *                        Otherwise start will be the first possible element and finish the last.
 */
var markStartAndFinish = function(matrix, randomSelection) {
  var possible = []
  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] == 0) {
        possible.push({ x: x, y: y })
      }
    }
  }
  var chosenStart = Math.floor(Math.random() * possible.length)
  if(randomSelection) {
    matrix[possible[chosenStart].y][possible[chosenStart].x] = 's'
  } else {
    matrix[possible[0].y][possible[0].x] = 's'
  }
  possible.splice(chosenStart, 1)
  var chosenFinish = Math.floor(Math.random() * possible.length)
  if(randomSelection) {
    matrix[possible[chosenFinish].y][possible[chosenFinish].x] = 'f'
  } else {
    matrix[possible[possible.length - 1].y][possible[possible.length - 1].x] = 'f'
  }
  return matrix
}


/**
 * Pseudocode from https://en.wikipedia.org/wiki/Maze_generation#Recursive_backtracker
 */
var generateRecBacktrackerMaze = function(width, height) {
  // Border wall deltas
  width += 2
  height += 2
  var matrix = []
  for(var y = 0; y < height - 1; y++) {
    var row = []
    matrix.push(row)
  }

  // Rest of the function body by https://github.com/semibran/maze
  function generate(nodes, adjacent, choose) {
    var node = choose(nodes)
    var stack = [node]
    var maze = new Map()
    for (var mazeNode of nodes) {
      maze.set(mazeNode, [])
    }
    while (node) {
      var neighbors = nodes.filter(other => !maze.get(other).length && adjacent(node, other))
      if (neighbors.length) {
        var neighbor = choose(neighbors)
        maze.get(node).push(neighbor)
        maze.get(neighbor).push(node)
        stack.unshift(neighbor)
        node = neighbor

      } else {
        stack.shift()
        node = stack[0]
      }
    }
    return maze
  }

  var world = {
    width: width - 1,
    height: height - 1,
    tiles: new Array((width - 1) * (height - 1)).fill('wall')
  }

  var nodes = cells(world).filter(cell => cell.x % 2 && cell.y % 2)
  var maze = generate(nodes, adjacent, choose)
  connect(maze, world)

  function cells(grid) {
    var { width, height  } = grid
    var cells = new Array(width * height)
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var cell = { x, y  }
        cells[locate(grid, cell)] = cell
      }
    }
    return cells
  }

  function locate(grid, cell) {
    return cell.y * grid.width + cell.x

  }

  function adjacent(a, b) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y) === 2
  }

  function choose(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  function connect(maze, world) {
    for (var [node, neighbors] of maze) {
      world.tiles[locate(world, node)] = 'floor'
      for (var neighbor of neighbors) {
        var midpoint = {
          x: node.x + (neighbor.x - node.x) / 2,
          y: node.y + (neighbor.y - node.y) / 2
        }
        world.tiles[locate(world, midpoint)] = 'floor'
      }
    }
  }

  var currentX = 0
  var currentY = 0
  for (var cell of cells(world)) {
    var tile = world.tiles[locate(world, cell)]
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

  var corridors = []
  for(var cY = 1; cY < height - 1; cY++) {
    for(var x = 1; x < width - 1; x++) {
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
