const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const {
    askAssistant
} = require("../config/openAi")
function renameProject(projectName) {
    return new Promise((resolve, reject) => {
        try {
            console.log("===given project name is ", projectName);
            process.chdir('../../../');
            execSync(`npx react-native-rename ${projectName} --skipGitStatusCheck`, { stdio: 'inherit' });
            console.log(`Project renamed to '${projectName}' successfully.`);
            resolve();
        } catch (error) {
            console.error('An error occurred while renaming the project:', error);
            reject(error);
        }
    });
}

function createComponent(componentName, customCode) {
    return new Promise((resolve, reject) => {
        try {
            console.log("===on creating component process.cwd()", process.cwd());
            const componentDirectory = path.join(process.cwd(), 'src', 'components');
            const componentFilePath = path.join(componentDirectory, `${componentName}.js`);
            const componentContent = customCode ? customCode : `
            import React from 'react';
    import { View, Text } from 'react-native';

    function ${componentName}() {
      return (
        <View>
          <Text>
            ${customCode ? customCode : 'Your component JSX here'}
          </Text>
        </View>
      );
    }

    export default ${componentName};
            `;

            fs.mkdirSync(componentDirectory, { recursive: true });
            fs.writeFileSync(componentFilePath, componentContent);

            console.log(`Component '${componentName}' created successfully at ${componentDirectory}`);

            // Import component
            const navigationFilePath = path.join(__dirname, "..", 'src', 'navigator', 'index.js');
            let navigationContent = fs.readFileSync(navigationFilePath, 'utf8');

            const importStatement = `import ${componentName} from '../components/${componentName}';\n`;

            // Find the first occurrence of 'import' statement
            const importIndex = navigationContent.indexOf('import');
            if (importIndex !== -1) {
                // Insert the import statement after the last import
                navigationContent = navigationContent.slice(0, importIndex) + importStatement + navigationContent.slice(importIndex);
            }

            // Update navigation stack
            const newScreen = `
                    <Stack.Screen
                        name="${componentName}"
                        component={${componentName}}
                    />
            `;

            const closingTagIndex = navigationContent.lastIndexOf('</Stack.Navigator>');
            if (closingTagIndex !== -1) {
                navigationContent = navigationContent.slice(0, closingTagIndex) + newScreen + navigationContent.slice(closingTagIndex);
            }

            fs.writeFileSync(navigationFilePath, navigationContent);
            console.log(`Navigation updated with '${componentName}' component.`);

            resolve();
        } catch (error) {
            console.error('An error occurred while creating the component:', error);
            reject(error);
        }
    });
}

