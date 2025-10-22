import * as user from '../../models/user/user.js';
import * as apiResponse from '../../helper/apiResponse.js';
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from './jwt.js'
import { token } from 'morgan';


export const isMobileExist = (request, response, next) => {
    try {

        request.body.query = { mobile: request.body.mobile }
        user.getUserbyMobile(request.body.query).then(res => {

            if (res.status) {
                if(!res.data.isActive) return apiResponse.validationError(response, "Inactive User")
                request.body.existingUser = res.data;

                request.logger.debug(JSON.stringify(request.body.existingUser));
                return next()
            }
            else {
                request.body.notExist = true
                return next()
            }
        }).catch(err => {
            request.logger.error("Error in isMobileExist" ,{ stack: error.stack });
            return apiResponse.somethingResponse(response)
        })

    } catch (error) {
        return apiResponse.somethingResponse(response)
    }
}

export const register = async(request, response, next) => {
    try {
        let existingUser = request.body?.existingUser
        if(existingUser && existingUser.isActive) return next()
        // 1️⃣ Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        request.body.password=hashedPassword
        user.createOwner(request.body).then(res => {
            if (!res.status) throw {}
            request.body.userId = res.data.insertedId
            return next()
        }).catch(error => {
            request.logger.error("Error in register",{ stack: error.stack });
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error("Error in register",{ stack: error.stack });
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const generateAuthToken = async (request, response, next) => {
    try {
        const minutes = 100000
        const expirationTime = Math.floor(Date.now() / 1000) + minutes * 60;
        const payload = {userId : request.body.authUser._id, roleId : request.body.authUser.roleId}
        const token = generateToken(payload, process.env.AUTHTOKEN_SECRETKEY, expirationTime)

        request.body.token = token
        return next()

    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const login = async(request, response, next) => {
    try {
        const { authUser, password } = request.body;
        const isMatch = await bcrypt.compare(password, authUser.password);
        if (!isMatch) {
            return apiResponse.validationError(response, `Incorrect Password, Please try again!`);
        }
        return next()
    } catch (error) {
        return apiResponse.somethingResponse(error, error?.message)
    }
}


export const isAuth=async(request,response,next)=>{
    try{
        const authHeader=request.headers['authorization'];
        const authToken=authHeader.split(" ")[1]
        if(!authToken){
            return apiResponse.unauthorizedResponse(response,'Unauthorized')
        }
        request.body.token=authToken  
        const authenticUser=await verifyToken(authToken,process.env.AUTHTOKEN_SECRETKEY)
        // If verification failed
        if (!authenticUser || authenticUser instanceof Error) {
            return apiResponse.unauthorizedResponse(res, "Unauthorized: Invalid or expired token");
        }
        request.body.userId=authenticUser.userId



    }catch(error){
        request.logger.error("Error in isAuth controller ",{ stack: error.stack });
        return apiResponse.somethingResponse(response);
    }
}


export const resetPwdChecks = async(request, response, next) => {
    try {
        let body = request.body
        // const hashedPassword = await bcrypt.hash(password, 10);
        // request.body.password=hashedPassword
        if(body.password==undefined || body.password=="") return apiResponse.notFoundResponse(response, "Please provide password")
      
        if(!isPasswordValid(body.password)) return apiResponse.notFoundResponse(response, "Password must contain 1 upper case, 1 lower case, 1 special character, 1 number ")
        if(body.password.length < 8) return apiResponse.notFoundResponse(response, "Password length Should be Equal to or more than 8 Characters")
        
        const hashedPassword=await bcrypt.hash(password,10)
        request.body.password=hashedPassword

        return next()
    } catch (error) {
        return apiResponse.somethingResponse(response, error)
    }
}