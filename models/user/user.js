import { ObjectId } from "mongodb";
import { aggregate, bulkWriteOperations, create, findOneAndUpdate, getMany,aggregationWithPegination, getOne, updateOne,  updateOneWithupsert,findWithPegination} from '../../helper/mongo.js';
import { logger } from '../../helper/logger.js';


const collection_name = "user"

export const getUserbyMobile = async (body) => {
  try {
    let query = {
      mobile: body.mobile
    }

    return await getOne(query, collection_name)
  } catch (error) {
    logger.error('error in getUserbyMobile in user model function')
    throw error
  }
}


export const createUser = async (body) => {
  try {
    let query = {
      mobile: body.mobile,
      password: body.password,
      roleId:body.roleId,
      productionName:body.productionName,
      address:body.address,
      createdDate: new Date(),
      isActive: true,
    //   defaultLanguage: body.defaultLanguage ? body.defaultLanguage : "en",
      name: body.name
    }
    
    if (body.email) {
      query['email'] = body.email
    }
    
    return await create(query, collection_name)
  }
  catch (error) {
    logger.error('error in create user in user model function')
    throw error;
  }
}


export const getAuthUser = async (body) => {
  try {
    const query = body.mobile ? { mobile: body.mobile } : body.email ? { email: body.email } : null;

    // let query
    // if (body.mobile) {
    //   query = {
    //     mobile: body.mobile
    //   }
    // }

    // if (body.email) {
    //   query = {
    //     email: body.email
    //   }
    // }
    return await getOne(query, collection_name)
  } catch (error) {
    throw error;

  }
}


export const getUser = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.userId),
      isActive: true
    }
    body.actionType ? delete query["isActive"] : undefined
    //return await mongoDbService.getOne(collection_name,query);
    return await getOne(query, collection_name)
  } catch (error) {
    logger.error('error in getUser in user model function',{stack:error.stack})
    throw error
  }
}

export const updatePassword = async (body) => {
  try {
    let query = {
      _id: new ObjectId(body.userId),
    }

    let update = {
      $set: {
        password: body.password
      },
    }

    return await updateOne(query, update, collection_name)

  } catch (error) {
    return { status: false, message: "failed to update password", error }

  }
}
