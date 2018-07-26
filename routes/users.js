var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require("fs")
var errormsg;
var flag=0;
var path=require('path')
var User = require('../models/user');
var Question = require('../models/question');
var Score = require('../models/score');
var Query=require('../models/query')
var Event=require('../models/event')
var News=require('../models/news')
var Scheme=require('../models/schemes')
var multer =require('multer')

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, 'uploads/')
	},
	filename: function(req, file, callback) {
		
		callback(null,file.originalname)
	}
})


//********************************************************************************************************************************************* */
//forgot password page for users
router.get('/forgotpassword',function(req,res)
{
	res.render('forgotpassword');
});
//********************************************************************************************************************************************** */








//forgot password page for users



router.post('/forgotpassword',function(req,res)
{

	var name = req.body.name;
	
	req.checkBody('name', 'Email is required').notEmpty();
	req.checkBody('name', 'Email is not valid').isEmail();
	var err = req.validationErrors();
	if(err)
	{
		res.render('forgotpassword',{
			errors:err
		}
	)
        //req.flash('error_msg', 'You are registered and can now login');
	// console.log(errors.msg);
	}
	else
{
	
	
	req.flash('success_msg','Reset Link is Sent To Your Email');
	res.redirect('login');
	
}
});
//********************************************************************************************************************************************* */
//register page
router.get('/register', ensureAuthenticated2,function(req, res){

});
function ensureAuthenticated2(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/users/dashboard');
    } else {
        res.render('register');
    }
}
//********************************************************************************************************************************************** */

// Login
router.get('/login', ensurelog,function(req, res){
res.redirect('dashboard');
	});

function ensurelog(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		
		res.render('login');
	}
}


//************************************************************************************************************************************************ */
//Dashboard function for both users
router.get(
    '/dashboard',ensure,function(req, res) {
	
		res.render('ulbdash',{welcome_msg:req.user.email});
	



	});
	

	function ensure(req,res,next)
	{if(req.user==undefined)
		{   req.flash('error_msg',"You are not logged in ")
			res.redirect('/users/login')
		} 
	else if(req.isAuthenticated)
	{
	
	if(req.user.admin)
	{
		res.redirect('/users/admindash')
	}
	else
	{next();}
	}
	
	else
	{
		res.render('login')
	}
	}
	
	
	
//********************************************************************************************************************************************* */
// Register User
router.post('/register', function(req, res){

	

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var employee_id=req.body.employee_id;
	var  mobile_no=req.body.mobile_no;
	var department=req.body.department;
	var designation=req.body.designation;
	var security_ques=req.body.security_ques;
	var security_ans=req.body.security_ans;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('employee_id','Employee id is required').notEmpty();
    req.checkBody('mobile_no','Mobile no is required').isInt();
    req.checkBody('department','Department Name is required').notEmpty();
    req.checkBody('designation','Designation is required').notEmpty();
    req.checkBody('security_ques','Security question is required').notEmpty();
    req.checkBody('security_ans','Security answer does not match').notEmpty();



	
var errors = req.validationErrors();

	if(errors)
	{
		res.render('register',{
			errors:errors
		}
		);
        //req.flash('error_msg', 'You are registered and can now login');
	// console.log(errors.msg);
	}


	else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			employee_id:employee_id,
			mobile_no:mobile_no,
			department:department,
             designation:designation,
             security_ques:security_ques,
			  security_ans:security_ans,
			
			  
			  admin:false
		});
		
		User.createUser(newUser,function (err,result) {
			if(err)
			{ console.log(err)
				res.render('register',{ uop:err.errors
				});}
	else
	{req.flash('success_msg','You are registered and can now login');
res.redirect('/users/login');}
})
}
})


passport.use('us',new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });

  }));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
//******************************************************************************************************************************************* */
router.post('/login',
  passport.authenticate('us', {successRedirect:'./dashboard', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
	res.redirect('/login');
	
  });
//******************************************************************************************************************************************** */
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');
res.redirect('/users/login')
	
});

//admin part
//*************************************************************************************************************************************** */
//**********************************************ADMIN PART******************************************************************************** */
//***************************************************************************************************************************************** */








