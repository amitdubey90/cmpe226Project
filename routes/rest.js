var mysql = require("mysql");
var express = require('express');
var app = express.Router();

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

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

app.get('/', function(req,res) {
  res.json("hello world from catalog");
});

app.get('/customerDetails/:customerId', function(req,res){ 
    connection.query("select * from customers where CustomerId='"+req.param('customerId')+"'", function (err,result) {  
        if(err){
            throw err;
        }
        else{
        res.json(result);
        }                    
    });
});

app.get('/customerorders/:customerId', function(req,res){ 
    connection.query("select * from orders where CustomerId="+req.params('customerId')+"", function (err,result) {  
         if(err){
            throw err;
        }
        else{
        res.json(result);
        }                  
    });
});

app.get('/orderdetails/:orderId', function(req,res){
	connection.query("select order from orderdetails where OrderId="+req.params('orderId')+"", function (err,result) {  
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

var idColName;
var tableName;

var maxId=function(callback){
    var query='select max('+idColName+') as lavda from '+tableName+'';
    connection.query(query,function(err, result){
                    console.log(query);
                    callback(err,result);

    });
}

var savePaymentId=function(payId,payType,payStatus){
    console.log(payId);
    console.log(payType);
    console.log(payStatus);

    connection.query("INSERT INTO payment VALUES(?,?,?)",[payId,payType,payStatus],function(err){
                    if(err){
                        throw err;
                            }
                    else{
                        return;
                    }  

    });
}

var saveOrderDetails=function(oId,cId,pId,oDate,sDate,pend){
    connection.query("INSERT INTO orders VALUES(?,?,?,?,?,?,?)",[oId,cId,pId,oDate,sDate,pend,23653],function(err){
                    if(err){
                        throw err;
                            }
                    else{
                        return;
                    }  
    });
}

var saveOrders=function(oId,pId,price,quan){
    connection.query("INSERT INTO orderdetails VALUES(?,?,?,?)",[oId,pId,price,quan],function(err){
            if(err){
                throw err;
            }
            else{
                return;
            }
        });
}

var addOrder = function(queryString, callback)
{

    connection.query(queryString, function(err, result)
    {
        if (err)
        {
            console.log("ERROR : " + err);
        }
        else
        {
            callback(result);
        }
    });
};

function addPayment(query,arr,callback)
{
    connection.query(query,arr,function(err, result)
    {
        if (err) 
            callback(err,null);
        else
            callback(null,result.insertId);

    });

};

function addOrders(query,arr,callback)
{
    connection.query(query,arr, function(err, result)
    {
        console.log(arr);
        if (err) 
            callback(err,null);
        else
            callback(null,result.insertId);

    });

};

function addOrderDetails(query,arr,callback)
{
    connection.query(query,arr, function(err, result)
    {
        console.log(arr);
        if (err) 
            callback(err,null);
        else
            callback(null,result.insertId);

    });

};

/*
 * POST to add order.
 */
var payId;
app.post('/addorder', function(req, res) {
    console.log(req);

    var orderDate= new Date();
    var shippingDate= new Date() + 2;
    var customerId = req.body.customerId;
    var productId = req.body.productId;
    var quanity = req.body.quantity;
    var totalprice = req.body.price;
    var pending="Pending";
    var paymentType=req.body.paymenttype;

    console.log(paymentType);
    console.log(customerId);

    var paymentQuery="INSERT INTO payment(PaymentType, PaymentApproved) VALUES(?,?)";
    var orderQuery="INSERT INTO orders(CustomerId, PaymentId, OrderDate, ShippingDate, OrderStatus, ShipperId) VALUES(?,?,?,?,?,?)";
    var orderDetailsQuery="INSERT INTO orderdetails(OrderId, ProductId, TotalPrice, Quantity) VALUES(?,?,?,?)";
    addPayment(paymentQuery,[paymentType,1],function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);            
        } else {
            console.log(data);
            addOrders(orderQuery,[customerId,data,orderDate,shippingDate,pending,1],function(err,data1){
                 if (err) {
                     // error handling code goes here
                     console.log("ERROR : ",err);            
                 } else {            
                    console.log(data1);
                        addOrderDetails(orderDetailsQuery,[data1,productId,totalprice,quanity],function(err,data1){
                            if (err) {
                                 // error handling code goes here
                                console.log("ERROR : ",err);            
                             } else {            
                                     console.log(data1);

                             } 
                        });
                 } 
        });
        } 

    });
    
    //savePaymentId(idtouse,"Credit",1);
    //saveOrderDetails(maxId("OrderId","orders")+1,customerId,productId,orderDate,shippingDate,pending);
    //saveOrders(maxId("OrderId","orders"),productId,totalprice,quanity);

    //res.json(maxId("OrderId","orders"));
    res.json("ok");
    
});

module.exports = app;