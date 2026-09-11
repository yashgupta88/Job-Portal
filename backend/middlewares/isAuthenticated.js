import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const isAuthenticated =asyncHandler( async(req,res,next)=>{
    try {

        const token = req.cookies.token;
        if(!token){
            throw new ApiError(401,"User is not authenticated ")
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY)

        if(! decode){
            throw new ApiError(401,"Invalid Token ")
        }

        req.id=decode.userId 

        next()
        
    } catch (error) {
         throw new ApiError(401,error?.message || "Invalid access token")
        
    }
}
)

export default isAuthenticated