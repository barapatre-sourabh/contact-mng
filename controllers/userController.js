const asyncHandler = require("express-async-handler");
 const User = require("../models/userModel");
 const jwt = require("jsonwebtoken");

 const bcrypt = require("bcrypt");

// 1 register user 
// get /api/user/register
//access public
const registerUser =asyncHandler(async(req,res)=>{
    const { username,email,password} = req.body ;
    if(!username || !email || !password){
        res.status(400);
        throw new Error('All fields are mandatory');
   
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered")
    }    
//Hash password
const hashedPassword = await bcrypt.hash(password,10);
 console.log("Hashed Password :",hashedPassword);
 const user = await User.create({
    username,
    email,
    password:hashedPassword
 });
   console.log(`User created ${user}`);
   if(user){
   res.status(201).json({_id:user.id,email:user.email});
   }else{
    res.status(400);
    throw new Error("User data us not valid");
   }
    res.json({message : "Register the user"})
});
 
// 1 login a user 
// get /api/user/login
//access public
const loginUser = asyncHandler(async(req,res)=>{
    const {email,password}= req.body;
if (!email ||!password) {
    res.status(400)
              
throw new Error("all fields are mandatory");
}   
    const user = await User.findOne({email});
    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password,user.password))){
       const accessToken = jwt.sign({
        user: {
            username: user.username,
            email:user.email,
            id: user.id,
        },
       },
       process.env.ACCESS_TOKEN_SECRET ,
       {  expiresIn:"15m"});
        res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("emai or password is not valid")
    }
 });
 
// gt a current  user 
// get /api/user/current
//access private
const currentUser =asyncHandler(async(req,res)=>{
    res.json(req.user);
 });
 

module.exports = {registerUser,loginUser,currentUser};