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

async function askAssistant2(name, instructions, content) {
    try {
        const openai = new OpenAI({
            apiKey: apiKey
        });
        // const assistant = await openai.beta.assistants.create({
        //     name,
        //     instructions,
        //     tools: [{ type: "code_interpreter" }],
        //     model: 'gpt-3.5-turbo',
        // });
        let code_generator_ass_id = "asst_YTw3Sej8gfKY2CrBcKUpbq2Y"
        const thread = await openai.beta.threads.create();
        await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content
            }
        );
        const run = openai.beta.threads.runs.stream(thread.id, {
            assistant_id: code_generator_ass_id
        });

        run
            .on('textCreated', (text) => {
                console.log('Received text:', text);
            })
            .on('textDelta', (textDelta, snapshot) => console.log("textDelta", textDelta.value))
            .on('toolCallCreated', (toolCall) => console.log(`\nassistant > ${toolCall.type}\n\n`))
            .on('toolCallDelta', (toolCallDelta, snapshot) => {
                if (toolCallDelta.type === 'code_interpreter') {
                    if (toolCallDelta.code_interpreter.input) {
                        console.log("code_interpreter input", toolCallDelta.code_interpreter.input);
                    }
                    if (toolCallDelta.code_interpreter.outputs) {
                        console.log("\noutput >\n");
                        toolCallDelta.code_interpreter.outputs.forEach(output => {
                            if (output.type === "logs") {
                                console.log(`\n${output.logs}\n`);
                            }
                        });
                    }
                }
            });

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
askAssistant2(
    "Code generator",
    "you are highly experienced react native developer,you will write code for me",
    "Home page component code"
)

module.exports = {
    askAssistant,
    askAssistant2
}
