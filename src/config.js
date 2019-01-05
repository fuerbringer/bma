const pathFinding = require('./pathfinding.js')

module.exports = {
  selectedPathfinders: [
    pathFinding.AStarFinder,
    pathFinding.BestFirstFinder,
    pathFinding.BreadthFirstFinder
  ],
  selectedPathfinderNames: [
    'AStarFinder',
    'BestFirstFinder',
    'BreadthFirstFinder'
  ],
  /**
   * Visual settings used for SVGs and such
   */
  grid: {
    pathFinderColors: [
      '#010067',
      '#ff0056',
      '#00ff00',
      '#005f39',
      '#ffe502',
      '#95003a',
      '#ff937e',
      '#d5ff00',
      '#9e008e',
      ,
    ],
    polyLineColor: '#0e4ca1',
    boxStroke: 'black',
    boxFill: 'white',
    boxFillStart: '#0075DC',
    boxFillFinish: '#2BCE48',
    boxFillWall: 'grey',
    boxStrokeWidth: '0.075',
    boxCustomWaypoint: 'red',
    textFontSize: '6',
    textFontFamily: 'sans-serif',
    textFontColor: 'black'
  }
}
