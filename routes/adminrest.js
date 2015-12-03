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

connectionStar = mysql.createPool({
        host     : 'cmpe226.cpodi2zqj9hl.us-east-1.rds.amazonaws.com',
        user     : 'cmpe226',
        password : 'project226',
        database : 'cmpe226star',
        multipleStatements: true
    });


var data = {
        "error":1
    };

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



app.get('/admin/salesAnalytics', function(req,res){ 



        var query="SELECT CategoryKey, COUNT(*) AS `num` FROM sales_fact_table GROUP BY CategoryKey order by CategoryKey asc";


    connectionStar.query(query, function (err,result) {  
        if(err){
            throw err;
        }
        else{
            console.log(result[2].num+"asdasd");
        res.render('salesAnalytics',{data: result});
        }                    
    });
});


app.get('/admin/salesZipcode', function(req,res){ 



        var query="select * from (Select SUM(SF.TotalSales) as 'sales', C.CustomerZipCode from sales_fact_table SF, customer C where C.CustomerKey= SF.CustomerKey  GROUP BY C.CustomerZipCode) as T order by T.sales desc limit 5 ";


    connectionStar.query(query, function (err,result) {  
        if(err){
            throw err;
        }
        else{
           // console.log(result[2].CustomerZipCode+"asdasd");
        // res.render('salesZipcode',{data: result});
        res.json(result)
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

/* Admin home page */
app.get('/home', function(req, res) {

    res.render('adminDashboard')
});

app.get('/getMonthlySales', function(req, res) {
    console.log("fetchig sales data")

    var query = "select totalSales, saleDate from cmpe226star.sales_fact_table where year(saleDate) = year(CURDATE()) order by saleDate ";
    connection.query(query, function (err,result) {  
         if(err){
            console.log(err);
            throw err;
        }
        else{
            response = [];
            for (i = 0; i < result.length; i++) {
                temp = [];
                //temp.push(Date.UTC(2012, 2, 6, 10), Math.floor((Math.random() * 10) + 1));
                var d = new Date(Date.parse(result[i].saleDate));
                
                temp.push(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 10), result[i].totalSales);
                response.push(temp);
            }
            res.json(response);
        }                    
    });
});


var resdata={
    "response":1
}


app.get('/sales/getQuarterlySales', function(req,res){
    sqlQuery = "SELECT QUARTER(SaleDate) AS quarter, SUM(UnitsSold) "+
                        "AS unitsSold FROM sales_fact_table  where year(saleDate) = year(CURDATE())"+
                        " GROUP BY YEAR(SaleDate), QUARTER(SaleDate)";
    connectionStar.query(sqlQuery, function (err,result) {  
         if(err){
            throw err;
        }
        else{
        res.json(result);
    }  //res.render('drill');
    });
});

    app.get('/sales/drillForQuarter/', function(req,res){

        sqlQuery = "SELECT MONTH(SaleDate) AS Month, SUM(UnitsSold) AS unitsSold FROM sales_fact_table"+
        " GROUP BY YEAR(SaleDate), MONTH(SaleDate)";
        connectionStar.query(sqlQuery, function (err,result) {  
           if(err){
            throw err;
        }
        else{
            res.json(result);
        }                    
        });
    });

app.post('/admin/pivot', function(req,res){

        console.log("************ ");
        var verb=req.body.pivot;
        console.log("************ "+verb);

        if(verb=="normal"){

        connectionStar.query("Select year(SaleDate) as year, MONTHNAME(SaleDate) as month, sum(UnitsSold) as TotalSold from sales_fact_table group by year(SaleDate), "+
                                        "Month(SaleDate);", function (err,result) {  
             if(err){
                throw err;
                }
            else{
                res.json(result);
                }                    
        });
        }
        else if(verb=="pivoted"){
                connectionStar.query("SELECT Year, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, `Dec` "+
                        "FROM ( SELECT year(SaleDate) AS 'Year', Sum(If( Month(SaleDate)= 1, UnitsSold, 0 )) AS Jan, "+
                            "Sum(If( Month(SaleDate)= 2, UnitsSold, 0 )) AS Feb, Sum(If( Month(SaleDate)= 3, UnitsSold, 0 )) AS Mar, "+
                            "Sum(If( Month(SaleDate)= 4, UnitsSold, 0 )) AS Apr, Sum(If( Month(SaleDate)= 5, UnitsSold, 0 )) AS May, "+ 
                            "Sum(If( Month(SaleDate)= 6, UnitsSold, 0 )) AS Jun, Sum(If( Month(SaleDate)= 7, UnitsSold, 0 )) AS Jul, "+ 
                            "Sum(If( Month(SaleDate)= 8, UnitsSold, 0 )) AS Aug, Sum(If( Month(SaleDate)= 9, UnitsSold, 0 )) AS Sep, "+ 
                            "Sum(If( Month(SaleDate)=10, UnitsSold, 0 )) AS Oct, Sum(If( Month(SaleDate)=11, UnitsSold, 0 )) AS Nov, "+
                            "Sum(If( Month(SaleDate)=12, UnitsSold, 0 )) AS `Dec` FROM sales_fact_table GROUP BY year) AS sums", function (err,result) {  
                                     if(err){
                                        throw err;
                                        }
                                    else{
                                        res.json(result);
                                        }                    
                                });
                                }

    
});

app.post('/admin/slicedice', function(req,res){

        console.log("************ ");
        var verb=req.body.actionVerb;
        console.log("************ "+verb);

        if(verb=="slice"){

        connectionStar.query("Select * from purchase_fact_table where CategoryKey in ('1' ,'4')  ORDER BY `TotalUnitsPurchased` ASC", function (err,result) {  
             if(err){
                throw err;
                }
            else{
                res.json(result);
                }                    
        });
        }
        else if(verb=="dice"){
                connectionStar.query("Select  * from purchase_fact_table where CategoryKey in ('1', '3') and SupplierKey in ('1', '3')  and ProductKey in ('1', '3') ORDER BY `TotalUnitsPurchased` ASC", function (err,result) {  
                                     if(err){
                                        throw err;
                                        }
                                    else{
                                        res.json(result);
                                        }                    
                                });
                                }

    
});

module.exports = app;