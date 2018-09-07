/* Tiny grid demo, should come in handy */
/* Needs some serious modularization before moving on */

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

  for(var i = 0; i < numberPerSide; i++) {    // x-axis
    for(var j = 0; j < numberPerSide; j++) {  // y-axis
      // Alternate colors, if "colors" has array-size n > 1
      var color1 = colors[(i+j) % colors.length];
      var color2 = colors[(i+j+1) % colors.length];  

      var g = document.createSvg("g");
      g.setAttribute("transform", ["translate(", i*size, ",", j*size, ")"].join(""));

      var number = numberPerSide * i + j;
      var box = document.createSvg("rect");
      box.setAttribute("width", size);
      box.setAttribute("height", size);
      box.setAttribute("fill", color1);
      box.setAttribute("id", "b" + number); 
      box.setAttribute("stroke", "black"); 
      box.setAttribute("stroke-width", "0.1"); 
      g.appendChild(box);

      var text = document.createSvg("text");
      text.appendChild(document.createTextNode(i * numberPerSide + j));
      text.setAttribute("fill", colors.length > 1 ? color2 : "black");
      text.setAttribute("font-size", 6);
      text.setAttribute("x", 0);
      text.setAttribute("y", size/2);
      text.setAttribute("id", "t" + number);
      g.appendChild(text);
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

function ready() {
  var container = document.getElementById("container");
  container.appendChild(grid(10, 10, 1000, ["white"/*, "blue"*/]));
}

addEventListener("DOMContentLoaded", ready, false);
