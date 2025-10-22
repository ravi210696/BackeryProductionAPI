import * as user from '../../models/user/user.js';
import * as apiResponse from '../../helper/apiResponse.js';
import * as category from '../../models/category/category.js';


export const addingCategory = async (request, response, next) => {
    try {
        const result = await category.createCategory(request.body); 
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to add category");
        }   
        return next();
    } catch (error) {
        request.logger.error("Error in addingCategory", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }   
};

export const isexistingcategory = async (request, response, next) => {
    try {
        const existingCategory = await category.getCategoryByName(request.body);    
        if (existingCategory.status && existingCategory.data) {
            return apiResponse.validationError(response, "Category with this name already exists");
        }   
        return next();
    } catch (error) {
        request.logger.error("Error in isexistingcategory", { stack: error.stack });
        return apiResponse.somethingResponse(response);
    }
};
export const getCategoryList = async (request, response, next) => {
    try {
        const categoryList = await category.getCategories(request.body);   
        if (!categoryList.status) {
            return apiResponse.notFoundResponse(response, "No category list");
        }   
        request.body.categoryList = categoryList.data;
        return next();
    } catch (error) {
        request.logger.error("Error in getCategoryList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};   

export const updateCategoryDetails = async (request, response, next) => {
    try {   
        const result = await category.updateCategoryById(request.body);
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to update category details");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in updateCategoryDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};