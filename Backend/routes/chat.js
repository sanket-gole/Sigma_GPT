import express from "express"
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router =express.Router();

router.post("/test",async(req,res)=>{
    try{
          const thread=new Thread({
            threadId:"xyz",
            title:"Testing new Thread"
          });

          const response=await thread.save();
          res.send(response);
    }catch(err){

     console.log(err);
     res.status(500).json({error:"Faild to save database"});
    }
})

//Get all threads

router.get("/thread",async(req,res)=>{
           try{

            const threads= await Thread.find({}).sort({ updatedAt: -1 });
            res.json(threads);
           }catch(err){
            console.log(err);
            res.status(500).json({error:"Failed to fetch threads"});
           }
})


router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
       const thread= await Thread.findOne({threadId});
    
       if(!thread){
            res.status(404).json({error:"Thread not found"});
       }
       res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to featch chat"});
    }
})


router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;

    try{
     const deletedThread=   await Thread.findOneAndDelete({threadId});
     if(!deletedThread){
        return res.status(404).json({error:"Thread not found"});
     }
     res.status(200).json({message:"Thread deleted successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to delete thread"});
    }
})


router.post("/chat",async(req,res)=>{

    const{threadId,message}=req.body;

    if(!threadId || !message){
        return res.status(400).json({error:"Thread ID and message are required"});
    }
    try{

       let thread = await Thread.findOne({ threadId });

        if(!thread){
            //create new thread
            thread= new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}]
            })
        }else{
            thread.messages.push({role:"user",content:message});
        }

        const assistantReplay= await getOpenAIAPIResponse(message);
        if (!assistantReplay) {
  return res.status(500).json({ error: "Failed to get response from AI" });
}

        thread.messages.push({role:"assistant",content:assistantReplay});
        thread.updatedAt=new Date();
        await thread.save();
        res.json({reply:assistantReplay});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to process chat message"});
    }
})

export default router;