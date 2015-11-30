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

    //var query="SELECT orders.OrderId, OrderDate, ShippingDate, OrderStatus,ProductId, TotalPrice, Quantity from orders, orderdetails where orders.OrderId = orderdetails.OrderId;";

  /* var query=  "SELECT o.orderId, o.OrderDate, o.ShippingDate, o.OrderStatus, p.ProductName, p.productDesc, c.CategoryName "+
            "FROM orders o INNER JOIN orderdetails od ON o.OrderId = od.orderId INNER JOIN products p ON od.ProductId = p.ProductId "+
            "INNER JOIN category c ON p.CategoryId = c.CategoryId";*/

        var query=    "SELECT o.OrderId, od.ProductId, od.Quantity, od.TotalPrice, o.OrderDate, o.ShippingDate, o.orderStatus, o.PaymentId, c.CustomerId, "+
            "s.ShipperId FROM customers c INNER JOIN orders o ON o.CustomerId = c.CustomerId "+
            "INNER JOIN shippers s ON o.ShipperId = s.ShipperId "+ "INNER JOIN orderdetails od on o.orderId=od.orderId"


    connection.query(query, function (err,result) {  
        if(err){
            throw err;
        }
        else{
        res.render('orderInformation',{data: result});
        }                    
    });
});

app.get('/admin/customers', function(req,res){ 
    connection.query("select * from customers", function (err,result) {  
         if(err){
            throw err;
        }
        else{
        //res.json(result);
        console.log("bazar"+JSON.stringify(result));
        res.render('customerInfo',{data: result});
        }                  
    });
});

app.get('/admin/products', function(req,res){

    var query="select p.ProductId, p.ProductName, p.ProductDesc, p.Price, c.CategoryName, c.Description from products p INNER JOIN category c on p.CategoryId=c.CategoryId";
	connection.query(query, function (err,result) {  
         if(err){
            throw err;
        }
        else{
        res.render('productInformation',{data: result});
        }                    
    });
});

var resdata={
    "response":1
}

module.exports = app;