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
 * @param randomSelection If true selects random start and finish within the possible elements.
 *                        Otherwise start will be the first possible element and finish the last.
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
 * Pseudocode from https://en.wikipedia.org/wiki/Maze_generation#Recursive_backtracker
 */
const generateRecBacktrackerMaze = (width, height) => {
  // Border wall deltas
  width += 2
  height += 2
  let matrix = []
  for(let y = 0; y < height - 1; y++) {
    matrix.push([])
  }

  // Rest of the function body by https://github.com/semibran/maze
  const generate = (nodes, adjacent, choose) => {
    let node = choose(nodes)
    const stack = [node]
    const maze = new Map()
    for (let mazeNode of nodes) {
      maze.set(mazeNode, [])
    }
    while (node) {
      const neighbors = nodes.filter(other => !maze.get(other).length && adjacent(node, other))
      if (neighbors.length) {
        const neighbor = choose(neighbors)
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

  const world = {
    width: width - 1,
    height: height - 1,
    tiles: new Array((width - 1) * (height - 1)).fill('wall')
  }

  const nodes = cells(world).filter(cell => cell.x % 2 && cell.y % 2)
  const maze = generate(nodes, adjacent, choose)
  connect(maze, world)

  const cells = grid => {
    const { width, height  } = grid
    const cells = new Array(width * height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = { x, y }
        cells[locate(grid, cell)] = cell
      }
    }
    return cells
  }

  const locate = (grid, cell) => {
    return cell.y * grid.width + cell.x
  }

  const adjacent = (a, b) => {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y) === 2
  }

  const choose = array => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const connect = (maze, world) => {
    for (const [node, neighbors] of maze) {
      world.tiles[locate(world, node)] = 'floor'
      for (let neighbor of neighbors) {
        const midpoint = {
          x: node.x + (neighbor.x - node.x) / 2,
          y: node.y + (neighbor.y - node.y) / 2
        }
        world.tiles[locate(world, midpoint)] = 'floor'
      }
    }
  }

  let currentX = 0
  let currentY = 0
  for (let cell of cells(world)) {
    const tile = world.tiles[locate(world, cell)]
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
