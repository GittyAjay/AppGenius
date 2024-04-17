#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to rename the project
function renameProject(projectName) {
  try {
    // Rename the project using react-native-rename
    execSync(`npx react-native-rename ${projectName}`, { stdio: 'inherit' });

    console.log(`Project renamed to '${projectName}' successfully.`);

    // Ask for the component name and custom code
    askForComponentDetails(projectName);
  } catch (error) {
    console.error('An error occurred while renaming the project:', error);
  }
}

// Function to ask for the component name and custom code
function askForComponentDetails(projectName) {
  rl.question('Enter your component name: ', (componentName) => {
    rl.question('Enter your custom code (leave empty for default): ', (customCode) => {
      createComponent(projectName, componentName, customCode);
    });
  });
}

// Function to create a new React component
function createComponent(projectName, componentName, customCode) {
  try {
    const componentDirectory = path.join(process.cwd(), projectName, 'src', 'components', componentName);

    // Create component directory with parent directories
    fs.mkdirSync(componentDirectory, { recursive: true });

    // Create component file
    const componentFilePath = path.join(componentDirectory, `${componentName}.js`);
    fs.writeFileSync(componentFilePath, generateComponentFile(componentName, customCode));

    console.log(`Component '${componentName}' created successfully at ${componentDirectory}`);
  } catch (error) {
    console.error('An error occurred while creating the component:', error);
  } finally {
    rl.close();
  }
}

// Generate component file content
function generateComponentFile(componentName, customCode) {
  return `
import React from 'react';

function ${componentName}() {
  return (
    <div>
      ${customCode ? customCode : '<!-- Your component JSX here -->'}
    </div>
  );
}

export default ${componentName};
`;
}

// Check if the project name argument is provided
if (process.argv.length < 3) {
  rl.question('Please provide a project name: ', (projectName) => {
    renameProject(projectName);
  });
} else {
  const projectName = process.argv[2];
  renameProject(projectName);
}
