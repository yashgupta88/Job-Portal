import {Router} from "express"
import { login, register, updateProfile,logout } from "../controller/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router=Router()

router.route("/register").post(
    register
)
router.route("/login").post(
   login
)

router.route("/profile/update").post(
   isAuthenticated,
   updateProfile
)
router.route("/logout").get(
   
   logout
)
export default router 


