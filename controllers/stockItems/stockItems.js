import * as apiResponse from '../../helper/apiResponse.js'
import * as itemMaster from '../../models/itemMaster/itemMaster.js';
import * as rawMaterial from '../../models/rawMaterial/rawMaterial.js';
import * as stockItems from '../../models/stockItems/stockItems.js';

export const addStockItems = async (request, response, next) => {
    try {
        const result = await stockItems.createStockItems(request.body); 
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to add stock items");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in addStockItems", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

// export const isexistingStockItems = async (request, response, next) => {
//     try {
//         const existingStockItems = await stockItems.getStockItemsByItemId(request.body);
//         if (existingStockItems.status && existingStockItems.data) {
//             return apiResponse.validationError(response, "Stock Items with this item already exists");
//         }
//         return next();
//     } catch (error) {
//         request.logger.error("Error in isexistingStockItems", { stack: error.stack });
//         return apiResponse.somethingResponse(response);
//     }   
// };        

export const getStockItemsList = async (request, response, next) => {   
    try {
        const stockItemsList = await stockItems.getStockItemsWithDetails(request.body);
        if (stockItemsList?.data?.length<1) {
            return apiResponse.notFoundResponse(response, "No stock items list");
        }
        request.body.stockItemsList = stockItemsList.data;
        return next();
    }
    catch (error) {
        request.logger.error("Error in getStockItemsList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const updateStockItemsDetails = async (request, response, next) => {
    try {
        const result = await stockItems.updateStockItemById(request.body);
        
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to update stock items details");
        }

        return next();

    } catch (error) {
        request.logger.error("Error in updateStockItemsDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};    
