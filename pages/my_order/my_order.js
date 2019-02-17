const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({
    data: {
        currentTab: 0,
        selectTabData: [],
        page: 1,
        num: 5,
        oldNum: 5, // 旧时分页数量
        isUpdate: false
    },
    onLoad: function (options) {
        var data = this.data;
        // 页面初始化 options为页面跳转所带来的参数
        let tabNumber = options.tab ? options.tab : 0;
        this.setData({
            currentTab: tabNumber
        })
        // 数据初始化
        this.getSelectTabData(data.page, data.num, tabNumber);

    },
    getSelectTabData(page, num, tab) {
        console.log("请求第" + page + '页')
        var y = this,
            yData = y.data;
        util.promiseRequest(api.order_list, {
            status: tab,
            page: page,
            num: num
        }).then(res => {
            let orderData, data;
            // 旧数据
            orderData = yData.selectTabData;
            // 新数据
            data = res.data.response_data.lists;

            // 定义新数据及长度
            var newData;
            if (orderData.length > 0) {
                newData = orderData.concat(data);
            } else {
                newData = data;
            }
            y.setData({
                selectTabData: newData,
                oldNum: data.length
            })
        })
    },
    //滑动切换
    swiperTab: function (e) {
        var that = this;
        let yData = that.data;
        let tabIndex = e.detail.current;
        that.setData({
            selectTabData: [],
            currentTab: tabIndex,
            page: 1,
            num: 5,
            oldNum: 5
        });
        if (!yData.isUpdate) {
            console.log('111111111')
            that.getSelectTabData(yData.page, yData.num, tabIndex);
        }
    },
    //点击切换
    clickTab: function (e) {
        var that = this;
        let yData = that.data;
        let tabIndex = e.currentTarget.dataset.current;
        that.setData({
            isUpdate: true,
            selectTabData: [],
            currentTab: tabIndex,
            page: 1,
            num: 5,
            oldNum: 5
        })
        that.getSelectTabData(yData.page, yData.num, tabIndex);
    },
    // 直接支付
    toPay(e) {
        var orderId = e.currentTarget.dataset.order;
        util.promiseRequest(api.pay_order, {
            order_no: orderId
        }).then(response => {
            var payParam = response.data.response_data;
            wx.requestPayment({
                timeStamp: payParam.timeStamp,
                nonceStr: payParam.nonceStr,
                package: payParam.package,
                signType: payParam.signType,
                paySign: payParam.paySign,
                success: function (res) {
                    console.log('支付成功' + res);
                    y.setData({
                        kaiTong: true
                    })
                },
                fail: function (res) {
                    console.log('支付失败' + res);
                    wx.navigateTo({
                        url: `../my_orderDetail/my_orderDetail?id=${orderId}&state=1&statename=待付款`
                    })
                }
            })
            console.log(response);
        })
    },
    // 确认收货
    confirm(e) {
        let that = this;
        util.promiseRequest(api.confirm_goods, {
            order_no: e.currentTarget.dataset.order
        }).then(res => {
            var data = res.data.response_data.lists;
            if (data === 1) {
                wx.showToast({
                    title: '确认收货成功...',
                    icon: 'none',
                    duration: 1000,
                    complete: function () {
                        setTimeout(() => {
                            app.returnLastPage();
                        }, 1000)
                    }
                })
            } else {
                wx.showToast({
                    title: '确认收货失败...',
                    icon: 'none',
                    duration: 1000,
                    complete: function () {
                        setTimeout(() => {
                            app.returnLastPage();
                        }, 1000)
                    }
                })
            }
        })
    },
    // 再来一单
    again(e) {
        let data = e.currentTarget.dataset;
        let params = {
            order_no: data.id,
        }
        util.promiseRequest(api.once_again_order, params).then(res => {
            wx.switchTab({
                url: '/pages/shoppingCart/shoppingCart'
            })
        })
    },
    // 去评价
    toEvaluation(e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../my_evaluation/my_evaluation?orderId=${data.id}&staffId=${data.staffer}`
        })
    },
    // 去详情
    toDetail(e) {
        var data = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../my_orderDetail/my_orderDetail?id=${data.id}&state=${data.state}&statename=${data.statename}`
        })
    },

    updateData: function () {
        console.log("上拉 scroll-view，开始更新数据");
        var yData = this.data;
        let type = yData.currentTab;

        // 更新 page
        let oldNum = yData.oldNum;
        // 有新数据
        var hasNewData = oldNum === yData.num;
        // 新的请求页数
        let newPage = yData.page + 1;

        this.setData({
            page: newPage
        })
        var newNum = yData.num;
        if (hasNewData) {
            this.getSelectTabData(newPage, newNum, type)
        }
    },
    onPullDownRefresh: function () {
        wx.startPullDownRefresh()
    }

})