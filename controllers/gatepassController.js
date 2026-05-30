const GatePass = require("../models/gatepass");
const StudentUser = require("../models/studentUsers");

// Render Apply Form
module.exports.renderApplyForm = async (req, res) => {
    try {
        const student = await StudentUser.findById(req.session.userId);

        if (!student) {
            req.flash("error", "Student not found. Please login again.");
            return res.redirect("/auth/login");
        }

        res.render("gatepass/apply", { user: student });

    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/");
    }
};

// Apply Gatepass
module.exports.applyGatepass = async (req, res) => {
    try {
        const student = await StudentUser.findById(req.session.userId);

        if (!student) {
            req.flash("error", "Student not found.");
            return res.redirect("/auth/login");
        }

        // ✅ Get dates from Joi validated req.body
        const { reason, exitDate, returnDate } = req.body;

        // ✅ user comes from session — no tampering possible
        const newGatepass = new GatePass({
            user: req.session.userId,
            reason,
            exitDate,
            returnDate
        });

        await newGatepass.save();

        req.flash("success", "Gate pass request submitted successfully.");
        res.redirect("/gatepass/myapplications");

    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to submit gate pass request.");
        res.redirect("/gatepass/apply");
    }
};

// Show Student Applications
module.exports.allApplication = async (req, res) => {
    try {
        const passes = await GatePass
            .find({ user: req.session.userId })
            .populate("user")
            .sort({ createdAt: -1 });

        res.render("gatepass/myapplications", { passes });

    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load applications.");
        res.redirect("/");
    }
};