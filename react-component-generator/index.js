const express = require('express')
const path = require('path')
const fs = require('fs')
const http = require('http')
const socketIo = require('socket.io')
const formidableMiddleware = require('express-formidable')
const { createComponent, buildAndroidApk, updateNavigatorCode, renameProject, deleteFolderRecursive } = require('./start')
const { askAssistant } = require('./openai')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.use(formidableMiddleware())
const PORT = 3000

app.use(express.static('public'))

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
function getAppName(instruction) {
  return new Promise((resolve, reject) => {
    const component_code = `${instruction} you have to return only app name in string from it don't add any preceeding text `
    askAssistant(component_code)
      .then(res_code => {
        resolve(res_code)
      })
      .catch(error => {
        console.error('Error in getAppName:', error)
        reject(error)
      })
  })
}
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

server.listen(PORT, () => {
  console.log('Server is running on port 3000')
})
