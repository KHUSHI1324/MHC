const express=require("express")
const mongoose=require('mongoose');
const cors=require('cors');
let http = require('http');
const app =express();
const server = http.createServer(app);
require('dotenv').config();

app.use(express.json());
app.use(cors());
// app.use(UserModel);
const router=require('./router/UserRouter');
app.use('/',router);

server.listen(9000,()=>{
    console.log("Server is ready to run in 9000 port")
})

mongoose.connect("mongodb://0.0.0.0:27017/mhv").then(()=>{
    console.log("mongodb connected");
}).catch((error)=>{
    console.log("db not connected",error);
})
