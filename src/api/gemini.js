import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);
        
    
        if (result.response && 
            result.response.candidates && 
            result.response.candidates.length > 0 &&
            result.response.candidates[0].content &&
            result.response.candidates[0].content.parts &&
            result.response.candidates[0].content.parts.length > 0 &&
            result.response.candidates[0].content.parts[0].text
        ) {
           
            return result.response.candidates[0].content.parts[0].text;
        } else {
            console.error("Gemini API Response format unexpected:", result);
            return "Sorry, the AI response was received but the format was unexpected.";
        }

    } catch (error) {
        console.error("Gemini API Request Failed:", error);
        return "Sorry, the request failed. Check the console for details.";
    }
}