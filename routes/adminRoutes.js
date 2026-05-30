const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isLoggedIn, isAdmin, validate } = require("../middleware/authMiddleware");
const changePasswordValidator = require("../validators/changePasswordValidator");

// Portal
router.get("/portal", isLoggedIn, isAdmin, adminController.portal);

// Dashboard
router.get("/dashboard", isLoggedIn, isAdmin, adminController.dashboard);

// Gatepasses
router.get("/gatepasses/all", isLoggedIn, isAdmin, adminController.getAllGatepasses);
router.get("/gatepasses/approved", isLoggedIn, isAdmin, adminController.getApprovedGatepasses);
router.get("/gatepasses/rejected", isLoggedIn, isAdmin, adminController.getRejectedGatepasses);

// Update gatepass status
router.post("/gatepasses/:id/approve", isLoggedIn, isAdmin, adminController.updateApprove);
router.post("/gatepasses/:id/reject", isLoggedIn, isAdmin, adminController.updateReject);

// Profile
router.get("/profile", isLoggedIn, isAdmin, adminController.adminProfile);

// Change Password
router.get("/change-password", isLoggedIn, isAdmin, adminController.renderChangePassword);
router.post("/change-password", isLoggedIn, isAdmin, validate(changePasswordValidator, "/admin/change-password"), adminController.changePassword);

// Delete Account
router.post("/delete-account", isLoggedIn, isAdmin, adminController.deleteAccount);

module.exports = router;