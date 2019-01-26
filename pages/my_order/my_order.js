var app = getApp()
Page({
  data: {
    currentTab: 0,
    noOrder:false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let tabNumber = options.tab ? options.tab : 0;
    this.setData({
      currentTab: tabNumber
    })

  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
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