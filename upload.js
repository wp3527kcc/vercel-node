// 导入 SDK, 当 TOS Node.JS SDK 版本小于 2.5.2 请把下方 TosClient 改成 TOS 导入
// import { TosClient } from '@volcengine/tos-sdk';
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
            files.push(fullPath)
        }
    })
}
function uploadFileToTos() {
    const vercelPath = 'front/dist/'
    traverseDirSync(vercelPath)
    console.log(files)
    files.forEach((each) => {
        const rr = fs.readFileSync(each)
        uploadFile('github/' + each.replace(vercelPath, ''), rr, true)
    })

}

exports.uploadFileToTos = uploadFileToTos