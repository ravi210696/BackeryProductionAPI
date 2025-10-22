import { ObjectId } from "mongodb";
import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany,aggregationWithPegination, getOne, updateOne,  updateOneWithupsert,findWithPegination} from '../../helper/mongo.js';
import { logger } from '../../helper/logger.js';

const collection_name = "itemMaster"

export const createItemMaster  = async (body) => {  
    try {
        let query = {  
            orgId: new ObjectId(body.user.orgId), 
            itemName: body.itemName,
            categoryId: new ObjectId(body.categoryId),
            unit: body.unit,
            ...(body.price&& {price: body.price}),
            ...(body.description&& {description: body.description}),
            createdBy: new ObjectId(body.user._id), 
            createdDate: body.createdDate
        };
        return await create(query, collection_name);
    }   
    catch (error) {
        logger.error('error in createItemMaster in itemMaster model function');
        throw error;
    }
};

export const getItemByName = async (body) => {
    try {  
        let query = {
            itemName: body.itemName,
            orgId: new ObjectId(body.user.orgId),
            isActive: true
        };
        
        return await getOne(query, collection_name);
    } catch (error) {
        logger.error('error in getItemByName in itemMaster model function');
        throw error;
    }
};  

// export const getItemMasters= async (body) => {  
//     try {
//         let query = {
//             orgId: new ObjectId(body.user.orgId),
//             isActive: true
//         };
//         return await getMany(query, collection_name);
//     } catch (error) {
//         logger.error('error in getItemMastersByUserId in itemMaster model function');
//         throw error;
//     }
// };

export const getItemMasters = async (body) => {
    try {  
        let query = {
            // itemName: body.itemName,
            orgId: new ObjectId(body.user.orgId),
            isActive: true
        };

        if(body.itemId){
            query['_id'] =  new ObjectId(body.itemId);
        }

        if(body.categoryId){
            query['categoryId'] = new ObjectId(body.categoryId);
        }

        if(body.itemName){
            query['itemName'] = body.itemName;
        }

        const pipeline = [
            { $match: query },
            {
                from:'category',
                localField:'categoryId',
                foreignField:'_id',
                as:'categoryDetails'
            },
            {
                $unwind:{
                    preservenumEmptyAndNullArrays:true,
                    path:'$categoryDetails',
                }
            },
            {
                $project:{
                    itemName:1,
                    price:1,
                    unit:1,
                    description:1,
                    categoryDetails: '$categoryDetails.categoryName'
                }
            }
        ];

        return await aggregate(pipeline, collection_name);

    } catch (error) {
        logger.error('error in getItemByName in itemMaster model function');
        throw error;
    }
};  


export const updateItemMasterById = async (body) => {  
    try {
        let query = {
            _id: new ObjectId(body.itemId)
        };
        let updateData = {
            $set: {}
        };
        if (body.itemName) {
            updateData.$set['itemName'] = body.itemName;
        }
        if (body.categoryId) {
            updateData.$set['categoryId'] = new ObjectId(body.categoryId);
        }
        if (body.price) {
            updateData.$set['price'] = body.price;
        }
        if (body.description) {
            updateData.$set['description'] = body.description;
        }

        if (body.unit) {
            updateData.$set['unit'] = body.unit;
        }

        if (body.isActive !== undefined) {
            updateData.$set['isActive'] = body.isActive;
        }

        return await updateOne(query, updateData, collection_name);
    } catch (error) {
        logger.error('error in updateItemMasterById in itemMaster model function');
        throw error;
    }   
};