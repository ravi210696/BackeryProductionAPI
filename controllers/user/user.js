import * as user from '../../models/user/user.js';
import * as apiResponse from '../../helper/apiResponse.js'
import { isValidMobileNumber, isValidEmail, isValidMobilewithCountryCode, isPasswordValid } from '../../helper/validator.js';

export const isMobileExist = (request, response, next) => {
    try {

        user.getUserbyMobile(request.body).then(res => {

            if (res.status) {
                if(!res.data.isActive) return apiResponse.validationError(response, "Inactive User")
                request.body.existingUser = res.data;

                request.logger.debug(JSON.stringify(request.body.existingUser));
                return next()
            }
            else {
                request.body.notExist = true
                return next()
            }
        }).catch(err => {
            request.logger.error("Error in isMobileExist" ,{ stack: error.stack });
            return apiResponse.somethingResponse(response)
        })

    } catch (error) {
        return apiResponse.somethingResponse(response)
    }
}


export const getAuthUser = async (request, response, next) => {
    try {
        let body = request.body
        // Check if either email or mobile number is provided
        if (!body.email && !body.mobile) {
            return apiResponse.notFoundResponse(response, "Please provide either an email or a mobile number");
        }
        // Validate mobile number if provided
        if (body.mobile) {
            if (body.mobile === "" || !isValidMobileNumber(body.mobile)) {
                return apiResponse.notFoundResponse(response, "Please enter a valid mobile number");
            }
        }
        // Validate email if provided
        if (body.email) {
            if (body.email === "" || !isValidEmail(body.email)) { // Assuming `isValidEmail` is a function for email validation
                return apiResponse.notFoundResponse(response, "Please enter a valid email");
            }
        }
        user.getAuthUser(request.body).then(res => {
            //is not registered
            if (!res.status) return apiResponse.notFoundResponse(response, "User not found. Create your account.")
            request.body.authUser = res.data
            return next()
        }).catch(error => {
            request.logger.error("Error while getAuthUser in user controller ", { stack: error.stack });
            return apiResponse.ErrorResponse(response, "Something went worng", error.toString())
        })
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const isUserValid = async (request, response, next) => {
    try {
        user.getUser(request.body).then(res => {
            //is not registered
            if (!res.status) return apiResponse.notFoundResponse(response, "Invalid user")

            request.body.user = res.data


            return next()
        }).catch(error => {
            request.logger.error('error in isUservalid',{stack:error.stack})
            return apiResponse.somethingResponse(response, error.message)
        })
    } catch (error) {
        request.logger.error('error in isUservalid',{stack:error.stack})
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const resetPassword = async (request, response, next) => {
    try {
        const { authUser, password } = request.body;
        const isMatch = await bcrypt.compare(password, authUser.password);
        
        //db password == new password
        if (isMatch) return apiResponse.validationError(response, "You are using old password")

        user.updatePassword(request.body).then(res => {
            if (!res.status) throw {}
            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Failed to reset password")
        })

    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}


export const employessExisting = async (request, response, next) => {
    try {
        if(requestbody.user.roleId !=1){
            return apiResponse.unauthorizedResponse(response, "Only admin can add employees")
        }
        const employees = request.body.employees;
        const duplicateMobiles = [];

        // Check each mobile
        for (const emp of employees) {
            const existing = await user.getUserbyMobile({ mobile: emp.mobile });
            if (existing.status) duplicateMobiles.push(emp.mobile);
        }

        if (duplicateMobiles.length > 0) {
            return apiResponse.validationError(response, `Duplicate mobile numbers: ${duplicateMobiles.join(', ')}`);
        }

        return next();
    } catch (error) {
        request.logger.error("Error in employessExisting", { stack: error.stack });
        return apiResponse.somethingResponse(response);
    }
};


export const addEmployees = async (request, response, next) => {
    try {
        const employees = request.body.employees;

        for (const emp of employees) {
            const hashedPassword = await bcrypt.hash(emp.password ??'12345678', 10);

            const userBody = {
                orgId: request.body.user.orgId,
                mobile: emp.mobile,
                password: hashedPassword,
                roleId: 2, // employee
                address: emp.address,
                email: emp.email,
                createdDate: new Date(),
                isActive: true,
                name: emp.name,
                employeeId: emp.employeeId
            };

            await user.createUser(userBody);
        }

        return next();
    } catch (error) {
        request.logger.error("Error in addEmployees", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const getEmployeeList = async (request, response, next) => {
    try {
        const orgId = request.body.user.orgId;
        const employeeList = await user.getEmployeesByOrgId({orgId}); 
        if (!employeeList.status) {
            return apiResponse.notFoundResponse(response, "No employee list");
        }
        request.body.employeeList = employeeList.data;
        return next();
    } catch (error) {
        request.logger.error("Error in getEmployeeList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const updateEmployeeDetails = async (request, response, next) => {
    try {
        const result = await user.updateEmployeeById(request.body);
        if (!result.status) {
            return apiResponse.validationError(response, "Failed to update employee details");
        }
        return next();
    } catch (error) {
        request.logger.error("Error in updateEmployeeDetails", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }   
};

