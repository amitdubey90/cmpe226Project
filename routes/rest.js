var mysql = require("mysql");
var express = require('express');
var app = express.Router();

connection = mysql.createPool({
        host     : 'cmpe226.cpodi2zqj9hl.us-east-1.rds.amazonaws.com',
        user     : 'cmpe226',
        password : 'project226',
        database : 'cmpe226'
    });

var data = {
        "error":1
    };

app.get('/', function(req,res) {
  res.json("hello world from catalog");
});

app.get('/customerDetails/:customerId', function(req,res){ 
    connection.query("select customer from customers where CustomerId="+req.param('customerId')+"", function (err,result) {  
        if(!err){
            json = JSON.stringify(results);
            res(json);
        }else{
            data["error"] = 'No customer Found..';
            res.json(data);
        }                     
    });
});

app.get('/customerorders/:customerId', function(req,res){ 
    connection.query("select * from orders where CustomerId="+customerId+"", function (err,result) {  
         if(!err){
            json = JSON.stringify(results);
            res(json);
        }else{
            data["error"] = 'No orders Found..';
            res.json(data);
        }                     
    });
});

app.get('/orderdetails/:orderId', function(req,res){
	connection.query("select order from orderdetails where OrderId="+orderId+"", function (err,result) {  
         if(!err){
            json = JSON.stringify(results);
            res(json);
        }else{
            data["error"] = 'No order details Found..';
            res.json(data);
        }                     
    });
});

app.post('/purchaseorder/', function(req,res){
	
});

module.exports = app;