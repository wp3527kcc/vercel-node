const Mock = require('mockjs');
function fetchReq(url, body, method = 'POST') {
    return fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
        method,
        body,
    })
}
async function logToFeiShu(
    content,
    webhookUrl = "https://open.feishu.cn/open-apis/bot/v2/hook/ad15802e-b359-451e-931e-78af5fc8c68d",
) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    console.time('logTime')
    const res = await fetchReq(webhookUrl, JSON.stringify({
        card: {
            elements: [
                {
                    tag: "div",
                    text: {
                        tag: "lark_md",
                        content,
                    },
                },
            ],
        },
        msg_type: "interactive",
    }));
    const data = await res.json();
    console.timeEnd('logTime')
    return data
}

// fetchReq('https://vercel-node-ruby-nine.vercel.app/api/users', JSON.stringify({
//     name: Mock.mock('@string(7, 10)'),
//     email: Mock.mock('@string(7, 10)') + '@gmail.com'
//     // name: Math.random().toString(16).slice(2),
//     // email: Math.random().toString(16).slice(2) + '@gmail.com'
// })).then(res => res.json()).then(result => {
//     logToFeiShu(new Date() + ' ' + JSON.stringify(result));
//     console.log(result)
// })

// build.js
const { exec } = require('child_process');

// 执行 vite build 命令
// exec('echo 123', (error, stdout, stderr) => {
exec('cd front && npm run build', (error, stdout, stderr) => {
    if (error) {
        console.error(`执行错误: ${error.message}`);
        logToFeiShu(new Date() + ' Vite1 打包失败！');
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        logToFeiShu(new Date() + ' Vite2 打包失败！');
        return;
    }
    console.log(`stdout: ${stdout}`);
    logToFeiShu(new Date() + ' Vite 打包完成！');
});