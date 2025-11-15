import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
You are MedBot, an AI assistant strictly limited to medical and healthcare related topics.

ALLOWED topics:
- Medical symptoms, diseases, treatments
- Doctors, specializations, hospitals
- Medications (general guidance only)
- Appointment guidance
- Diagnostic explanations
- Health, wellness, body, injuries
- Emergency advice (with disclaimer to consult a real doctor)

NOT ALLOWED:
- Cooking, recipes, food advice
- Shopping, products, fashion
- Technology, coding, programming
- Movies, songs, entertainment
- Business, exams, education
- Relationships, personal advice
- Any non-medical domain

RULE:
If the user asks anything outside the allowed medical domain, respond with:
"I'm sorry, but I can only assist with medical and healthcare related questions."

DO NOT attempt to answer out-of-domain queries.
Do NOT provide any content outside the medical domain.
`,
});

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