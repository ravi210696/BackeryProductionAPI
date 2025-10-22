import {Joi} from 'celebrate';
import {ObjectId} from 'mongodb';

export let validation = {
    registration: {
        body: Joi.object().keys({
            mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
            password: Joi.string().min(8).required(),
            // roleId: Joi.number().valid(1).required(), // 1 = owner
            productionName: Joi.string().required(),
            address: Joi.string().required(),
            email: Joi.string().email().optional(),
            // name: Joi.object({
            //     firstName: Joi.string().min(3).required(),
            //     middleName: Joi.string().allow('').optional(),
            //     lastName: Joi.string().allow('').optional(),
            // }).required()
            name: Joi.string().min(3).required(),
        })
    },
    addingUser: {
    body: Joi.object().keys({
        employees: Joi.array().items(
            Joi.object({
                mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
                // password: Joi.string().min(8).required(),
                // name: Joi.object({
                //     firstName: Joi.string().min(3).required(),
                //     middleName: Joi.string().allow('').optional(),
                //     lastName: Joi.string().allow('').optional(),
                // }).optional(),
                employeeId: Joi.string().optional(),
                name: Joi.string().min(3).required(),
                email: Joi.string().email().optional(),
                address: Joi.string().optional()
            })
        ).min(1).required()
    })
    },

    updateEmployeeDetails: {
        body: Joi.object().keys({
            employeeId: Joi.string().custom((value, helpers) => {   
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');

                }
                return value;
            }).required(),
            isActive: Joi.boolean().optional(),
            name: Joi.object({
                firstName: Joi.string().min(3).optional(),
                middleName: Joi.string().allow('').optional(),  
                lastName: Joi.string().allow('').optional(),
            }).optional(),
            mobile: Joi.string().pattern(/^[0-9]{10}$/).optional(),
            email: Joi.string().email().optional(),
            address: Joi.string().optional()
        })
    },
    addingShop: {
        body: Joi.object().keys({
            shopName: Joi.string().min(3).required(),   
            address: Joi.string().required(),
            gstNumber: Joi.string().optional(),
            ownerName: Joi.string().min(3).required(),
            contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required()
        })
    },

    updateShopDetails: {
        body: Joi.object().keys({
            shopId: Joi.string().custom((value, helpers) => {   
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid'); 
                }
                return value;
            }
            ).required(),
            shopName: Joi.string().min(3).optional(),   
            address: Joi.string().optional(),
            gstNumber: Joi.string().optional(),
            ownerName: Joi.string().min(3).optional(),
            contactNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(),
            isActive: Joi.boolean().optional()
        })
    },

    addingCategory: {
        body: Joi.object().keys({
            categoryName: Joi.string().min(3).required(),
            description: Joi.string().optional(),
        })
    },

    updateCategoryDetails: {
        body: Joi.object().keys({
            categoryId: Joi.string().custom((value, helpers) => {   
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid'); 
                }
                return value;
            }
            ).required(),
            categoryName: Joi.string().min(3).optional(),
            description: Joi.string().optional(),
            isActive: Joi.boolean().optional()
        })
    },

    addingItemMaster: {
        body: Joi.object().keys({
            itemName: Joi.string().min(3).required(),
            categoryId: Joi.string().custom((value, helpers) => {   
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid'); 
                }   
                return value;
            }
            ).required(),
            // price: Joi.number().positive().optional(),
            unit: Joi.string().min(1).required(),
            description: Joi.string().optional(),
        })
    },


    updateItemMasterDetails: {
        body: Joi.object().keys({
            itemId: Joi.string().custom((value, helpers) => {
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }   
            ).required(),
            itemName: Joi.string().min(3).optional(),
            categoryId: Joi.string().custom((value, helpers) => {
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }
            ).optional(),
            // price: Joi.number().positive().optional(),
            unit: Joi.string().min(1).optional(),
            description: Joi.string().optional(),
            isActive: Joi.boolean().optional()
        })
    },

    addingRawMaterial: {
        body: Joi.object().keys({
            itemId: Joi.string().custom((value, helpers) => {
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }   
            ).required(),
            description: Joi.string().optional(),
            rawMaterials: Joi.array().items(
                Joi.object({
                    materialName: Joi.string().min(3).required(),
                    quantity: Joi.number().positive().optional(),
                    unit: Joi.string().min(1).required()
                })
            ).min(1).required() 
        })
    },


    updateRawMaterialDetails: {
        body: Joi.object().keys({
            rawMaterialId: Joi.string().custom((value, helpers) => {
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }
            ).required(),
            itemId: Joi.string().custom((value, helpers) => {
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }
            ).optional(),
            materialName: Joi.string().min(3).optional(),
            quantity: Joi.number().positive().optional(),
            unit: Joi.string().min(1).optional(),
            isActive: Joi.boolean().optional()
        })
    },

    addingStockItems: {
        body: Joi.object().keys({
            itemId: Joi.string().custom((value, helpers) => {  
                if (!ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }
            ).required(),
            quantity: Joi.number().positive().required(),
            unitPrice: Joi.string().min(1).required(),
            description: Joi.string().optional(),
        })
    },

}