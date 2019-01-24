var express = require('express');
var session = require('express-session');
var alert = require('alert-node');
var mongoose = require('mongoose');
var ejs = require('ejs');
var bodyparser = require('body-parser');

var app = express();

var Ques = require('./models/questions');
var Person = require('./models/users');
app.use( express.static( "public" ) );
mongoose.connect('mongodb://localhost:27017/owebsite1',{strict:false},{ useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(session({
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    }));




    //homepage
    app.get('/',(req,res)=>{
        res.render('index');
    })
    app.get('/login',(req,res)=>{
        res.render('login');
    })
    app.get('/signup',(req,res)=>{
        res.render('signup');
      })
    app.get('/askques',(req,res)=>{
          console.log(req.session.username);
          res.render('askques');
      })
 

//for signup

app.post('/sign',(req,res)=>{
    Person.findOne({ email: req.body.email })
    .then(person => {
        if (person) {
        console.log(person.email) }
      else{
          var v = 'hi'
          req.session.email=req.body.email;
          req.session.username=req.body.signuser;
          req.session.password=req.body.passuser;
          req.session.interest=req.body.interest;
          var a;
          req.session.tag=a;
          const item = {
              email:req.body.email,
              password:req.body.passuser,
              username:req.body.signuser,
              interest:req.body.interest,
          }

          const newUser = new Person(item);
          newUser.save();
         res.redirect('/savesession');
         

   
          //   Person.find({},function(err,docs){
        //     if(err) throw err;
        //     console.log(docs);
        // res.render('authentic',{data:docs,userData:req.session});
        // });
      }
    })
    .catch(err=>console.log(err));
   
})
 

//for login
// app.post('/log',(req,res)=>{
//     Person.findOne({ username: req.body.username })
//     .then(person => {
//         if (person) {
//             if(person.password!=req.body.password)
//             {
//             alert('password didnot match');
//             res.redirect('/');
//             }
//          req.session.username=req.body.username;
//          req.session.password=req.body.password;
//            var a;
//          req.session.tag=a;
//          if(req.session.tag==null){console.log('will not print');}
//          console.log(req.session.tag);
//           Person.find({},function(err,docs){
//             if(err) throw err;
//            // console.log(docs);
//         res.redirect('/savesession');
//             //res.render('authentic',{data:docs,userData:req.session});
//         });
//         }
//       else
//       {
//       console.log('na');
//       }
//     })
//     .catch(err=>console.log(err));
    
//  })

 //saving session
app.get('/savesession',(req,res)=>{
    Person.findOne({username:req.session.username}).then(person=>{
        req.session.email=person.email; 
        req.session.interest=person.interest;
        req.session.userId=person._id;
        res.redirect('/userprofile');
}).catch(err=>console.log(err));
});
app.post('/tagsearch',(req,res)=>{
    req.body.tagname;

})

//for 2home page
 app.get('/userprofile',(req,res)=>{

      if(req.session.tag==null || req.session.tag=='')
      {
    Ques.find().populate('questionedby').then(docs=>{
  //res.send('s');
        res.render('temp',{data:docs,userData:req.session});
    }) .catch(err=>console.log(err));
    }
    else
    {
        Ques.find({tag:req.session.tag}).populate('questionedby').then(docs=>{
            //res.send('s');
                  res.render('temp',{data:docs,userData:req.session});
              }) .catch(err=>console.log(err));
    }
    
});   

app.get('/template',(req,res)=>{
    req.session.username='himalya';
    Ques.find().populate('questionedby').then(docs=>{
        //res.send('s');
              res.render('temp',{data:docs,userData:req.session});
          }) .catch(err=>console.log(err));
})

//testing
app.get('/test',(req,res)=>{
    Ques.find({tag:'mongoose'}).then(person=>{
        console.log(person[0].title);
    }).catch(err=>console.log(err));
    res.send('hi');
})


app.post('/a',(req,res)=>{
    req.session.tag=req.body.tagname;
    console.log(req.session.tag);
   res.redirect('/userprofile');
    //res.send('jai mata di')
})



// app.get('/',(req,res)=>{
 

//   const item={
//         email:'himalyasharma8921',
//         password:'himalyamani'
//     }
//     const newUser = new Person(item);
//     newUser.save();
//     res.send('h');
// });
// app.get('/ques',(req,res)=>{
//     var id = '5c3f50397e68e83ec0033a45';
//     const item={
//     title:'what is nodejs',
//     questionedby:id,
//     tag:'nodejs'
//     };
//     const newQues = new Ques(item);
//     newQues.save();
//     res.send('question stored');
// })
app.get('/route',(req,res)=>{
    Ques.find().populate('questionedby').then(docs=>{
        console.log(typeof(docs));
        console.log(docs);
        console.log(docs[0].title);
        res.send('question stored');
    }).catch(err=>console.log(err));

});
//question page 
app.post('/ques',(req,res)=>{
    const item={
        title:req.body.textarea,
        tag:req.body.tag,
        questionedby:req.session.userId,
    }
       const newQues = new Ques(item);
       newQues.save();
        res.redirect('/userprofile');
});


//route to display the answer text box page
app.get('/answerpage',(req,res)=>{
   
    var qid = req.session.ques_id;
    Ques.findById(qid,function(err,tank){
        if(err) throw err;
    console.log('jmd');
   console.log(tank);
        res.render('ansques',{data:tank,user:req.session});
    
        
       // res.render('ansques',{data:tank,user:req.session});
   });
   
   
});

app.get('/answer/:q_id',(req,res)=>{

    var i=req.params.q_id;
    req.session.ques_id=i;
    res.redirect('/answerpage');
});


app.post('/storeans/:q_id',(req,res)=>{
    var q =req.params.q_id;//
   console.log(q);//question id
       Ques.findById(q,function(err,tank){
           if(err) throw err;
                console.log('jmd');

         //  tank.answer=[];
           const len = tank.answer.length;
           console.log(len);
           tank.answer[len]={};
           tank.answer[len].name=req.session.username;
           tank.answer[len].ans=[];
           tank.answer[len].ans.push(req.body.userans);
           tank.save();
           //res.render('ansques',{data:idm,user:req.session});
       res.redirect('/userprofile');
       });

       // res.redirect('/userprofile');

});




app.listen(3000,()=>{
    console.log('listening');
});
