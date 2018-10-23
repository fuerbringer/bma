const helper = require('./helper')
const grid = require('./grid')
const maze = require('./maze')
const pathFinding = require('./pathfinding.js')
const presetGrids = require('./preset-grids.js')
const ui = require('./ui.js')

/**
 * Entry point for the individual pathfinder demonstration
 * @param {Object} options - Grid, Pathfinder, etc settings
 */
const algorithmDemo = options => {
  let algorithmType = pathFinding.AStarFinder
  let matrix = null
  let polyLine = []
  let heuristics = []
  let gridWidth = 24
  let gridHeight = 24
  if(options.hasOwnProperty('algorithm')) {
    algorithmType = options.algorithm
  }
  if(options.hasOwnProperty('gridWidth')) {
    gridWidth = options.gridWidth
  }
  if(options.hasOwnProperty('gridHeight')) {
    gridHeight = options.gridHeight
  }
  if(options.hasOwnProperty('gridType') && options.gridType == 'recbacktracker') {
    matrix = maze.generateRecBacktrackerMaze(gridWidth, gridHeight, false)
  } else if(options.hasOwnProperty('gridType') && options.gridType == 'random') {
    matrix = maze.generatePseudoRandomMaze(gridWidth, gridHeight)
  } else if(options.hasOwnProperty('gridType') && options.gridType.length > 0) {
    matrix = presetGrids[options.gridType]
  } else {
    matrix = maze.generateRecBacktrackerMaze(gridWidth, gridHeight, false)
  }
  const container = document.getElementById('container')
  container.appendChild(grid.generateGridFromMatrix(matrix))
  const startAndFinish = helper.findStartAndFinish(matrix)
  const pfGrid = new pathFinding.Grid(helper.sanitizeMatrix(matrix))
  const finder = new algorithmType({
    allowDiagonal: options.allowDiagonal ? true : false,
    heuristic: function(dx, dy) {
      heuristics.push({x: dx, y: dy})
      return pathFinding.Heuristic.chebyshev(dx, dy)
    }
  })
  const t0 = performance.now() // Start measuring time for pathfinder calculations
  const path = finder.findPath(
    startAndFinish.start.x, startAndFinish.start.y,
    startAndFinish.finish.x, startAndFinish.finish.y, pfGrid)
  const t1 = performance.now() // End measuring time
  for(let i = 0; i < path.length; i++) {
    polyLine.push(grid.getRealBoxCoords(path[i][0], path[i][1], { x: 4, y: 4 }))
  }
  grid.drawVisualPath(polyLine)

  ui.setStatus({
    algorithm: algorithmType.name,
    startAndFinish: startAndFinish,
    distance: (path.length - 1),
    elapsedTime: (t1 - t0),
    heuristics: heuristics.length,
    totalCells: (gridWidth * gridHeight)
  })
  ui.handleHeuristicsToggle(matrix, heuristics)
}

const initAlgorithmDemoInterface = (algorithm, gridType) => {
  ui.addAlgorithmTypes(algorithm)
  ui.addPresetGrids(gridType)
}

module.exports = {
  pathFinding,
  algorithmDemo,
  initAlgorithmDemoInterface
}
