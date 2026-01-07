const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * שירות AI - מטפל בכל התקשורת עם Google Generative AI
 * אחראי על: יצירת תקשורת עם Gemini, עיבוד prompts, parsing תגובות
 */

let genAI = null;
let model = null;

/**
 * אתחול מודל AI (יש לקרוא פעם אחת בהפעלת השרת)
 */
exports.initializeAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY לא הוגדר ב-.env');
    }
    
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log('✅ AI Service initialized');
};

/**
 * יוצר הצעת מחיר ועיצוב עבור אתר על פי תיאור משתמש
 * @param {string} userDescription - תיאור המשתמש
 * @returns {Promise<{min_price: number, max_price: number, sections: string[], summary: string, html_preview: string}>}
 */
exports.generateWebsiteQuote = async (userDescription) => {
    if (!model) {
        exports.initializeAI();
    }

    if (!userDescription) {
        throw new Error('אנא כתוב תיאור לאתר');
    }

    const prompt = `
        Act as a Senior UI/UX Designer and Web Architect.
        Client Request: "${userDescription}".
        
        Task:
        1. Analyze the request to estimate price and sections.
        2. Design a STUNNING, HIGH-END HTML/CSS Hero Section for this specific website.
        
        Design Requirements for the Hero Section:
        - Use a dark, luxurious, modern theme (unless request implies otherwise).
        - Use gradients, shadows, and modern typography.
        - Use ONLY inline CSS (style="...") so it renders immediately.
        - Make it look like a finished professional product.
        
        Return ONLY a raw JSON object with this exact structure:
        {
            "min_price": (number in NIS),
            "max_price": (number in NIS),
            "sections": (array of strings),
            "summary": (string in Hebrew),
            "html_preview": (string containing the raw HTML code for the Hero Section design)
        }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    let text = response.text();
    text = text.replace(/```json|```/g, '').trim(); 
    
    const jsonResponse = JSON.parse(text);
    
    return jsonResponse;
};
