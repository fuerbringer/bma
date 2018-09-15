document.createSvg = function(tagName) {
  var svgNS = "http://www.w3.org/2000/svg";
  return this.createElementNS(svgNS, tagName);
};

var drawVisualPath = function(pathMatrix, polyId, color, id) {
  var id = id ? id : "main-grid";
  var color = color ? color : "green";
  var svg = document.getElementById(id);
  var polyLine = document.createSvg("polyline");
  var points = "";
  for (var i = 0; i < pathMatrix.length; i++){
    if (pathMatrix[i] instanceof Array){
      if(pathMatrix[i].length == 2) {
        points += pathMatrix[i].join(",");
        points += " ";
      }
    }
  }
  polyLine.setAttribute("points", points);
  polyLine.setAttribute("fill", "none");
  polyLine.setAttribute("stroke", color);
  polyLine.setAttribute("class", "grid-path");
  if(polyId) {
    polyLine.setAttribute("id", "grid-path");
  }
  svg.appendChild(polyLine);
}

/**
 * Delete all paths
 */
var clearVisualPaths = function() {
  var polys = document.getElementsByClassName("grid-path");
  while(polys[0]) {
    polys[0].parentNode.removeChild(polys[0]);
  }
}

/**
 * Given a rect#coord-N-N returns the parents <g> translate/transform x and y in an array
 * Example: [0, 16]
 */
var getSvgBoxCoord = function(id) {
  // Assuming base element with id `id` has a parent with an attribute `transform`
  var translate = document.getElementById(id).parentNode.getAttribute("transform");
  var parts = /translate\(\s*([^\s,)]+)[ , ]([^\s,)]+)/.exec(translate);
  return [ parts[1], parts[2] ];
}

/**
 * Provides exact SVG pixel coordinates for a given box' <g> parent element
 * Example:
 *  let f(x) = x
 *  f(5) = x <=> getRealBoxCoords(5,5)
 *  Returns exact pixel coordinates for 5,5
 */
var getRealBoxCoords = function(x, y, centeringOffset) {
  var id = "coord-" + x + "-" + y;
  var centeringOffset = centeringOffset ? centeringOffset : { x: 0, y: 0 };
  // Assuming base element with id `id` has a parent with an attribute `transform`
  var translate = document.getElementById(id).parentNode.getAttribute("transform");
  var parts = /translate\(\s*([^\s,)]+)[ , ]([^\s,)]+)/.exec(translate);
  return [ parseInt(parts[1]) + centeringOffset.x, parseInt(parts[2]) + centeringOffset.y ];
}

/**
 * Example:
 *  // Fills box at 1,1 with red color
 *  setRectAttribute(1, 1, "fill", "red");
 */
var setRectAttribute = function(x, y, name, value) {
  var rect = document.getElementById("coord-" + x + "-" + y);
  rect.setAttribute(name, value);
}

/**
 * Resets all boxes in the coordinate system with class coord-rect to default
 * Example:
 *  // Set rect at 1,1 to filled red ...
 *  setRectAttribute(1, 1, "fill", "red");
 *  // And reset it again (the whole grid)
 *  resetAllCoordRects();
 */
var resetAllCoordRects = function() {
  var rects = document.getElementsByClassName("coord-rect");
  for(var i = 0; i < rects.length; i++) {
    rects[i].setAttribute("fill", "white");
    rects[i].setAttribute("stroke", "black"); 
    rects[i].setAttribute("stroke-width", "0.1"); 
  }
}

/**
 * Resets rect at x,y to its initial state
 */
var resetCoordRect = function(x, y) {
  var rect = document.getElementById("coord-" + x + "-" + y);
  rect.setAttribute("fill", "white");
  rect.setAttribute("stroke", "black"); 
  rect.setAttribute("stroke-width", "0.1"); 
}

/**
 * @param {int} numberPerSide Sizes for x and y axis
 * @param {int} size Height / width attribute for inner boxes
 * @param {int} pixelsPerSide Total width and height of the output
 */
