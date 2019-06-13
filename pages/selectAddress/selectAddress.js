// pages/selectAddress/selectAddress.js
const app = getApp();
var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js");
const util = require("../../utils/util.js");
const api = require("../../api/index.js");
const qqmapsdk = new QQMapWX({
  key: wx.mapKey // 必填
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dontShowNowLocation: false,
    focus: false,
    initAddress: "",
    loading: false,
    addressData: [],
    keyword: "",
    showSearchData: false,
    showMyShoppingAddress: true,
    formAddAddress: false,
    formEditAddress: false,
    result: [],
    onlyShowAddress: false // 默认不仅仅展示收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.addAddress === "true") {
      console.log("获取地址传回去");
      wx.setNavigationBarTitle({
        title: "搜索地址" //页面标题为路由参数
      });
      this.setData({
        focus: true,
        dontShowNowLocation: true,
        formAddAddress: true,
        showMyShoppingAddress: false
      });
    }
    // 确认订单更新地址
    if (options && options.from == "shoppingCart_confirm") {
      let addr_id = options.addr_id;
      let from = options.from;
      this.setData({
        addr_id: addr_id,
        from: from
      });
    }
    // 仅仅展示我的收货地址
    if (Number(options.length) > 0) {
      this.setData({
        onlyShowAddress: true
      });
    }
    if (options.editAddress === "true") {
      console.log("获取地址传回去");
      wx.setNavigationBarTitle({
        title: "搜索地址" //页面标题为路由参数
      });
      this.setData({
        focus: true,
        formEditAddress: true,
        dontShowNowLocation: true,
        showMyShoppingAddress: false
      });
    }

    if (options.address) {
      // 有默认地址直接设置
      this.setData({
        initAddress: options.address
      });
    } else {
      this.reGetLocation();
    }

    this.getMy_shippingAddress();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMy_shippingAddress();
  },
  setWithThisAdress() {
    var yData = this.data;
    var address = yData.initAddress || yData.reAddress;
    var shortAdress = address.split("区")[1];
    wx.Storage.setItem("address", address);
    wx.Storage.setItem("shortAddress", shortAdress);
    wx.Storage.removeItem("globalAddress");
    app.returnLastPage();
  },
  getMy_shippingAddress() {
    var y = this;
    util
      .promiseRequest(api.addr_list, {
        access_token: app.globalData.access_token
      })
      .then(res => {
        var data = res.data.response_data.lists;
        console.log(data);
        y.setData({
          addressData: data
        });
      });
  },
  searchInp(e) {
    var val = e.detail.value;
    console.log(val);
    this.setData({
      keyword: val,
      showSearchData: true
    });
    var lat = wx.Storage.getItem("lat"),
      lng = wx.Storage.getItem("lng");
    let isChinese = util.checkType(val, "hasChinese");
    if (isChinese) {
      this.searchArea(lat, lng, val);
    }
  },
  reGetLocation() {
    var y = this;
    this.setData({
      initAddress: "",
      loading: true
    });
    util.getLocation((lat, lng) => {
      console.log(lat + "," + lng);
      // 更新经纬度
      wx.Storage.setItem("lat", lat);
      wx.Storage.setItem("lng", lng);
      // 位置信息
      util.getCityInfo(lat, lng, wx.mapKey, function(cityInfo) {
        console.log(cityInfo);
        setTimeout(() => {
          y.setData({
            loading: false,
            reAddress: cityInfo.address,
            reShortAddress: cityInfo.address_component.street_number
          });
        }, 1000);
      });
    });
  },

  searchArea: function(lat, lng, keyWord) {
    var _this = this;
    var location = lat + "," + lng;
    qqmapsdk.search({
      keyword: keyWord, //搜索关键词
      location: location,
      success: function(res) {
        //搜索成功后的回调
        if (res.data && res.data.length) {
          _this.setData({
            result: res.data
          });
          console.log(res.data);
        } else {
          util.toast("未查询到位置...");
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  selectGlobalAddress(e) {
    var yData = this.data;
    var data = e.currentTarget.dataset;
    if (yData.from == "shoppingCart_confirm" && data.id != yData.addr_id) {
      // 设置新的地址确认订单使用
      wx.Storage.setItem("useGlobalFromShoppingCart_confirm", true);
    }
    wx.Storage.setItem("globalAddress", data.info);
    wx.Storage.removeItem("shortAddress");
    wx.Storage.removeItem("address");
    app.returnLastPage();
  },
  addShippingAddress() {
    wx.navigateTo({
      url: `../my_addShoppingAddress/my_addShoppingAddress`
    });
  },
  toJump(e) {
    var data = e.currentTarget.dataset;
    var yData = this.data;
    if (yData.formAddAddress) {
      wx.yue.pub("addAddress", data.info);
      app.returnLastPage();
      // wx.redirectTo({
      //     url: `../my_addShoppingAddress/my_addShoppingAddress`
      // })
    } else if (yData.formEditAddress) {
      wx.yue.pub("editAddress_selectAddress", data.info);
      app.returnLastPage();
      // wx.redirectTo({
      //     url: `../my_editShoppingAddress/my_editShoppingAddress`
      // })
    } else {
      wx.Storage.setItem("address", data.info.address);
      wx.Storage.setItem("shortAddress", data.info.title);
      wx.Storage.removeItem("globalAddress");
      app.returnLastPage();
    }
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
