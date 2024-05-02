const OpenAI = require('openai');
const apiKey = 'sk-proj-2li9kkRs1oFfolDahIhQT3BlbkFJMSiu78FNiPfRnd0onZ0j';

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
