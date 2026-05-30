const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminUserSchema = new Schema({
    userName : {
        type: String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true,
    },
    hostelName : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum: ["admin", "student"],
        default : "admin",
        required : true
    }
})

const AdminUser = mongoose.model("AdminUser", adminUserSchema);
module.exports = AdminUser;