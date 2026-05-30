const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gatePassSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "StudentUser",
        required : true,
    },
    reason : {
        type : String,
        required : true,
        default : "Weekend Holiday",
        
    },
    exitDate : {
        type : Date,
        required : true,
    },
    returnDate : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : ["Pending", "Approved", "Rejected"],
        default : "Pending",
    },
    
}, {timestamps : true }); 

const Gatepass = mongoose.model("Gatepass", gatePassSchema);
module.exports = Gatepass;
