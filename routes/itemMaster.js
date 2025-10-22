import { Router } from "express";
import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from "../controllers/user/user.js";
import {celebrate} from 'celebrate';
import { validation } from "../helper/validationSchema.js";
import * as itemMaster from "../controllers/itemMaster/itemMaster.js";


const router = Router();

router.post('/add/item',
   celebrate(validation.addingItemMaster),
   auth.isAuth,
    user.isUserValid,
    itemMaster.isexistingItem,
    itemMaster.addItemMaster,   
    (request,response) => {
        return  apiResponse.successResponse(response, "Item Added successfully")
    }
)

router.get('/item/list',
    auth.isAuth,
    user.isUserValid,   
    itemMaster.getItemMasterList,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Item List fetched successfully", request.body.itemMasterList)
    }   
)

router.post('/update/item/details',
    celebrate(validation.updateItemMasterDetails),
    auth.isAuth,
    user.isUserValid,
    itemMaster.updateItemMasterDetails,
    (request, response) => {
        return apiResponse.successResponse(response, "Item details updated successfully")
    }
)

export default router;

