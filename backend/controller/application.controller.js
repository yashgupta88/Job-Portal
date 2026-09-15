import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Application} from "../models/application.model.js"
import {Job} from "../models/job.model.js"

const applyJob = asyncHandler( async(req,res) =>{
    const userId = req.id

    const {id:jobId} = req.params

    if(!jobId){
       throw new ApiError(400 , "Job id is required ")
    }

    // checking if already applied or not by the user

    const existingApplication = await Application.findOne(
        {
            job:jobId,
            applicant:userId
        }
    )

    if(existingApplication){
       throw new ApiError(400 , "You have already applied for this job ")
    }

    // check if the job exists 
    const job=await Job.findById(jobId)
    if(! job){
         throw new ApiError(404 , "Job not found ")
    }

    // createing a new application
    const newApplication = await Application.create({
        job:jobId,
        applicant:userId,
        
    })
    job.applications.push(newApplication._id);

    await job.save({validateBeforeSave:false})

    return res.status(201).json(new ApiResponse(201,newApplication,"Job applied succesfully "))



})

const getAppliedJobs = asyncHandler(async(req,res) =>{

    const userId = req.id

    const application = await Application.find(
    {
        applicant:userId
    }
    ).sort({createdAt:-1}).populate(
        {
        path:"job",
        options:{sort:{createdAt:-1}},
        populate:{
            path:"company",
            options:{sort:{createdAt:-1}},
        }
    }
)

if(! application){
    throw new ApiError(404 , "No applications found")
}

return res.status(200).json(new ApiResponse(200,application,"application fetched successfully "))



})

const getApplicants = asyncHandler( async(req,res)=>{

    const {id:jobId} = req.params

    const job = await Job.findById(jobId).populate({
        path:'applications',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant'
        }
    })

    if(!job){
        throw new ApiError(404 , "No Job found")
    }

    return res.status(200).json(new ApiResponse(200,job,"data fetched successfully "))

})


const updateStatus = asyncHandler( async(req,res) =>{

    const {status}=req.body

    const applicationId = req.params.id

    if(!status){
         throw new ApiError(400 , " status is required ")
    }

    const application=await Application.findById(applicationId)

    if(!application){
        throw new ApiError(404 , " application not found  ")
    }

    // updating status 

    application.status=status.toLowerCase();
    await application.save()
    return res.status(200).json(new ApiResponse(200,application,"status updated successfully "))

})

export {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateStatus



}

