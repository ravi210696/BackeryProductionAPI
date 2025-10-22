import { ObjectId } from "mongodb";
import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany,aggregationWithPegination, getOne, updateOne,  updateOneWithupsert,findWithPegination} from '../../helper/mongo.js';
import { logger } from '../../helper/logger.js';


const collection_name = "shops"

export const getShopByName = async (body) => {   
    try {
        let query = {   
            shopName: body.shopName,
            orgId: new ObjectId(body.user.orgId)
        };
        return await getMany(query, collection_name);
    } catch (error) {
        logger.error('error in getShopByName in shops model function');
        throw error;
    }   
};

export const createShop  = async (body) => {   
    try {
        let query = {
            orgId: new ObjectId(body.user.orgId),
            shopName: body.shopName,
            address: body.address,
            ...(body.address&& {address: body.address}),
            ...(body.gstNumber&& {gstNumber: body.gstNumber}),
            ...(body.ownerName&& {ownerName: body.ownerName}),
            ...(body.contactNumber&& {contactNumber: body.contactNumber}),
            createdBy: new ObjectId(body.user._id),
            createdDate: body.createdDate
        };
        
        return await create(query, collection_name);
    } catch (error) {
        logger.error('error in createShop in shops model function');
        throw error;
    }
};

export const getShopsByUserId = async (body) => {
    try {
        let query = {
            orgId: new ObjectId(body.user.orgId),
            isActive: true
        };
        return await getMany(query, collection_name);
    } catch (error) {
        logger.error('error in getShopsByUserId in shops model function');
        throw error;
    }
};

export const updateShopById = async (body) => { 
    try {
        let query = {
            _id: new ObjectId(body.shopId)  
        };
        let updateData = {
            $set: {}
        };

        if (body.shopName) {
            updateData.$set.shopName = body.shopName;
        }
        if (body.address) {
            updateData.$set.address = body.address;
        }   
        if (body.gstNumber) {
            updateData.$set.gstNumber = body.gstNumber;
        }   
        if (body.ownerName) {
            updateData.$set.ownerName = body.ownerName;
        }
        if (body.contactNumber) {
            updateData.$set.contactNumber = body.contactNumber;
        }
        if(body.isActive !== undefined){
            updateData.$set.isActive = body.isActive;
        }
        return await updateOne(query, updateData, collection_name);
    } catch (error) {
        logger.error('error in updateShopById in shops model function');
        throw error;
    }
};

