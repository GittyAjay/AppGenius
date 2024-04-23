const { execSync } = require('child_process')
const readline = require('readline')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
function renameProject (projectName) {
  return new Promise((resolve, reject) => {
    try {
      console.log('===given project name is ', projectName)
      process.chdir('..')
      execSync(`npx react-native-rename ${projectName} --skipGitStatusCheck`, { stdio: 'inherit' })
      console.log(`Project renamed to '${projectName}' successfully.`)
      resolve()
    } catch (error) {
      console.error('An error occurred while renaming the project:', error)
      reject(error)
    }
  })
}

function createComponent (componentName, customCode) {
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

function updateNavigatorCode () {
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

function askForComponentName (projectName) {
  rl.question('Enter your component name: ', (componentName) => {
    rl.question('Enter your custom code (leave empty for default): ', (customCode) => {
      createComponent(componentName, customCode)
      rl.close()
    })
  })
}

const deleteFolderRecursive = function () {
  const folderToDelete = './src/components'
  const folderPath = path.join(__dirname, '..', folderToDelete)
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file, index) => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        if (fs.existsSync(curPath)) { // Check if file exists
          fs.unlinkSync(curPath) // Delete file if it exists
          console.log(`File '${curPath}' deleted successfully.`)
        } else {
          console.log(`File '${curPath}' does not exist.`)
        }
      }
    })
    fs.rmdirSync(folderPath)
    console.log(`Folder '${folderPath}' deleted successfully.`)
  } else {
    console.log(`Folder '${folderPath}' does not exist.`)
  }
}

function buildAndroidApk () {
  return new Promise((resolve, reject) => {
    try {
      const androidDirectory = path.join(__dirname, '..', 'android')
      process.chdir(androidDirectory)
      exec('./gradlew assembleRelease', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`)
          reject(error)
          return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
        resolve('Apk created sucessfully')
      })
    } catch (error) {
      console.error(`Error occurred: ${error}`)
      reject(error)
    }
  })
}
// function fileDownload() {
//     const filePath = path.join(__dirname, '..', 'android/app/build/outputs/apk/release/app-release.apk');

//     const destinationFolderPath = path.join(require('os').homedir(), 'Downloads');
//     const destinationFilePath = path.join(destinationFolderPath, 'app-release.apk');

//     return new Promise((resolve, reject) => {
//         const readStream = fs.createReadStream(filePath);
//         const writeStream = fs.createWriteStream(destinationFilePath);
//         readStream.on('error', reject);
//         writeStream.on('error', reject);
//         readStream.on('end', () => {
//             resolve("downloaded");
//         });
//         readStream.pipe(writeStream);
//     });
// }

module.exports = {
  askForComponentName,
  createComponent,
  buildAndroidApk,
  renameProject,
  updateNavigatorCode,
  deleteFolderRecursive
}
