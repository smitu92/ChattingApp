import mongoose from "mongoose";

const chatUserSchema=new mongoose.Schema({

    _id:{type:String,require:true},
    username:{
        type:String,
        require:true
    },
    avatar:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
         type:Date
    },
    contacts:{
        type:Array
    },
    email: { type: String, required: true }, 
    firstName: { type: String, default: '' }, 
    lastName: { type: String, default: '' }, 
    bio: { type: String, default: '' }, 
    isTestUser: { type: Boolean, default: false }

});

export const mongochatUser=mongoose.model("chatUser",chatUserSchema);