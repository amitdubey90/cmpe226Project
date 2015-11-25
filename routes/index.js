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

    var cmd = "INSERT INTO userinfo(name, email, userpass) VALUES(?,?,?)";  
    var cmd1 = "INSERT INTO customers(FirstName, LastName, Phone, Email, Street, City, Zipcode, State, Country) VALUES(?,?,?,?,?,?,?,?,?)";  


     connection.query(cmd1, [user.username, user.LastName,user.Phone, user.email, user.Street, user.City, user.Zipcode, user.State, user.Country], function (err,result) {  
            console.log(cmd1);
            console.log("Second query "+ err);
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
   connection1.query(cmd, [user.username, user.email,user.password], function (err,result) {  
        console.log(cmd);
        console.log("first query "+ err);
        callback(err,result);  
      //  return;        
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
    console.log("asdasdsadasdasd");
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
        var email1=user1.email;
        var email2=results[0].email;
        var pass1=user1.password;
        var pass2=results[0].userpass;
        var username2=results[0].name;
//console.log(user1.email+"@"+user1.password+"@");
  //      console.log(results[0].email+"@"+results[0].userpass+"@");
        //if((results[0].email == user1.email) && (results[0].userPass == user1.password)) {  
            if(email1==email2 && pass1==pass2){
            console.log("SUCESSS");
            res.locals.error = '';
            res.locals.username = username2;

            req.session.username = username2;   
            req.session.loggedIn = true;
            console.log(req.session.username);                         
            res.redirect('/');  
            return;  
          
        } else {  

  res.locals.error = 'Username or password error.';  
            res.render('login',{title: apptitle});  
            return;  

        	
        }      
    }); 
});

module.exports = router;
