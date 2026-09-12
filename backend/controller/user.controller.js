import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import 'dotenv/config'

const register = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNumber, password, role } = req.body;

  if (!fullname || !email || !phoneNumber || !password || !role) {
    throw new ApiError(400, "All fields are Required");
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new ApiError(400, "User already exist with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    fullname,
    email,
    phoneNumber,
    password: hashedPassword,
    role,
  });

  return res.status(200).json(new ApiResponse(200,{},"Account Created Successfully"))

});

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, "All fields are Required");
  }

  let user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid Email");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect Password");
  }
  if(role !== user.role){
     throw new ApiError(400, "Account doesn't exist with current role ");
  }
  const tokenData = {
    userId:user._id
  }
  const token = await jwt.sign(tokenData , process.env.SECRET_KEY, {expiresIn : '1d'})

  user = {
    _id:user._id,
    fullname:user.fullname,
    email:user.email,
    phoneNumber:user.phoneNumber,
    role:user.role,
    profile:user.profile
  }



  return res.status(200).cookie("token",token , {maxAge:1*24*60*60*1000 , httpOnly:true , sameSite:'strict'}).json(new ApiResponse(200,{ user }, "Logged in Successfully"))


});

const logout=asyncHandler(async (req,res)=>{


      const options={
    
        httpOnly : true,
        secure : false 
        
    }
    return res.status(200).clearCookie("token",options).json(new ApiResponse(200,{},"Logged out successfully"))
})

const updateProfile=asyncHandler(async (req,res)=>{
    const {fullname,email,phoneNumber,bio,skills} = req.body
    const file = req.file

  
  let skillsArray ;
  if(skills){
    skillsArray = skills.split(",");
  }
  const userId = req.id ; 
  let user = await User.findById(userId)

  if(! user){  // to check user is currently logged in or not 
    throw new ApiError("400", "User not found")

  }

  if(fullname) user.fullname=fullname
  if(phoneNumber) user.phoneNumber=phoneNumber
  if(bio) user.profile.bio=bio
  if(skills) user.profile.skills=skillsArray
  if(email) user.email=email

  await user.save({validateBeforeSave:false})

    user = {
    _id:user._id,
    fullname:user.fullname,
    email:user.email,
    phoneNumber:user.phoneNumber,
    role:user.role,
    profile:user.profile
  }

  return res.status(200).json(new ApiResponse(200,user,"Updated Successfully"))



})




export {
    register,
    login,
    logout,
    updateProfile
}