//******************************************************************************************************************************* */
router.get('/admindash',ensureadmin,function(req,res){

var record;
var events;
var userdata

Score.aggregate([{$group:{_id:{email:"$email",username:"$username",userid:"$userid"},total:{$sum:"$result"}}},{$sort:{"total":-1} }],function(err,result)
{

if(err)
throw err

	
	record=result;
	two()



})
function two(){
Event.find({},function(err,result)
{

if(err)
throw err;
events=result;
third()
//res.render('admindash',{record:record,name:req.user.username,events:result})

})


}
 
function third()
{ 
User.find({},function(err,results)
{
if(err)
throw err
else{
	userdata=results;
fourth()
//res.render('admindash',{record:record,name:req.user.username,events:events,userdata:results})
}
})
}

function fourth(){
News.find({},function(err,result)
{

if(err)
throw err
res.render('admindash',{record:record,name:req.user.username,events:events,userdata:userdata,news:result})



})



}

})


//******************************************************************************************************************************************* */



// ensure admin func
function ensureadmin(req,res,next)
{
	if(req.user==undefined)
	{  req.flash('error_msg',"You are not logged in")
		res.redirect('/users/login')
	}
else if(req.isAuthenticated && req.user.admin)
{
	next()
}
else
{
	req.flash('error_msg','you are not authorised')
	res.redirect('/users/login');
}
}
//*******************************************************************************************************************************************8 */
//add quiz
router.get('/add-quiz',ensureadmin,function(req,res)
{
	
var data;

Question.collection.distinct("questionscheme",function(err,result)
{
	
	data=result;
	filldata()
})

function filldata()
{
	res.render('add-quiz',{name:req.user.name,data:data})
}
	
})
//****************************************************************************************************************************************** */
router.post('/add-quiz',function(req,res)
{

	var questionscheme = req.body.type;
	var question = req.body.question;
	var op1 = req.body.op1;
	var op2 = req.body.op2;
	var op3 = req.body.op3;
	var op4 = req.body.op3;
	var rightAnswer = req.body.rightAnswer;

	req.checkBody('question', 'Question is required').notEmpty();
	req.checkBody('op1', 'options are required').notEmpty();
	req.checkBody('op2', 'options are required').notEmpty();
	req.checkBody('op3', 'options are required').notEmpty();
	req.checkBody('op4', 'options are required').notEmpty();
	req.checkBody('rightAnswer', 'rightAnswer is required').notEmpty();

	var errors = req.validationErrors();
	if(errors)
	{console.log(errors)
		req.flash('error_msg',"All Fields Are Required")
	res.redirect('/users/add-quiz')
        //req.flash('error_msg', 'You are registered and can now login');
	// console.log(errors.msg);
	}
else{
	var ques= new Question({
		
	 questionscheme : questionscheme,
	 question :question,
	 op1 :op1,
	 op2 : op2,
	 op3 :op3,
	 op4 :op3,
	 rightAnswer : rightAnswer
	});

ques.save(function(err,result)
{
	if(err)
			{
				res.redirect('add-quiz');}
else{
	
req.flash('success_msg','question has been saved');

res.redirect("/users/add-quiz");
	//res.render('login',{success_msg:''});	
}

	
})
}
})
//********************************************************************************************************************************************** */

//routes for quiz
router.get('/quiz',ensureadmin,function(req,res)
{
	
var data;
Question.collection.distinct("questionscheme",function(err,result)
{
	
	data=result;
	filldata()
})

function filldata()
{
	res.render('quiz',{name:req.user.name,quizname:data})
}
	
})

//****************************************************************************************************************************************** */
router.post('/delete',function(req,res)
{

Question.collection.deleteMany({questionscheme:req.body.send},function(err,result)
{
	if(err)
	throw err
	else{
		req.flash('success_msg',"DELETED")
		res.redirect('/users/quiz')
	}
})
Score.deleteMany({schemetype:req.body.send},function(err,result)
{
	if(err)
	throw err;

})


})

router.get('/adminquery',ensureadmin,function(req,res)
{
var data;
Query.find({seen:false},function(err,result)
{
if(err)
throw err
else if(result)
{data=result;
	
	filldata()
}

})
function filldata()
{
	data.j=req.user.email
	
res.render('adminquery',{data:data,name:req.user.username});
}

})

