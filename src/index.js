const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
// 配置解析 JSON 格式的请求体
app.use(bodyParser.json());
app.use(cors())
const port = process.env.PORT || 3000;
const upload = multer({
    storage: multer.memoryStorage(), // 文件存储在内存中
});
const prefix = '/api'
const CDNBASEURL = process.env.CDNBASEURL
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});
app.use(express.static('../front'))
const { config } = require('dotenv');
config();
const { uploadFile } = require('./tos');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/dist/index.html'))
})
app.get(prefix + '/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/dist/index.html'))
})
app.get(prefix + '/upload', async (req, res) => {
    const fileList = await pool.query(`SELECT * FROM upload_history where create_by = '${'admin'}' ORDER BY create_time DESC`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(fileList.rows)
})

app.get(prefix + '/file/*', async (req, res) => {
    const key = req.originalUrl.slice(prefix.length + 6)
    res.redirect(CDNBASEURL + key)
})

app.post(prefix + '/upload', upload.array('files'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('没有文件上传');
    }
    try {
        const uploadResults = [];
        for (const file of req.files) {
            // 从内存中获取文件 Buffer
            const fileBuffer = file.buffer;
            const fileName = decodeURIComponent(file.originalname);
            const tosResult = await uploadFile(fileName, fileBuffer, 'staticFile/');
            await pool.query(`INSERT INTO upload_history (create_time, create_by, filePath, fileUrl) 
VALUES (NOW(), 'admin', '${fileName}', '${CDNBASEURL + tosResult}')`)
            uploadResults.push({
                fileName,
                realPath: CDNBASEURL + tosResult
            });
        }
        res.send({
            message: '文件上传成功',
            results: uploadResults,
            // results: 'uploadResults',
        });
    } catch (error) {
        console.error('上传失败:', error);
        res.status(500).send({ message: '文件上传失败' });
    }
});

app.listen(port, () => {
    console.log(`服务器正在监听 ${port} 端口`);
});
