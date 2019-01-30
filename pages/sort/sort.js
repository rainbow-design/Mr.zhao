const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const Storage = require("../../utils/storage.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shortAddress: '加载中...',
        address: '',
        showYouhuiQuan: false,
        classA: [],
        classB: [],
        productList: [],
        classShowA: '',
        classShowB: '',
        proType: null,
        proId: null,
        card: [],
        total: 0,
        proBottom: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { },

    // 优惠券
    get_coupons() {
        let that = this;
        app.get_coupons(function (data) {
            that.setData({
                card: data,
                total: data.length
            })
            if (data.length === 0) {
                showYouhuiQuan: false
            }
        })
    },

    // 领取优惠券
    receive_coupons(e) {
        let that = this;
        app.receive_coupons(function () {
            that.get_coupons();
        });
    },
    // 商品列表
    getproduct_list(type) {
        if (!this.data.proBottom && type == 1) {
            return;
        }
        let that = this;
        let params = {
            type: this.data.proType,
            id: this.data.proId,
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
    scrollBottom() {
        this.setData({
            page: this.data.page + 1
        });
        this.getproduct_list(1);
    },
    toSelectAddress(e) {
        var data = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../selectAddress/selectAddress?address=${data.address}`
        })
    },
    // 获取分类
    getProduct_cate(id) {
        let params = {}
        if (id) {
            params.id = id;
        }
        let that = this;
        util.promiseRequest(api.product_cate, params).then((res) => {
            that.setData({
                [id ? 'classB' : 'classA']: res.data.response_data,
            });
            if (res.data.response_data[0]) {
                that.setData({
                    [id ? 'proId' : 'proType']: id ? res.data.response_data[0].id : res.data.response_data[0].type,
                })
            }
            that.getproduct_list();
        })
    },
    // 选择分类
    chooseClass(e) {
        let cur = e.currentTarget.dataset;
        this.setData({
            [cur.type == 1 ? 'classShowA' : 'classShowB']: cur.index,
            proId: cur.pro_id,
            proType: cur.pro_type,
            page: 1,
            proBottom: true
        });
        if (cur.type == 1 && cur.pro_type != 1) {
            this.getProduct_cate(cur.id);
        } else if (cur.pro_type == 1) {
            this.setData({
                classB: [],
            })
            this.getproduct_list();
        } else {
            this.getproduct_list();
        }
    },

    toDetail(e) {
        wx.navigateTo({
            url: '../sort_detail/sort_detail?id=' + e.currentTarget.dataset.id
        })
    },
    getCoupon() {
        this.setData({
            showYouhuiQuan: true
        })
    },
    closeCoupon() {
        this.setData({
            showYouhuiQuan: false
        })
    },
    test() {
        wx.navigateTo({
            url: `../index_search/index_search`
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
        this.setData({
            shortAddress: Storage.getItem("shortAddress"),
            address: Storage.getItem("address")
        })
        this.getProduct_cate();
        this.get_coupons();
        var globalAddress = wx.Storage.getItem("globalAddress");
        if (globalAddress) {
            this.setData({
                globalAddress: globalAddress
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        app.getShoppingCartNum();
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
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})