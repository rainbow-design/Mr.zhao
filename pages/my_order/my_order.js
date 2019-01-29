const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({
  data: {
    currentTab: 0,
    selectTabData: [],
    page: 1,
    num: 5
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let tabNumber = options.tab ? options.tab : 0;
    this.setData({
      currentTab: tabNumber
    })
    // 数据初始化
    this.getSelectTabData();

  },
  getSelectTabData() {
    var y = this,
      yData = y.data;
    util.promiseRequest(api.order_list, {
      status: yData.currentTab,
      page: yData.page,
      num: yData.num
    }).then(res => {
      var data = res.data.response_data.lists;
      y.setData({
        selectTabData: data
      })
    })
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    this.getSelectTabData();
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      this.getSelectTabData();
    }
  },
  // 去评价
  toEvaluation() {
    wx.navigateTo({
      url: `../my_evaluation/my_evaluation`
    })
  },
  // 去支付
  toPay() {
    wx.navigateTo({
      url: `../my_orderDetail/my_orderDetail`
    })
  }
})