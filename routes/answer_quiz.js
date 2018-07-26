var express = require('express');
var router = express.Router();
  var counter=module.exports=0;

var question = require('../models/question');

router.get('/',function(req,res)
{ var res;
   console.log('aa gya')
    question.find({},function (err, result) {

        if (err) console.log (err);
        if (!result) console.log ('ques not found');
       var data=result[0];
       counter++;
  res.render('answer_quiz',{data:data})
    
});

});

router.get('/next',function(req,res)
{ var res;
   console.log('get aa gya')
    question.find({},function (err, result) {

        if (err) console.log (err);
       c
       var data=result;
       counter++;
  

       
   
      // res.render('answer_quiz',{data:data})
    console.log(data)
    res.json(data);
   
});

});







module.exports = router;







