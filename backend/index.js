import express from "express";
import cookieParser from "cookie-parser"
import 'dotenv/config'
import cors from "cors"
import connectDB from "./db/index.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/job.routes.js"
import applicationRoute from "./routes/application.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use(cors({
    origin:'http//localhost:5173',
    credentials:true
}))

// api's
app.use("/api/v1/user",userRoute)
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/jobs",jobRoute)
app.use("/api/v1/application",applicationRoute)

// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/updateProfile"





connectDB()
.then(()=>app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server  is running at port ${process.env.PORT}`)
})
)
.catch((error)=>{
    throw error
})