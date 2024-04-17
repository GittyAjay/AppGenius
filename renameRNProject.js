#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to rename the project
function renameProject(projectName) {
    try {
        // Navigate to the parent directory of the project
        const parentDir = path.resolve(__dirname, '..');

        // Install react-native-rename package globally
        execSync('npm install -g react-native-rename', { stdio: 'inherit' });

        // Navigate to the parent directory and rename the project using react-native-rename
        execSync(`cd ${parentDir} && react-native-rename ${projectName}`, { stdio: 'inherit' });

        console.log(`Project renamed to '${projectName}' successfully.`);
    } catch (error) {
        console.error('An error occurred while renaming the project:', error);
    } finally {
        rl.close();
    }
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
