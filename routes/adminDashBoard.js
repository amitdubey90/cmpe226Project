var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('adminDashBoard');
});

router.get('/customerInfo', function(req, res, next) {

console.log("customerInfo");
 console.log("sadsdada"+res[0]);

  res.render('customerInfo');
});

router.get('/orderInfo', function(req, res, next) {

console.log("orderInfo");
 console.log("sadsdada"+res[0]);

  res.render('orderInfo');
});

router.get('/productInfo', function(req, res, next) {

console.log("productInfo");
 console.log("productInfo"+res[0]);

  res.render('productInfo');
});

module.exports = router;
