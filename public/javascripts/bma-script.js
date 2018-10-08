document.createSvg = function(tagName) {
  var svgNS = "http://www.w3.org/2000/svg";
  return this.createElementNS(svgNS, tagName);
};

function randomIntFromInterval(min,max)
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

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

generatePseudoRandomMaze = function(width, height, remainderFrequency) {
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

markStartAndFinish = function(matrix, randomSelection) {
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
generateRecBacktrackerMaze = function(width, height, randomStartAndFinish) {
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
  var start = corridors[randomIntFromInterval(0, corridors.length - 1)];
  var finish = corridors[randomIntFromInterval(0, corridors.length - 1)];
  console.log(start, finish)
  matrix[start.y][start.x] = 's';
  matrix[finish.y][finish.x] = 'f';
  matrix[0][0] = 1; // Patch wall at (0,0)
  return matrix;
}

function ready() {
  //console.debug(generateRecBacktrackerMaze(6, 6));
  //var matrix = generatePseudoRandomMaze(20, 20);
  var matrix = generateRecBacktrackerMaze(24, 24, false);
  var container = document.getElementById("container");
  container.appendChild(generateGridFromMatrix(matrix));
  var startAndFinish = findStartAndFinish(matrix);
  var polyLine = [];
  var dbgWnd = document.getElementById("debug-out");
  var grid = new PF.Grid(sanitizeMatrix(matrix));
  var finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
    heuristic: function(dx, dy) {
      // Tap into individual steps
      console.log("Considering", dx, dy);
      return PF.Heuristic.chebyshev(dx, dy);
    }
  });
  var path = finder.findPath(
    startAndFinish.start.x, startAndFinish.start.y,
    startAndFinish.finish.x, startAndFinish.finish.y, grid);
  for(var i = 0; i < path.length; i++) {
    polyLine.push(getRealBoxCoords(path[i][0], path[i][1], { x: 4, y: 4 }));
  }
  drawVisualPath(polyLine);
}

addEventListener("DOMContentLoaded", ready, false);