//********************************************************************************************************************************************** */
router.post('/viewquestions',ensureadmin,function(req,res)
{

Question.find({questionscheme:req.body.send},function(err,result){

if(err)
{throw err}
res.render('viewquestions',{name:req.user.username,data:result})

})
})

//*************************************************************************************************************************************** */
router.post('/deletequestions',function(req,res)
{
	Question.findByIdAndRemove(req.body.name,function(err,result)
{
if(err)
throw err
else
res.json('hi')
})



})

//***************************************************************************************************************************************** */



router.post('/deletequery',function(req,res)
{   
     
   data=req.body.name ;
  
    Query.findByIdAndRemove(data,function(err,result){

        
        
		if(err)
		 console.log(err);
		else if (!result) 
		console.log ('No queries');
       else {
           console.log("deleted");
            res.json('hi')
       }
     
    });
})

//******************************************************************************************************************************************** */

router.post('/replyquery',function(req,res){

var message=req.body.message
var id=req.body.name

Query.findOneAndUpdate({_id:id},{seen:true,reply:message},{new:true},function(err,result)
{

if(err)
throw err
else
{res.json('hi')}

})
})
//*********************************************************************************************************************************** */

router.post('/adminevent',function(req,res)
{

var subject=req.body.subject;
var description=req.body.description;
var date=req.body.date;
var time=req.body.time;
var venue=req.body.venue;

req.checkBody('subject', 'Subject is required').notEmpty();
req.checkBody('description', 'Description is required').notEmpty();
req.checkBody('date', 'Date is required').notEmpty();
req.checkBody('time', 'Time is required').notEmpty();
req.checkBody('venue', 'Venue is required').notEmpty();
var errors = req.validationErrors();
	if(errors)
	{console.log(errors)
		req.flash('error_msg','Please Fill all the fields')
		res.redirect('/users/admindash')
		}
		
    else{
		var event= new Event({
			
		 subject : subject,
		 description :description,
		 date :date,
		 time: time,
		 venue :venue,
	
		});
		event.save(function(err,result){
if(err)
throw err;

req.flash('success_msg',"event has been created")
res.redirect('/users/admindash')


		});

	}   
	
})
//************************************************************************************************************************************** */
router.post('/deleteevent',function(req,res){

Event.deleteOne({_id:req.body.id},function(err,result)
{

res.json('hi')

})



})
//******************************************************************************************************************************** */
router.post('/addnews',function(req,res)
{ console.log()
var category=req.body.category;
	var subject=req.body.subject;
	var description=req.body.description;

		
	req.checkBody('subject', 'Subject is required').notEmpty();
	req.checkBody('description', 'description is required').notEmpty();
	req.checkBody('category', 'category is required').notEmpty();
	
	var errors = req.validationErrors();
		if(errors)
		{console.log(errors)
			req.flash('error_msg','Please Fill all the fields')
			res.redirect('/users/admindash')
			}
			
		else{
			var event= new News({
			category:category,	
			 subject : subject,
			 description :description,
			
		
			});
			event.save(function(err,result){
	if(err)
	throw err;
	
	req.flash('success_msg',"event has been created")
	res.redirect('/users/admindash')
	
	
			});
	
		}   
		




})
//***************************************************************************************************************************************** */
router.post('/deletenews',function(req,res)
{ 
	News.deleteOne({_id:req.body.id},function(err,result)
{
	if(err)
	throw err
	else
	res.json('News Deleted')
}

)
})

//**************************************************************************************************************************************** */
router.get('/schemeadd',ensureadmin,function(req,res)
{
Scheme.find({},function(err,result){
if(err)
throw err;

res.render('adminschemeadd',{data:result})
})

	
})

router.post('/upload',function(req,res)
{
var filename;	
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
		
filename=req.file.originalname	
		
	two()
	})

