
const mongoose =require('mongoose')

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://kanan_db:P%40njwani54@cluster0.tvikiqx.mongodb.net/devTinder")
};

module.exports={
    connectDB,
}