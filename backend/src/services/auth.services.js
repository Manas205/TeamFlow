const bcrypt=require('bcrypt')
const User=require('../models/user')
const salt_round=10
const jwt=require('jsonwebtoken')
const {generateAccessToken,generateRefreshToken, verifyRefreshToken}=require('../utils/tokenUtils')

const signup=async({name,email,password})=>{
    const hashedPassword=await bcrypt.hash(password,salt_round);
    try {
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })
        return{
            _id:user._id,
            name:user.name,
            email:user.email
        };
    } catch (err) {
        if(err.code===11000)
        {
            const error=new Error('Email already in use')
            error.statusCode=409;
            throw error
        }
    }
}

const login=async({email,password})=>{
    const user=await User.findOne({email}).select('+password')
    if(!user)
    {
        const error=new Error('Invalid email or password')
        error.statusCode=400;
        throw error;
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        const error=new Error("Invalid Email or Password")
        error.statusCode=401;
        throw error;
    }
    const accessToken=generateAccessToken(user._id)
    const refreshToken=generateRefreshToken(user._id)
    user.refreshToken=refreshToken;
    await user.save();
    return{
        accessToken,
        refreshToken,
        user:{_id:user._id,name:user.name,email:user.email},
    };
};
const refreshAccessToken=async(refreshToken)=>{
    if(!refreshToken)
    {
        const error=new Error('No refresh token provided')
        error.statusCode=401;
        throw error;
    }
    let decoded;
    try
    {
        decoded=verifyRefreshToken(refreshToken);
       
    }
    catch(err)
    {
        
        const error=new Error('Invalid or expired refresh token')
        error.statusCode=403;
        throw error;
    }
    const user=await User.findById(decoded.userId).select('+refreshToken')
    
    if(!user || user.refreshToken!=refreshToken)
    {
        const error=new Error('Invalid or expired refresh token')
        error.statusCode=403;
        throw error;
    }
    const newAccessToken=generateAccessToken(user._id)
    return {accessToken:newAccessToken}
}
const logout=async(userid)=>{
    await User.findByIdAndUpdate(userId,{refreshToken:null});
}
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return { _id: user._id, name: user.name, email: user.email };
};
module.exports={signup,login,refreshAccessToken,logout,getCurrentUser}