function two()
{

	
var abstract=req.body.abstract;
var complete=req.body.complete;
var valid_from=req.body.valid_from;
var valid_to=req.body.valid_to;
var eligibility=req.body.eligibility;


req.checkBody('abstract', 'Subject is required').notEmpty();
req.checkBody('complete', 'Description is required').notEmpty();
req.checkBody('valid_from', 'Date is required').notEmpty();
req.checkBody('valid_to', 'Time is required').notEmpty();

var errors = req.validationErrors();
	if(errors)
	{console.log(errors)
		req.flash('error_msg','Please Fill all the fields')
		res.redirect('/users/schemeadd')
		}
		
    else{
		var scheme=new Scheme({
			
		 abstract:abstract,
		 complete:complete,
		 valid_from:valid_from,
		 valid_to:valid_to,
		 eligibility:eligibility,
		filename:filename,
	
		});
		scheme.save(function(err,result){
if(err)
throw err;

req.flash('success_msg',"Scheme has been Added")
res.redirect('/users/schemeadd')


		});

	}   
	
}


})
//**************************************************************************************************************************************** */
router.post('/download',function(req,res)
{

	res.sendFile(req.body.file, { root: path.join(__dirname, '../uploads') })



})

router.post('/deleteadminsc',function(req,res){
filetobedelete=req.body.filename
console.log(filetobedelete)
Scheme.deleteOne({_id:req.body.name},function(err,result)
{
if(err)
throw err
res.json('hi')

})
})

//*********************************************************************************************************************************************** */
//*******************************************************************ULB SECTION*********************************************************************************************** */
//********************************************************************************************************************************************** */
//********************************************************************************************************************************************* */
function ensureulb(req,res,next)

{

if(req.user==undefined)
{ req.flash('error_msg',"Please Login ")
	res.redirect('/users/login')
}
else if(req.isAuthenticated && !req.user.admin)
{
	next();
}
 else{
	 res.redirect('/users/dashboard')
 }

}
//********************************************************************************************************************************************** */
router.post('/showquiz',ensureulb,function(req,res)
{ var data;
	
Question.find({questionscheme:req.body.send},function(err,result)
{
	if(err)
	throw err;
	if(!result)
	{
		console.log('no ques')
	}
	else{data=result[0];
		filldata()}
})
function filldata(){
	
res.render('ques-ans',{quizname:req.body.send,data:data})
}

})
//******************************************************************************************************************************************** */
router.post('/next',ensurelog,function(req,res)
{ var quiztype=req.body.quiztype;
	
Question.find({questionscheme:quiztype},function(err,results)
{
if(err)
{throw err}

if(!results)
{
	console.log('not founf')}
else{
	res.json(results)
}

})




})
//*********************************************************************************************************************************************** */
router.post('/sub',function(req,res)
{
 var useranswer=req.body.ans;
 var question =req.body.question;
 var quiztype=req.body.quiztype;
 var scoreflag;

 var data;
 ///**** */
 Score.findOneAndUpdate({username:req.user.username,email:req.user.email,schemetype:quiztype,userid:req.user.employee_id},{$setOnInsert:{result:0,q:[]}},{new:true,upsert:true},function(err,result)
 { 
	 if(err)
{
	console.log(err)
}
else
{
	second()

}
 })

 /*** */
 function second(){
Question.findOne({question:question},function(err,result)
{

if(err)
console.log(err)
else
{
	 var flag;
if(useranswer==result.rightAnswer)
{
	flag=true;
	third()
}
else
{
	flag=false;
	fourth()
}
fill(flag);
}
})

function fill(flag)
{
	res.json(flag)
}

 }
	function third(){
Score.findOneAndUpdate({username:req.user.username,schemetype:quiztype,q:{$ne:question}},{ $inc:{result:10}},{new:true},function(err,result)
{ 
	if(err)
{console.log(err)}
else
{console.log(result)}
fourth()
})

	}

	function fourth(){
Score.findOneAndUpdate({username:req.user.username,schemetype:quiztype},{$addToSet: {q:question}},{new:true},function(err,result)
 { 
	 if(err)
{
	console.log(err)
}
else if(!result)
{
	scoreflag=false
}
else 
{
	console.log(result)

}

 })
	}

})


//********************************************************************************************************************************************* */
router.get("/ulbquiz",ensureulb,function(req,res)
{

	var data;
	Question.collection.distinct("questionscheme",function(err,result)
	{
		
		data=result;
		fillulbdata()
	})

function fillulbdata(){
	res.render('ulbquiz',{user:req.user.username,ulbquizname:data})
	}
})






