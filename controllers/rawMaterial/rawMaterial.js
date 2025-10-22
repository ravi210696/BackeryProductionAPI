import * as apiResponse from '../../helper/apiResponse.js'
import * as itemMaster from '../../models/itemMaster/itemMaster.js';
import * as rawMaterial from '../../models/rawMaterial/rawMaterial.js';

export const addRawMaterial = async (request, response, next) => {
    try {
        const result = await rawMaterial.createRawMaterial(request.body);
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to add raw material");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in addRawMaterial", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};



export const isexistingRawMaterial = async (request, response, next) => {
    try {
        const existingRawMaterial = await rawMaterial.getRawMaterialByItemId(request.body);
        if (existingRawMaterial.status && existingRawMaterial.data) {
            return apiResponse.validationError(response, "Raw Material with this name already exists");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in isexistingRawMaterial", { stack: error.stack });
        return apiResponse.somethingResponse(response);
    }   
};

export const getRawMaterialList = async (request, response, next) => {
    try {
        const rawMaterialList = await rawMaterial.getRawMaterials(request.body);
        if (rawMaterialList?.data?.length<1) {
            return apiResponse.notFoundResponse(response, "No raw material list");
        }
        request.body.rawMaterialList = rawMaterialList.data;
        return next();
    } catch (error) {
        request.logger.error("Error in getRawMaterialList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const updateRawMaterialDetails = async (request, response, next) => {
    try {
        const result = await rawMaterial.updateRawMaterialById(request.body);
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to update raw material details");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in updateRawMaterialDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};


