var presetGrids = require('./preset-grids.js')

var addPresetGrids = function(selected) {
  var optionsObj = presetGrids;
  optionsObj['recbacktracker'] = 'generator'
  optionsObj['random'] = 'generator'
  var options = Object.entries(optionsObj)
  for(let [key, val] of options) {
    var option = document.createElement('option')
    option.setAttribute('value', key)
    if(val != 'generator') {
      option.appendChild(document.createTextNode(`${key} (Vorgefertigt *)`))
    } else {
      option.appendChild(document.createTextNode(`${key} (Generator)`))
    }
    if(selected == key) {
      option.setAttribute('selected', 'selected')
    } else if(!selected && key == 'recbacktracker') {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-type').appendChild(option)
  }
}

var addAlgorithmTypes = function(selected) {
  var available = [
    'AStarFinder',
    'DijkstraFinder'
  ]
  for(var i = 0; i < available.length; i++) {
    var algo = available[i]
    var option = document.createElement('option')
    option.setAttribute('value', algo)
    option.appendChild(document.createTextNode(algo))
    if(selected == algo) {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-algorithm').appendChild(option)
  }
}

module.exports = {
  addPresetGrids,
  addAlgorithmTypes
}
