// pages/my_orderDetail/my_orderDetail.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        orderData: {},
        state: '',
        statename: ''
    },
    // 再来一单
    again() {
        let params = {
            order_no: this.data.orderId,
        }
        util.promiseRequest(api.once_again_order, params).then(res => {
            wx.switchTab({
                url: '/pages/shoppingCart/shoppingCart'
            })
        })
    },
    // 取消订单
    cancel() {
        let that = this;
        util.promiseRequest(api.cancel_order, {
            order_no: that.data.orderId
        }).then(res => {
            wx.showToast({
                title: '取消订单成功',
                icon: 'none',
                duration: 2000
            });
            that.getOrder_detail(that.data.orderId);
        })
    },
    // 确认收货
    confirm(e) {
        let that = this;
        util.promiseRequest(api.confirm_goods, {
            order_no: that.data.orderId
        }).then(res => {
            wx.showToast({
                title: '确认收货成功',
                icon: 'none',
                duration: 2000
            });
            that.getOrder_detail(that.data.orderId);
        })
    },
    // 去评价
    toEvaluation(e) {
        wx.navigateTo({
            url: `../my_evaluation/my_evaluation?orderId=${this.data.orderId}&staffId=${this.data.orderData.staffer}`
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            orderId: options.id
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getOrder_detail(this.data.orderId);
    },
    getOrder_detail(id) {
        var y = this;
        util.promiseRequest(api.order_detail, {
            order_no: id
        }).then(res => {
            var data = res.data.response_data.lists[0];
            y.setData({
                orderData: data
            })
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})