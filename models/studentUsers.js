const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentUserSchema = new Schema({
    userName : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        match: [/^[a-zA-Z0-9._%+-]+@rajalakshmi\.edu\.in$/, "Please use your college email"]
    },
    password : {
        type : String,
        required : true,
        minlength: 6,
    },
    role : {
        type : String,
        enum: ["admin", "student"],
        default : "student",
        required : true,
    },
    rollNumber : {
        type : String,
        required : true,
        unique : true,
    },
    department : {
        type : String,
        required : true,
    },
    parentPhone : {
        type : String,
        required : true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10 digit phone number"]
    },
    roomNumber : {
        type : String,
        required : true
    },
    hostelName : {
        type : String,
        required : true
    },
    homeLocation : {
        type : String,
        required : true
    } 
}, {timestamps: true });

const StudentUser = mongoose.model("StudentUser", studentUserSchema);
module.exports = StudentUser;