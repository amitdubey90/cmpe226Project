var express = require('express');
var router = express.Router();
var apptitle = 'Ecommerce App Cmpe226';
var id;

// SQL
var mysql = require('mysql');  
var DB_NAME = 'cmpe226';  
  
var connection  = mysql.createPool({  
    host     : 'cmpe226.cpodi2zqj9hl.us-east-1.rds.amazonaws.com',  
    user     : 'cmpe226',  
    password : 'project226',
    port:3306  
});  
var connection1  = mysql.createPool({  
    host     : 'cmpe226.cpodi2zqj9hl.us-east-1.rds.amazonaws.com',  
    user     : 'cmpe226',  
    password : 'project226',
    port:3306  
});  
connection.query('USE ' + DB_NAME,function(err){
    if(err)
        console.log('use error');
});

function User(user) {  
    this.username = user.username;  
    this.password = user.password;  
    this.email=user.email;
  this.LastName =user.LastName;
  this.Phone =user.Phone;
  this.Street =user.Street;
  this.City =user.City;
  this.Zipcode =user.Zipcode;
  this.State =user.State;
  this.Country  =user.Country;
};  



User.prototype.save = function save(callback) {  
  var user = {  
    customerId: this.customerId,
    username: this.username,  
    password: this.password,
    email: this.email,
    LastName:this.LastName,
    Phone: this.Phone,
    Street: this.Street,
    City: this.City,
    Zipcode: this.Zipcode,
    State: this.State,
    Country: this.Country,
  };  

  var sql_insert_into_customer = "INSERT INTO customers(FirstName, LastName, Phone, Email, Street, City, Zipcode, State, Country) VALUES(?,?,?,?,?,?,?,?,?)";  

  connection.query(sql_insert_into_customer, [user.username, user.LastName,user.Phone, user.email, user.Street, user.City, user.Zipcode, user.State, user.Country], function (err,result) {  
    console.log(sql_insert_into_customer);
    console.log("Inserted customers "+ err);
    id=result.insertId;             
  });   

  var connection1 = mysql.createConnection({
    host     : 'cmpe226.cpodi2zqj9hl.us-east-1.rds.amazonaws.com',  
    user     : 'cmpe226',  
    password : 'project226',
    port:3306  
  });

  connection1.query('USE ' + DB_NAME,function(err){
    if(err)
      console.log('use error');
  });

  var sql_inset_into_userinfo = "INSERT INTO userinfo(customerId, email, userpass) VALUES(?,?,?)";  

  connection1.query(sql_inset_into_userinfo, [user.customerId, user.email,user.password], function (err,result) {  
    console.log(sql_inset_into_userinfo);
    console.log("Inserted userInfo"+ err);
    callback(err,result);  
      //  return;        
    });
};    

User.prototype.getAdminByUsername = function getAdminByUsername(callback) {  

   var user = {  
        username: this.username,  
        password: this.password,
    };
    var cmd = 'select * from cmpe226.admin where username = ?';  
    connection.query(cmd, [user.username], function (err, result) {  
        console.log(cmd);
        callback(err,result);                      
    });           
};  

User.prototype.getUserNumByName = function getUserNumByName(username, callback) {  
    var cmd = 'select COUNT(1) AS num from user info where username = ?';
    connection.query(cmd, [username], function (err, result) {  
        connection.release(); 
        callback(err,result);                      
    });         
};  
User.prototype.getUserByEmail = function getUserByEmail(callback) {  
    console.log("getUserByEmail");
     var user = {  
        username: this.username,  
        password: this.password,
        email: this.email,
    };
    var cmd = 'select * from cmpe226.userinfo where email = ?';  
    connection.query(cmd, [user.email], function (err, result) {  
        console.log(cmd);
        callback(err,result);                      
    });         
}; 


function Customer(customer){

  this.FirstName =customer.FirstName;
  this.LastName =customer.LastName;
  this.Phone =customer.Phone;
  this.Street =customer.Street;
  this.City =customer.City;
  this.Zipcode =customer.Zipcode;
  this.State =customer.State;
  this.Country  =customer.Country;
};


