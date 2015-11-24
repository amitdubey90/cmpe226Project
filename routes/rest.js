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

/*
 * POST to add order.
 */
app.post('/addorder', function(req, res) {
    var orderId = guid();
    //var paymentId= guid();
    var orderDate= new Date();
    var shippingDate= new Date() + 2;
    var customerId = req.body.customerId;
    var productId = req.body.productId;
    var quanity = req.body.quanity;
    var totalprice = req.body.price;
    var pending="Pending";
    var paymentType=req.body.paymenttype;

    maxId();
    console.log(id);
    //savePaymentId(idtouse,"Credit",1);
    //saveOrderDetails(maxId("OrderId","orders")+1,customerId,productId,orderDate,shippingDate,pending);
    //saveOrders(maxId("OrderId","orders"),productId,totalprice,quanity);

    //res.json(maxId("OrderId","orders"));
    res.json("ok");
    
});

module.exports = app;