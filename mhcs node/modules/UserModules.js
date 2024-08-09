const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'your-32-character-long-secret-key';
  
const userSchema = mongoose.Schema({
fname:{
    type:String,
    required:true,
    // remove left-right space
    trim:true,
},
email:{
    type:String,
    required:true,
    unique:true,
    validate(value){
        if(!validator.isEmail(value)){
        throw new Error('not valid email address')
    }
 }
},
mobile:{
    type:Number,
    required:true,
    // unique:true,
    maxlength:10
},
password:{
    type:String,
    required:true,
    minlength:6
},
cpassword:{
    type:String,
    required:true,
    minlength:6
}
});

// Encrypting the password using bcrypt
userSchema.pre('save',async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        // this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

// token generate process
userSchema.methods.generateAuthToken= async function(){
    try {
//         //              (payload{user id,secret key-->32 words})
//            // Generate a JSON Web Token using the user's ID and a secret key
     let tokengen = jwt.sign({ _id:this._id }, secretKey,{
        expiresIn:'1d'
    });
  this.tokens = this.tokens.concat({token:tokengen});
        await this.save();
        return tokengen;
    } catch (error) {
        console.log(error + 'in generateAuthToken');
    }
}



const USER= mongoose.model('auth',userSchema)
module.exports=USER;