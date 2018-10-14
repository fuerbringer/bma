var helper = require('./helper')


var generatePseudoRandomMaze = function(width, height, remainderFrequency) {
  var matrix = [];
  remainderFrequency = remainderFrequency ? remainderFrequency : 4;
  for(var y = 0; y < height; y++) {
    var row = [];
    for(var x = 0; x < width; x++) {
      var block = (((Math.random() * 100) % remainderFrequency).toFixed(0) == true) ? 1 : 0;
      row.push(block);
    }
    matrix.push(row);
  }
  var startBlock = {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  };
  var endBlock = {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  };
  matrix[startBlock.y][startBlock.x] = 's';
  matrix[endBlock.y][endBlock.x] = 'f';
  return matrix;
}


var markStartAndFinish = function(matrix, randomSelection) {
  var possible = [];
  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] == 0) {
        possible.push({ x: x, y: y });
      }
    }
  }
  var chosenStart = Math.floor(Math.random() * possible.length);
  if(randomSelection) {
    matrix[possible[chosenStart].y][possible[chosenStart].x] = 's';
  } else {
    matrix[possible[0].y][possible[0].x] = 's';
  }
  possible.splice(chosenStart, 1);
  var chosenFinish = Math.floor(Math.random() * possible.length);
  if(randomSelection) {
    matrix[possible[chosenFinish].y][possible[chosenFinish].x] = 'f';
  } else {
    matrix[possible[possible.length - 1].y][possible[possible.length - 1].x] = 'f';
  }
  return matrix;
}


/**
 * Pseudocode from https://en.wikipedia.org/wiki/Maze_generation#Recursive_backtracker
 */
var generateRecBacktrackerMaze = function(width, height, randomStartAndFinish) {
  // Border wall deltas
  width += 2;
  height += 2;
  var matrix = [];
  for(var y = 0; y < height - 1; y++) {
    var row = [];
    for(var x = 0; x < width - 1; x++) {
      var block = 0;
    }
    matrix.push(row);
  }

  // Rest of the function body by https://github.com/semibran/maze
  function generate(nodes, adjacent, choose) {
    var node = choose(nodes)
    var stack = [node]
    var maze = new Map()
    for (var node of nodes) {
      maze.set(node, [])
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

  var x = 0;
  var y = 0;
  for (var cell of cells(world)) {
    var tile = world.tiles[locate(world, cell)]
    if (!cell.x && cell.y) {
      y++;
      x = 0;
    } else {
      x++;
    }
    if(x < width - 1 && y < height) {
      matrix[y][x] = (tile == 'wall' ? 1 : 0);
    }
  }

  var corridors = [];
  for(var y = 1; y < height - 1; y++) {
    for(var x = 1; x < width - 1; x++) {
      if(matrix[y][x] == 0) {
        corridors.push({ x: x, y: y });
      }
    }
  }

  // Random start
  var startIndex = helper.randomIntFromInterval(0, corridors.length - 1);
  var start = corridors[startIndex];
  // Remove start element so start and finish don't end up as the same cell
  corridors.splice(startIndex, 1);
  var finishIndex = helper.randomIntFromInterval(0, corridors.length - 1);
  var finish = corridors[finishIndex];
  matrix[start.y][start.x] = 's';
  matrix[finish.y][finish.x] = 'f';
  matrix[0][0] = 1; // Patch wall at (0,0)
  return matrix;
}


module.exports = {
  generatePseudoRandomMaze,
  markStartAndFinish,
  generateRecBacktrackerMaze
}
