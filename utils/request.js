export default function request(params) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: params.url,
            method: params.method || 'get',
            data: params.data || {},
            header: params.header || {},
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}