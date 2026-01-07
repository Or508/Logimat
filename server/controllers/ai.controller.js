const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateQuote = async (req, res) => {
    try {
        console.log("🎨 Generating design preview...");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const { userDescription } = req.body;

        if (!userDescription) {
            return res.status(400).json({ message: 'אנא כתוב תיאור לאתר' });
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

        res.json(jsonResponse);

    } catch (error) {
        console.error('❌ AI Error:', error.message);
        res.status(500).json({ message: 'שגיאה: ' + error.message });
    }
};