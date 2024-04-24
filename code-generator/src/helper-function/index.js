const fs = require('fs')
const path = require('path')

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
module.exports = {
    deleteFolderRecursive
}