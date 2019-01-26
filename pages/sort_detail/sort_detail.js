const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const WxParse = require('../../component/wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasYouhuiQuan: true,
        productList: [],
        id: '',
        detailText: {
            content: ''
        }
    },
    // 商品列表
    getproduct_detail() {
        let that = this;
        let params = {
            id: this.data.id
        };
        util.promiseRequest(api.product_detail, params).then((res) => {
            that.setData({
                productList: res.data.response_data[0],
                detailText: {
                    content: WxParse.wxParse('detailTextt', 'html', res.data.response_data[0].content, that),
                }
            })
        })
    },
    joinCart() {
        let params = {
            goods_id: this.data.id,
            type: 1,
            num: 1
        }
        util.promiseRequest(api.cart_add, params).then((res) => {
            wx.showToast({
                title: '加入购物车成功',
                icon: 'none',
                duration: 1500
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id
        })
        this.getproduct_detail();
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