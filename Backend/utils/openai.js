// in util the main logic of code working ai
import "dotenv/config";


const getOpenAIAPIResponse= async(message)=>{
     const option ={
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": process.env.OPENAI_API_KEY || "Bearer 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",
        },
        body: JSON.stringify({
            model:  "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: message}],
        }), 
    }
    try{
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", option);
        const data = await response.json();
        // console.log(data.choices[0].message.content);
         return data.choices[0].message.content;

    }catch(error){
        console.error("❌ API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export default getOpenAIAPIResponse;