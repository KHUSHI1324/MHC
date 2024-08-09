const express = require('express');
const router = express.Router();
const {register,login}=require('../controller/UserController');
router.post('/register',register)
router.post('/login',login)
// router.
module.exports=router;