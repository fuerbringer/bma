var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BMA' })
})

router.get('/pathfinder', function(req, res) {
  res.render('pathfinder', { title: 'Pathfinder', query: req.query })
})

router.get('/credits', function(req, res) {
  res.render('credits', { title: 'Autoren' })
})

module.exports = router
