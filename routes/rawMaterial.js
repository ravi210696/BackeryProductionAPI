import { Router } from "express";
import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from "../controllers/user/user.js";
import {celebrate} from 'celebrate';
import { validation } from "../helper/validationSchema.js";
import * as rawMaterial from "../controllers/rawMaterial/rawMaterial.js";


const router = Router();

router.post('/add/raw/material',
   celebrate(validation.addingRawMaterial),
   auth.isAuth, 
    user.isUserValid,
    rawMaterial.isexistingRawMaterial,
    rawMaterial.addRawMaterial,   
    (request,response) => {
        return  apiResponse.successResponse(response, "Raw Material Added successfully")
    }
)

router.get('/raw/material/list',
    auth.isAuth,
    user.isUserValid,
    rawMaterial.getRawMaterialList,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Raw Material List fetched successfully", request.body.rawMaterialList)
    }
)   

router.post('/update/raw/material/details',
    celebrate(validation.updateRawMaterialDetails),
    auth.isAuth,
    user.isUserValid,
    rawMaterial.updateRawMaterialDetails,
    (request, response) => {
        return apiResponse.successResponse(response, "Raw Material details updated successfully")
    }
)

export default router;