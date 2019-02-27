// pages/my_integral/my_integral.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
// 开关控制，避免点击tab触发 swiper 的移动事件两次执行
let isClick = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        currentTab: 0,
        couponData: []
    },
    onLoad: function (options) {
        if (this.data.loading) {
            util.openLoading();
        }
        this.getMy_coupon();
        // 页面初始化 options为页面跳转所带来的参数
        let tabNumber = options.tab ? options.tab : 0;
        this.setData({
            currentTab: tabNumber
        })

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
        if (this.data.loading) {
            util.openLoading();
        }
    },

    getMy_coupon(index) {
        var y = this;
        util.promiseRequest(api.my_coupons, {
            access_token: app.globalData.access_token,
            status: index || 0
        })
            .then(res => {
                var data = res.data.response_data.lists;
                util.closeLoading();
                y.setData({
                    couponData: data,
                    loading: false
                })
                isClick = false;
            })
    },
    //滑动切换
    swiperTab: function (e) {
        if (!isClick) {
            var that = this;
            util.openLoading();
            that.setData({
                currentTab: e.detail.current
            });
            that.getMy_coupon(e.detail.current);
        }

    },
    //点击切换
    clickTab: function (e) {
        isClick = true;
        var that = this;
        let index = e.target.dataset.current;
        util.openLoading();
        if (this.data.currentTab === index) {
            return false;
        } else {
            that.getMy_coupon(index);
            that.setData({
                couponData: false,
                currentTab: index
            })
        }
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