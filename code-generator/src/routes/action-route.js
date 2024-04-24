
const { componentArray, updateNavigatorCode } = require('../models/page-component')
const { renameProject, buildAndroidApk } = require('../models/project-build')
const { deleteFolderRecursive } = require('../helper-function')

app.post('/submit', async (req, res) => {
    const { instruction } = req.fields
    res.setHeader('Content-Type', 'application/json')
    if (await isInstructionisValid(instruction)) {
        const projectName = await getAppName(instruction)
        renameProject(projectName)
            .then(() => {
                return componentArray(instruction)
            })
            .then(() => {
                return buildAndroidApk()
            })
            .then((apkPath) => {
                if (apkPath) {
                    console.log('APK path:', apkPath)
                    res.json({ message: 'App is generated please download it from here' })
                } else {
                    console.log('No APK generated.')
                    res.json({ message: 'No APK generated.' })
                }
            })
            .catch((error) => {
                console.error('Error occurred during script execution:', error)
                res.status(500).res.json({ message: 'error in generating apk' })
            })
            .finally(() => {
                deleteFolderRecursive()
                updateNavigatorCode()
            })
    } else {
        res.status(404).json({ message: "Oops! It seems like your message doesn't match any of our available applications. Please provide a valid instruction related to one of our apps. Thank you!" })
    }
})

app.get('/download', (req, res) => {
    const parentDir = path.join(__dirname, '..')
    const apkFilePath = 'android/app/build/outputs/apk/release/app-release.apk'
    const fileName = 'app-release.apk'
    const apkFile = path.join(parentDir, apkFilePath)
    console.log('===fs.existsSync(apkFile)', apkFile)
    if (fs.existsSync(apkFile)) {
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
        res.setHeader('Content-type', 'application/vnd.android.package-archive')
        const apkFileStream = fs.createReadStream(apkFile)
        apkFileStream.pipe(res)
    } else {
        res.status(404).send('APK file not found')
    }
})