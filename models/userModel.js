const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema (
    {
        userName:{
            type:String,
            required:true
        },
        userEmail: {
            type:String,
            required:true
        },
        userPassword: {
            type:String,
            required:true
        }
    }
);
const userModel = mongoose.model("users" , userSchema);
module.exports = userModel;
