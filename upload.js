const fs = require('fs')
const path = require('path')
const { config } = require('dotenv');
config();
const { uploadFile } = require('./src/tos')

const files = []
function traverseDirSync(dirPath) {
    const items = fs.readdirSync(dirPath) // 读取目录下的所有文件/文件夹
    items.forEach((item) => {
        const fullPath = path.join(dirPath, item)
        const stat = fs.statSync(fullPath) // 获取文件/文件夹状态
        if (stat.isDirectory()) {
            traverseDirSync(fullPath) // 递归遍历子目录
        } else {
            if(['index.html', 'vite.svg'].some(each => files.includes(each))) {
                return;
            }
            files.push(fullPath)
        }
    })
}
function uploadFileToTos() {
    const vercelPath = path.join(__dirname, './front/dist/')
    traverseDirSync(vercelPath)
    console.log(files, vercelPath)
    files.forEach((each) => {
        const rr = fs.readFileSync(each)
        uploadFile(each.replace(vercelPath, ''), rr, 'uploadProject/', true)
    })
}
uploadFileToTos()

exports.uploadFileToTos = uploadFileToTos