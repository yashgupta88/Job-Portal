import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerCompany,getCompany,getCompanyById,updateCompany } from "../controller/company.controller.js";

const router = Router();

router.route("/register").post(isAuthenticated , registerCompany)
router.route("/get").get(isAuthenticated , getCompany)
router.route("/get/:id").get(isAuthenticated , getCompanyById)
router.route("/update/:id").patch( isAuthenticated , updateCompany)


export default router 