//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
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
        isPlus: false, // 是会员吗
        swiperCurrent: 0,
        card: [], // 优惠券的数量
        bannerList: [], //轮播图
        categoryList: [],
        productList: [],
        shortAddress: '',
        address: '',
        globalAddress: {} // 全局配置的地址信息最大
    },
    //   签到
    toSignIn() {
        let that = this;
        util.promiseRequest(api.sign_in, {}).then((res) => {
            if (!res.data.error_code) {
                that.setData({
                    showSignIn: true
                })
            } else {
                wx.showToast({
                    title: res.data.error_msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    closeB() {
        this.setData({
            showSignIn: false
        })
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
                productList_a: res.data.response_data.lists[0].list,
                productList_b: res.data.response_data.lists[1].list
            })
        })
    },
    toSortPage(e) {
        var data = e.currentTarget.dataset;
        wx.reLaunch({
            url: '../sort/sort?id=' + data.id + '&type=' + data.type + '&index=' + data.index
        })
    },
    toProductDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../sort_detail/sort_detail?id=${id}`
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
    onLoad: function(options) {
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
                                wx.Storage.setItem("token", data.access_token);
                                wx.yue.pub("hasToken", data.access_token)
                                console.log("app.globalData-----------------------")
                                console.dir(app.globalData);
                            } else {
                                wx.navigateTo({
                                    url: `../authorizationLogin/authorizationLogin?isShouquan=false`
                                });
                            }
                        })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.getBannerList();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var y = this;
        wx.yue.sub("hasToken", function() {
            // 获取优惠券
            app.get_coupons(function(data) {
                if (data.length > 0) {
                    y.setData({
                        hasYouhuiquan: true,
                        card: data
                    })
                }
            });
            // 获取购物车订单数
            app.getShoppingCartNum((length) => {
                if (length > 0) {
                    wx.setTabBarBadge({
                        index: 2,
                        text: String(length)
                    })
                } else {
                    wx.removeTabBarBadge({
                        index: 2
                    })
                }
            });
            // 获取用户收货地址条数
            app.getMy_shippingAddressLength();
            // 获取会员等级
            app.isPlus(function(state) {
                y.setData({
                    isPlus: state
                })
            });

        })
        var globalAddress = wx.Storage.getItem("globalAddress");
        if (globalAddress) {
            this.setData({
                globalAddress: globalAddress
            })
        }
    },
    // 领取优惠券
    receive_coupons(e) {
        let that = this;
        app.receive_coupons(e, function() {
            app.get_coupons(function(data) {
                that.setData({
                    card: data,
                    total: data.length
                })
                if (data.length === 0) {
                    that.setData({
                        hasYouhuiquan: false
                    })

                }
            });
        });
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
            wx.Storage.setItem("lat", lat)
            wx.Storage.setItem("lng", lng)
            // 位置信息
            util.getCityInfo(lat, lng, mapKey, function(cityInfo) {
                var shortAddress = cityInfo.address_component.street_number;
                wx.Storage.setItem("shortAddress", shortAddress)
                wx.Storage.setItem("address", cityInfo.address)
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
    onHide: function() {
        // 取消多余的事件订阅
        wx.yue.remove("hasToken");
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    getBannerList() {
        var y = this;
        util.getDataCommon(api.banner, {}, function(res) {
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
    toPlus(e) {
        var data = e.currentTarget.dataset;
        if (data.state) {
            // 我是会员
            wx.navigateTo({
                url: `../index_openPlus/index_openPlus`
            })
        } else {
            wx.navigateTo({
                url: `../index_plus/index_plus`
            })
        }

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
})