const presetGrids = require('./preset-grids.js')
const grid = require('./grid.js')
const pathFinding = require('./pathfinding.js')


/**
 * Update text status in the #stat-* elements
 * @param {Object} options - Object containing key->values for status
 */
const setStatus = options => {
  if(options.hasOwnProperty('startAndFinish')) {
    document.getElementById('stat-start').innerHTML
      = 'S(' + options.startAndFinish.start.x + ', ' + options.startAndFinish.start.y + ')'
    document.getElementById('stat-end').innerHTML
      = 'F(' + options.startAndFinish.finish.x + ', ' + options.startAndFinish.finish.y + ')'
  }
  if(options.hasOwnProperty('distance')) {
    if(options.distance > 0) {
      document.getElementById('stat-distance').innerHTML = options.distance + (options.distance == 1 ? ' Zelle' : ' Zellen')
    } else {
      document.getElementById('stat-distance').innerHTML = '0 Zellen (Weg nicht möglich)'
    }
  }
  if(options.hasOwnProperty('algorithm')) {
    document.getElementById('stat-algorithm').innerHTML = options.algorithm
    if(options.hasOwnProperty('heuristics')) {
      const heuristic = options.heuristics.charAt(0).toUpperCase() + options.heuristics.slice(1)
      document.getElementById('stat-algorithm').innerHTML += ` (${heuristic} Heuristik)`
    }
  }
  if(options.hasOwnProperty('elapsedTime')) {
    if(options.elapsedTime > 0) {
      document.getElementById('stat-elapsed-time').innerHTML = `${options.elapsedTime} ms`
    } else {
      document.getElementById('stat-elapsed-time').innerHTML = '< 0 ms'
    }
  }
  if(options.hasOwnProperty('heuristicsCount')) {
    document.getElementById('stat-heuristics').innerHTML = `${options.heuristicsCount} Zellen`
    if(options.hasOwnProperty('totalCells')) {
      // How many % of the cells have been heuristically analyzed
      const percentHeuristics = (options.heuristicsCount / options.totalCells) * 100
      document.getElementById('stat-heuristics').innerHTML += ` (${percentHeuristics.toFixed(2)}%)`
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
    const keyTxt = key.charAt(0).toUpperCase() + key.slice(1)
    if(val != 'generator') {
      option.appendChild(document.createTextNode(`${keyTxt} (Vorgefertigt ²)`))
    } else {
      option.appendChild(document.createTextNode(`${keyTxt} (Generator)`))
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
 * Append Heuristic methods provided by PathFinding.js as options to dropdown
 */
const addHeuristics = selected => {
  let heuristics = [ 'keine' ]
  for(let property in pathFinding.Heuristic) {
    if(property && pathFinding.Heuristic.hasOwnProperty(property)) {
      heuristics.push(property)
    }
  }
  for(let i = 0; i < heuristics.length; i++) {
    const heuristic = heuristics[i]
    const option = document.createElement('option')
    option.setAttribute('value', heuristic)
    option.appendChild(document.createTextNode(heuristic.charAt(0).toUpperCase() + heuristic.slice(1)))
    if(selected == heuristic) {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-heuristic').appendChild(option)
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
  addHeuristics,
  handleHeuristicsToggle
}
