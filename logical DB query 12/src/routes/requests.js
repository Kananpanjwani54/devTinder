const express=require('express');
const userauth= require('../middleware/auth');

const requestRouter=express.Router();

requestRouter.post("/requestConnections",userauth,(req,res)=>{
        const user=req.user;
        //sending a connection req
        console.log("Sending a connnecton req")
        res.send(user.firstName +" Sent a connection request ")
    
});

module.exports=requestRouter;