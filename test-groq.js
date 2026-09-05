const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/GROQ_API_KEY=([^\r\n]+)/)[1];

const prompt = `You are an expert technical recruiter and a highly critical AI evaluator.
You will be given a transcript of an interview. Your job is to rigorously evaluate the candidate's answers.
The JSON must be an array of objects, where each object has:
{
    "question": "The question asked",
    "answer": "The candidate's answer",
    "score": <number from 0 to 10>,
    "feedback": "1 sentence of strict critique",
    "ideal_answer": "A short example of a perfect answer"
}
CRITICAL REQUIREMENT: The feedback and ideal_answer MUST be written entirely in the language corresponding to the language code "es-ES". Do not use any other language under any circumstances.`;

(async () => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            model: 'qwen-2.5-32b', 
            messages: [{role: 'system', content: prompt}, {role: 'user', content: '[{"q": "Encantado de conocerte, CIATI! Veo que tienes 22 años... ¿Podrías contarme sobre algún proyecto...", "a": "no sé no sé"}]'}], 
        })
    });
    const j = await res.json();
    console.log(JSON.stringify(j, null, 2));
})();
