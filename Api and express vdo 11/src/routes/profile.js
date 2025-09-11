const express=require("express")

const profileRoutes=express.Router();

profileRoutes.get("/profile",async(req,res)=>{
    try{
        const user=req.user;
        res.send(user);
}catch(err){
    res.status(400).send("Error" +err.message);
    }
})

module.exports=profileRoutes;