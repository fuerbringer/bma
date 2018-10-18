document.createSvg = function(tagName) {
  var svgNS = 'http://www.w3.org/2000/svg'
  return this.createElementNS(svgNS, tagName)
}

var drawVisualPath =  function(pathMatrix, polyId, color, id) {
  var svgId = id ? id : 'main-grid'
  var svgColor = color ? color : 'green'
  var svg = document.getElementById(svgId)
  var polyLine = document.createSvg('polyline')
  var points = ''
  for (var i = 0; i < pathMatrix.length; i++){
    if (pathMatrix[i] instanceof Array){
      if(pathMatrix[i].length == 2) {
        points += pathMatrix[i].join(',')
        points += ' '
      }
    }
  }
  polyLine.setAttribute('points', points)
  polyLine.setAttribute('fill', 'none')
  polyLine.setAttribute('stroke', svgColor)
  polyLine.setAttribute('class', 'grid-path')
  if(polyId) {
    polyLine.setAttribute('id', 'grid-path')
  }
  svg.appendChild(polyLine)
}


/**
 * Delete all paths
 */
var clearVisualPaths = function() {
  var polys = document.getElementsByClassName('grid-path')
  while(polys[0]) {
    polys[0].parentNode.removeChild(polys[0])
  }
}


/**
 * Given a rect#coord-N-N returns the parents <g> translate/transform x and y in an array
 * Example: [0, 16]
 */
var getSvgBoxCoord = function(id) {
  // Assuming base element with id `id` has a parent with an attribute `transform`
  var translate = document.getElementById(id).parentNode.getAttribute('transform')
  var parts = /translate\(\s*([^\s,)]+)[ , ]([^\s,)]+)/.exec(translate)
  return [ parts[1], parts[2] ]
}

/**
 * Provides exact SVG pixel coordinates for a given box' <g> parent element
 * Example:
 *  let f(x) = x
 *  f(5) = x <=> getRealBoxCoords(5,5)
 *  Returns exact pixel coordinates for 5,5
 */
var getRealBoxCoords = function(x, y, centeringOffset) {
  var id = 'coord-' + x + '-' + y
  var offset = centeringOffset ? centeringOffset : { x: 0, y: 0 }
  // Assuming base element with id `id` has a parent with an attribute `transform`
  var translate = document.getElementById(id).parentNode.getAttribute('transform')
  var parts = /translate\(\s*([^\s,)]+)[ , ]([^\s,)]+)/.exec(translate)
  return [ parseInt(parts[1]) + offset.x, parseInt(parts[2]) + offset.y ]
}


/**
 * Example:
 *  // Fills box at 1,1 with red color
 *  setRectAttribute(1, 1, "fill", "red");
 */
var setRectAttribute = function(x, y, name, value) {
  var rect = document.getElementById('coord-' + x + '-' + y)
  rect.setAttribute(name, value)
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
  var rects = document.getElementsByClassName('coord-rect')
  for(var i = 0; i < rects.length; i++) {
    rects[i].setAttribute('fill', 'white')
    rects[i].setAttribute('stroke', 'black') 
    rects[i].setAttribute('stroke-width', '0.1') 
  }
}


/**
 * Resets rect at x,y to its initial state
 */
var resetCoordRect = function(x, y) {
  var rect = document.getElementById('coord-' + x + '-' + y)
  rect.setAttribute('fill', 'white')
  rect.setAttribute('stroke', 'black') 
  rect.setAttribute('stroke-width', '0.1') 
}


/**
 * @param {int} size Height / width attribute for inner boxes
 */
var generateGridFromMatrix = function(matrix, size, id) {
  var innerSize = size ? size : 10
  var gridId = id ? id : 'main-grid'
  var svg = document.createSvg('svg')
  svg.setAttribute('id', gridId)
  svg.setAttribute('viewBox', [0, 0, matrix[0].length * innerSize, matrix.length * innerSize].join(' '))

  for(var y = 0; y < matrix.length; y++) {
    for(var x = 0; x < matrix[y].length; x++) {
      var g = document.createSvg('g') // Group element we want to act as parent
      g.setAttribute('transform', [ 'translate(', x * innerSize, ',', y * innerSize, ')' ].join(''))

      // Create individual cell so we can display it and modify it later
      var box = document.createSvg('rect') 
      box.setAttribute('width', innerSize)
      box.setAttribute('height', innerSize)
      if(matrix[y][x] == 1) {
        box.setAttribute('fill', 'grey')
      } else if(matrix[y][x] == 's') {
        box.setAttribute('fill', 'blue')
      } else if(matrix[y][x] == 'f') {
        box.setAttribute('fill', 'green')
      } else {
        box.setAttribute('fill', 'white')
      }
      box.setAttribute('id', 'coord-' + x + '-' + y) 
      box.setAttribute('class', 'coord-rect')
      box.setAttribute('stroke', 'black') 
      box.setAttribute('stroke-width', '0.1') 
      g.appendChild(box)
      if(y == 0) {
        var txtForY = document.createSvg('text') 
        txtForY.setAttribute('x', 0)
        txtForY.setAttribute('y', innerSize)
        txtForY.setAttribute('font-family', 'Times New Roman')
        txtForY.setAttribute('font-size', '8')
        txtForY.setAttribute('fill', 'darkslategray')
        txtForY.textContent = x
        g.appendChild(txtForY)
      } else if(x == 0) {
        var txtForX = document.createSvg('text') 
        txtForX.setAttribute('x', 0)
        txtForX.setAttribute('y', innerSize)
        txtForX.setAttribute('font-family', 'Times New Roman')
        txtForX.setAttribute('font-size', '8')
        txtForX.setAttribute('fill', 'darkslategray')
        txtForX.textContent = y
        g.appendChild(txtForX)
      }
      svg.appendChild(g)
    }  
  }
  return svg
}


module.exports = {
  drawVisualPath,
  clearVisualPaths,
  getSvgBoxCoord,
  getRealBoxCoords,
  setRectAttribute,
  resetAllCoordRects,
  resetCoordRect,
  generateGridFromMatrix
}
