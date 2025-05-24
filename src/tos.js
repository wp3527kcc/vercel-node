// 导入 SDK, 当 TOS Node.JS SDK 版本小于 2.5.2 请把下方 TosClient 改成 TOS 导入
// import { TosClient } from '@volcengine/tos-sdk';
const { TosClient, TosClientError, TosServerError } = require('@volcengine/tos-sdk')
const accessKeyId = process.env.TOS_ACCESS_KEY_ID
const accessKeySecret = process.env.TOS_ACCESS_KEY_SECRET
const bucketName = 'kokobucket1';
const region = "cn-guangzhou" // 填写 Bucket 所在地域。以华北2（北京)为例，则 "Provide your region" 填写为 cn-beijing。
const endpoint = "tos-cn-guangzhou.volces.com" // 填写域名地址


// 创建客户端
const client = new TosClient({
    accessKeyId,
    accessKeySecret,
    region,
    endpoint
});

function handleError(error) {
    if (error instanceof TosClientError) {
        console.log('Client Err Msg:', error.message);
        console.log('Client Err Stack:', error.stack);
    } else if (error instanceof TosServerError) {
        console.log('Request ID:', error.requestId);
        console.log('Response Status Code:', error.statusCode);
        console.log('Response Header:', error.headers);
        console.log('Response Err Code:', error.code);
        console.log('Response Err Msg:', error.message);
    } else {
        console.log('unexpected exception, message: ', error);
    }
}

async function getFile(key) {
    try {
        const {
            data: { content },
        } = await client.getObjectV2({
            bucket: bucketName,
            key: key,
        });

        // 获取返回的 stream 中的所有内容
        let allContent = Buffer.from([]);
        for await (const chunk of content) {
            allContent = Buffer.concat([allContent, chunk]);
        }
        return allContent
    } catch (error) {
        console.log('---===', error)
        return '404 not found ' + `<h2>${key}</h2>`
        // handleError(error);
    }
}
async function getFileList() {
    try {
        const { data } = await client.listObjectsType2({
            bucket: bucketName,
        });
        return data.Contents
    } catch (error) {
        handleError(error);
    }
}
async function uploadFile(filename, body) {
    const randomPrefix = Math.random().toString(16).slice(2, 6) + '_';
    const result = await client.putObject({
        body,
        key: randomPrefix + filename,
        bucket: bucketName,
    });
    return result
}
// getFileList().then(console.log)
exports.getFile = getFile
exports.getFileList = getFileList
exports.uploadFile = uploadFile