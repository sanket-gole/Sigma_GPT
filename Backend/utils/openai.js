import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.OPENAI_API_KEY || "Bearer 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"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    }),
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", option);
    const data = await response.json();

    // ✅ FIX: Safely check if response contains the required data
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("⚠️ OpenAI API returned unexpected response:", data);
      return null;
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ API Error:", error.message);
    return null; // ❌ DO NOT use res here
  }
};

export default getOpenAIAPIResponse;
