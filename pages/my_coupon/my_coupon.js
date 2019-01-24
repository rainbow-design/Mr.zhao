// pages/my_integral/my_integral.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    couponData: [],
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
  onLoad: function (options) {
    this.getMy_coupon();
    // 页面初始化 options为页面跳转所带来的参数
    let tabNumber = options.tab ? options.tab : 0;
    this.setData({
      currentTab: tabNumber
    })

  },
  getMy_coupon(index) {
    var y = this;
    util.promiseRequest(api.my_coupons, {
      access_token: app.globalData.access_token,
      status: index || 0
    })
      .then(res => {
        var data = res.data.response_data.lists;
        console.log(data);
        y.setData({
          couponData: data
        })
      })
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.getMy_coupon(e.detail.current);
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    let index = e.target.dataset.current;
    if (this.data.currentTab === index) {
      return false;
    } else {
      that.getMy_coupon(index);
      that.setData({
        currentTab: index
      })
    }
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