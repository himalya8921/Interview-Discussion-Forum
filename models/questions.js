const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var queschema = mongoose.Schema({
        
            title:{type:String,default:'',},
            upvote:{type:Number,default:0},
            questionedby:{type:mongoose.Schema.Types.ObjectId,
                ref:'user'},
                tag:{type:String,default:'',},
            answer:
            [{
                name:{type:String,default:'',},
               ans:[String],
            },]
            
        })

module.exports = u = mongoose.model('question',queschema);

//