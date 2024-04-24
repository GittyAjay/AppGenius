import { askAssistant } from "./openAi"
const fs = require('fs')
const path = require('path')
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
function createComponent(componentName, customCode) {
    return new Promise((resolve, reject) => {
        try {
            console.log('===on creating component process.cwd()', process.cwd())
            const componentDirectory = path.join(process.cwd(), 'src', 'components')
            const componentFilePath = path.join(componentDirectory, `${componentName}.js`)
            const componentContent = customCode || `
              import React from 'react';
      import { View, Text } from 'react-native';
  
      function ${componentName}() {
        return (
          <View>
            <Text>
              ${customCode || 'Your component JSX here'}
            </Text>
          </View>
        );
      }
  
      export default ${componentName};
              `

            fs.mkdirSync(componentDirectory, { recursive: true })
            fs.writeFileSync(componentFilePath, componentContent)

            console.log(`Component '${componentName}' created successfully at ${componentDirectory}`)

            // Import component
            const navigationFilePath = path.join(__dirname, '..', 'src', 'navigator', 'index.js')
            let navigationContent = fs.readFileSync(navigationFilePath, 'utf8')

            const importStatement = `import ${componentName} from '../components/${componentName}';\n`

            // Find the first occurrence of 'import' statement
            const importIndex = navigationContent.indexOf('import')
            if (importIndex !== -1) {
                // Insert the import statement after the last import
                navigationContent = navigationContent.slice(0, importIndex) + importStatement + navigationContent.slice(importIndex)
            }

            // Update navigation stack
            const newScreen = `
                      <Stack.Screen
                          name="${componentName}"
                          component={${componentName}}
                      />
              `

            const closingTagIndex = navigationContent.lastIndexOf('</Stack.Navigator>')
            if (closingTagIndex !== -1) {
                navigationContent = navigationContent.slice(0, closingTagIndex) + newScreen + navigationContent.slice(closingTagIndex)
            }

            fs.writeFileSync(navigationFilePath, navigationContent)
            console.log(`Navigation updated with '${componentName}' component.`)

            resolve()
        } catch (error) {
            console.error('An error occurred while creating the component:', error)
            reject(error)
        }
    })
}
function updateNavigatorCode() {
    const _filePath = './src/navigator/index.js'
    const filePath = path.join(__dirname, '..', _filePath)

    console.log('File path:', filePath) // Log the file path

    const newFileContent = `// App.js
  
  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  const Stack = createStackNavigator();
  
  function App() {
      return (
          <NavigationContainer>
              <Stack.Navigator>
              </Stack.Navigator>
          </NavigationContainer>
      );
  }
  
  export default App;
  `
    fs.writeFile(filePath, newFileContent, 'utf8', (err) => {
        if (err) {
            console.error('Error in navigation File reset :', err)
            return
        }
        console.log('Navigation File reset successfully.')
    })
}
module.exports = {
    createComponent,
    componentArray,
    createComponentCode,
    updateNavigatorCode
}