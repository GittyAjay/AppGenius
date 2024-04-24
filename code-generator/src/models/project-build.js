const { execSync } = require('child_process')
const path = require('path')
const { exec } = require('child_process')
function renameProject(projectName) {
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

function buildAndroidApk() {
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
module.exports = {
    renameProject,
    buildAndroidApk
}