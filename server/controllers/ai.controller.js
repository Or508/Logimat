const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// אתחול ה-API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- התיקון כאן: שינוי למודל 1.5 שהוא יציב וחינמי ---
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PROMPT = `
You are a World-Class Senior Web Architect & UX Expert.
When a user describes a business, you MUST generate a complete, premium, futuristic landing page.
Your goal is to impress.

RULES:
1. Ignore spelling mistakes.
2. If the input is vague (e.g., "pizza"), expand it to a luxury concept.
3. Use a dark-mode, neon, glassmorphism design style (CSS inside HTML).
4. Return ONLY valid JSON format.
5. The JSON structure must be:
{
  "min_price": "Number",
  "max_price": "Number",
  "html_preview": "Full HTML string with CSS"
}
`;

exports.generateQuote = async (req, res) => {
    try {
        const { userDescription } = req.body;

        if (!userDescription) {
            return res.status(400).json({ error: "Description is required" });
        }

        console.log("🛠️ Processing AI Request...");

        // יצירת הפרומפט המשולב
        const finalPrompt = `${SYSTEM_PROMPT} \n\nClient Request: ${userDescription} \n\nGenerate the JSON now:`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        
        // ניקוי הטקסט שמגיע מה-AI (לפעמים הוא מוסיף ```json)
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const jsonResponse = JSON.parse(text);

        res.json(jsonResponse);

    } catch (error) {
        console.error("🔥 CRITICAL SERVER ERROR:", error);
        
        // החזרת הודעת שגיאה ברורה לצד לקוח
        res.status(500).send("המערכת עמוסה כרגע (Quota Exceeded). נסה שוב בעוד דקה.");
    }
};