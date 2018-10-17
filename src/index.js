var helper = require('./helper')
var grid = require('./grid')
var maze = require('./maze')
var pathFinding = require('./pathfinding.js')

var algorithmDemo = function(options) {
  var algorithmType = pathFinding.AStarFinder;
  var matrix = null;
  var gridWidth = 24;
  var gridHeight = 24;
  if(options.hasOwnProperty('algorithm')) {
    algorithmType = options.algorithm;
  }
  if(options.hasOwnProperty('gridWidth')) {
    gridWidth = options.gridWidth;
  }
  if(options.hasOwnProperty('gridHeight')) {
    gridHeight = options.gridHeight;
  }
  if(options.hasOwnProperty('gridType') && options.gridType == 'recbacktracker') {
    matrix = maze.generateRecBacktrackerMaze(gridWidth, gridHeight, false);
  } else if(options.hasOwnProperty('gridType') && options.gridType == 'random') {
    matrix = maze.generatePseudoRandomMaze(gridWidth, gridHeight);
  } else {
    matrix = maze.generateRecBacktrackerMaze(gridWidth, gridHeight, false);
  }
  console.log(gridWidth, gridHeight)
  var container = document.getElementById("container");
  container.appendChild(grid.generateGridFromMatrix(matrix));
  var startAndFinish = helper.findStartAndFinish(matrix);
  var polyLine = [];
  var dbgWnd = document.getElementById("debug-out");
  var pfGrid = new pathFinding.Grid(helper.sanitizeMatrix(matrix));
  var finder = new algorithmType({
    allowDiagonal: options.allowDiagonal ? true : false,
    heuristic: function(dx, dy) {
      // Tap into individual steps if needed
      return pathFinding.Heuristic.chebyshev(dx, dy);
    }
  });
  var path = finder.findPath(
    startAndFinish.start.x, startAndFinish.start.y,
    startAndFinish.finish.x, startAndFinish.finish.y, pfGrid);
  for(var i = 0; i < path.length; i++) {
    polyLine.push(grid.getRealBoxCoords(path[i][0], path[i][1], { x: 4, y: 4 }));
  }
  grid.drawVisualPath(polyLine);

  helper.setStatus({
    algorithm: algorithmType.name,
    startAndFinish: startAndFinish,
    distance: (path.length - 1)
  });
}

module.exports = {
  pathFinding,
  algorithmDemo,
}
