// pages/my/my.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCallTelMask: false,
    userInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },
  getUserInfo() {
    var y = this;
    util.promiseRequest(api.basicInfo, { access_token: app.globalData.access_token })
      .then(res => {
        var data = res.data.response_data;
        y.setData({
          userInfo: data
        })

      })
  },
  toMemberInfo(e) {
    var data = e.currentTarget.dataset.info;
    wx.yue.pub("userInfo", data);
    wx.navigateTo({
      url: `../my_memberInfo/my_memberInfo`
    })
  },
  // 优惠券
  toCoupon() {
    wx.navigateTo({
      url: `../my_coupon/my_coupon`
    })
  },
  // 我的积分
  toIntegral() {
    wx.navigateTo({
      url: `../my_integral/my_integral`
    })

  },
  // 我的邀请
  toinvite() {
    wx.navigateTo({
      url: `../my_invite/my_invite`
    })

  },
  // 开通会员
  openPlus() {
    wx.navigateTo({
      url: `../index_plus/index_plus`
    })
  },
  // 我的订单
  toOrder() {
    wx.navigateTo({
      url: `../my_order/my_order`
    })
  },
  // 显示客服帮助
  showCallMe() {
    this.setData({
      showCallTelMask: true
    })
  },
  toInviteFriend() {
    wx.navigateTo({
      url: `../index_inviteFriend/index_inviteFriend`
    })
  },
  // 收货地址
  toShippingAddress() {
    wx.navigateTo({
      url: `../my_shippingAddress/my_shippingAddress`
    })
  },
  cancelToCallTel() {
    this.setData({
      showCallTelMask: false
    })
  },
  toContactUs() {
    wx.makePhoneCall({
      phoneNumber: '400-686-2367'
    })
  },
  toMyOrderPage(e) {
    let tabNumber = e.currentTarget.dataset.tab;
    wx.navigateTo({
      url: `../my_order/my_order?tab=${tabNumber}`
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