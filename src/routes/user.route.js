const authenticateUser = require("../middlewares/authenticateUser");

const { signup, verifyOtpSignUp, login, verifyOtpLogin, forgotPassword, resetPassword } = require("../controllers/user/authController");
const { getCountries, getStates, getCities, getProfile, updateProfile, deleteProfileImage } = require("../controllers/user/profileController");
const { partnerPreferences, getPreference, matchedUsers, singleMatchedUser } = require("../controllers/user/partnerPreferenceController");
const { sendOrUpdateRequest, sentRequestTo, gotRequestFrom } = require("../controllers/user/requestedUserController");
const { createQuery, getQueryData } = require("../controllers/user/supportController");
const { getAllSubscriptionPlans } = require("../controllers/user/subscriptionController");
const { getReligions, getCastes } = require("../controllers/user/religionAndCasteController");
const getDetailsById = require("../controllers/user/getTermsPrivacyAboutController");

const userRoute = require("express").Router();

//---------- user auth ----------
userRoute.post("/signup", signup);
userRoute.post("/verify_otp_sign_up", verifyOtpSignUp);
userRoute.post("/login", login);
userRoute.post("/verify_otp_login", verifyOtpLogin);
userRoute.post("/forget_password", forgotPassword);
userRoute.post("/reset_password", resetPassword);

// Update Profile
userRoute.get("/religions", getReligions);
userRoute.get("/castes", getCastes);

userRoute.post("/country", getCountries);
userRoute.post("/states", getStates);
userRoute.post("/cities", getCities);

userRoute.get("/profile", authenticateUser,  getProfile);   
userRoute.put("/profile", authenticateUser, updateProfile);

userRoute.post("/deleteProfileImage", authenticateUser, deleteProfileImage);

// Preferences & Match
userRoute.post("/preferences", authenticateUser, partnerPreferences);
userRoute.get("/yourPreference", authenticateUser, getPreference);
userRoute.post("/all_match", authenticateUser, matchedUsers);
userRoute.get("/single_match/:id", authenticateUser, singleMatchedUser);

// request user
userRoute.post("/send_request", authenticateUser, sendOrUpdateRequest);
userRoute.get("/requested_to", authenticateUser, sentRequestTo);
userRoute.get("/requested_by", authenticateUser, gotRequestFrom);

// Subscription
userRoute.get("/subscription_plans", authenticateUser, getAllSubscriptionPlans);

// Support (Query)
userRoute.post("/submit_query", authenticateUser, createQuery);
userRoute.get("/get_query", authenticateUser, getQueryData);

// Terms & Condition, Privacy Policy & About Us
userRoute.get("/get_terms_privacy_about", authenticateUser, getDetailsById);

module.exports = userRoute;