Customer.prototype.save = function save(callback) {  
    var customer = {  
        
FirstName : this.FirstName, 
LastName: this.LastName,
Phone: this.Phone,
Street:this.Street, 
City:this.City,
Zipcode: this.Zipcode, 
State:this.State, 
Country:this.Country,
    };  

    var cmd = "INSERT INTO customers(FirstName, LastName, Phone, Street, City, Zipcode, State, Country) VALUES(?,?,?,?,?,?,?,?,?)";  
    connection.query(cmd, [customer.Firstname, customer.LastName,customer.Phone, customer.Street, customer.City, customer.Zipcode, customer.State, customer.Country], function (err,result) {  
                console.log(cmd);

        callback(err,result);                       
    });         
}; 


// SQL

/* GET home page. */
router.get('/', function(req, res, next) {

	console.log('loggedIn ' + req.session.loggedIn);
	if (req.session.loggedIn)
		res.render('index', { title: apptitle, username: req.session.username});
	else
  		res.render('index', { title: apptitle, username: 'User' });
});

router.get('/user/registration', function (req, res) {
    res.render("reg", {title: apptitle});
});

router.post("/user/create", function (req, res) {
    var username=req.body.username;
    var lastname=req.body.userlastname;
    var email=req.body.email;
    var user = new User({
        username:username,
        password:req.body.password,
        email:req.body.email,
        LastName:req.body.userlastname,
        Phone:req.body.userphone,
        Email:req.body.email,
        Street:req.body.userstreet,
        City:req.body.usercity,
        Zipcode:req.body.userzipcode,
        State:req.body.userstate,
        Country:req.body.usercountry,
    });

    console.log("_______________");
    console.log("inserted customer id"+id);
    console.log(user);

   user.save(function (err, sql_user) {
        //if (err) res.json(err)
        //console.log('Registration '+user.username +' Ok!');
    	console.dir(user);
        req.session.loggedIn = true;
        req.session.username = user.username;
        req.session.email=user.email;
		    console.log('loggedIn ' + req.session.loggedIn);

      return;

    });


   // customer.save(function (err, sql_user) {
   //    //  if (err) res.json(err)
   //      console.log('Registration');
   //      console.dir(customer);

   //        //  res.redirect('/');
   //  });
    res.redirect('/');


});
router.get('/user/login', function(req, res) {
	var username = "";
	if (req.session.username) {
		username = req.session.username;
	} 
	res.render('login',{title: apptitle});  
});


router.get('/user/adminLogin', function(req, res) {
 /* var username = "";
  if (req.session.username) {
    username = req.session.username;
  } */
  res.render('adminLogin',{title: apptitle});  
});



router.post('/user/adminLogin', function(req, res) {
    console.log("admin login");
  var admin1 = new User({
        username:req.body.username,
        password:req.body.password,
       // email:req.body.email,
    });


admin1.getAdminByUsername(function (err, results) {
         
       if(results == '') {   
            res.locals.error = 'Admin does not exist! ';  
            res.render('adminLogin',{title: apptitle});  
            return;  
        }  

        var username1=admin1.username;
        var username2=results[0].username;
        var pass1=admin1.password;
        var pass2=results[0].password;
 
            if(username1==username1 && pass1==pass2){
            console.log("SUCESSS");
            res.locals.error = '';
            res.locals.username = username2;
            req.session.username = username2;   
            req.session.loggedIn = true;
            console.log(req.session.username);                         
            res.redirect('/adminDashBoard');  
            return;  
          
        } else {  

  res.locals.error = 'Admin Username or password error.';  
            res.render('adminLogin',{title: apptitle});  
            return;  

          
        }      
    }); 



});
router.post('/user/login', function(req, res) {
  console.log("asdsadas");
  var user1 = new User({
    username:req.body.username,
    password:req.body.password,
    email:req.body.email,
  });

  user1.getUserByEmail(function (err, results) {
    if(results == '') {   
      res.locals.error = 'User does not exist! ';  
      res.render('login',{title: apptitle});  
      return;  
    }  

    var input_email = user1.email;
    var input_pass = user1.password;

    var result_email = results[0].email;
    var result_pass = results[0].userpass;

    if(input_email==result_email && input_pass==result_pass){
      console.log("SUCESSS");

      req.session.username = input_email;   
      req.session.loggedIn = true;

      console.log("********" + results[0].customerId + "****");
      req.session.customerId = results[0].customerId;
      console.log(req.session.username);                         
      
      // res.redirect('/');  
      res.render('index');
      return;  

    } else {  
      res.locals.error = 'Username or password error.';  
      res.render('login',{title: apptitle});  
      return;  
    }      
  });
});

module.exports = router;
