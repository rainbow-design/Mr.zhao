// wxml    <Authorization bind:pubToFather="getFromFatherOpenId"></Authorization>
const app = getApp();
import API from "../../api/index";
import util from "../../utils/util";
Page({
    data: {
        loaded: false,
        avatar: '',
        username: '',
        phone: ''
    },
    onShow: function () {
        if (!this.data.loaded) {
            util.openLoading();
        }
        this.isRegistered();
    },
    getFromFatherOpenId(e) {
        var data = e.detail;
        // console.log('组件传递接收值', e.detail)
        this.setData({
            avatar: data.avatar,
            username: data.username,
            loaded: true
        })
        util.closeLoading();
    },
    isRegistered() {
        var that = this;
        wx.login({
            success(res) {
                if (res.code) {
                    util.promiseRequest(API.login, {
                        wxcode: res.code
                    })
                        .then(response => {
                            var data = response.data.data;
                            if (data && data.openid && data.id) {
                                //已登录 true
                                // 直接存储数据
                                app.globalData.openid = data.openid;
                                that.setData({
                                    avatar: data.avatar,
                                    username: data.username,
                                    loaded: true
                                })
                                util.closeLoading();
                            } else {
                                that.setData({
                                    loaded: true
                                })
                                util.closeLoading();
                            }
                        })
                }
            }
        })
    }
})