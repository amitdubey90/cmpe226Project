var mongoose = require('mongoose');

var productDetailSchema = new mongoose.Schema({
	productName: String,
	category : String,
  	identifier : String,
  	shortDesc: String,
  	price: Number,
  	details : [mongoose.Schema.Types.Mixed]
});

mongoose.model('productcatalogs', productDetailSchema);