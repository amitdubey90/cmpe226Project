var mysql = require("mysql");
var express = require('express');
var app = express.Router();

connection = mysql.createPool({
        host     : 'cmpe226.cpodi2zqj9hl.us-east-1.rds.amazonaws.com',
        user     : 'cmpe226',
        password : 'project226',
        database : 'cmpe226',
        multipleStatements: true
    });

var data = {
        "error":1
    };

app.get('/admin', function(req,res) {
  res.json("hello world from catalog");
});

app.get('/admin/orders', function(req,res){ 

    var query="SELECT orders.OrderId, OrderDate, ShippingDate, OrderStatus,ProductId, TotalPrice, Quantity from orders, orderdetails where orders.OrderId = orderdetails.OrderId;";
    connection.query(query, function (err,result) {  
        if(err){
            throw err;
        }
        else{
        res.json(result);
        }                    
    });
});

app.get('/admin/customers', function(req,res){ 
    connection.query("select * from customers", function (err,result) {  
         if(err){
            throw err;
        }
        else{
        res.json(result);
        }                  
    });
});

app.get('/admin/products', function(req,res){
	connection.query("select * from products", function (err,result) {  
         if(err){
            throw err;
        }
        else{
        res.json(result);
        }                    
    });
});

var resdata={
    "response":1
}

module.exports = app;