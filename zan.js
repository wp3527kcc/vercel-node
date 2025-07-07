const headers = {
    cookie:
        "log_web_id=6344022195; s_v_web_id=verify_mbrbfb8w_m5knvq0H_XjBc_4FTS_AQvt_t00YlwUzzI7f; creative_device_id=a5a52269-6060-4066-ad73-222a1dfb1490; PHPSESSID=t2luvllega07o8823j9650skvi; webp_enabled=1; lang=zh; email=719045449%40qq.com; token=caa40ecc76c192f4; creative_token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTE0MzA0NDMsInZhbCI6IkxLQzcyQ0RRR09HTDRQSDJDQVYySzZNQVBERFUzVlBCQkFSQ05JVk1TNkVWWlJSM0VDNFEifQ.uK-DmjdiFUXl4vJlcmeQjigyc4j5JWEOty9OwJlgSjYF12Ai9yoFRJtM6umypiTc; _aihecong_chat_visibility=false",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
};
async function logToFeiShu(
    content,
    webhookUrl = "https://open.feishu.cn/open-apis/bot/v2/hook/ad15802e-b359-451e-931e-78af5fc8c68d",
) {
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
    return data
}


function main() {
    fetch("https://tuchong.com/rest/categories/%E6%9C%80%E6%96%B0/recommend", {
        headers,
        "body": null,
        "method": "GET"
    })
        .then((res) => res.json())
        .then(res => {
            res.feedList.forEach(item => {
                const runFlag = Math.random() * 2.5 < 1 // 点赞40%的内容
                if (!runFlag) return;
                fetch("https://tuchong.com/gapi/interactive/favorite", {
                    headers,
                    body: `post_id=${item.post_id}&nonce=7cbab2db23d60826&referer=&position=community`,
                    method: "PUT",
                })
                    .then((res) => res.json())
                    .then(console.log)
                    .catch(err => {
                        logToFeiShu('出错了' + err)
                    })
            })
        })
        .catch(err => {
            logToFeiShu('出错了' + err)
        });
}

main()