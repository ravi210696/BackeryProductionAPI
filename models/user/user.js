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


export const createOwner  = async (body) => {
  try {
    let query = {
      mobile: body.mobile,
      password: body.password,
      roleId:1,
      // productionName:body.productionName,
      address:body.address,
      createdDate: new Date(),
      isActive: true,
    //   defaultLanguage: body.defaultLanguage ? body.defaultLanguage : "en",
      name: body.name
    }
    
    if (body.email) {
      query['email'] = body.email
    }
    if(body.productionName){
      const addOrganization = await create({ productionName: body.productionName }, 'organization');
      if(!addOrganization.status) throw new Error('Failed to create organization')
      query['orgId'] =new ObjectId(addOrganization.data.insertedId)
    }
    
    return await create(query, collection_name)
  }
  catch (error) {
    logger.error('error in create user in user model function')
    throw error;
  }
}


export const createUser = async (body) => {
  try {
    let query = {
      mobile: body.mobile,
      password: body.password,
      roleId:body.roleId,
      // productionName:body.productionName,
      address:body.address,
      createdDate: new Date(),
      isActive: true,
    //   defaultLanguage: body.defaultLanguage ? body.defaultLanguage : "en",
      name: body.name
    }
    
    if (body.email) {
      query['email'] = body.email
    }
    if(body.productionName){
      query['productionName'] = body.productionName
    }
    if(body.orgId){
      query['orgId'] = new ObjectId(body.orgId)
    }
    if(body.employeeId){
      query['employeeId'] = body.employeeId
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

export const getEmployeesByOrgId = async (body) => {
  try {
    let query = { 
      orgId: new ObjectId(body.orgId),
      roleId: 2 ,// employee role
      isActive: true
    }

    return await getMany(query, collection_name)
  } catch (error) {
    logger.error('error in getEmployeesByOrgId in user model function',{stack:error.stack})
    throw error
  }   
}

export const updateEmployeeById = async (body) => {
    try {
      const { employeeId, isActive, name, mobile, email, address } = body;    
      const updateData = {};
      if (isActive !== undefined) updateData.isActive = isActive;
      if (name) updateData.name = name;
      if (mobile) updateData.mobile = mobile;
      if (email) updateData.email = email;
      if (address) updateData.address = address;
        let query = {
            _id: new ObjectId(employeeId),
            roleId: 2 // employee role
        };  
        let update = {
            $set: updateData
        };
        return await updateOne(query, update, collection_name);
    } catch (error) {
        logger.error('error in updateEmployeeById in user model function',{stack:error.stack})
        throw error;
    }
};
