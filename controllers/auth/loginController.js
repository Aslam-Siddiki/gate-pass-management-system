const StudentUser = require("../../models/studentUsers");
const AdminUser = require("../../models/adminUser");
const bcrypt = require("bcrypt");

// Render Login Page
module.exports.renderLoginPage = (req, res) => {
    res.render("auth/login");
};

// Login Logic
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user =
            await StudentUser.findOne({ email }) ||
            await AdminUser.findOne({ email });

        if (!user) {
            req.flash("error", "Account not found. Please register.");
            return res.redirect("/auth/register");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash("error", "Invalid credentials.");
            return res.redirect("/auth/login");
        }

        req.session.userId = user._id;
        req.session.role = user.role;

        req.session.save((err) => {
            if (err) {
                console.log(err);
                req.flash("error", "Session error.");
                return res.redirect("/auth/login");
            }

            req.flash("success", "Login successful. Welcome back!");

            if (user.role === "admin") {
                return res.redirect("/admin/portal");
            }

            if (user.role === "student") {
                return res.redirect("/student/dashboard");
            }
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Login failed. Please try again.");
        res.redirect("/auth/login");
    }
};

// Logout
module.exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {  // ✅ proper session destroy
        if (err) {
            req.flash("error", "Logout failed.");
            return res.redirect("/");
        }
        res.redirect("/");
    });
};