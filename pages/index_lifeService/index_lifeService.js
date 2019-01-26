const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lifeList: [],
    defaultPhone: '1234567',
    currentPhone: ''
  },
  // 获取生活服务
  getLife() {
    let that = this;
    util.promiseRequest(api.service_life, {}).then((res) => {
      that.setData({
        lifeList: res.data.response_data.lists
      })
    })
  },
  choosePhone(e) {
    this.setData({
      defaultPhone: '',
      currentPhone: e.currentTarget.dataset.phone
    })
  },
  call() {
    var thisData = this.data,
      phone = thisData.defaultPhone || thisData.currentPhone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLife();
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
  toLeaveAMessage() {
    wx.navigateTo({
      url: `../index_leaveAMessage/index_leaveAMessage`
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