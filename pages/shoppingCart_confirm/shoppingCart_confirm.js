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
    addr_id: "",
    delivery_time_Arr: [],
    result_delivery_time: "", // 最终的配送时间
    delivery_time_id: "",
    orderParam_goods_info: [],
    goods_ids: "", // 商品id拼接
    original_amount: "", // 原始总价
    amount: "", // 总价
    count: "", // 总数
    total_price: "", // 默认从确认订单缓存中取出来的总价
    jifenShouldOver: 50,
    default_useJifen: true,
    checked: "../../assets/icon/checkBox_act.png",
    normal: "../../assets/icon/checkBox.png",
    userJifenNum: 0,
    userJifenNum_price: "",
    canPay: true,
    coupons_money: "", // 优惠券优惠金额
    shouldIUse_Jifen: 0 // 实际使用积分个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var yData = this.data;
    var confirmOrderData = wx.Storage.getItem("confirmOrderData");
    if (confirmOrderData) {
      var delivery_time_Arr = [];
      var orderParam_goods_info = [];
      var goods_ids = [];
      confirmOrderData.delivery_time.forEach(v => {
        delivery_time_Arr.push(v.time);
      });
      var count = 0;
      confirmOrderData.goods_detail.forEach(v => {
        orderParam_goods_info.push({
          goods_id: v.id,
          num: v.num
        });
        goods_ids.push(v.id);
        count += v.num;
      });

      var addrInfo = confirmOrderData.addrInfo; // 配送地址信息
      var lists = confirmOrderData.lists; // 其他信息
      var deliver_cost = confirmOrderData.deliver_cost; // 配送费用相关信息
      var delivery_fee =
        Number(lists.total_price) >= Number(deliver_cost[0].limit)
          ? 0
          : deliver_cost[0].cost; // 精确需要支付的配送费
      var userJifenNum,
        jifenShouldOver = yData.jifenShouldOver;
      if (yData.default_useJifen) {
        userJifenNum =
          Number(lists.score) >= jifenShouldOver ? Number(lists.score) : 0;
      } else {
        userJifenNum = 0;
      }
      var result_amount = util.toFixed(
        Number(lists.total_price) + Number(delivery_fee),
        2
      ); // 计算商品总价

      this.setData({
        goods_ids: goods_ids.join(","),
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
        show_sale_price:
          Number(lists.sale_price) > 0 ? lists.sale_price + "元" : 0,
        orderParam_goods_info: orderParam_goods_info,
        amount: result_amount, // 总价
        original_amount: result_amount, // 原始总价
        total_price: lists.total_price, // 确认订单的默认总价
        userJifenNum: userJifenNum
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var yData = this.data;

    let useGlobalFromShoppingCart_confirm = wx.Storage.getItem(
      "useGlobalFromShoppingCart_confirm"
    );
    let globalAddress = wx.Storage.getItem("globalAddress");
    let useThisAddress =
      useGlobalFromShoppingCart_confirm == true ? true : false;
    this.setData({
      useGlobalFromShoppingCart_confirm: globalAddress,
      useThisAddress: useThisAddress,
      addr_id: globalAddress.id
    });
    console.log(useThisAddress);
    var selectCouponData = wx.Storage.getItem("selectCoupon");
    // console.log(selectCouponData)
    // 最终支付
    var finalAmount = 0;
    // 如果用户有选取的优惠券，改变金额
    // 使用原始价格，防止优惠券变更
    let shouldIUse = yData.userJifenNum == 0 ? 0 : yData.jifenShouldOver;

    if (Number(yData.original_amount) > Number(selectCouponData.use_money)) {
      let jifenYouHui = 0;
      if (yData.default_useJifen && yData.userJifenNum) {
        jifenYouHui = Number(yData.Info.score) / 100;
        // 如果积分大于实际支付金额
        if (jifenYouHui > Number(yData.original_amount)) {
          shouldIUse = Number(yData.original_amount) * 100;
          console.log(
            "此笔订单我应该使用（使用优惠券）" + shouldIUse + "的积分"
          );
        }
      }

      finalAmount =
        Number(yData.original_amount) -
        Number(selectCouponData.coupons_money) -
        jifenYouHui;
      if (finalAmount > 0) {
        this.setData({
          amount: util.toFixed(finalAmount, 2)
        });
      }
      this.setData({
        coupons_money:
          "- ￥" + util.toFixed(Number(selectCouponData.coupons_money), 2),
        shouldIUse_Jifen: Number(shouldIUse) // 实际使用积分
      });
      console.log("使用积分?:" + yData.default_useJifen);
      console.log("积分变化：" + yData.userJifenNum);
      console.log("选择优惠券后的金额变化:" + finalAmount);
      // 未选择积分使用优惠券后积分改变
    } else {
      // 积分减免的金额
      let jifenYouHui = 0;
      if (yData.default_useJifen && yData.userJifenNum) {
        jifenYouHui = Number(yData.Info.score) / 100;
        // 如果积分大于实际支付金额
        if (jifenYouHui > Number(yData.original_amount)) {
          shouldIUse = Number(yData.original_amount) * 100;
          console.log("此笔订单(没有优惠券)我应该使用" + shouldIUse + "的积分");
        }
      }
      var original_amount_temp = yData.original_amount - jifenYouHui;
      this.setData({
        amount: util.toFixed(
          original_amount_temp > 0 ? original_amount_temp : 0,
          2
        ),
        coupons_money: "",
        shouldIUse_Jifen: Number(shouldIUse) // 实际使用积分
      });
      // 没有选择优惠券的更新
      console.log("原始价格:" + yData.original_amount);
      console.log("选择优惠券后的金额变化:" + yData.amount);
    }

    // 获取购物车订单数
    app.getShoppingCartNum(
      length => {
        if (length > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: String(length)
          });
        } else {
          wx.removeTabBarBadge({
            index: 2
          });
        }
      },
      carList => {
        // 胶水代码 为了 商品列表页面展示商品数量 shoppingCart_productList
        wx.Storage.setItem("carList", carList.lists);
      }
    );

    console.log("彼时积分：" + this.data.userJifenNum);
    console.log(this.data.shouldIUse_Jifen);
  },
  bindPickerChange(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    var delivery_time_Arr = this.data.delivery_time_Arr;
    this.setData({
      index: e.detail.value,
      result_delivery_time: delivery_time_Arr[e.detail.value]
    });
  },

  toProductList() {
    var y = this;
    console.log(y.data.goods_ids);
    util
      .promiseRequest(api.confirm_order_detail, {
        goods_ids: y.data.goods_ids
      })
      .then(response => {
        var data = response.data.response_data.lists;
        wx.Storage.setItem("confirm_order_detail", data);
        console.log(data);
        wx.navigateTo({
          url: `../shoppingCart_productList/shoppingCart_productList`
        });
      });
  },
  toAddOrder() {
    var yData = this.data;
    if (yData.canPay) {
      this.setData({
        canPay: false
      });
      var paramObj = {
        goods_info: JSON.stringify(yData.orderParam_goods_info),
        addr_id: yData.addr_id,
        amount: yData.amount,
        count: yData.count,
        pay_info: {},
        delivery_time: yData.result_delivery_time
      };

      var pay_info = {
        amount: yData.total_price, // 商品总价
        sale_price: yData.sale_price, // 优惠金额
        use_score: yData.shouldIUse_Jifen, // 使用积分
        delivery_fee: yData.delivery_fee // 配送费
      };
      // 没有优惠券
      if (
        yData.can_use_coupons.count == 0 ||
        wx.Storage.getItem("selectCoupon") == ""
      ) {
        pay_info.coupons_money = "";
        pay_info.coupons_id = "";
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
          pay_info.coupons_money = "";
          pay_info.coupons_id = "";
          paramObj.pay_info = JSON.stringify(pay_info);
        }
      }

      util.promiseRequest(api.add_order, paramObj).then(res => {
        if (res.data.error_msg) {
          util.toast(res.data.error_msg);
          return;
        }
        var orderId = res.data.response_data.order_number;
        util
          .promiseRequest(api.pay_order, {
            order_no: orderId
          })
          .then(response => {
            if (response.data.error_msg) {
              util.toast(response.data.error_msg);
              return;
            }
            var payParam = response.data.response_data;
            wx.requestPayment({
              timeStamp: payParam.timeStamp,
              nonceStr: payParam.nonceStr,
              package: payParam.package,
              signType: payParam.signType,
              paySign: payParam.paySign,
              success: function(res) {
                console.log("支付成功" + res);
                setTimeout(() => {
                  wx.redirectTo({
                    url: `../shoppingCart_paySuccess/shoppingCart_paySuccess?id=${orderId}`
                  });
                }, 1000);
                // 获取购物车订单数
              },
              fail: function(res) {
                console.log("支付失败" + res);
                wx.redirectTo({
                  url: `../my_orderDetail/my_orderDetail?id=${orderId}&state=1&statename=待付款`
                });
              }
            });

            console.log(
              "最终的价格是 " +
                yData.amount +
                ", 配送费为" +
                yData.delivery_fee +
                ", 使用积分为" +
                yData.userJifenNum
            );
            console.log("配送时间是" + yData.result_delivery_time);
          });
      });
    }
  },
  toCoupon(e) {
    var data = e.currentTarget.dataset;
    wx.yue.sub("selectCoupon", function(ids) {
      console.log(ids);
      wx.Storage.setItem("selectCoupon", ids);
    });
    wx.navigateTo({
      url: `../shoppingCart_coupon/shoppingCart_coupon?ids=${data.ids}`
    });
  },
  useJifen(e) {
    var data = e.currentTarget.dataset;
    var yData = this.data;
    var checkJifenState = !this.data.default_useJifen;
    // 同时同步商品总价
    // 优惠券有选择吗？
    var selectCouponData = wx.Storage.getItem("selectCoupon");
    // 最终支付
    var finalAmount = 0;
    // 如果用户有选取的优惠券，改变金额
    // 使用原始价格，防止优惠券变更
    var youhuiPrice = 0;
    if (Number(yData.original_amount) > Number(selectCouponData.use_money)) {
      youhuiPrice = Number(selectCouponData.coupons_money);
      console.log("有选择的优惠券:" + youhuiPrice);
    }
    var original_amount = yData.original_amount;
    var checked_result_amount_temp =
      Number(original_amount) - Number(data.score) / 100 - youhuiPrice;
    var checked_result_amount = util.toFixed(
      checked_result_amount_temp > 0 ? checked_result_amount_temp : 0,
      2
    );
    var notCheck_result_amount = util.toFixed(
      Number(original_amount) - youhuiPrice,
      2
    );
    checkJifenState
      ? this.setData({
          default_useJifen: checkJifenState,
          userJifenNum: data.score,
          amount: checked_result_amount
        })
      : this.setData({
          default_useJifen: checkJifenState,
          userJifenNum: 0,
          amount: notCheck_result_amount
        });
    // 同步变更商品总价

    // console.log(this.data.amount)
    if (this.data.userJifenNum === 0) {
      this.setData({
        userJifenNum_price: "false"
      });
    } else {
      this.setData({
        userJifenNum_price: this.data.userJifenNum / 100
      });
    }
    console.log("积分：" + this.data.userJifenNum_price);
  },
  changeAnotherAdress() {
    let y = this;
    let yData = y.data;
    let addrInfo = yData.addrInfo; // 配送地址信息
    let addr_id = addrInfo.id; // 地址id
    // 收货地址
    wx.navigateTo({
      url: `../selectAddress/selectAddress?from=shoppingCart_confirm&addr_id=${addr_id}`
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 更新购物车的数量提示
    // 获取购物车订单数
    app.getShoppingCartNum(length => {
      if (length > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: String(length)
        });
      } else {
        wx.removeTabBarBadge({
          index: 2
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 更新购物车的数量提示
    // 获取购物车订单数
    app.getShoppingCartNum(length => {
      if (length > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: String(length)
        });
      } else {
        wx.removeTabBarBadge({
          index: 2
        });
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
