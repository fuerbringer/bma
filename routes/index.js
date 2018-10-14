var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BMA' });
});

router.get('/pathfinder/a-star', function(req, res, next) {
  res.render('a-star', { title: 'A* Pathfinder' });
});

module.exports = router;