function updateNavigatorCode() {
    const _filePath = './src/navigator/index.js';
    const filePath = path.join(__dirname, '..', _filePath);

    console.log('File path:', filePath); // Log the file path

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
`;
    fs.writeFile(filePath, newFileContent, 'utf8', (err) => {
        if (err) {
            console.error('Error in navigation File reset :', err);
            return;
        }
        console.log('Navigation File reset successfully.');
    });
}

function askForComponentName(projectName) {
    rl.question('Enter your component name: ', (componentName) => {
        rl.question('Enter your custom code (leave empty for default): ', (customCode) => {
            createComponent(componentName, customCode);
            rl.close();
        });
    });
}

const deleteFolderRecursive = function () {
    const folderToDelete = '../../../src/components';
    const folderPath = path.join(__dirname, "..", folderToDelete);
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                if (fs.existsSync(curPath)) {
                    fs.unlinkSync(curPath);
                    console.log(`File '${curPath}' deleted successfully.`);
                } else {
                    console.log(`File '${curPath}' does not exist.`);
                }
            }
        });
        fs.rmdirSync(folderPath);
        console.log(`Folder '${folderPath}' deleted successfully.`);
    } else {
        console.log(`Folder '${folderPath}' does not exist.`);
    }
};

function buildAndroidApk() {
    return new Promise((resolve, reject) => {
        try {
            const androidDirectory = path.join(__dirname, '..', '..', '..', 'android');
            process.chdir(androidDirectory);
            exec('./gradlew assembleRelease', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${error}`);
                    reject(error);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                resolve("Apk created sucessfully")
            });
        } catch (error) {
            console.error(`Error occurred: ${error}`);
            reject(error);
        }
    });
}
function getAppName(instruction) {
    return new Promise((resolve, reject) => {
        const component_code = `${instruction} you have to return only app name in string from it don't add any preceeding text `;
        askAssistant(component_code)
            .then(res_code => {
                resolve(res_code);
            })
            .catch(error => {
                console.error('Error in getAppName:', error);
                reject(error);
            });
    });
}
function isInstructionisValid(instruction) {
    return new Promise((resolve, reject) => {
        const isInstructionisValid_code = `if the following statement is not about to making, describing application where application can be Web Application, Android or iOS,  then specify one word invalid otherwise valid  for ${instruction}"`;
        askAssistant(isInstructionisValid_code)
            .then(res_code => {
                let cleaned_res_code = res_code.replace(/\._/g, '');
                console.log("isInstructionisValid", cleaned_res_code?.toLowerCase());
                if (res_code?.toLowerCase() !== "invalid") {
                    resolve(true);
                } else {
                    resolve(false)
                }

            })
            .catch(error => {
                console.error('Error in getAppName:', error);
                reject(error);
            });
    });
}
function createComponentCode(component_name, instruction, allComponents) {
    return new Promise((resolve, reject) => {
        // const component_code = `Generate a running code without any enclosing code block for a React Native that provides a functional component code block. The code block should be named ${component_name}.js and include basic UI elements. It should support navigation to other pages as per the provided ${JSON.stringify(allComponents)}. Ensure all resources are referenced using public URLs instead of local file paths. The message should instruct the developer to directly copy and paste the code into their file without any additional formatting.i don't want any preeceding text`
        const component_code = `
        Generate a React Native Functional component with default return statement code block that should be placed in a .js file named ${component_name} and it can also be used at other .js file also import all required thing which you are using also navigation. This component should include basic UI elements,Ensure all resources are referenced it and follow ${instruction} to function as a navigable page and without any enclosing code block.Ensure resource URLs are used instead of local file paths where applicable. It should have the ability to navigate to additional pages such as ${JSON.stringify(allComponents)},resources should url based not local file path and if required.
        `;
        // const component_code = `Give ${component_name} Page code in react native by keeping in mind ${instruction} also navigate to page according to this ${JSON.stringify(allComponents)} i already installed all necessary packages and don't give any extra text other then code,there should must be only one parent component,output should be such that i can directly put and use it`;
        askAssistant(component_code)
            .then(res_code => {
                createComponent(component_name, res_code)
                resolve();
            })
            .catch(error => {
                console.error('askAssistant Error in createComponentCode:', error);
            });
    });
}
function componentArray(instruction) {
    return new Promise((resolve, reject) => {
        const create_component_prompt = instruction + "Please provide a concise list of page names, without spaces, for your React Native app. Ensure each name is distinct and represents a unique page in your application. Return the names as an array. don't include any extra text beyond the code.";
        askAssistant(create_component_prompt)
            .then(response => {
                console.log("askAssistant = componentArray response", response);
                const parsedRes = JSON.parse(response)
                console.log("askAssistant = componentArray parsedRes", typeof parsedRes);
                const allComponents = parsedRes;
                const promises = []; // Array to store promises for each createComponentCode call
                for (let index = 0; index < parsedRes.length; index++) {
                    const component_name = parsedRes[index];
                    promises.push(createComponentCode(component_name, instruction, allComponents));
                }
                Promise.all(promises)
                    .then(() => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
            .catch(error => {
                console.error('askAssistant Error in componentArray:', error);
                reject(error);
            });
    });
}
module.exports = {
    askForComponentName,
    createComponent,
    buildAndroidApk,
    renameProject,
    updateNavigatorCode,
    deleteFolderRecursive,
    getAppName,
    isInstructionisValid,
    componentArray,
    createComponentCode
}
