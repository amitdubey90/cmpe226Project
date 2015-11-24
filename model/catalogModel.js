var mongoose = require('mongoose');

var productDetailSchema = new mongoose.Schema({
	productName: String,
	category : String,
  	identifier : String,
  	shortDesc: String,
  	price: Number,
  	imageUrl :  String,
  	details : [mongoose.Schema.Types.Mixed]
});

mongoose.model('catalogs', productDetailSchema);