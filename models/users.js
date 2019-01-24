const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var userschema = mongoose.Schema({
    email:{type:String,default:'',},
    password:{type:String,default:'',},
    username:{type:String,default:'',},
    interest:{type:String,default:'',},
    address:{type:String,default:'',},

})

module.exports = u = mongoose.model('user',userschema);

//