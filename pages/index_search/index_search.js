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
        productList: [],
        proBottom: true
    },
    toDetail(e) {
        wx.navigateTo({
            url: '../sort_detail/sort_detail?id=' + e.currentTarget.dataset.id
        })
    },
    // 商品列表
    getproduct_list(type) {
        if (!this.data.proBottom && type == 1) {
            return;
        }
        let that = this;
        let params = {
            keyword: this.data.searchValue,
            num: 20,
            page: this.data.page
        };
        util.promiseRequest(api.product_list, params).then((res) => {
            let data = type == 1 ? that.data.productList.concat(res.data.response_data) : res.data.response_data
            if (res.data.response_data.length < 20) {
                that.data.proBottom = false;
            }
            that.setData({
                productList: data
            })
        })
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
    search() {
        this.setData({
            page: 1,
            proBottom: true
        });
        this.getproduct_list();
    },
    inputData(e) {
        this.setData({
            searchValue: e.detail.value
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
        this.setData({
            page: this.data.page + 1
        });
        this.getproduct_list(1);
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