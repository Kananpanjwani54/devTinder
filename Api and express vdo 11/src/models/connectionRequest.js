//create schema for user request
const mongoose =require("mongoose");
const {Schema} =mongoose;


const connectionRequest = new Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Type.ObjectId,
            required:true,
        },
        toUserId:{
            type:mongoose.Schema.Type.ObjectId,
            required:true,
        },
        status:{
            type:String,
            enum:{
                values:["pending", "ignored", "interested", "accepted", "rejected"],
                message:`{VAlUE} is incorrect type`
            },
            required:true,
        },

    },
    {timestamps: true}
);

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
)

module.exports=ConnectionRequest;