// pages/my_shippingAddress/my_shippingAddress.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressData: [],
        addressList_H: '', // 地址栏高度
        btn_T: '' // 新增按钮距离顶部
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        this.getMy_shippingAddress();
    },
    toEdit(e) {
        var data = e.currentTarget.dataset;
        var action = 'edit';
        wx.redirectTo({
            url: `../my_editShippingAddress/my_editShippingAddress?action=${action}`
        })
        wx.yue.pub("editAddress", data);
    },
    getMy_shippingAddress() {
        var y = this;
        util.promiseRequest(api.addr_list, {
            access_token: app.globalData.access_token
        })
            .then(res => {
                var data = res.data.response_data.lists;
                console.log(data);
                y.setData({
                    addressData: data
                }, function () {
                    var addressList_H, btn_T;
                    util.getEle('#addressList', function (res) {
                        addressList_H = res[0].height;
                        y.setData({
                            addressList_H: addressList_H
                        })
                    })
                    util.getEle('#addBtn', function (res) {
                        btn_T = res[0].top;
                        y.setData({
                            btn_T: btn_T
                        })
                    })
                })
            })
    },
    toAddShippingAddress() {
        wx.navigateTo({
            url: `../my_addShippingAddress/my_addShippingAddress`
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