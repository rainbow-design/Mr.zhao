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
        loading: true,
        searchValue: '',
        productList: [],
        proBottom: true,
        focus: true
    },
    /**
 * 生命周期函数--监听页面加载
 */
    onLoad: function (options) {
        let token = wx.Storage.getItem("token");
        if (this.data.loading && token != '') {
            util.openLoading();
            this.searchListHistory();
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
    toDetail(e) {
        wx.navigateTo({
            url: '../sort_detail/sort_detail?id=' + e.currentTarget.dataset.id
        })
    },
    // 商品列表
    getproduct_list(type) {
        let that = this;
        if ((!this.data.proBottom && type == 1) || this.data.searchValue == '') {
            return;
        } else {
            util.promiseRequest(api.add_search_history, {
                keywords: this.data.searchValue
            }).then((res) => {
                let params = {
                    keyword: that.data.searchValue,
                    num: 8,
                    page: that.data.page
                };
                util.promiseRequest(api.product_list, params).then((res) => {
                    let data = type == 1 ? that.data.productList.concat(res.data.response_data) : res.data.response_data
                    if (res.data.response_data.length < 8) {
                        that.data.proBottom = false;
                    }
                    if (data == '' || data.length === 0) {
                        util.toast("无搜索结果数据...")
                    }
                    that.setData({
                        productList: data
                    })

                })
                that.searchListHistory();
            })
        }
    },
    searchListHistory() {
        let that = this;
        util.promiseRequest(api.search_list, {}).then((res) => {
            // 搜索历史控制显示个数
            var historyData_temp = res.data.response_data.history;
            var historyData = historyData_temp.length > 8 ? historyData_temp.slice(0, 7) : historyData_temp;

            that.setData({
                searchListTop: res.data.response_data.top,
                searchListHistory: historyData,
                loading: false
            }, function () {
                util.closeLoading();
            })
        })
    },
    clearHistory() {
        let that = this;
        util.promiseRequest(api.clear_history, {}).then((res) => {
            if (res.data.response_data.lists == 1) {
                wx.showToast({
                    title: '清除历史数据成功...',
                    icon: 'none',
                    duration: 1000,
                    complete: function () {
                        that.setData({
                            searchListHistory: []
                        })
                    }
                })
            }

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
        var y = this;
        let key = e.currentTarget.dataset.key;
        this.setData({
            searchValue: key,
            page: 1
        })
        y.getproduct_list(1);
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
        this.setData({
            page: this.data.page + 1
        });
        this.getproduct_list(1);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toShouQuan() {
        wx.navigateTo({
            url: '../authorizationLogin/authorizationLogin'
        });
    }
})