const USER=require('../modules/UserModules');
const bcrypt =require('bcryptjs');
const nodemailer = require('nodemailer');
module.exports.register=async(req,res)=>{
  console.log(req.body);
    
//   if data is not filled
  const {fname,email,mobile,password,cpassword} = req.body;
  if(!fname || !email || !mobile|| !password || !cpassword){
    res.status(422).json({error:'Fill all the data'});
    console.log('not data available');
  };

//   is user unique 
  try {
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
           user:process.env.EMAIL,
           pass:process.env.PASSWORD
      }
    });
    const mailOptions={
      from: process.env.EMAIL,
      to:email,
      Subject:'Sending email through Radiant Life',
      html:'<h1>Congratultaion,you have sucessfully register in Radiant Life</h1>'
    }
    transporter.sendMail(mailOptions,(error,info)=>{
if(error){
  console.log('Error',error)
}else{
  console.log('Email sent' + info.response);
  res.status(201).json({status:401,error})
}
})

    const preUser = await USER.findOne({email:email});
    if(preUser){
        res.status(422).json({error:'User already exist'});
        console.log('user already exist');
    }else if(password !== cpassword){
        res.status(422).json({error:'Password is not valid'});
        console.log('pswd is not valid');
    }else{
        // if user is unique ,add the user
        const finalUser = new USER({
            fname,email,mobile,password,cpassword
        });

// password hashing process

        // save()-->it is a method of mongoDb
        const storedata = await finalUser.save();
        console.log(storedata);
        res.status(200).json(storedata);
    }
  } catch (error) {
    res.status(400).send(error +'in register page');
  }
}

module.exports.login= async(req,res)=>{
  
  const {email,password} = req.body;
  // if data is not filled
  if( !email || !password ){
    res.status(400).json({error:'Fill all the data'});
 };

 try {
//   // is email are valid/same
  const userLogin = await USER.findOne({email:email});
  console.log(userLogin +'user value');

// user ka email match hoga to data milega uski help se password check krenge
  if(userLogin){
    // is password same/valid            frontend psswrd,database psswrd
    const isMatch = await bcrypt.compare(password,userLogin.password);
    console.log(isMatch + 'password match');
 res.status(200).json(userLogin);
  

    if(!isMatch)
      res.status(400).json({error:'Invalid details'})
  }else{
    res.status(400).json({error:'user not exist'})
  }
 } catch (error) {
  res.status(400).json({error:'Invalid details'})
  console.log(error.msg + 'error in login');
 }
}
