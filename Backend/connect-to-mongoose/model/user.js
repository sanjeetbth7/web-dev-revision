import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name : {
        type : String,
        required : true,
    },
    last_name : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    gender : {
        type : String,
        required : true,
    },
    job : {
        type : String,
    }
}, {  timestamps : true });

export const User = mongoose.model("users", userSchema);

