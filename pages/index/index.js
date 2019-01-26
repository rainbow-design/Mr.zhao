//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const Storage = require("../../utils/storage.js");
// 实例化API核心类
var mapKey = 'GRBBZ-C6A35-IJLI7-QKHAT-NXZ7S-IQBG6'
// pages/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSignIn: false,
    hasYouhuiquan: false, // 首页领取优惠券？
    indicatorDots: false,
    swiperCurrent: 0,
    bannerList: [], //轮播图
    RootUrl: api.RootUrl,
    categoryList: [],
    productList: [],
    shortAddress: '',
    address: ''
  },
  // 分类列表
  getCetegoryList() {
    let that = this;
    util.promiseRequest(api.category_list, {}).then((res) => {
      that.setData({
        categoryList: res.data.response_data.lists
      })
    })
  },
  // 商品
  getProductList() {
    let that = this;
    util.promiseRequest(api.index_products, {}).then((res) => {
      that.setData({
        productList: res.data.response_data.lists
      })
    })
  },
  toIndexSearch() {
    wx.navigateTo({
      url: `../index_search/index_search`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation();
    this.getCetegoryList();
    this.getProductList();
    var y = this;
    wx.getSetting({
      success(res) {
        // 鉴别是否授权
        var isShouquan = res.authSetting["scope.userInfo"];
        if (!isShouquan) {
          wx.navigateTo({
            url: `../authorizationLogin/authorizationLogin?isShouquan=${isShouquan}`
          });
        } else {
          // 已授权直接获取token
          y.getTokenMeg();
        }
      }
    })
  },
  getTokenMeg() {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          util.promiseRequest(api.login, {
            wxcode: res.code
          })
            .then(response => {
              var data = response.data.response_data;
              if (data && data.result === true) {
                //已登录 true
                // 直接存储数据
                app.globalData.userData = data;
                app.globalData.openid = data.openid;
                app.globalData.access_token = data.access_token;
                console.log("app.globalData-----------------------")
                console.dir(app.globalData);
              }
            })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getBannerList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  closeYouhuoquan() {
    this.setData({
      hasYouhuiquan: false
    })
  },
  getLocation() {
    var y = this;
    util.getLocation((lat, lng) => {
      console.log(lat + ',' + lng);
      Storage.setItem("lat", lat)
      Storage.setItem("lng", lng)
      // 位置信息
      util.getCityInfo(lat, lng, mapKey, function (cityInfo) {
        console.log(cityInfo);
        var shortAddress = cityInfo.address_component.street_number;
        Storage.setItem("shortAddress", shortAddress)
        Storage.setItem("address", cityInfo.address)
        y.setData({
          address: cityInfo.address,
          shortAddress: shortAddress
        })
      })
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

  },
  getBannerList() {
    var y = this;
    util.getDataCommon(api.banner, {}, function (res) {
      y.setData({
        bannerList: res
      })
    })
  },
  toShouQuan() {
    wx.navigateTo({
      url: '../authorizationLogin/authorizationLogin'
    });
  },
  toLifeService() {
    wx.navigateTo({
      url: `../index_lifeService/index_lifeService`
    })
  },
  toPlus() {
    wx.navigateTo({
      url: `../index_plus/index_plus`
    })
  },
  toInviteFriend() {
    app.share();
  },
  toSelectAddress(e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../selectAddress/selectAddress?address=${data.address}`
    })
  },
  toSignIn() {
    this.setData({
      showSignIn: !this.data.showSignIn
    })
  },
})