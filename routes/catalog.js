var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var catalog = mongoose.model('catalogs');

/* Remove when testing is complete */
router.get('/', function(req, res, next) {
  res.json("hello world from catalog");
});


router.get('/category/:category', function(req, res, next) {
	catalog.find({ "category" : req.param('category')}, {'productName' :1 , 'shortDesc': 1 , 'price' : 1} ,
		function(err, data){
				if (err) { return next(err); }
	   			if (!data) { return next(new Error("can't find products in category")); }
			   	
			    res.json(data);
			});
});

router.get('/product/:productId', function(req, res, next) {
	catalog.findById(req.param('productId'), 
		function(err, data) {
			if (err) { return next(err); }
	   			if (!data) { return next(new Error("can't find product")); }
			   
			    res.json(data);
		});
});

module.exports = router;