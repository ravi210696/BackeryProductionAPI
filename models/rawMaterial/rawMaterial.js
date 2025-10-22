import { ObjectId } from "mongodb";
import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany,aggregationWithPegination, getOne, updateOne,  updateOneWithupsert,findWithPegination,createMany} from '../../helper/mongo.js';
import { logger } from '../../helper/logger.js';

const collection_name = "rawMaterial"

export const createRawMaterial  = async (body) => { 
    try {
        
        const rawMaterials=body.rawMaterials.map(item=>({
            orgId: new ObjectId(body.user.orgId),
            itemId: new ObjectId(item.itemId),
            ...item,
            createdBy: new ObjectId(body.user._id),
            createdDate: body.createdDate
        }));

        if(rawMaterials.length<1) throw new Error('rawMaterials array is empty');

        const uniqueItemIds = new Set(rawMaterials.map(r => r.itemId.toString()));
        if (uniqueItemIds.size !== rawMaterials.length) {
            throw new Error('Duplicate itemIds found in rawMaterials');
        }

        return await createMany(rawMaterials, collection_name);
    }
    catch (error) {
        logger.error('error in createRawMaterial in rawMaterial model function');
        throw error;
    }   
};


export const getRawMaterialByItemId = async (body) => {
    try {  
        let query = {
            orgId: new ObjectId(body.user.orgId),
            isActive: true
        };
        return await getMany(query, collection_name);
    } catch (error) {
        logger.error('error in getRawMaterialsById in rawMaterial model function');
        throw error;
    }
};


export const updateRawMaterialById = async (body) => { 
    try {
        let query = {   
            _id: new ObjectId(body.rawMaterialId),
            orgId: new ObjectId(body.user.orgId)
        };
        let updateData = {
            $set: {}
        };
        if (body.itemId) {
            updateData.$set['itemId'] = new ObjectId(body.itemId);
        }
        if (body.quantity) {
            updateData.$set['quantity'] = body.quantity;
        }
        if (body.unit) {
            updateData.$set['unit'] = body.unit;
        }
        if (body.isActive !== undefined) {
            updateData.$set['isActive'] = body.isActive;
        }

        if(body.materialName){
            updateData.$set['materialName'] = body.materialName;
        }
        
        return await updateOne(query, updateData, collection_name);
    } catch (error) {
        logger.error('error in updateRawMaterialById in rawMaterial model function');
        throw error;
    }
};
export const getRawMaterials= async (body) => {
    try {
        let query = {
            itemId: new ObjectId(body.itemId),
            orgId: new ObjectId(body.user.orgId),
            isActive: true
        };  

        const pipeline = [
            { $match: query },
            {   
                $lookup: {
                    from: 'itemMaster',
                    localField: 'itemId',
                    foreignField: '_id',
                    as: 'itemDetails'
                }
            },
            {
                $unwind: {
                    preserveNullAndEmptyArrays: true,
                    path: '$itemDetails'
                }
            },
            {
                $lookup: {
                    from: 'category',
                    localField: 'itemDetails.categoryId',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: {
                    preserveNullAndEmptyArrays: true,   
                    path: '$categoryDetails'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    orgId: { $first: '$orgId' },
                    itemId: { $first: '$itemId' },
                    // quantity: { $first: '$quantity' },
                    // rate: { $first: '$rate' },
                    isActive: { $first: '$isActive' },
                    createdBy: { $first: '$createdBy' },
                    createdDate: { $first: '$createdDate' },
                    itemDetails: { $push: '$itemDetails' }
                }
            },
            {
                $project: {
                    orgId: 1,
                    itemId: 1,
                    itemName: '$itemDetails.itemName',
                    categoryId: '$itemDetails.categoryId',
                    categoryName: '$categoryDetails.categoryName',
                    description: '$itemDetails.description',
                    // quantity: 1,
                    // rate: 1,
                    isActive: 1,    
                    createdBy: 1,
                    createdDate: 1,
                    itemDetails: 1
                }
            }
        ]
        return await aggregate(pipeline, collection_name);
    } catch (error) {
        logger.error('error in getRawMaterialByItemId in rawMaterial model function');
        throw error;
    }
};