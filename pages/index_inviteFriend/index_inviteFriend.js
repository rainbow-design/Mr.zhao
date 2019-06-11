const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../api/index.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let y = this;
    util
      .promiseRequest(api.basicInfo, {
        access_token: app.globalData.access_token
      })
      .then(res => {
        let id = res.data.response_data.lists[0].id;
        y.setData({
          id: id
        });
      });
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
  onShareAppMessage: function() {
    return {
      title: "",
      path: "/pages/index/index?id=" + this.data.id
    };
  }
});
