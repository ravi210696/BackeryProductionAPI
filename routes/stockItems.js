import { Router } from "express";
import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from "../controllers/user/user.js";
import {celebrate} from 'celebrate';
import { validation } from "../helper/validationSchema.js";
import * as stockItems from "../controllers/stockItems/stockItems.js";

const route=Router()
route.post('/add/stock/items',
    celebrate(validation.addingStockItems),
    auth.isAuth,
    user.isUserValid,
    // stockItems.isexistingStockItems,
    stockItems.addStockItems,
    (request,response)=>{
        return apiResponse.successResponse(response,"Stock Items added successfully")
    }
)

route.get('/stock/items/list',
    auth.isAuth,
    user.isUserValid,
    stockItems.getStockItemsList,
    (request,response)=>{
        return apiResponse.successResponseWithData(response,"Stock Items List fetched successfully",request.body.stockItemsList)
    }
)
route.post('/update/stock/items/details',
    celebrate(validation.updateStockItemsDetails),
    auth.isAuth,
    user.isUserValid,
    stockItems.updateStockItemsDetails,
    (request,response)=>{
        return apiResponse.successResponse(response,"Stock Items details updated successfully")
    }
)

export default route;