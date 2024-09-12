const authenticateUser = require("../middlewares/authenticateUser");
const bodyParser = require("body-parser");

const {signup, verifyOtpSignUp, login, verifyOtpLogin, forgotPassword, resetPassword} = require("../controllers/user/authController");
const {getProfile, updateProfile, deleteProfileImage} = require("../controllers/user/profileController");
const {partnerPreferences} = require("../controllers/user/partnerPreferenceController");

const userRoute = require("express").Router();

//---------- user auth ----------
userRoute.post("/signup", signup);
userRoute.post("/verify_otp_sign_up", verifyOtpSignUp);
userRoute.post("/login", login);
userRoute.post("/verify_otp_login", verifyOtpLogin);
userRoute.post("/forget_password", forgotPassword);
userRoute.post("/reset_password", resetPassword);

userRoute.get("/profile", authenticateUser,  getProfile); 
userRoute.put("/profile", authenticateUser, updateProfile);
userRoute.post("/deleteProfileImage", authenticateUser, deleteProfileImage);

userRoute.post("/preferences", authenticateUser, partnerPreferences);



module.exports = userRoute;
