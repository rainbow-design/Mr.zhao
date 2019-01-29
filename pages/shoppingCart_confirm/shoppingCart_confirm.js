// pages/my.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canScroll: true,
        multiIndex: 0,
        confirmData: {},
        addr_id: '',
        delivery_time_Arr: [],
        result_delivery_time: '', // 最终的配送时间
        delivery_time_id: '',
        orderParam_goods_info: [],
        original_amount: '', // 原始总价
        amount: '', // 总价
        count: '', // 总数
        jifenShouldOver: 50,
        default_useJifen: true,
        checked: '../../assets/icon/checkBox_act.png',
        normal: '../../assets/icon/checkBox.png',
        userJifenNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var yData = this.data;
        var confirmOrderData = wx.Storage.getItem("confirmOrderData");
        if (confirmOrderData) {
            var delivery_time_Arr = [];
            var orderParam_goods_info = [];
            confirmOrderData.delivery_time.forEach(v => {
                delivery_time_Arr.push(v.time);
            })
            var count = 0;
            confirmOrderData.goods_detail.forEach(v => {
                orderParam_goods_info.push({
                    "goods_id": v.id,
                    "num": v.num
                });
                count += v.num;
            })

            var addrInfo = confirmOrderData.addrInfo; // 配送地址信息
            var lists = confirmOrderData.lists; // 其他信息
            var deliver_cost = confirmOrderData.deliver_cost; // 配送费用相关信息
            var delivery_fee = Number(lists.total_price) > Number(deliver_cost[0].limit) ? 0 : deliver_cost[0].cost;
            var userJifenNum = yData.default_useJifen ? lists.score : 0;
            var result_amount = util.toFixed(Number(lists.total_price) - Number(delivery_fee) - (Number(userJifenNum) / 100), 2); // 计算商品总价

            this.setData({
                count: count,
                confirmData: confirmOrderData,
                addrInfo: addrInfo, // 配送地址信息
                addr_id: addrInfo.id, // 地址id
                delivery_time_Arr: delivery_time_Arr, // 配送时间信息
                result_delivery_time: delivery_time_Arr[0], // 默认选中配送时间数组第一个
                deliver_cost: deliver_cost, // 配送信息
                delivery_fee: delivery_fee, // 配送费
                goodsInfo: confirmOrderData.goods_detail, // 商品信息
                Info: lists, // 其他信息
                can_use_coupons: confirmOrderData.can_use_coupons, // 可使用优惠券,
                sale_price: lists.sale_price, // 优惠金额
                orderParam_goods_info: orderParam_goods_info,
                amount: result_amount, // 总价
                original_amount: result_amount, // 原始总价
                userJifenNum: userJifenNum
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
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var delivery_time_Arr = this.data.delivery_time_Arr;
        this.setData({
            index: e.detail.value,
            result_delivery_time: delivery_time_Arr[e.detail.value]
        })
    },

    toProductList() {
        wx.navigateTo({
            url: `../shoppingCart_productList/shoppingCart_productList`
        })
    },
    toAddOrder() {
        var yData = this.data;

        var paramObj = {
            goods_info: JSON.stringify(yData.orderParam_goods_info),
            addr_id: yData.addr_id,
            amount: yData.amount,
            count: yData.count,
            pay_info: {},
            delivery_time: yData.result_delivery_time
        }

        var pay_info = {
            amount: yData.amount, // 商品总价
            sale_price: yData.sale_price, // 优惠金额
            use_score: yData.userJifenNum, // 使用积分
            delivery_fee: yData.delivery_fee // 配送费
        }
        // 没有优惠券
        if (yData.can_use_coupons.count == 0) {
            pay_info.coupons_money = '';
            pay_info.coupons_id = '';
            paramObj.pay_info = JSON.stringify(pay_info);

        } else {
            // 有优惠券从缓存中获取
            var selectCoupon = wx.Storage.getItem("selectCoupon");
            if (selectCoupon != "") {
                // 有选择
                pay_info.coupons_money = selectCoupon.coupons_money;
                pay_info.coupons_id = selectCoupon.coupons_id;
                paramObj.pay_info = JSON.stringify(pay_info);
                // 使用完删除
                wx.Storage.removeItem("selectCoupon");
            } else {
                // 有但是不使用没有优惠券
                pay_info.coupons_money = '';
                pay_info.coupons_id = '';
                paramObj.pay_info = JSON.stringify(pay_info);
            }

        }

        util.promiseRequest(api.add_order, paramObj).then(res => {
          
            console.log(res);
        })


        // console.log('最终的价格是 ' + yData.amount + ', 配送费为' + yData.delivery_fee + ', 使用积分为' + yData.userJifenNum)
        console.log('配送时间是' + yData.result_delivery_time)
        // wx.navigateTo({
        //   url: `../shoppingCart_paySuccess/shoppingCart_paySuccess`
        // })


    },
    toCoupon(e) {
        var data = e.currentTarget.dataset;
        wx.yue.sub('selectCoupon', function (ids) {
            console.log(ids);
            wx.Storage.setItem("selectCoupon", ids)
        })
        wx.navigateTo({
            url: `../shoppingCart_coupon/shoppingCart_coupon?ids=${data.ids}`
        })
    },
    useJifen(e) {
        var data = e.currentTarget.dataset;
        var yData = this.data;
        var checkJifenState = !this.data.default_useJifen;
        // 同时同步商品总价
        var original_amount = yData.original_amount;
        var notCheck_result_amount = util.toFixed(original_amount + (Number(data.score) / 100), 2);
        var checked_result_amount = original_amount;
        checkJifenState ? this.setData({
            default_useJifen: checkJifenState,
            userJifenNum: data.score,
            amount: checked_result_amount
        }) : this.setData({
            default_useJifen: checkJifenState,
            userJifenNum: 0,
            amount: notCheck_result_amount
        })
        // 同步变更商品总价


        console.log(this.data.amount)
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
        // 更新购物车的数量提示
        app.getShoppingCartNum();
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