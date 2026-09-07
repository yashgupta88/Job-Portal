import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"
import 'dotenv/config'

const connectDB= async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log('Mongo DB connected successfully')
    } catch (error) {
        console.log(error)
        throw error
    }
}

export default connectDB