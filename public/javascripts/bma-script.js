/* Tiny grid demo, should come in handy */
/* TODO AND WARNING: Needs some serious cleanup and modularization before moving on */

document.createSvg = function(tagName) {
  var svgNS = "http://www.w3.org/2000/svg";
  return this.createElementNS(svgNS, tagName);
};

var grid = function(numberPerSide, size, pixelsPerSide, colors) {
  var numberPerSide = numberPerSide ? numberPerSide : 20;
  var size = size ? size : 10;
  var pixelsPerSide = pixelsPerSide ? pixelsPerSide : 400;
  var svg = document.createSvg("svg");
  svg.setAttribute("width", pixelsPerSide);
  svg.setAttribute("height", pixelsPerSide);
  svg.setAttribute("viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));

  for(var i = 0; i < numberPerSide; i++) {
    for(var j = 0; j < numberPerSide; j++) {
      // Alternate colors, if "colors" has array-size n > 1
      var color1 = colors[(i+j) % colors.length];
      var color2 = colors[(i+j+1) % colors.length];  

      var g = document.createSvg("g");
      g.setAttribute("transform", ["translate(", j*size, ",", i*size, ")"].join(""));

      var number = numberPerSide * i + j;
      var box = document.createSvg("rect");
      box.setAttribute("width", size);
      box.setAttribute("height", size);
      if(Math.round(10 * Math.random()) % 4 == 0) {
        box.setAttribute("fill", "grey");
      } else {
        box.setAttribute("fill", color1);
      }
      box.setAttribute("id", "coord-" + j + "-" + i); 
      box.setAttribute("stroke", "black"); 
      box.setAttribute("stroke-width", "0.1"); 
      g.appendChild(box);
      svg.appendChild(g);
    }  
  }
  svg.addEventListener( "click", function(e){
    var id = e.target.id;
    if(id) {
      alert("Clicked tile " + id);
    }
    }, false);
  return svg;
};

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
  container.appendChild(grid(16, 16, 512, ["white"/*, "blue"*/]));
    pathFindingTest();
}

addEventListener("DOMContentLoaded", ready, false);
