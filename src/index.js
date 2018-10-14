var helper = require('./helper')
var grid = require('./grid')
var maze = require('./maze')
var pathFinding = require('./pathfinding.js')

document.createSvg = function(tagName) {
  var svgNS = "http://www.w3.org/2000/svg";
  return this.createElementNS(svgNS, tagName);
};

var aStarDemo = function() {
  //console.debug(generateRecBacktrackerMaze(6, 6));
  //var matrix = generatePseudoRandomMaze(20, 20);
  var matrix = maze.generateRecBacktrackerMaze(24, 24, false);
  var container = document.getElementById("container");
  container.appendChild(grid.generateGridFromMatrix(matrix));
  var startAndFinish = helper.findStartAndFinish(matrix);
  var polyLine = [];
  var dbgWnd = document.getElementById("debug-out");
  var pfGrid = new pathFinding.Grid(helper.sanitizeMatrix(matrix));
  var finder = new pathFinding.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
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

}

addEventListener("DOMContentLoaded", aStarDemo, false);