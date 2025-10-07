const mongoose = require("mongoose");
const { Schema } = mongoose;


const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"//this has been done so that we can user data from this schema
       },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
        ref:"User"
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect type`,
      },
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);
//creating index (for easiers fetching data having similar values)
connectionRequestSchema.index({fromUserId:1,toUserId:1})

//pre save (its a function )
connectionRequestSchema.pre("save", function(next){
if(this.fromUserId.equals(this.toUserId)){
throw new Error("You could not send request to yoursef");
}
next();
})
const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
