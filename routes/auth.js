import { Router } from "express";
import * as auth from '../controllers/auth/auth.js';
import {celebrate} from 'celebrate';
import { validation } from "../helper/validationSchema.js";
import * as apiResponse from '../helper/apiResponse.js';
import * as user from '../controllers/user/user.js';

const router = Router();


router.use((request,response,next)=>{
    console.log('\nAuth middleware');
    console.log(request.originalUrl);
    return next();

})

router.post('/register/owner',
    celebrate(validation.registration),
    auth.isMobileExist,
    auth.register,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Registered Succesfully ")
    }
)


router.post('/login',
    user.getAuthUser,
    auth.generateAuthToken,
    auth.login,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Login Successfull", { token: request.body.token, _id: request.body.authUser._id, name: request.body.authUser.name })
    }
)


router.post("/reset/password",
    auth.isAuth,
    user.isUserValid,
    auth.resetPwdChecks,
    user.resetPassword,
    (request, response) => {
        return apiResponse.successResponse(response, "Password has been reset successfully")
    }
)

export default router