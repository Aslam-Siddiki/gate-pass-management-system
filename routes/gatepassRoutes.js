const express = require("express");
const router = express.Router();

const gatepassController = require("../controllers/gatepassController");
const { isLoggedIn, isStudent, validate } = require("../middleware/authMiddleware");
const gatepassValidator = require("../validators/gatePassValidator");

router.get("/apply", isLoggedIn, isStudent, gatepassController.renderApplyForm);
router.post("/apply", isLoggedIn, isStudent, validate(gatepassValidator, "/gatepass/apply"), gatepassController.applyGatepass); // ✅ added redirect path
router.get("/myapplications", isLoggedIn, isStudent, gatepassController.allApplication);

module.exports = router;