const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasYouhuiQuan: true,
        showYouhuiQuan: false,
        classA: [],
        classB: [],
        productList: [],
        classShowA: '',
        classShowB: '',
        proType: null,
        proId: null,
        productList: [],
        card: []
    },
    // 优惠券
    get_coupons() {
        let that = this;
        util.promiseRequest(api.get_coupons, {}).then((res) => {
            that.setData({
                card: res.data.response_data
            })
        })
    },
    // 商品列表
    getproduct_list() {
        let that = this;
        let params = {
            // type: this.data.type,
            // id: this.data.id
        };
        util.promiseRequest(api.product_list, params).then((res) => {
            that.setData({
                productList: res.data.response_data
            })
        })
    },
    // 获取分类
    getProduct_cate(id) {
        let params = {}
        if (id) {
            params.id = id;
        }
        let that = this;
        util.promiseRequest(api.category_list, params).then((res) => {
            that.setData({
                [id ? 'classB' : 'classA']: res.data.response_data.lists,
            })
            if (that.data.classB.length == 0) {
                that.getProduct_cate(that.data.classA[0].id);
            } else {
                that.getproduct_list();
            }
        })
    },
    // 选择分类
    chooseClass(e) {
        let cur = e.currentTarget.dataset;
        this.setData({
            [cur.pro_id ? 'proId' : 'proType']: cur.pro_id ? cur.pro_id : cur.pro_type,
            [cur.type == 1 ? 'classShowA' : 'classShowB']: cur.index
        });
        if (cur.type == 1) {
            this.getProduct_cate(cur.id);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getProduct_cate();
        this.get_coupons();
    },
    toDetail() {
        wx.navigateTo({
            url: `../sort_detail/sort_detail`
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