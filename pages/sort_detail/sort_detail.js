const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../api/index.js");
const WxParse = require("../../component/wxParse/wxParse.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasYouhuiQuan: true,
    productList: [],
    id: "",
    detailText: {
      content: ""
    },
    shoppingCartNum: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.getproduct_detail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var y = this;
    // 获取购物车订单数
    if (wx.Storage.getItem("token")) {
      app.getShoppingCartNum(length => {
        if (length > 0) {
          y.setData({
            shoppingCartNum: length
          });
        } else {
          y.setData({
            shoppingCartNum: 0
          });
        }
      });
    }
  },
  // 商品列表
  getproduct_detail() {
    let that = this;
    let params = {
      id: this.data.id
    };
    util.promiseRequest(api.product_detail, params).then(res => {
      var data = res.data.response_data[0];
      that.setData({
        productList: data,
        detailText: {
          content: WxParse.wxParse("detailTextt", "html", data.content, that)
        }
      });
    });
  },
  toShopCart() {
    wx.switchTab({
      url: "../shoppingCart/shoppingCart"
    });
  },
  joinCart() {
    app.isLogin(() => {
      var y = this;
      let params = {
        goods_id: this.data.id,
        type: 1,
        num: 1
      };

      util.promiseRequest(api.cart_add, params).then(res => {
        wx.showToast({
          title: "加入购物车成功",
          icon: "none",
          duration: 300,
          complete: function() {
            setTimeout(() => {
              // 获取用户购物车的订单量
              y.setData({
                shoppingCartNum: y.data.shoppingCartNum + 1
              });
            }, 300);
          }
        });
      });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 获取购物车订单数
    if (wx.Storage.getItem("token")) {
      app.getShoppingCartNum(length => {
        if (length > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: String(length)
          });
        } else {
          wx.removeTabBarBadge({
            index: 2
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 获取购物车订单数
    if (wx.Storage.getItem("token")) {
      app.getShoppingCartNum(length => {
        if (length > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: String(length)
          });
        } else {
          wx.removeTabBarBadge({
            index: 2
          });
        }
      });
    }
  }
});
