const OpenAI = require('openai');
const {
    apiKey
} = require("../utils/constant")

async function getResponse() {
    const openai = new OpenAI({ apiKey });
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        logit_bias: { "1734": -100 },
        messages: [
            {
                role: "user",
                content: " Generate a React Native Functional component with default return statement code block that should be placed in a .js file named Home page"
            }
        ],
        functions: [
            {
                name: "createCatObject",
                parameters: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            description: "code without any new line and slash"
                        },
                    },
                    required: ["code"]
                }
            }
        ],
        function_call: { name: "createCatObject" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;
    // const json = JSON.parse(functionCall.arguments);
    console.log("====json", functionCall.arguments.replace(/\n/g, ''));

}
getResponse();