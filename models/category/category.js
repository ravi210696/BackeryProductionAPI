import { ObjectId } from "mongodb";
import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany,aggregationWithPegination, getOne, updateOne,  updateOneWithupsert,findWithPegination} from '../../helper/mongo.js';
import { logger } from '../../helper/logger.js';


const collection_name = "category"


export const createCategory  = async (body) => {   
    try {
        let query = {  
            // orgId: new ObjectId(body.user.orgId), 
            categoryName: body.categoryName,
            description: body.description,
            createdBy: new ObjectId(body.user._id),
            createdDate: body.createdDate
        };
        return await create(query, collection_name);
    } catch (error) {
        logger.error('error in createCategory in category model function');
        throw error;
    }
};

export const getCategoryByName = async (body) => {  
    try {
        let query = {
            categoryName: body.categoryName,
            // orgId: new ObjectId(body.user.orgId),
            isActive: true
        };
        return await getOne(query, collection_name);
    } catch (error) {
        logger.error('error in getCategoryByName in category model function');
        throw error;
    }   
};  

export const getCategories= async (body) => {
    try {
        let query = {
            // orgId: new ObjectId(body.user.orgId),
            isActive: true
        };
        return await getMany(query, collection_name);
    } catch (error) {
        logger.error('error in getCategoriesByUserId in category model function');
        throw error;
    }
};

export const updateCategoryById = async (body) => { 
    try {
        let query = {
            _id: new ObjectId(body.categoryId)  
        };
        let updateData = {
            $set: {}
        };      
        if (body.categoryName) {
            updateData.$set.categoryName = body.categoryName;
        }
        if (body.description) {
            updateData.$set.description = body.description;
        }  
        
        if (body.isActive !== undefined) {
            updateData.$set.isActive = body.isActive;
        }
        return await update(query, updateData, collection_name);
    } catch (error) {
        logger.error('error in updateCategoryById in category model function');
        throw error;
    }
};