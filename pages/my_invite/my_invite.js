// pages/my_invite/my_invite.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../api/index.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    initData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (this.data.loading) {
      util.openLoading();
    }
    this.getFrientInvit();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  getFrientInvit() {
    var y = this;
    util
      .promiseRequest(api.my_friends, {
        access_token: app.globalData.access_token
      })
      .then(res => {
        var data = res.data.response_data.lists;
        data.forEach(v => {
          v.shortDate = v.create_time.split(" ")[0];
        });
        util.closeLoading();
        y.setData({
          initData: data,
          loading: false
        });
      });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
