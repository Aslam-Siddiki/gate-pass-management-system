const express = require("express");
const router = express.Router();

const loginController = require("../controllers/auth/loginController");
const registerController = require("../controllers/auth/registerController");
const { validate } = require("../middleware/authMiddleware");
const adminUserValidator = require("../validators/adminUserValidator");
const studentUserValidator = require("../validators/studentUserValidator");

// Register Choice Page
router.get("/register", registerController.renderRegisterPage);

// Student Register
router.get("/register/student", registerController.renderStudentRegister);
router.post("/register/student", validate(studentUserValidator, "/auth/register/student"), registerController.registerStudent); // ✅ added redirect path

// Admin Register
router.get("/register/admin", registerController.renderAdminRegister);
router.post("/register/admin", validate(adminUserValidator, "/auth/register/admin"), registerController.registerAdmin); // ✅ added redirect path

// Login Routes
router.get("/login", loginController.renderLoginPage);
router.post("/login", loginController.loginUser);

// Logout
router.get("/logout", loginController.logoutUser);

module.exports = router;