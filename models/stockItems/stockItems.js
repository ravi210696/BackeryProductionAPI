import { ObjectId } from "mongodb";
import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany,aggregationWithPegination, getOne, updateOne,  updateOneWithupsert,findWithPegination} from '../../helper/mongo.js';
import { logger } from '../../helper/logger.js';


const collection_name = "stockItems"

export const createStockItems = async (body) => {
    try {
        let query = {
            orgId: new ObjectId(body.user.orgId),
            itemId: new ObjectId(body.itemId),
            quantity: body.quantity,
            unitPrice: body.unitPrice,
            addStock:true,
            ...(body.description && {description: body.description}),
            createdBy: new ObjectId(body.user._id),
            createdDate: body.createdDate
        };
        const existingStockItem = await getOne({orgId: new ObjectId(body.user.orgId),
            itemId: new ObjectId(body.itemId),
            quantity: body.quantity,
            unitPrice: body.unitPrice},collection_name
        );  

    
        if(existingStockItem.status) throw new Error('Stock Item already exists'); 

        return await create(query, collection_name);
    } catch (error) {
        logger.error('error in createStockItem in stockItems model function');
        throw error;
    }   
};

export const getStockItemsByOrgId = async (body) => {   
    try {
        let query = {   
            orgId: new ObjectId(body.user.orgId),
            isActive: true
        };
        return await getMany(query, collection_name);
    } catch (error) {
        logger.error('error in getStockItemsByOrgId in stockItems model function');
        throw error;
    }
};


export const updateStockItemById = async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.stockItemId)
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
        if (body.isActive !== undefined) {
            updateData.$set['isActive'] = body.isActive;
        }
        if( body.unitPrice) {
            updateData.$set['unitPrice'] = body.unitPrice;
        }
        if( body.description) {
            updateData.$set['description'] = body.description;
        }
            
        return await updateOne(query, updateData, collection_name);

    } catch (error) {
        logger.error('error in updateStockItemById in stockItems model function');
        throw error;
    }
};






export const getStockItemsWithDetails = async (body) => {
  try {
    const query = {
      orgId: new ObjectId(body.user.orgId),
      isActive: true
    };

    if(body.itemId){
      query['itemId'] = new ObjectId(body.itemId);
    }

    //  Date filter (optional)
    if (body.fromDate && body.toDate) {
      query.createdDate = {
        $gte: new Date(body.fromDate),
        $lte: new Date(body.toDate)
      };
    } else if (body.fromDate) {
      query.createdDate = { $gte: new Date(body.fromDate) };
    } else if (body.toDate) {
      query.createdDate = { $lte: new Date(body.toDate) };
    }

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
          path: '$itemDetails',
          preserveNullAndEmptyArrays: true
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
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          effectiveQty: {
            $cond: [{ $eq: ['$addStock', true] }, '$quantity', { $multiply: ['$quantity', -1] }]
          },
          stockValue: { $multiply: ['$quantity', '$unitPrice'] },
          effectiveStockValue: {
            $cond: [
              { $eq: ['$addStock', true] },
              { $multiply: ['$quantity', '$unitPrice'] },
              { $multiply: [{ $multiply: ['$quantity', '$unitPrice'] }, -1] }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$itemId',
          orgId: { $first: '$orgId' },
          itemName: { $first: '$itemDetails.itemName' },
          unit: { $first: '$itemDetails.unit' },
          categoryName: { $first: '$categoryDetails.categoryName' },
          totalInQty: {
            $sum: { $cond: [{ $eq: ['$addStock', true] }, '$quantity', 0] }
          },
          totalOutQty: {
            $sum: { $cond: [{ $eq: ['$addStock', false] }, '$quantity', 0] }
          },
          totalQuantity: { $sum: '$effectiveQty' },
          totalStockValue: { $sum: '$effectiveStockValue' },
          lastUpdated: { $max: '$createdDate' }
        }
      },
      {
        $project: {
          _id: 0,
          itemId: '$_id',
          itemName: 1,
          unit: 1,
          categoryName: 1,
          totalInQty: 1,
          totalOutQty: 1,
          totalQuantity: 1,
          totalStockValue: 1,
          lastUpdated: 1
        }
      }
    ];

    return await aggregate(pipeline, collection_name);
  } catch (error) {
    logger.error('error in getStockItemsWithDetails in stockItems model function', { stack: error.stack });
    throw error;
  }
};

