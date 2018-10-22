var helper = require('./helper')
var grid = require('./grid')
var maze = require('./maze')
var pathFinding = require('./pathfinding.js')
var presetGrids = require('./preset-grids.js')
var ui = require('./ui.js')

var algorithmDemo = function(options) {
  var algorithmType = pathFinding.AStarFinder
  var matrix = null
  var gridWidth = 24
  var gridHeight = 24
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
  var container = document.getElementById('container')
  container.appendChild(grid.generateGridFromMatrix(matrix))
  var startAndFinish = helper.findStartAndFinish(matrix)
  var polyLine = []
  var pfGrid = new pathFinding.Grid(helper.sanitizeMatrix(matrix))
  var finder = new algorithmType({
    allowDiagonal: options.allowDiagonal ? true : false,
    heuristic: function(dx, dy) {
      // TODO: Tap into individual steps
      // TODO: Mark 'touched' cells
      return pathFinding.Heuristic.chebyshev(dx, dy)
    }
  })
  var t0 = performance.now() // Start measuring time for pathfinder calculations
  var path = finder.findPath(
    startAndFinish.start.x, startAndFinish.start.y,
    startAndFinish.finish.x, startAndFinish.finish.y, pfGrid)
  var t1 = performance.now() // End measuring time
  for(var i = 0; i < path.length; i++) {
    polyLine.push(grid.getRealBoxCoords(path[i][0], path[i][1], { x: 4, y: 4 }))
  }
  grid.drawVisualPath(polyLine)

  helper.setStatus({
    algorithm: algorithmType.name,
    startAndFinish: startAndFinish,
    distance: (path.length - 1),
    elapsedTime: (t1 - t0)
  })
}

var initAlgorithmDemoInterface = function(algorithm, gridType) {
  ui.addAlgorithmTypes(algorithm)
  ui.addPresetGrids(gridType)
}

module.exports = {
  pathFinding,
  algorithmDemo,
  initAlgorithmDemoInterface
}
