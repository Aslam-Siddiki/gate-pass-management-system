const StudentUser = require("../models/studentUsers");
const Gatepass = require("../models/gatepass"); 
const bcrypt = require("bcrypt");

// Dashboard
module.exports.dashboard = (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const todayDate = today.getDate();
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const todayText = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    res.render("student/dashboard", { year, month, days, firstDay, todayDate, todayText });
};

// Profile
module.exports.renderProfile = async (req, res) => {
    try {
        const student = await StudentUser.findById(req.session.userId);
        res.render("student/profile", { user: student });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load profile");
        res.redirect("/student/dashboard");
    }
};

// Render Change Password ✅ no async needed
module.exports.renderChangePassword = (req, res) => {
    res.render("student/changePassword");
};

// Change Password ✅ Joi handles confirmPassword check
module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const student = await StudentUser.findById(req.session.userId);

        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) {
            req.flash("error", "Current password is incorrect.");
            return res.redirect("/student/change-password");
        }

        student.password = await bcrypt.hash(newPassword, 12);
        await student.save();

        req.flash("success", "Password changed successfully.");
        res.redirect("/student/profile");

    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to change password.");
        res.redirect("/student/change-password");
    }
};

// Logout
module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect("/auth/login");
    });
};

// Delete Account
module.exports.deleteAccount = async (req, res) => {
    try {
        // Delete all gatepasses of this student first
        await Gatepass.deleteMany({ user: req.session.userId });

        // Then delete the student account
        await StudentUser.findByIdAndDelete(req.session.userId);

        req.session.destroy((err) => {
            if (err) console.log(err);
            res.redirect("/auth/register"); // ✅ correct redirect
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to delete account.");
        res.redirect("/student/profile");
    }
};