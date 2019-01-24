//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
// pages/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: '',
    },
    getSearchList() {
        let that = this;
        util.promiseRequest(api.search_list, {}).then((res) => {
            that.setData({
                searchListTop: res.data.response_data.top,
                searchListHistory: res.data.response_data.history
            })
        })
    },
    chooseKey(e) {
        this.setData({
            searchValue: e.currentTarget.dataset.key,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getSearchList();
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

    },
    toShouQuan() {
        wx.navigateTo({
            url: '../authorizationLogin/authorizationLogin'
        });
    }
})