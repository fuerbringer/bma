/**
 * TODO: Write functions to operate on the grid created in generateGrid
 */

document.createSvg = function(tagName) {
  var svgNS = "http://www.w3.org/2000/svg";
  return this.createElementNS(svgNS, tagName);
};

/**
 * @param {int} numberPerSide Sizes for x and y axis
 * @param {int} size Height / width attribute for inner boxes
 * @param {int} pixelsPerSide Total width and height of the output
 */
var generateGrid = function(numberPerSide, size, pixelsPerSide) {
  var numberPerSide = numberPerSide ? numberPerSide : 20;
  var size = size ? size : 10;
  var pixelsPerSide = pixelsPerSide ? pixelsPerSide : 400;
  var svg = document.createSvg("svg");
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
      box.setAttribute("stroke", "black"); 
      box.setAttribute("stroke-width", "0.1"); 
      g.appendChild(box);
      svg.appendChild(g);
    }  
  }
  return svg;
};

/**
 * Demo function for PathFinding.js
 */
function pathFindingTest() {
  var dbgWnd = document.getElementById("debug-out");
  var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
  ];
  dbgWnd.innerHTML += "Gegeben ist die matrix: \n";
  dbgWnd.innerHTML += matrix[0].toString() + "\n";
  dbgWnd.innerHTML += matrix[1].toString() + "\n";
  dbgWnd.innerHTML += matrix[2].toString() + "\n";
  var grid = new PF.Grid(matrix);
  var finder = new PF.AStarFinder();
  dbgWnd.innerHTML += "Nun wird der Weg von {1,2} zu {4,2} mittels A* gesucht: \n";
  var path = finder.findPath(1, 2, 4, 2, grid);
  path.forEach(p => {
    dbgWnd.innerHTML += p.toString() + "\n";
  })
}

function ready() {
  var container = document.getElementById("container");
  container.appendChild(generateGrid(16, 16, 512));

  pathFindingTest();
}

addEventListener("DOMContentLoaded", ready, false);
