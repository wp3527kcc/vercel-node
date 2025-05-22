var Mock = require('mockjs')
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

fetchReq('https://vercel-node-ruby-nine.vercel.app/users', JSON.stringify({
    name: Mock.mock('@string(7, 10)'),
    email: Mock.mock('@string(7, 10)') + '@gmail.com'
})).then(res => res.json()).then(result => {
    logToFeiShu(new Date() + ' ' + JSON.stringify(result));
    console.log(result)
})