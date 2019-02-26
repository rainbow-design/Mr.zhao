// pages/my_integral/my_integral.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        integralData: false,
        totalScore: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (this.data.loading) {
            util.openLoading();
        }
        this.getMy_integral();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    getMy_integral() {
        var y = this;
        util.promiseRequest(api.score_list, {
            access_token: app.globalData.access_token
        })
            .then(res => {
                var data = res.data.response_data.lists;
                var totalScore = 0;
                console.log(data);
                data.forEach(v => {
                    v.shortDate = v.time.split(' ')[0];
                    totalScore += v.type === "+" ? Number(v.score) : - Number(v.score);
                })
                util.closeLoading();
                y.setData({
                    integralData: data,
                    totalScore: totalScore,
                    loading: false
                })
            })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})