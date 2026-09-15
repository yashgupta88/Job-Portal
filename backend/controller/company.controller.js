import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerCompany = asyncHandler(async (req , res) =>{


    const {name , description , website , location } = req.body

    if(! name){
        throw new ApiError(400 , "Company name is required ")

    }

    let company =await  Company.findOne({name:name});

    if(company){
        throw new ApiError(400 , " Company already exist ")  
    }

    company = await Company.create({
        name:name,
        userId:req.id
    })

    return res.status(201).json(new ApiResponse(201,company,"Company Registered Successfully"))

    
})

// to get all companys of a recruiter 

const getCompany = asyncHandler(async(req,res)=>{

    const userId = req.id
    const companies =await Company.find({
        userId:userId
    })

    if(! companies){
        throw new ApiError(404 , "Companies Not found ")
    }

    return res.status(200).json(new ApiResponse(200, companies , "Companies fetched Successfully"))


})

// get company by id


const getCompanyById = asyncHandler( async (req,res) =>{
    const companyId = req.params.id

    const company = await Company.findById(companyId)
    if(!company){
         throw new ApiError(404 , "Company Not found ")
    }

    return res.status(200).json(new ApiResponse(200,company,"Company fetched Successfully"))




})

const updateCompany = asyncHandler(async (req,res) => {

    const {name, description , website , location } = req.body

    const file = req.file;
    // cloudinary 

    const updateData = {
        name, 
        description ,
        website ,
        location
    }

    const company = await Company.findByIdAndUpdate(
       req.params.id , 
       updateData ,
       {
        new:true
       }
    )

    if(! company ){
        throw new ApiError(404 , "Company not found " )

    }
    return res.status(200).json(new ApiResponse(200,company , "Company info updated successfully "))

})

export {
    registerCompany,
    getCompany,
    getCompanyById,
    updateCompany
}