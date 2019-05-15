// pages/shoppingCart_productList/shoppingCart_productList.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    initData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var y = this;
    // 是订单列表里面的查看
    if (options && options.orderId) {
      util
        .promiseRequest(api.order_goods, { order_no: options.orderId })
        .then(res => {
          var orderData = res.data.response_data.lists;
          var data = wx.Storage.getItem("confirm_order_detail");
          data.forEach(v => {
            orderData.forEach(m => {
              if (v.id === m.goods_id) {
                v.num = m.goods_count;
              }
            });
          });
          console.log("data", data);
          y.setData({
            initData: data
          });
        });
    } else {
      // 确认订单里面的情况
      var data = wx.Storage.getItem("confirm_order_detail");
      var carList = wx.Storage.getItem("carList");

      data.forEach(v => {
        carList.forEach(m => {
          if (v.id === m.goods_id) {
            v.num = m.num;
          }
        });
      });
      this.setData({
        initData: data
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
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.Storage.removeItem("confirm_order_detail");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

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
