// pages/my_addShippingAddress/my_addShippingAddress.js
const Storage = require("../../utils/storage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectAddress: 0,
    showCitySelect: false,
    address: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var y = this;
    wx.yue.sub("addAddress", function (data) {
      Storage.setItem("addAddress", data);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var y = this;
    var addressData = Storage.getItem("addAddress");
    addressData != "" ? y.setData({
      address: addressData.address
    }) : ''
    Storage.removeItem("addAddress")
  },
  selectAddressType(e) {
    var data = e.currentTarget.dataset;
    this.setData({
      selectAddress: Number(data.num)
    })

  },
  selectYourAddress() {
    var y = this;
    var from = true;

    wx.navigateTo({
      url: `../selectAddress/selectAddress?getAddress=${from}`
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