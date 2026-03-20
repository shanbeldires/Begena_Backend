const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const ACCESS_TOKEN_PUBLIC_KEY = require("../config/env.js");


const verificationToken = async(req,res,next)=>{
   try{
        const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
        if(!token){
            const error = new Error("token missing");
            error.statusCode = 401;
            throw error;
        }
        const decoded = jwt.verify(token,ACCESS_TOKEN_PUBLIC_KEY,{
            algorithms:["HS256"]
        });
        const user = await User.findById(decoded.User_id);
        if(!user){
            const error = new Error(" you are not authorized");
            error.statusCode = 404;
            throw error;
        }
        req.user = user;
        next();
    
   }
   catch(error){
    next(error)
   }      
}
module.exports = verificationToken;