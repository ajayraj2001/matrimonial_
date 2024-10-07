const { registerAdmin, logInAdmin } = require("../controllers/admin/adminAuthController");
const { createCaste, getCastes, updateCaste, deleteCaste } = require("../controllers/admin/casteController");
const { createReligion, getReligions, updateReligion, deleteReligion } = require("../controllers/admin/religionController");
const { 
    createSubscriptionPlan, 
    getAllSubscriptionPlans, 
    updateSubscriptionPlan, 
    deleteSubscriptionPlan 
} = require("../controllers/admin/subscriptionPlanController");
const { getAllSupportQueries, updateSupportQuery, deleteSupportQuery } = require("../controllers/admin/supportListController");
const { createDetails, updateDetails } = require("../controllers/admin/termsPrivacyAboutController");
const { getAllUsers, deleteUser } = require("../controllers/admin/userListController");
const { authenticateAdmin, authorizeRoles } = require("../middlewares/authenticateAdmin");

const adminRoute = require("express").Router();

// //---------- admin auth ----------
adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", logInAdmin);
// adminRoute.post("/forget_password", forgetPassword);
// adminRoute.post("/reset_password", resetPassword);
// adminRoute.get("/profile", authenticateAdmin, getProfile);
// adminRoute.put("/profile", authenticateAdmin, updateProfile);
// adminRoute.put("/change_password", authenticateAdmin, changePassword);


// -------------- Users --------------------
adminRoute.get('/users', authenticateAdmin, getAllUsers);
adminRoute.delete('/users/:id', authenticateAdmin, deleteUser);

// ------------- Subscription Plan --------------
adminRoute.post("/create_subscription_plan", authenticateAdmin, createSubscriptionPlan);
adminRoute.get("/get_subscription_plans", authenticateAdmin, getAllSubscriptionPlans);
adminRoute.patch("/update_subscription_plan/:id", authenticateAdmin, updateSubscriptionPlan);
adminRoute.delete("/delete_subscription_plan/:id", authenticateAdmin, deleteSubscriptionPlan);

// ------------- Religion ------------------------
adminRoute.post("/add_religion", authenticateAdmin, createReligion);
adminRoute.get("/get_all_religion", authenticateAdmin, getReligions);
adminRoute.patch("/update_single_religion/:id", authenticateAdmin, updateReligion);
adminRoute.delete("/delete_single_religion/:id", authenticateAdmin, deleteReligion);

// ------------- Caste ----------------------------
adminRoute.post("/add_caste", authenticateAdmin, createCaste);
adminRoute.get("/get_all_caste/:id", authenticateAdmin, getCastes);
adminRoute.patch("/update_single_caste/:id", authenticateAdmin, updateCaste);
adminRoute.delete("/delete_single_caste/:id", authenticateAdmin, deleteCaste);

// ------------- Support(Query) ---------------------
adminRoute.get("/get_all_queries", authenticateAdmin, getAllSupportQueries);
adminRoute.patch("/update_single_query/:id", authenticateAdmin, updateSupportQuery);
adminRoute.delete("/delete_single_query/:id", authenticateAdmin, deleteSupportQuery);

// ------------ Terms, Privacy & About ---------------
adminRoute.post("/terms_privacy_about", authenticateAdmin, createDetails);
adminRoute.patch("/update_terms_privacy_about", authenticateAdmin, updateDetails);

// //dashboard
// adminRoute.get("/dashboard", authenticateAdmin, adminDashboard)

// //------getActiveUses--------
// adminRoute.get("/getAllUsers", authenticateAdmin, getUsers)
// adminRoute.put("/updateUser", authenticateAdmin, updateUser)


// //---------- appData --------
// adminRoute.post("/appData", authenticateAdmin, createAppData);
// adminRoute.get("/appData", authenticateAdmin, getAllAppData);
// adminRoute.patch("/appData/:id", authenticateAdmin, updateAppData);
// adminRoute.delete("/appData/:id", authenticateAdmin, deleteAppData);

module.exports = adminRoute;