var generateGrid = function(numberPerSide, size, pixelsPerSide, id) {
  var numberPerSide = numberPerSide ? numberPerSide : 20;
  var size = size ? size : 10;
  var pixelsPerSide = pixelsPerSide ? pixelsPerSide : 400;
  var id = id ? id : "main-grid";
  var svg = document.createSvg("svg");
  svg.setAttribute("id", id);
  svg.setAttribute("width", pixelsPerSide);
  svg.setAttribute("height", pixelsPerSide);
  svg.setAttribute("viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));

  for(var y = 0; y < numberPerSide; y++) {
    for(var x = 0; x < numberPerSide; x++) {
      var g = document.createSvg("g"); // Group element we want to act as parent
      g.setAttribute("transform", [ "translate(", x * size, ",", y * size, ")" ].join(""));

      var number = numberPerSide * y + x;
      // Create individual cell so we can display it and modify it later
      var box = document.createSvg("rect"); 
      box.setAttribute("width", size);
      box.setAttribute("height", size);
      box.setAttribute("fill", "white");
      box.setAttribute("id", "coord-" + x + "-" + y); 
      box.setAttribute("class", "coord-rect");
      box.setAttribute("stroke", "black"); 
      box.setAttribute("stroke-width", "0.1"); 
      g.appendChild(box);
      svg.appendChild(g);
    }  
  }
  return svg;
};

/**
 * @param {int} size Height / width attribute for inner boxes
 * @param {int} pixelsPerSide Total width and height of the output
 */
var generateGridFromMatrix = function(matrix, size, pixelsPerSide, id) {
  var size = size ? size : 10;
  var pixelsPerSide = pixelsPerSide ? pixelsPerSide : 400;
  var id = id ? id : "main-grid";
  var svg = document.createSvg("svg");
  svg.setAttribute("id", id);
  svg.setAttribute("width", pixelsPerSide);
  svg.setAttribute("height", pixelsPerSide);
  svg.setAttribute("viewBox", [0, 0, matrix.length * size, matrix[0].length * size].join(" "));

  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      var g = document.createSvg("g"); // Group element we want to act as parent
      g.setAttribute("transform", [ "translate(", x * size, ",", y * size, ")" ].join(""));

      var number = matrix.length * y + x;
      // Create individual cell so we can display it and modify it later
      var box = document.createSvg("rect"); 
      box.setAttribute("width", size);
      box.setAttribute("height", size);
      if(matrix[y][x] == 1) {
        box.setAttribute("fill", "grey");
      } else if(matrix[y][x] == "s") {
        box.setAttribute("fill", "blue");
      } else if(matrix[y][x] == "f") {
        box.setAttribute("fill", "green");
      } else {
        box.setAttribute("fill", "white");
      }
      box.setAttribute("id", "coord-" + x + "-" + y); 
      box.setAttribute("class", "coord-rect");
      box.setAttribute("stroke", "black"); 
      box.setAttribute("stroke-width", "0.1"); 
      g.appendChild(box);
      svg.appendChild(g);
    }  
  }
  return svg;
};

/**
 * Prepares a 2d matrix for PathFinding.js
 * Removes Start and Finish ("s", "f") elements
 */
function sanitizeMatrix(matrix) {
  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] != 0 && matrix[y][x] != 1) {
        matrix[y][x] = 0;
      }
    }
  }
  return matrix;
}

/**
 * Finds "s" and "f" inside a 2d matrix, representing start and finish, and returns their coords.
 */
function findStartAndFinish(matrix) {
  var startAndFinish = {
    start: {
      x: false,
      y: false
    },
    finish: {
      x: false, y: false
    }
  };
  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      if(matrix[y][x] === "s") {
        startAndFinish.start.x = x;
        startAndFinish.start.y = y;
      } else if(matrix[y][x] === "f") {
        startAndFinish.finish.x = x;
        startAndFinish.finish.y = y;
      }
    }
  }
  return startAndFinish;
}

function ready() {
  var matrix = [
    [0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 0, 1,   0, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 0, 0,   1, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 1, 0,   1, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 1, "s", 1, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 1, 0,   1, 0, 1, 1,   1, 0, 0, 0, 0 ],
    [0, 0, 0,   1, 0, 0, 0,   0, 0, 1, 0, 0 ],
    [0, 0, 0,   1, 0, 0, 0,   0, 0, 1, 0, 0 ],
    [0, 0, 0,   1, 1, 0, 1, "f", 1, 0, 0, 0 ],
    [0, 0, 0,   1, 0, 1, 0,   1, 0, 0, 0, 0 ],
    [0, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0, 0 ],
    [0, 0, 0,   0, 0, 1, 1,   0, 0, 0, 0, 0 ],
    [0, 0, 0,   0, 0, 1, 1,   0, 0, 0, 0, 0 ],
  ];
  var container = document.getElementById("container");
  container.appendChild(generateGridFromMatrix(matrix));
  var startAndFinish = findStartAndFinish(matrix);
  var polyLine = [];
  var dbgWnd = document.getElementById("debug-out");
  var grid = new PF.Grid(sanitizeMatrix(matrix));
  var finder = new PF.AStarFinder();
  var path = finder.findPath(
    startAndFinish.start.x, startAndFinish.start.y,
    startAndFinish.finish.x, startAndFinish.finish.y, grid);
  for(var i = 0; i < path.length; i++) {
    polyLine.push(getRealBoxCoords(path[i][0], path[i][1], { x: 4, y: 4 }));
  }
  drawVisualPath(polyLine);

  //pathFindingTest();
}

addEventListener("DOMContentLoaded", ready, false);
