import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getJobById,postJob,getAllJobs,getAdminJobs } from "../controller/job.controller.js";




const router = Router();

router.route("/post").post(isAuthenticated , postJob)
router.route("/get").get(isAuthenticated , getAllJobs)
router.route("/get/:id").get(isAuthenticated , getJobById)
router.route("/getadminjobs").get( isAuthenticated , getAdminJobs)


export default router 