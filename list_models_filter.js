const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const apiKey = "AIzaSyDJ8taQjGfJYgEbsWPrH6GJhQ1suCoPuDo";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Found Models:");
            const models = data.models.filter(m => m.name.includes("flash") || m.name.includes("pro") || m.name.includes("gemini"));
            models.forEach(m => console.log(`- ${m.name}`));
        }
    } catch (error) {
        console.error("Script Error:", error);
    }
}

listModels();
