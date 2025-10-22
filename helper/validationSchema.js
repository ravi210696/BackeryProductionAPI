import {Joi} from 'celebrate';
import {ObjectId} from 'mongodb';

export let validation = {
    registration: {
        body: Joi.object().keys({
            mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
            password: Joi.string().min(8).required(),
            roleId: Joi.number().valid(1).required(), // 1 = owner
            productionName: Joi.string().required(),
            address: Joi.string().required(),
            email: Joi.string().email().optional(),
            name: Joi.object({
                firstName: Joi.string().min(3).required(),
                middleName: Joi.string().allow('').optional(),
                lastName: Joi.string().allow('').optional(),
            }).required()
        })
    }
}