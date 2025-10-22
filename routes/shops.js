import { Router } from "express";
import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from "../controllers/user/user.js";
import {celebrate} from 'celebrate';
import { validation } from "../helper/validationSchema.js";
import * as shop from "../controllers/shops/shops.js";

const router = Router();

router.post('add/shops',
   celebrate(validation.addingShop),
   auth.isAuth,
    user.isUserValid,
    shop.isexistingShop,
    shop.addShops,
   (request,response) => {
      return  apiResponse.successResponse(response, "Shop Added successfully")
   }
)

router.get('/shop/list',
    auth.isAuth,
    user.isUserValid,
    shop.getShopList,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Shop List fetched successfully", request.body.shopList)
    }
)


router.post('/update/shop/details',
    celebrate(validation.updateShopDetails),
    auth.isAuth,
    user.isUserValid,
    shop.updateShopDetails,
    (request, response) => {
        return apiResponse.successResponse(response, "Shop details updated successfully")
    }
)

export default router;

