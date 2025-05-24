const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { getFile, uploadFile, getFileList } = require('./tos')
const multer = require('multer');
const { config } = require('dotenv');
const bodyParser = require('body-parser');
const mime = require('mime-types');

const app = express();
// 配置解析 JSON 格式的请求体
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'));
app.use(express.static('front/dist'));
const port = process.env.PORT || 3000;
const upload = multer({
  storage: multer.memoryStorage(), // 文件存储在内存中
});

config();
// 连接数据库
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Optional: For development environments only
  },
});

app.get('/upload', async (req, res) => {
  const fileList = await getFileList()
  res.json(fileList)
})
// 获取所有用户
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建用户
app.post('/users', async (req, res) => {
  console.log(req.body);
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除用户
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ message: '用户删除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

app.get('/file/:filepath', async (req, res) => {
  const { filepath: key } = req.params
  const ext = key.split('.').pop();
  const mimeType = mime.lookup(ext)
  console.time('getFile')
  const allContent = await getFile(key)
  console.timeEnd('getFile')
  res.setHeader('Content-Type', mimeType);
  res.send(allContent)
})

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('没有文件上传');
  }
  try {
    // 从内存中获取文件 Buffer
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const tosResult = await uploadFile(fileName, fileBuffer)
    console.log(tosResult)

    res.send({
      message: '文件上传成功',
      // fileUrl: `https://${params.Bucket}.s3.amazonaws.com/${fileName}`, // S3 文件 URL
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).send('文件上传失败');
  }
})

app.listen(port, () => {
  console.log(`服务器正在监听 ${port} 端口`);
});
