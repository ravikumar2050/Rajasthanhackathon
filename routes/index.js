var express = require('express');
var router = express.Router();

// Get Homepage

router.get('/', ensureAuthenticated,function(req, res){
	res.render('index',{name1:req.user.name});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.render('index',{name1:"ULB Login"})
	}
}


module.exports = router;