const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const { isLoggedIn, isStudent, validate } = require("../middleware/authMiddleware");
const changePasswordValidator = require("../validators/changePasswordValidator");

// Dashboard
router.get("/dashboard", isLoggedIn, isStudent, studentController.dashboard);

// Profile
router.get("/profile", isLoggedIn, isStudent, studentController.renderProfile);

// Change Password
router.get("/change-password", isLoggedIn, isStudent, studentController.renderChangePassword);
router.post("/change-password", isLoggedIn, isStudent, validate(changePasswordValidator, "/student/change-password"), studentController.changePassword); // ✅ added redirect path

// Delete Account
router.post("/delete-account", isLoggedIn, isStudent, studentController.deleteAccount);

module.exports = router;