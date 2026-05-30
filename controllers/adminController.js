const AdminUser = require("../models/adminUser");
const GatePass = require("../models/gatepass");
const bcrypt = require("bcrypt");

// Portal
module.exports.portal = (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const todayDate = today.getDate();
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const todayText = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    res.render("admin/portal", { year, month, days, firstDay, todayDate, todayText });
};

// Dashboard
module.exports.dashboard = async (req, res) => {
    try {
        const pendingCount  = await GatePass.countDocuments({ status: "Pending" });
        const approvedCount = await GatePass.countDocuments({ status: "Approved" });
        const rejectedCount = await GatePass.countDocuments({ status: "Rejected" });
        res.render("admin/dashboard", { pendingCount, approvedCount, rejectedCount });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load dashboard.");
        res.redirect("/admin/gatepasses/all");
    }
};

// All Gatepasses (Pending)
module.exports.getAllGatepasses = async (req, res) => {
    try {
        const passes = await GatePass.find({ status: "Pending" })
            .populate("user")
            .sort({ createdAt: -1 });
        const safePasses = passes.filter(pass => pass.user !== null);
        res.render("admin/gatepasses/all", { passes: safePasses });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to fetch gatepasses.");
        res.redirect("/");
    }
};

// Approved Gatepasses
module.exports.getApprovedGatepasses = async (req, res) => {
    try {
        const passes = await GatePass.find({ status: "Approved" })
            .populate("user")
            .sort({ createdAt: -1 });
        const safePasses = passes.filter(pass => pass.user !== null);
        res.render("admin/gatepasses/approved", { passes: safePasses });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to fetch approved gatepasses.");
        res.redirect("/admin/gatepasses/all");
    }
};

// Rejected Gatepasses
module.exports.getRejectedGatepasses = async (req, res) => {
    try {
        const passes = await GatePass.find({ status: "Rejected" })
            .populate("user")
            .sort({ createdAt: -1 });
        const safePasses = passes.filter(pass => pass.user !== null);
        res.render("admin/gatepasses/rejected", { passes: safePasses });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to fetch rejected gatepasses.");
        res.redirect("/admin/gatepasses/all");
    }
};

// Update Approve
module.exports.updateApprove = async (req, res) => {
    try {
        await GatePass.findByIdAndUpdate(req.params.id, { status: "Approved" });
        req.flash("success", "Gatepass approved successfully.");
        res.redirect("/admin/gatepasses/all");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to approve gatepass.");
        res.redirect("/admin/gatepasses/all");
    }
};

// Update Reject
module.exports.updateReject = async (req, res) => {
    try {
        await GatePass.findByIdAndUpdate(req.params.id, { status: "Rejected" });
        req.flash("success", "Gatepass rejected successfully.");
        res.redirect("/admin/gatepasses/all");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to reject gatepass.");
        res.redirect("/admin/gatepasses/all");
    }
};

// Admin Profile
module.exports.adminProfile = async (req, res) => {
    try {
        const admin = await AdminUser.findById(req.session.userId);
        res.render("admin/profile", { admin });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load profile.");
        res.redirect("/admin/gatepasses/all");
    }
};

// Render Change Password Page
module.exports.renderChangePassword = (req, res) => {
    res.render("admin/changePassword");
};

// Change Password
module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await AdminUser.findById(req.session.userId);
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            req.flash("error", "Current password is incorrect.");
            return res.redirect("/admin/change-password");
        }
        admin.password = await bcrypt.hash(newPassword, 12);
        await admin.save();
        req.flash("success", "Password changed successfully.");
        res.redirect("/admin/profile");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to change password.");
        res.redirect("/admin/change-password");
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
        await AdminUser.findByIdAndDelete(req.session.userId);
        req.session.destroy((err) => {
            if (err) console.log(err);
            res.redirect("/auth/register");
        });
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to delete account.");
        res.redirect("/admin/profile");
    }
};