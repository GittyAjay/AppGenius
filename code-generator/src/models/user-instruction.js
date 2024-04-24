import { askAssistant } from "./openAi"

function isInstructionisValid(instruction) {
    return new Promise((resolve, reject) => {
        const isInstructionisValid_code = `if the following statement is not about to making, describing application where application can be Web Application, Android or iOS,  then specify one word invalid otherwise valid  for ${instruction}"`
        askAssistant(isInstructionisValid_code)
            .then(res_code => {
                const cleaned_res_code = res_code.replace(/\._/g, '')
                console.log('isInstructionisValid', cleaned_res_code?.toLowerCase())
                if (res_code?.toLowerCase() !== 'invalid') {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
            .catch(error => {
                console.error('Error in getAppName:', error)
                reject(error)
            })
    })
}
function componentArray(instruction) {
    return new Promise((resolve, reject) => {
        const create_component_prompt = instruction + "Please provide a concise list of page names, without spaces, for your React Native app. Ensure each name is distinct and represents a unique page in your application. Return the names as an array. don't include any extra text beyond the code."
        askAssistant(create_component_prompt)
            .then(response => {
                console.log('askAssistant = componentArray response', response)
                const parsedRes = JSON.parse(response)
                console.log('askAssistant = componentArray parsedRes', typeof parsedRes)
                const allComponents = parsedRes
                const promises = [] // Array to store promises for each createComponentCode call
                for (let index = 0; index < parsedRes.length; index++) {
                    const component_name = parsedRes[index]
                    promises.push(createComponentCode(component_name, instruction, allComponents))
                }
                Promise.all(promises)
                    .then(() => {
                        resolve()
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
            .catch(error => {
                console.error('askAssistant Error in componentArray:', error)
                reject(error)
            })
    })
}
function createComponentCode(component_name, instruction, allComponents) {
    return new Promise((resolve, reject) => {
        // const component_code = `Generate a running code without any enclosing code block for a React Native that provides a functional component code block. The code block should be named ${component_name}.js and include basic UI elements. It should support navigation to other pages as per the provided ${JSON.stringify(allComponents)}. Ensure all resources are referenced using public URLs instead of local file paths. The message should instruct the developer to directly copy and paste the code into their file without any additional formatting.i don't want any preeceding text`
        const component_code = `
          Generate a React Native Functional component with default return statement code block that should be placed in a .js file named ${component_name} and it can also be used at other .js file also import all required thing which you are using also navigation. This component should include basic UI elements,Ensure all resources are referenced it and follow ${instruction} to function as a navigable page and without any enclosing code block.Ensure resource URLs are used instead of local file paths where applicable. It should have the ability to navigate to additional pages such as ${JSON.stringify(allComponents)},resources should url based not local file path and if required.
          `
        // const component_code = `Give ${component_name} Page code in react native by keeping in mind ${instruction} also navigate to page according to this ${JSON.stringify(allComponents)} i already installed all necessary packages and don't give any extra text other then code,there should must be only one parent component,output should be such that i can directly put and use it`;
        askAssistant(component_code)
            .then(res_code => {
                createComponent(component_name, res_code)
                resolve()
            })
            .catch(error => {
                console.error('askAssistant Error in createComponentCode:', error)
            })
    })
}
module.exports = {
    isInstructionisValid,
    componentArray,
    createComponentCode
}