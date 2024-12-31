import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
    shortId : {
        type : String,
        required : true,
        unique : true,
    },
    redirectUrl : {
        type : String,
        required : true,
    }
}, {timestamps : true});

const URL = mongoose.model('url',urlSchema);

export default URL;