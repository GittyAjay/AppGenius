const OpenAI = require('openai');
const {
    apiKey
} = require("../utils/constant")

async function askAssistant(prompt) {
    try {
        const openai = new OpenAI({
            apiKey: apiKey
        });
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });
        const content = chatCompletion.choices[0].message.content;
        return content;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

module.exports = {
    askAssistant
}
