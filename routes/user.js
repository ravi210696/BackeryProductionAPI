import * as apiResponse  from '../helper/apiResponse.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from "../controllers/user/user.js";




// router.post(
//    "/add/employees",
//    celebrate(validation.addingUser),
//    (request,response,next) => {
//       request.body.addUser = true;
//       return next();
//    },
//    auth.isAuth,
//    user.isUserValid,
//    user.getOneUser,
//    user.addUser,
//    (request,response) => {
//       return  apiResponse.successResponse(response, "User Added successfully")
//    }
// )