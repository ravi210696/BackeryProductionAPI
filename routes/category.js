import { Router } from "express";
import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from "../controllers/user/user.js";
import {celebrate} from 'celebrate';
import { validation } from "../helper/validationSchema.js";
import * as category from "../controllers/category/category.js";

const router = Router();

router.post('add/',
   celebrate(validation.addingCategory),
   auth.isAuth,
    user.isUserValid,
    category.isexistingcategory,
    category.addingCategory,
   (request,response) => {
      return  apiResponse.successResponse(response, "Category Added successfully")
   }
)

router.get('/list',
    auth.isAuth,
    user.isUserValid,   
    category.getCategoryList,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Category List fetched successfully", request.body.categoryList)
    }   
)
router.post('/update/details',
    celebrate(validation.updateCategoryDetails),
    auth.isAuth,
    user.isUserValid,
    category.updateCategoryDetails,
    (request, response) => {
        return apiResponse.successResponse(response, "Category details updated successfully")
    }
)
export default router;