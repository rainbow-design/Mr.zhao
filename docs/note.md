# Note

## 组件

### 1. image
 - mode = "scaleToFill" 不保持横纵比例缩放占满区域
 - mode ="aspectFit" 保持纵横比缩放图片，长边完全显示
 - mode = "aspectFill"	保持纵横比缩放图片，短边完全显示
 - mode = "widthFix" 宽度不变，高度自动变化，保持原图宽高比不变

 ### 2. view，text
- text 不能实现多行文字截断，使用 view元素
- video,image与view上下有间隙， dispaly:block
- `<view> \n</view>`文本换行

## 生命周期
- onLoad
 `onLoad(Object query)` onLoad 的参数中获取打开当前页面路径中的参数。

## snippets
- setData
````js
 changeItemInArray() {
    // 对于对象或数组字段，可以直接修改一个其下的子字段，这样做通常比修改整个对象或数组更好
    this.setData({
      'array[0].text': 'changed data'
    })
  },
  changeItemInObject() {
    this.setData({
      'object.text': 'changed data'
    })
  },
````
- 固定顶部
````js
// wxml
<import src="../../component/fixed_normal_head.wxml" />

<scroll-view class='posScroll' scroll-y style="height: {{scrollHeight}};">
</scroll-view>
// 或者
<view class='exceptHeader'></view>
.exceptHeader {
  position: absolute;
  top: 128rpx;
}
// js

````js
 data: scrollHeight: ''
 onLoad:
  var that = this;
  app.setHeight(height => {
      that.setData({
        scrollHeight: (height - 128) + 'px'
      })
    })

````
- dataset
 `var data = e.currentTarget.dataset;`
- load
````js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
````
- sendRequest

````js
  util.sendRequest(api.mediaUrl,{},function(res){
      console.log(res.data.response_data.lists)
    })
````
- 内部链接公用
````html
<view data-choice="2" data-type="2" data-relat_id="{{item.id}}" bindtap='toHref'></view>
````
````js
 toHref: function(e) {
   app.toHref(e);
  },
````
- mock
````js
const mockData = require("../../mock/forYourAnswer.js");

setTimeout(() => {
      that.setData({
        defaultData: mockData.default
      })
    }, 0);
````
- class
  + `<view wx:for="{{mediaData}}"class="coverageBox {{(index < mediaData.length -1) ? 'border_bottom':''  }}" data-index ="{{index}}"  ></view>`
  + `  <view wx:for="{{hotcityList}}" class="weui-grid {{(index +1) %3 == 0 ? 'flexWrap':''  }}" data-index="{{index}}" data-code="110000" data-city="北京市" bindtap="bindCity"></view>`

- 页面跳转传递参数 
  + `wx.navigateTo({ url: `../mediaCoverage_detail/mediaCoverage_detail?id=${target.id}` });`

- 公共头部
  + `<import src="../../component/normal_head.wxml" />`
  + `<template is="head" data="{{title: '哪里能查',color:'black'}}" />`
- `wx.request(Object object)` 参数
  + 对于 POST 方法且 header['content-type'] 为 application/json 的数据，会对数据进行 JSON 序列化
  + 对于 POST 方法且 header['content-type'] 为 application/x-www-form-urlencoded 的数据，会将数据转换成 query string 
- uid , session_key
  + [login](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)
  + [uid](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html)



## 地图导航

- [腾讯位置服务](https://lbs.qq.com/console/customized/log/?console=customizedLog)
- [微信小程序之 map 地图使用总结，了解一下？](https://www.jianshu.com/p/5b2f95a16fce)

## 遗留

<!-- - 内链外链跳转 -->
<!-- - 返回按钮添加 -->
<!-- - renderHtml 富文本 -->
<!-- - map location -->
<!-- - 胃你解答交互 -->
<!-- - pdf 下载 -->
- Storage.setItem(array)

## 优化

- 七牛托管 /assets/product

## 记录

### first
- name `磁控胶囊胃镜机器人`
- appid `wx198a730995ba0119`
- 腾讯定位`T4NBZ-CRBCX-QSJ4Q-Z6NAY-CMT4Q-VWFTW`
- [蓝湖](https://lanhuapp.com/web/#/item/board?pid=b228e7c2-8656-4ff2-80ac-450180c8b40e)
- [文档](http://showdoc.qcw100.cn/)

## 生态圈
- wepy
- mpvue
## Userful Links
- [快速了解小程序](http://ssh.today/blog/hello-min-app)
- [从零开始一个微信小程序版知乎](https://juejin.im/post/5a61b6a1518825732739af03)
- [首个微信小程序开发教程！](https://juejin.im/entry/57e34d6bd2030900691e9ad7)