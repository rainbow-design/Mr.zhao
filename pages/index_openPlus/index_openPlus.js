// pages/index_openPlus/index_openPlus.js
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const mock = require("../../mock/mock.js");
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        initData: [],
        kaiTong: false,
        defaultIndex: 0,
        checked: '../../assets/icon/right_taocan.png',
        normal: '../../assets/icon/round.png',
        isPlus: false,
        plus_id: '',
        price: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPlusState();
        this.getInitPlusList();
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
    getPlusState() {
        var y = this;
        // 获取会员等级
        app.isPlus(function (state) {
            y.setData({
                isPlus: state
            })
        });
    },
    getInitPlusList() {
        var y = this;
        // setTimeout(() => {
        //   y.setData({
        //     initData: mock.plus,
        //   })
        // }, 300)
        util.promiseRequest(api.plus_list, {})
            .then(res => {
                var data = res.data.response_data.lists;
                y.setData({
                    initData: data,
                    plus_id: data[0].id,
                    price: data[0].price
                })
            })
    },
    selectTaocan(e) {
        var index = e.currentTarget.dataset.index;
        var yData = this.data.initData;
        this.setData({
            defaultIndex: index,
            plus_id: yData[`${index}`].id,
            price: yData[`${index}`].price
        })
        console.log("当前选中的套餐" + index)
    },
    kaiTong() {
        var y = this;
        var plus_type = y.data.isPlus ? 2 : 1;
        util.promiseRequest(api.pay_plus, {
            plus_id: y.data.plus_id,
            plus_type: plus_type
        }).then(res => {
            var payParam = res.data.response_data;
            wx.requestPayment({
                timeStamp: payParam.timeStamp,
                nonceStr: payParam.nonceStr,
                package: payParam.package,
                signType: payParam.signType,
                paySign: payParam.paySign,
                success: function (res) {
                    console.log('支付成功' + res);
                    wx.showToast({
                        title: '支付成功...',
                        icon: 'none',
                        duration: 1000,
                        complete: function () {
                            setTimeout(() => {
                                y.setData({
                                    kaiTong: true
                                })
                            }, 1000)
                        }
                    })

                },
                error: function (res) {
                    console.log('支付失败' + res)
                }
            })
            console.log(res);
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

    }
})