// pages/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canScroll: true,
    multiIndex: 0,
    multiArray: [['今天'], ['一小时', '10：00', '12：00', '14：00', '20：00']],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  toProductList() {
    wx.navigateTo({
      url: `../shoppingCart_productList/shoppingCart_productList`
    })
  },
  toPay() {
    wx.navigateTo({
      url: `../shoppingCart_paySuccess/shoppingCart_paySuccess`
    })
  },
  toCoupon() {
    wx.navigateTo({
      url: `../shoppingCart_coupon/shoppingCart_coupon`
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