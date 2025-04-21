import { GoogleGenerativeAI } from "@google/generative-ai";

const generateTitle = async (content: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error('Gemini API key not found');
        return 'Untitled Entry';
    }

    try {
        // Initialize the model
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Generate title
        const prompt = `Create a short, creative title (max 6 words) for this journal entry through which it could easily be recognised. Response should be just the title without quotes: ${content.substring(0, 300)}...`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        if (!response) {
            console.error('No response from Gemini API');
            return 'Untitled Entry';
        }

        const title = response.text().trim();
        console.log('Generated title:', title);

        return title || 'Untitled Entry';
    } catch (error) {
        console.error('Error generating title:', error);
        return 'Untitled Entry';
    }
};

export { generateTitle };