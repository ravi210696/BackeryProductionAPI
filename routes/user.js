import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from "../controllers/user/user.js";
import {celebrate} from 'celebrate';
import { validation } from "../helper/validationSchema.js";



router.post(
   "/add/employees",
   celebrate(validation.addingUser),
   auth.isAuth,
   user.isUserValid,
   user.employessExisting,
   user.addEmployees,
   (request,response) => {
      return  apiResponse.successResponse(response, "employees Added successfully")
   }
)

router.get('/employee/list',
    auth.isAuth,
    user.isUserValid,
    user.getEmployeeList,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Employee List fetched successfully", request.body.employeeList)
    }
)

router.post('/update/employee/Details',
    celebrate(validation.updateEmployeeDetails),
    auth.isAuth,
    user.isUserValid,
    user.updateEmployeeDetails,
    (request, response) => {
        return apiResponse.successResponse(response, "Employee status updated successfully")
    }
)

export default router;