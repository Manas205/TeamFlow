const authService=require('../services/auth.services.js')

const signup=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password)
        {
            return res.status(400).json({message:'All fields are required'});
        }
        const user=await authService.signup({name,email,password})
        return res.status(201).json({
            message:"Signup Successful",
            user
        })
    } catch (err) {
        const statusCode=err.statusCode || 500;
        console.log("Something wrong in auth.controller.js try error block");
        return res.status(statusCode).json({message:err.message || "Something went wrong"})
    }
}
const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(400).json({message:'Email and password are required'})
        }
        const {accessToken, refreshToken,user}=await authService.login({email,password})
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:'strict',
            maxAge:7*24*60*60*1000
        })
        return res.status(200).json({
      message: 'Login successful',
      accessToken,
      user,
    });
    } catch (err) {
    const statusCode = err.statusCode || 500;
    console.log("Error in try catch of login");
    
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
    }
}
const refresh=async(req,res)=>{
    try {
        const refreshToken=req.cookies.refreshToken;
        const {accessToken}=await authService.refreshAccessToken(refreshToken);
        return res.status(200).json({accessToken})
    } catch (err) {
        const statusCode=err.statusCode || 500;
        return res.status(statusCode).json({message:err.message || 'Something went wrong'})
    }
}
const logout=async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await authService.logout(decoded.userId); // null out refreshToken in DB
    } catch (err) {
      // token was already invalid/expired — nothing to revoke, not a real error
      console.log('Logout: token already invalid, nothing to revoke:', err.message);
    }
  }

  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logged out successfully' });
}
module.exports={signup,login, refresh,logout}