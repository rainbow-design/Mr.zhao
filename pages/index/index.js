//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const regeneratorRuntime = require("../../utils/runtime.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showSignIn: false,
        hasYouhuiquan: false, // 首页领取优惠券？
        indicatorDots: false,
        showInviteAd: true,
        isPlus: false, // 是会员吗
        swiperCurrent: 0,
        card: [], // 优惠券的数量
        bannerList: [], //轮播图
        categoryList: [],
        productList: [],
        shortAddress: '',
        address: '',
        globalAddress: '', // 全局配置的地址信息最大
        canSignIn: true

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (!wx.Storage.address) {
            this.getLocation();
        }
        this.getCetegoryList();
        this.getProductList();
        var y = this;
        wx.getSetting({
            success(res) {
                // 鉴别是否授权
                var isShouquan = res.authSetting["scope.userInfo"];
                // 试着直接获取token
                y.getTokenMeg();
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
        var y = this;
        wx.yue.sub("hasToken", function () {
            // 获取优惠券
            app.get_coupons(function (data) {
                if (data.length > 0 && wx.Storage.getItem("closeYouhuoquan") === "close") {
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
            if (wx.Storage.getItem("token")) {
                app.isPlus(function (state) {
                    y.setData({
                        isPlus: state
                    })
                });
            }


        })
        this.setData({
            shortAddress: wx.Storage.getItem("shortAddress"),
            address: wx.Storage.getItem("address")
        })
        var globalAddress = wx.Storage.getItem("globalAddress");
        if (globalAddress) {
            this.setData({
                globalAddress: globalAddress
            })
        }
    },
    //   签到
    toSignIn() {

        app.isLogin(() => {
            let that = this;
            util.promiseRequest(api.sign_in, {}).then((res) => {
                if (!res.data.error_code) {
                    util.toast("今日签到成功...")
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
        })

    },
    // 关闭签到弹框
    closeB() {
        this.setData({
            showSignIn: false
        })
    },
    // 轮播图
    getBannerList() {
        var y = this;
        util.getDataCommon(api.banner, {}, function (res) {
            y.setData({
                bannerList: res
            })
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
            var lists = res.data.response_data.lists;
            var tuijianData = lists.length > 1 ? lists[1].list : [];
            // 热门商品
            util.addKey(lists, {
                showCountControl: false,
                current_num: 0
            })
            // 推荐购买
            util.addKey(tuijianData, {
                showCountControl: false,
                current_num: 0
            })

            that.setData({
                remaiData: lists[0].list,
                tuijianData: tuijianData
            })
        })
    },
    // 加入购物车
    addToCart(e) {
        app.addToCart(e);
        return;
        // + - 按钮控制取消，不使用
        var y = this;
        var data = e.currentTarget.dataset;
        app.isLogin(() => {

            this.getShoppingCartDataLength(data.id, function (thisGoodsLength) {
                // 商品数量为0不直接显示+-

                // 开始购物车商品数量就加一
                app.addToCart(e);
                y.setData({
                    [data.state === 'remai' ? `remaiData[${data.index}].showCountControl` : `tuijianData[${data.index}].showCountControl`]: true,
                    [data.state === 'remai' ? `remaiData[${data.index}].current_num` : `tuijianData[${data.index}].current_num`]: thisGoodsLength + 1
                })


                console.log(thisGoodsLength)
            });
        })
    },
    // 获取购物车此商品的数量
    getShoppingCartDataLength(id, callback) {

        util.promiseRequest(api.cart_list, {}).then(res => {
            var data = res.data.response_data.lists || [];
            var finalData = util.filterObjToArr(data);
            var filterData = finalData.filter((val) => {
                return id == val.goods_id
            });
            let length = filterData.length > 0 ? filterData[0].num : 0;
            callback(length)
        })
    },
    // 加
    numAdd(e) {
        let data = e.currentTarget.dataset;
        let index = data.index;
        let num = data.num;

        this.setData({
            [data.state === 'remai' ? `remaiData[${data.index}].current_num` : `tuijianData[${data.index}].current_num`]: num + 1
        })
        this.changeCart(e.currentTarget.dataset.id, Number(num) + 1);
    },
    // 减
    minusNum(e) {
        let data = e.currentTarget.dataset;
        let index = data.index,
            num = data.num;
        if (num > 1) {
            this.setData({
                [data.state === 'remai' ? `remaiData[${data.index}].current_num` : `tuijianData[${data.index}].current_num`]: num - 1
            })
            this.changeCart(e.currentTarget.dataset.id, Number(num) - 1);
        } else if (num === 1) {
            util.toast("继续删除请到购物车...")
        }


    },
    // 购物车数量变动提交公共方法
    changeCart(id, num) {
        let params = {
            goods_id: id,
            type: 2,
            num: num
        }
        util.promiseRequest(api.cart_add, params).then((res) => {
            // 更新购物车数量
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
        app.isLogin(() => {
            wx.navigateTo({
                url: `../index_search/index_search`
            })
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
                                // wx.navigateTo({
                                //     url: `../authorizationLogin/authorizationLogin?isShouquan=false`
                                // });
                            }
                        })
                }
            }
        })
    },

    swiperChange: function (e) {
        var source = e.detail.source;
        if (source === "autoplay" || source === "touch") {
            this.setData({
                swiperCurrent: e.detail.current
            })
        }
    },
    selectCarouselByIndex: function (e) {
        this.setData({
            swiperCurrent: e.currentTarget.id
        })
    },
    // 领取优惠券
    receive_coupons(e) {
        let that = this;
        app.receive_coupons(e, function () {
            app.get_coupons(function (data) {
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
        }, function () {
            wx.Storage.setItem("closeYouhuoquan", true)
        })
    },
    getLocation() {
        var y = this;
        util.getLocation((lat, lng) => {
            console.log(lat + ',' + lng);
            wx.Storage.setItem("lat", lat)
            wx.Storage.setItem("lng", lng)
            // 位置信息
            util.getCityInfo(lat, lng, wx.mapKey, function (cityInfo) {
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
                url: `../authorizationLogin/authorizationLogin`
            })
        }

    },
    toInviteFriend() {
        app.isLogin(() => {
            app.share();
        })
    },
    closeAd() {
        this.setData({
            showInviteAd: false
        })
    },
    toSelectAddress(e) {
        var data = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../selectAddress/selectAddress?address=${data.address}`
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // 取消多余的事件订阅
        wx.yue.remove("hasToken");
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
        let that = this;
        wx.showNavigationBarLoading() //在标题栏中显示加载

        async function clearData() {
            await that.setData({
                categoryList: [],
                bannerList: [],
                remaiData: [],
                tuijianData: []
            })
        }

        async function getCetegoryList() {
            await util.promiseRequest(api.category_list, {}).then((res) => {
                that.setData({
                    categoryList: res.data.response_data.lists
                })
            })
        }
        async function getBannerList() {
            await util.promiseRequest(api.banner, {}).then((res) => {
                that.setData({
                    bannerList: res.data.response_data.lists
                })
            })
        }

        async function getProductList() {
            await util.promiseRequest(api.index_products, {}).then((res) => {
                var lists = res.data.response_data.lists;
                var tuijianData = lists.length > 1 ? lists[1].list : [];
                // 热门商品
                util.addKey(lists, {
                    showCountControl: false
                })
                // 推荐购买
                util.addKey(tuijianData, {
                    showCountControl: false
                })


                that.setData({
                    remaiData: lists[0].list,
                    tuijianData: tuijianData
                })
            })
        }

        //下拉刷新
        async function refresh() {
            await clearData();
            await getCetegoryList();
            await getProductList();
            await getBannerList();

            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }
        refresh();
    }
})