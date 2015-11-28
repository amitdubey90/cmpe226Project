var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('adminDashBoard');
});

router.get('/customerInfo', function(req, res, next) {

console.log("asdsadsadsadsadsadsa");
 console.log("sadsdada"+res[0]);

  res.render('customerInfo');
});

module.exports = router;
