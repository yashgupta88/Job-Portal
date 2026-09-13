import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Job} from "../models/job.model.js"

const postJob = asyncHandler( async(req,res)=>{

    const {title , description , requirements , salary , location ,jobType , experience , position , companyId} = req.body

    const userId = req.id 
    
    const arr=[title,description , requirements , salary , location , jobType , experience , position , companyId ]

    if(arr.some((data)=> data === undefined || data === null || data.toString().trim() === "")) {
        throw new ApiError(400 , "All fields are required ")
    }

    const job = await Job.create({
        title,
        description,
        requirements:requirements.split(","),
        salary:Number(salary),
        location,
        jobType,
        experienceLevel : experience,
        position,
        company : companyId ,
        created_by: userId
    })

    return res.status(201).json(new ApiResponse(201,job,"New job created successfully "))


})

const getAllJobs = asyncHandler( async(req,res) =>{

    const keyword = req.query.keyword || ""

    const query = {
        $or:[

            {title:{$regex:keyword,$options:"i"}},
            {description:{$regex:keyword,$options:"i"}}  // i for making filter not case sensitive 
        ]
    }

    const jobs = await Job.find(query).populate({
        path:"company"
    }).sort({
        createdAt:-1
    })

    if(!jobs){
        throw new ApiError(404 , "Job not found ")

    }

    return res.status(200).json(new ApiResponse(200,jobs,"jobs fetched successfully "))



})


const getJobById = asyncHandler ( async (req,res)=>{

    const jobId = req.params.id

    const job = await Job.findById(jobId)

    if(! job){
         throw new ApiError(404 , "Job not found ")
    }
    return res.status(200).json(new ApiResponse(200,job,"job fetched successfully "))
})

// for admin 

const getAdminJobs = asyncHandler ( async(req,res)=>{
    const adminId = req.id
    const jobs = await Job.find({
        created_by:adminId
    })

    if(!jobs){
         throw new ApiError(404 , "Job not found ")
    }
    return res.status(200).json(new ApiResponse(200,jobs,"jobs fetched successfully"))
})

export {
    getJobById,
    postJob,
    getAllJobs,
    getAdminJobs
}