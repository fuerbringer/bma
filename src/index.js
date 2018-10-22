var helper = require('./helper')
var grid = require('./grid')
var maze = require('./maze')
var pathFinding = require('./pathfinding.js')
var presetGrids = require('./preset-grids.js')

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
  // TODO: detect grids/mazes other than these two, namely from addPresetGrids()
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
      // Tap into individual steps if needed
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

var addPresetGrids = function(selected) {
  var optionsObj = presetGrids;
  optionsObj['recbacktracker'] = 'generator'
  optionsObj['random'] = 'generator'
  var options = Object.entries(optionsObj)
  for(let [key, val] of options) {
    var option = document.createElement('option')
    option.setAttribute('name', key)
    option.setAttribute('value', key)
    if(val != 'generator') {
      option.appendChild(document.createTextNode(`${key} (Vorgefertigt)`))
    } else {
      option.appendChild(document.createTextNode(`${key} (Generator)`))
    }
    if(selected == key) {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-type').appendChild(option)
  }
}

module.exports = {
  pathFinding,
  algorithmDemo,
  addPresetGrids
}
