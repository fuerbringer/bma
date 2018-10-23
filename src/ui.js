const presetGrids = require('./preset-grids.js')
const grid = require('./grid.js')


/**
 * Update text status in the #stat-* elements
 * @param {Object} options - Object containing key->values for status
 */
const setStatus = options => {
  if(options.hasOwnProperty('startAndFinish')) {
    document.getElementById('stat-start').innerHTML
      = '`S(' + options.startAndFinish.start.x + ', ' + options.startAndFinish.start.y + ')`'
    document.getElementById('stat-end').innerHTML
      = '`F(' + options.startAndFinish.finish.x + ', ' + options.startAndFinish.finish.y + ')`'
  }
  if(options.hasOwnProperty('distance')) {
    if(options.distance > 0) {
      document.getElementById('stat-distance').innerHTML = '`'
        + options.distance
        + (options.distance == 1 ? '` Zelle' : '` Zellen')
    } else {
      document.getElementById('stat-distance').innerHTML = '`0` Zellen (Weg nicht möglich)'
    }
  }
  if(options.hasOwnProperty('algorithm')) {
    document.getElementById('stat-algorithm').innerHTML = options.algorithm
  }
  if(options.hasOwnProperty('elapsedTime')) {
    if(options.elapsedTime > 0) {
      document.getElementById('stat-elapsed-time').innerHTML = `\`${options.elapsedTime} ms\``
    } else {
      document.getElementById('stat-elapsed-time').innerHTML = '`< 0 ms`'
    }
  }
  if(options.hasOwnProperty('heuristics')) {
    document.getElementById('stat-heuristics').innerHTML = `\`${options.heuristics}\` Zellen`
    if(options.hasOwnProperty('totalCells')) {
      // How many % of the cells have been heuristically analyzed
      const percentHeuristics = (options.heuristics / options.totalCells) * 100
      document.getElementById('stat-heuristics').innerHTML += ` \`(${percentHeuristics.toFixed(2)}%)\``
    }
  }
}


/**
 * Add preset grids as option to the select/dropdown field of grid generators
 * @param {String} selected - name of the already selected option
 */
const addPresetGrids = selected => {
  let optionsObj = presetGrids; {
    optionsObj['recbacktracker'] = 'generator'
    optionsObj['random'] = 'generator'
  }
  const options = Object.entries(optionsObj)
  for(let [key, val] of options) {
    const option = document.createElement('option')
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


/**
 * Add algorithm (pathfinder) types as option to the select/dropdown field of pathfinders
 * @param {String} selected - name of the already selected option
 */
const addAlgorithmTypes = selected => {
  const available = [
    'AStarFinder',
    'DijkstraFinder'
  ]
  for(let i = 0; i < available.length; i++) {
    const algo = available[i]
    const option = document.createElement('option')
    option.setAttribute('value', algo)
    option.appendChild(document.createTextNode(algo))
    if(selected == algo) {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-algorithm').appendChild(option)
  }
}


/**
 * Handle toggling of button for heuristically marked cells
 * @param {Array} matrix - 2d array
 * @param {Array} heuristics - Array of objects in the form of {x: x, y: y}
 */
const handleHeuristicsToggle = (matrix, heuristics, buttonId = 'toggle-heuristics') => {
  document.getElementById(buttonId).addEventListener('click', function() {
    const toggledClass = 'toggled'
    if (this.classList.contains(toggledClass)) {
      grid.unmarkCellHeuristics(matrix)
    } else {
      grid.markCellHeuristics(heuristics)
    }
    this.classList.toggle(toggledClass);
  }, false);
}


module.exports = {
  setStatus,
  addPresetGrids,
  addAlgorithmTypes,
  handleHeuristicsToggle
}
