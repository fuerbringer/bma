// Original code by https://github.com/semibran/maze (MIT)

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


const cells = grid => {
  const { width, height } = grid
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


module.exports = {
  generate,
  connect,
  cells,
  locate,
  choose,
  adjacent
}