//********************************************************************************************************************************************** */

router.post('/reset',function(req,res)
{
Score.findOneAndUpdate({username:req.user.username,schemetype:req.body.name},
{$set:{result:0,q:[]}},{new:true},function(err,result){

if(err)
throw err
else{
	console.log(result)
}
})
})
//************************************************************************************************************************************ */
router.get('/ulbquery',ensureulb,function(req,res)
{
res.render('ulbquery',{g:req.user})
})

//********************************************************************************************************************************************* */
router.post('/ulbquery',function(req,res){


	
	var username = req.user.username;
	
	var email = req.user.email;
	var phone = req.user.mobile_no;
	var message = req.body.message;
	var subject=req.body.subject;
	var reply="";
    


// Validation

req.checkBody('message', 'Message can not be empty').notEmpty();
req.checkBody('subject', 'Subject can not be empty').notEmpty();

var errors = req.validationErrors();

	if(errors)
	{
		res.render('ulbquery',{
			errors:errors,g:req.user
		}
		);
        //req.flash('error_msg', 'You are registered and can now login');
	// console.log(errors.msg);
	}


	else {  
		var newquery = new Query({
		
			username:username,
            
            email:email,
            phone:phone,
			message:message,
			subject:subject,
		   reply:reply,
		   seen:false
        });
        
		
   
	newquery.save(function(err,result)
{
if(err)
throw err;
else
{
	req.flash('success_msg',"Query has been sent")
res.redirect('/users/ulbquery')
}

});
	
 
	
}
});


//******************************************************************************************************************************************** */
router.get('/ulbhome',ensureulb,function(req,res)
{
	var events;
var record;
var noofquiz;
var total;
	Score.aggregate([ {$group:{_id:{email:"$email",username:"$username",userid:"$userid"},total:{$sum:"$result"}}},{$sort:{"total":-1} }],function(err,result)
	{
	
	if(err)
	throw err
	if(result)
	{
		
		record=result;
		console.log(result)
		two()
	}
	
	
	})

function two()
{
	Event.find({},function(err,result)
{

if(err)
throw err;
events=result;
third()
//res.render('ulbhome',{name:req.user.username,leaderboard:record,events:result})

})
	
}
function third()
{
	Question.collection.distinct("questionscheme",function(err,result)
	{
		
		noofquiz=result.length;
		fourth()
		//res.render('ulbhome',{name:req.user.username,leaderboard:record,events:events,quizno:noofquiz})
	})
	

}
function fourth()
{
	Score.distinct('schemetype',{username:req.user.username},function(err,result)
	{
		console.log(req.user.username)
		noofquiztaken=result.length;
		five()
		//res.render('ulbhome',{name:req.user.username,leaderboard:record,events:events,quizno:noofquiz,quiztaken:noofquiztaken})
	})


}
function five()
{
	Score.aggregate([ { $match : { username : req.user.username }},{$group:{_id:{email:"$email",username:"$username",userid:"$userid"},total:{$sum:"$result"}}},{$sort:{"total":-1} }],function(err,result)
	{
	
	if(err)
	throw err
	
	
		
		
		total=result[0].total
	//	res.render('ulbhome',{name:req.user.username,leaderboard:record,events:events,quizno:noofquiz,quiztaken:noofquiztaken,total:total})
	six()
	
	
	})
	
}

function six(){

News.find({},function(err,result){

if(err)
throw err
res.render('ulbhome',{name:req.user.username,leaderboard:record,events:events,quizno:noofquiz,quiztaken:noofquiztaken,total:total,news:result})
	

})


}

})



//********************************************************************************************************************************************* */

router.get('/ulbinbox',ensureulb,function(req,res)
{

Query.find({username:req.user.username,seen:true},function(err,result)
{

if(err)
throw err
res.render('ulbinbox',{name:req.user.username,data:result})



})





})


//********************************************************************************************************************************************* */
router.get('/ulbscheme',ensureulb,function(req,res)
{
Scheme.find({},function(err,result)
{
if(err)
throw err
res.render('ulbscheme',{data:result})

})


})





//******************************************************************************************************************************************* */
module.exports = router;