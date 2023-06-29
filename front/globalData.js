class GlobalData {
    $baseURL = "http://localhost:3000"

    constructor () {
        let token = uni.getStorageSync('token');
        let userInfo = uni.getStorageSync('userInfo');
        this._token = token || "";
        this._userInfo = userInfo || {};
    }

    set token (val) {
        const fine = typeof val === "string";
        if (fine) {
            this._token = val;
            console.log("globalData.token has been set to:", val);
            uni.setStorageSync("token", val);
        }
    }
    get token () { return this._token }
    get isLogin () { return !!this._token }

    clearToken () {
        console.log("clear token..")
        for (let key in this._token) {
            delete this._token[key]
        }
        uni.removeStorageSync("token");
    }

    set userInfo (val) {
        const fine = (val instanceof Object);
        if (fine) {
            val = Object.assign(this._userInfo, val);
            this._userInfo = val;
            console.log("globalData.userInfo has been set to:", val);
            uni.setStorageSync("userInfo", val);
        }
    }
    get userInfo () { return this._userInfo }
    clearUserInfo () {
        console.log("clear userInfo...")
        for (let key in this._userInfo) {
            switch (key) {
                case "nickName":
                case "language":
                    break;

                default:
                    delete this._userInfo[key]
                    break;
            }
        }
        uni.setStorageSync("userInfo", this._userInfo);
    }
    get mobile () { return this._userInfo.mobile }

    loginOut () {
        return new Promise((resolve) => {
            this.clearToken();
            this.clearUserInfo();
            resolve("退出登录了")
        })
    }

    $request (opts) {
        return new Promise((resolve, reject) => {
            wx.request({
                method: 'GET',
                header: {
                    'content-type':'application/json',
                    "token": this.token
                },
                responseType: 'text',
                data: {},
                dataType: 'json',
                ...opts,
                url: this.$baseURL + opts.url,
                success: async (result)=>{
                    if (result.data.code >= 9000) {
                        await this.$message("登录已过期");
                        await this.loginOut();
                        uni.reLaunch({
                            url: '/pages/login'
                        });
                    }
                    else {
                        resolve(result.data);
                        opts.success?.(result.data);
                    }
                },
                fail: (info)=>{
                    reject(info);
                    opts.fail?.(info);
                },
                complete: ()=>{
                    opts.complete?.()
                }
            })
        })
    }

    $message (title, duration=2000) {
        if (title.length) return new Promise((resolve) => {
            uni.showToast({
                title,
                duration,
                icon: "none"
            });
            setTimeout(resolve, duration);
        })
    }

    $confirm (content="确认吗？", showCancel=true, title="温馨提示") {
        return new Promise((resolve, reject) => {
            uni.showModal({
                title,
                content,
                showCancel,
                success: function (res) {
                    if (res.confirm) {
                        resolve()
                    } else if (res.cancel) {
                        reject()
                    }
                }
            });        
        })
    }
}

export default new GlobalData()