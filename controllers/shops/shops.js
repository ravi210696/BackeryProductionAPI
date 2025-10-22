import * as user from '../../models/user/user.js';
import * as apiResponse from '../../helper/apiResponse.js'
import * as shop from '../../models/shops/shops.js';

export const isexistingShop = async (request, response, next) => {
    try {
        const { shopName } = request.body;
        const existingShop = await shop.getShopByName({ shopName });    
        if (existingShop.status && existingShop.data.length > 0) {
            return apiResponse.validationError(response, "Shop with this name already exists");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in isexistingShop", { stack: error.stack });
        return apiResponse.somethingResponse(response);
    }
};

export const addShops = async (request, response, next) => {   
    try {
        if(request.body.user.roleId !== 1) {
            return apiResponse.unauthorizedResponse(response, "Only admin can add shops");
        }
        const result = await shop.createShop(request.body);
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to add shop");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in addShops", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const getShopList = async (request, response, next) => {
    try {
        const shopList = await shop.getShopsByUserId({userId: request.user.id});
        if (!shopList.status) {
            return apiResponse.notFoundResponse(response, "No shop list");
        }
        request.body.shopList = shopList.data;
        return next();
    } catch (error) {
        request.logger.error("Error in getShopList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }   
};
export const updateShopDetails = async (request, response, next) => {
    try {
        if(request.body.user.roleId !== 1) {
            return apiResponse.unauthorizedResponse(response, "Only admin can update shops");
        }
        const result = await shop.updateShopById(request.body);
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to update shop details");
        }   
        return next();
    } catch (error) {
        request.logger.error("Error in updateShopDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};