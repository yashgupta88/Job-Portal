import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob,getAppliedJobs,getApplicants,updateStatus } from "../controller/application.controller.js";




const router = Router();

router.route("/apply/:id").get(isAuthenticated , applyJob)
router.route("/get").get(isAuthenticated , getAppliedJobs)
router.route("/:id/applicants").get(isAuthenticated , getApplicants)
router.route("/status/:id/update").patch( isAuthenticated , updateStatus)


export default router 