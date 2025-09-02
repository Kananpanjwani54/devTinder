const express=require("express");
//created app for express-->basically an object inside a var app;
// entry point fot http

const app=express();

//route handler

app.get("/",(req,res)=>{
res.send("Hello from Server of kanan!!")
});
app.use("/test",(req,res)=>{
res.send("Main jian!")
});
app.use("/hello",(req,res)=>{
res.send("Main Honn don!")
});
const PORT=3000;

//
app.listen(PORT,()=>{
    console.log("Server running on http://localhost:3000")
})
//nodemon install to not restarting server manually.(-g-->global)


