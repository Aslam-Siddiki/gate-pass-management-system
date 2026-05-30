const StudentUser = require("../../models/studentUsers");
const AdminUser = require("../../models/adminUser");
const bcrypt = require("bcrypt");

// Render Pages
module.exports.renderRegisterPage    = (req, res) => res.render("auth/register");
module.exports.renderStudentRegister = (req, res) => res.render("student/register");
module.exports.renderAdminRegister   = (req, res) => res.render("admin/register");

// Student Registration
module.exports.registerStudent = async (req, res) => {
    try {
        
        const {
            userName, 
            email, 
            password, 
            role,
            rollNumber, 
            department, 
            parentPhone,
            roomNumber, 
            hostelName, 
            homeLocation
        } = req.body; 

        const existingUser = await StudentUser.findOne({
            $or: [{ email }, { rollNumber }]
        });

        if (existingUser) {
            req.flash("error", existingUser.email === email
                ? "Email already registered. Please login."
                : "Roll number already registered."
            );
            return res.redirect("/auth/login"); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await StudentUser.create({
            userName, email,
            password: hashedPassword,
            role, rollNumber, department,
            parentPhone, roomNumber,
            hostelName, homeLocation
        });

        req.flash("success", "Registered successfully. Please log in.");
        res.redirect("/auth/login");

    } catch (err) {
        console.log(err);
        req.flash("error", err.code === 11000
            ? "Account already exists. Please login."
            : "Something went wrong."
        );
        res.redirect("/auth/login"); 
    }
};

// Admin Registration
module.exports.registerAdmin = async (req, res) => {
    try {
        const { userName, email, password, hostelName, role } = req.body; // ✅ was req.body.user

        const existingUser = await AdminUser.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email already registered. Please login.");
            return res.redirect("/auth/login"); // ✅ was /admin/register
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await AdminUser.create({
            userName, email,
            password: hashedPassword,
            hostelName, role
        });

        req.flash("success", "Admin registered successfully. Please log in.");
        res.redirect("/auth/login");

    } catch (err) {
        console.log(err);
        req.flash("error", err.code === 11000
            ? "Account already exists. Please login."
            : "Something went wrong."
        );
        res.redirect("/auth/login"); 
    }
};