// pages/index_openPlus/index_openPlus.js
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const mock = require("../../mock/mock.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    initData: [],
    kaiTong: false,
    defaultIndex: 0,
    checked: '../../assets/icon/right_taocan.png',
    normal: '../../assets/icon/round.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlusData();
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
  getPlusData() {
    var y = this;
    setTimeout(() => {
      y.setData({
        initData: mock.plus,
      })
    }, 300)
  },
  selectTaocan(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      defaultIndex: index
    })
    console.log("当前选中的套餐" + index)
  },
  kaiTong() {
    this.setData({
      kaiTong: true
    })
  },
  toIndex() {
    app.toIndex();
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