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
const algorithmDemo = (options = {}) => {
  let algorithmType = pathFinding.AStarFinder
  let heuristic = 'manhattan'
  let matrix = null
  let polyLine = []
  let heuristics = []
  let gridWidth = 24
  let gridHeight = 24
  if(options.hasOwnProperty('algorithm')) {
    algorithmType = options.algorithm
  }
  if(options.hasOwnProperty('heuristic')) {
    heuristic = options.heuristic
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
  let finder = null
  if(heuristic != 'keine') {
    finder = new algorithmType({
      allowDiagonal: options.allowDiagonal ? true : false,
      heuristic: function(dx, dy) {
        heuristics.push({x: dx, y: dy})
        return pathFinding.Heuristic[heuristic](dx, dy)
      }
    })
  } else {
    finder = new algorithmType({
      allowDiagonal: options.allowDiagonal ? true : false
    })
  }
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
    heuristicsCount: heuristics.length,
    heuristics: heuristic,
    totalCells: (gridWidth * gridHeight)
  })
  ui.handleHeuristicsToggle(matrix, heuristics)
}

/**
 * Add dropdown options for algorithm types and grids
 * @param {String} algorithm - Selected pathfinding algorithm
 * @param {String} gridType - Selected grid / maze type
 */
const initAlgorithmDemoInterface = (algorithm = 'AStarFinder', gridType = 'recbacktracker', heuristicType = '') => {
  ui.addAlgorithmTypes(algorithm)
  ui.addPresetGrids(gridType)
  ui.addHeuristics(heuristicType)
}


module.exports = {
  pathFinding,
  algorithmDemo,
  initAlgorithmDemoInterface
}
