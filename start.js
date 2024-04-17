const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function renameProject(projectName) {
    try {
        console.log("===given project name is ", projectName);
        process.chdir('..');
        execSync(`npx react-native-rename ${projectName} --skipGitStatusCheck`, { stdio: 'inherit' });
        console.log(`Project renamed to '${projectName}' successfully.`);
        askForComponentName(projectName);
    } catch (error) {
        console.error('An error occurred while renaming the project:', error);
    }
}

function createComponent(componentName, customCode) {
    try {
        console.log("===on creating component process.cwd()", process.cwd());
        const componentDirectory = path.join(process.cwd(), 'src', 'components');
        const componentFilePath = path.join(componentDirectory, `${componentName}.js`);
        const componentContent = `
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
        const navigationFilePath = path.join(process.cwd(), 'src', 'navigator', 'index.js');
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

        // Find the closing tag of Stack.Navigator
        const closingTagIndex = navigationContent.lastIndexOf('</Stack.Navigator>');
        if (closingTagIndex !== -1) {
            // Insert the new screen before the closing tag
            navigationContent = navigationContent.slice(0, closingTagIndex) + newScreen + navigationContent.slice(closingTagIndex);
        }

        fs.writeFileSync(navigationFilePath, navigationContent);

        console.log(`Navigation updated with '${componentName}' component.`);
    } catch (error) {
        console.error('An error occurred while creating the component:', error);
    }
}

function askForComponentName(projectName) {
    rl.question('Enter your component name: ', (componentName) => {
        rl.question('Enter your custom code (leave empty for default): ', (customCode) => {
            createComponent(componentName, customCode);
            rl.close();
        });
    });
}

if (process.argv.length < 3) {
    rl.question('Please provide a project name: ', (projectName) => {
        renameProject(projectName);
    });
} else {
    const projectName = process.argv[2];
    renameProject(projectName);
}
