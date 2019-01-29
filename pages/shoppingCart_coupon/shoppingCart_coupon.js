// pages/shoppingCart_coupon/shoppingCart_coupon.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponData: [],
    notUseCoupon: true,
    checked: '../../assets/icon/right_orange.png',
    normal: '../../assets/icon/round.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 多个id使用逗号分隔
    this.getMy_coupon(options.ids);
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
  checkAll() {
    var y = this;
    var newCheckState = !this.data.notUseCoupon;
    this.setData({
      notUseCoupon: newCheckState
    })

    if (newCheckState) {
      var couponData = this.data.couponData;
      couponData.forEach((v, i) => {
        y.setData({
          [`couponData[${i}].default_check`]: false
        })
      })
    }
  },
  singleCheck(e) {
    var data = e.currentTarget.dataset;
    var couponData = this.data.couponData;
    var checkstate = data.checkstate;

    var index = data.index;
    this.setData({
      [`couponData[${data.index}].default_check`]: !couponData[`${data.index}`].default_check
    })

    if (checkstate === false) {
      var paramObj = {
        coupons_money: couponData[index].money,
        coupons_id: couponData[index].id
      }
      wx.yue.pub('selectCoupon', paramObj)
      console.log('选中')
      setTimeout(() => {
        app.returnLastPage();
      }, 300)
    }

    this.updateCheckAll();
  },
  updateCheckAll() {
    var couponData = this.data.couponData;
    var checkOrNot = couponData.some(v => v.default_check === true)

    checkOrNot ? this.setData({
      notUseCoupon: false
    }) : this.setData({
      notUseCoupon: true
    })

  },
  getMy_coupon(ids) {
    var y = this;
    util.promiseRequest(api.can_use_coupons, {
      access_token: app.globalData.access_token,
      coupons_id: ids
    })
      .then(res => {
        var data = res.data.response_data.lists;
        console.log(data);
        util.addKey(data, {}, function (v) {
          v.default_check = false;
        })
        y.setData({
          couponData: data
        })
      })
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