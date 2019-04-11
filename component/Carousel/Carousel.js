Component({
    /**
     * 组件的属性列表 必须
     */
    properties: {
        bannerList: { // 属性名
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
            observer: function(newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        },
        dotWidthAndHeight: String,
        swiperHeight: String, // swiper 高度
        dotTop: String // 小点距离顶部高度
    },

    /**
     * 组件的初始数据
     */
    data: {
        swiperCurrentIndex: 0,
        indicatorDots: false // 自定义轮播按钮
    },
    created() {
        console.log('created')
    },

    /**
     * 组件的方法列表
     */
    methods: {

        swiperChange: function(e) {
            var source = e.detail.source;
            if (source === "autoplay" || source === "touch") {
                this.setData({
                    swiperCurrentIndex: e.detail.current
                })
            }
        },
        selectCarouselByIndex: function(e) {
            this.setData({
                swiperCurrentIndex: Number(e.currentTarget.id)
            })
        },
        // 轮播图跳转至内部页面
        toHref(e) {
            const data = e.currentTarget.dataset;
            // type = 2，根据 goods_id 展示商品详情
            // type = 3, 展示富文本的活动详情页面
            if (data.type === '2') {
                wx.navigateTo({
                    url: `../sort_detail/sort_detail?id=${data.id}`
                })
            } else if (data.type === '3') {
                wx.yue.pub("renderData", data.content)
                wx.navigateTo({
                    url: `../activity_detail/activity_detail`
                })
            }
        },
    }
})