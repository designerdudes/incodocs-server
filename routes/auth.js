import express from "express";
// // <<<<<<< mujahed
// import { signin, sendOTPforverification, verifyotp, register, getAllCustomers, getAlldeliveryagent, getallTeamMembers, sendOTPforMobileverification, verifymobileotp, getUserById, deletebyid, getCurrentUserById, getCurrentUser, addOrUpdateAddress, deleteAddress, sendOTPforAdminVerification, } from '../controllers/auth.js';
import {
  resendOtp,
  verifyemailotp,
  verifyLoginOtp,
} from "../controllers/auth.js";
// import { adminAuthenticateToken, authenticateToken } from '../middleware/authToken.js';
// // =======
// // import { signin, sendOTPforverification, verifyotp, register, getAllCustomers, getAlldeliveryagent, deletebyid, getUserById, getallTeamMembers ,} from '../controllers/auth.js';
// // import { authenticateToken } from '../middleware/authToken.js';
// // >>>>>>> master
const router = express.Router();
// router.post("/register", register)
// router.post("/signin", signin)
// router.post("/emailOtpSend", sendOTPforverification);
// router.post("/mobileOtpSend", sendOTPforMobileverification);

// router.post("/adminEmailOtpSend", sendOTPforAdminVerification);
router.post("/resendotp", resendOtp);
router.post("/emailOtpVerify", verifyemailotp);
router.post("/loginotp", verifyLoginOtp);
// router.post("/mobileOtpVerify", verifymobileotp);

// router.get("/getallcustomers", getAllCustomers)
// router.get("/getalldeliveryagent", getAlldeliveryagent)
// router.get("/getallTeamMembers", getallTeamMembers)

// router.delete("/id/:id", deletebyid)
// router.get("/id/:id", getUserById)
// router.post("/currentUser", getCurrentUser)
// router.post("/editAddress", addOrUpdateAddress)
// router.delete('/address/:addressId', deleteAddress);

// // router.post("/facebook",facebookAuth)
// // router.post("/google",googleAuth)
export default router;
