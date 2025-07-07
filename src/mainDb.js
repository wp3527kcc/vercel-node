const mysql = require('mysql2/promise'); // 使用 Promise 版本

function connect() {
  // 创建连接池（推荐生产环境使用）
  const pool = mysql.createPool({
    host: 'localhost',      // 数据库地址
    port: 3306,             // 端口，默认3306
    user: 'root',           // 用户名
    password: '123456',     // 密码
    database: 'tc_cdn',      // 数据库名
    waitForConnections: true,
    connectionLimit: 10,    // 连接池大小
    queueLimit: 0
  });
  pool.on('connection', (conn) => {
    conn.on('error', (err) => {
      console.error('连接错误:', err);
    });
  });
  return pool
}
exports.connect = connect