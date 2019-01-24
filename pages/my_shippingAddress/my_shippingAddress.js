// pages/my_shippingAddress/my_shippingAddress.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMy_shippingAddress();
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
    this.getMy_shippingAddress();
  },
  toEdit(e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../my_editShippingAddress/my_editShippingAddress`
    })
    wx.yue.pub("editAddress", data);
  },
  getMy_shippingAddress() {
    var y = this;
    util.promiseRequest(api.addr_list, {
      access_token: app.globalData.access_token
    })
      .then(res => {
        var data = res.data.response_data.lists;
        console.log(data);
        y.setData({
          addressData: data
        })
      })
  },
  toAddShippingAddress() {
    wx.navigateTo({
      url: `../my_addShippingAddress/my_addShippingAddress`
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