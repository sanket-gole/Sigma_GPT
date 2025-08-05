

import express from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"
const app= express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/api",chatRoutes);

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
    connectDB()
})


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully");
    }catch(error){
        console.error("❌ Database connection error:", error);
        process.exit(1); // Exit the process with failure
    }
}



// app.post("/test",async(req,res)=>{

   
// })