import * as user from '../../models/user/user.js';
import * as apiResponse from '../../helper/apiResponse.js'
import * as itemMaster from '../../models/itemMaster/itemMaster.js';

export const addItemMaster = async (request, response, next) => {
    try {
        const result = await itemMaster.createItemMaster(request.body); 
        if (!result.status) {   
            return apiResponse.validationError(response, "Failed to add item");
        }   
        return next();
    } catch (error) {
        request.logger.error("Error in addItemMaster", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }   
};

export const isexistingItem = async (request, response, next) => {
    try {
        const existingItem = await itemMaster.getItemByName(request.body);
        if (existingItem.status && existingItem.data) {
            return apiResponse.validationError(response, "Item with this name already exists");
        }   
        return next();
    } catch (error) {
        request.logger.error("Error in isexistingItem", { stack: error.stack });
        return apiResponse.somethingResponse(response);
    }
};
export const getItemMasterList = async (request, response, next) => {
    try {
        const itemMasterList = await itemMaster.getItemMasters(request.body);   
        if (itemMasterList?.data?.length<1) {
            return apiResponse.notFoundResponse(response, "No item list");
        }
        request.body.itemMasterList = itemMasterList.data;
        return next();
    } catch (error) {
        request.logger.error("Error in getItemMasterList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const updateItemMasterDetails = async (request, response, next) => {
    try {   
        const result = await itemMaster.updateItemMasterById(request.body);
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to update item details");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in updateItemMasterDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }   
};