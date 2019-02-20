// pages/shoppingCart_paySuccess/shoppingCart_paySuccess.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        if (options && options.id) {
            this.setData({
                orderId: options.id
            })
        }
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
    toSeeOrder() {
        var orderId = this.data.orderId;
        wx.redirectTo({
            url: `../my_orderDetail/my_orderDetail?id=${orderId}&state=1&statename=已完成`
        })
    },
    toIndex() {
        app.toIndex();
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

    },
    toInviteFriend() {
        app.share();
    }
})