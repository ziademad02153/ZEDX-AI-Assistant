const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Note: listModels is on the genAI instance directly in some versions, 
        // or we might need to use the model manager if exposed. 
        // Actually the SDK exposes it via the GoogleGenerativeAI class usually? 
        // Let's try to just make a raw fetch call if the SDK doesn't make it easy in node.

        // Using raw fetch to be sure, as SDK structure varies
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
        }
    } catch (error) {
        console.error("Script Error:", error);
    }
}

listModels();
