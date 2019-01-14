// pages/iThink/iThink.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskClassName: "columnCenter",
    isShouQuan: true
  },
  onLoad: function (options) {
    // this.login();
  },
  login() {
    wx.login({
      success(res) {
        if (res.code) {
          util.promiseRequest(api.wxLogin, {
            wxcode: res.code
          })
            .then(response => {
              var data = response.data.response_data;
              if (data && data.result === true) {
                //已登录 true
                // 直接存储数据
                app.globalData.userData = data;
                app.globalData.openid = data.openid;
                app.globalData.access_token = data.access_token;
                console.log("app.globalData-----------------------")
                console.dir(app.globalData)
                // 发布 胃你解答数据需要 token
                wx.yue.pub("hasToken", data.access_token)
              } else if (data.result === false) {
                app.globalData.openid = data.openid;
                // 注册 false
                that.register();
              }
            })
        }
      }
    })
  },
  getVerificationCode() { },
  bindGetUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      isShouQuan: true
    })
    setTimeout(() => {
      app.returnLastPage();
    }, 300)
  },
  register() {
    var that = this;
    if (app.globalData.userInfo) {
      var userInfo = app.globalData.userInfo;
      var paramObj = {
        uname: userInfo.nickName,
        openid: app.globalData.openid,
        image: userInfo.avatarUrl,
        sex: userInfo.gender
      }
      util.promiseRequest(api.wxRegister, paramObj)
        .then(res => {
          // console.log("注册后获得的数据----------")
          var data = res.data.response_data;
          // console.log(data);
          if (data.access_token) {
            app.globalData.access_token = data.access_token;
            // 发布 胃你解答数据需要 token
            wx.yue.pub("hasToken", data.access_token)

          }
        })
    } else {
      // 没有用户信息请求授权
      this.setData({
        isShouQuan: false
      })
    }


  },
  goLastPage() {
    app.returnLastPage();
  },
})