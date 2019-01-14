# [APi](https://developers.weixin.qq.com/miniprogram/dev/api/)
## 基础
- `wx.canIUse(string schema)` 
判断小程序的API，回调，参数，组件等是否在当前版本可用。
- `wx.getSystemInfoSync()` 设备系统信息
- ` wx.getUpdateManager()` 更新

## 路由
- `wx.navigateBack`返回上级页面
- `wx.navigateTo({url: '../logs/logs'})` 
保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。
- `wx.switchTab(Object object)`
````js
 wx.switchTab({
      url: '../whereCanSearch/whereCanSearch'
    })
````
跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
- `wx.reLaunch(Object object)` 关闭所有页面，打开到应用内的某个页面

## 界面

### 交互

- `wx.showToast(Object object)` 显示消息提示框 
- `wx.showLoading(Object object)` 显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
- `wx.showModal(Object object)` 显示模态对话框

### 下拉刷新
- `wx.startPullDownRefresh(Object object)`

### 动画
- `Animation`

## 网络
### 发起请求
- `wx.request(Object object)` 发起 HTTPS 网络请求。使用前请注意阅读相关说明。
### 下载
- `wx.downloadFile`
## 数据缓存
- `wx.setStorage(Object object)`
- `wx.getStorage(Object object)`
- `wx.removeStorage(Object object)`
- `wx.clearStorage(Object object)`
- `wx.getStorageInfo(Object object)` 异步获取当前storage的相关信息
- `wx.getStorageInfoSync()` 获取当前storage的相关信息同步版本
## 媒体
### 地图
- `MapContext`
### 视频
- `VideoContext`
## 位置
- `wx.getLocation(Object object)` 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。
## 开放接口
### 用户信息
- `wx.getUserInfo(Object object)` 调用前需要 用户授权 scope.userInfo,获取用户信息。
- `wx.authorize(Object object)` 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据

# WXML

## 数据绑定
- 内容
````js
<view>{{ message }}</view>
Page({
  data: {
    message: 'Hello MINA!'
  }
})
````
- 组件属性(需要在双引号之内)
````js
<view id="item-{{id}}"></view>
Page({
  data: {
    id: 0
  }
})
````
- 控制属性(需要在双引号之内)
````js
<view wx:if="{{condition}}"></view>
Page({
  data: {
    condition: true
  }
})
````
- 关键字(需要在双引号之内)
true：boolean 类型的 true，代表真值。
false： boolean 类型的 false，代表假值。
````js
<checkbox checked="{{false}}"></checkbox>
````
### 支持运算
- 三元运算
```js
<view hidden="{{flag ? true : false}}">Hidden</view>
```
- 算数运算
```js
<view>{{a + b}} + {{c}} + d</view>
Page({
  data: {
    a: 1,
    b: 2,
    c: 3
  }
})
```
> view中的内容为 3 + 3 + d。
- 逻辑判断
```js
<view wx:if="{{length > 5}}"></view>
```
- 字符串运算
```js
view>{{"hello" + name}}</view>
Page({
  data: {
    name: 'MINA'
  }
})
```
- 数据路径运算
```js
<view>{{object.key}} {{array[0]}}</view>
Page({
  data: {
    object: {
      key: 'Hello '
    },
    array: ['MINA']
  }
})
```
- 组合数组
```js
<view wx:for="{{[zero, 1, 2, 3, 4]}}">{{item}}</view>
Page({
  data: {
    zero: 0
  }
})
```
## 列表渲染
- `wx:for`
`wx:for`控制属性绑定一个数组.默认数组的当前项的下标变量名默认为 index，数组当前项的变量名默认为 item
```js
<view wx:for="{{array}}">{{index}}: {{item.message}}</view>
```
使用 wx:for-item 可以指定数组当前元素的变量名，

使用 wx:for-index 可以指定数组当前下标的变量名：
````js
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
````
- `block wx:for`
类似 block wx:if，也可以将 wx:for 用在<block/>标签上，以渲染一个包含多节点的结构块。例如：
````js
<block wx:for="{{[1, 2, 3]}}">
  <view>{{index}}:</view>
  <view>{{item}}</view>
</block>
````
- `wx:key`
留关键字 `*this` 代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字
````js
<switch wx:for="{{objectArray}}" wx:key="unique" style="display: block;">
  {{item.id}}
</switch>
<button bindtap="switch">Switch</button>
<button bindtap="addToFront">Add to the front</button>

<switch wx:for="{{numberArray}}" wx:key="*this" style="display: block;">
  {{item}}
</switch>

objectArray: [
      {id: 5, unique: 'unique_5'},
      {id: 4, unique: 'unique_4'},
      {id: 3, unique: 'unique_3'},
      {id: 2, unique: 'unique_2'},
      {id: 1, unique: 'unique_1'},
      {id: 0, unique: 'unique_0'},
    ],
numberArray: [1, 2, 3, 4]
````
[参考](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/list.html)
## 条件渲染
- `wx:if` ,来判断是否需要渲染该代码块：
```js
<view wx:if="{{condition}}">True</view>
```
- 也可以用 wx:elif 和 wx:else 来添加一个 else 块：
```js
<view wx:if="{{length > 5}}">1</view>
<view wx:elif="{{length > 2}}">2</view>
<view wx:else>3</view>
```
- `block wx:if`
因为 wx:if 是一个控制属性，需要将它添加到一个标签上。如果要一次性判断多个组件标签，可以使用一个 <block/> 标签将多个组件包装起来，并在上边使用 wx:if 控制属性。
````js
<block wx:if="{{true}}">
  <view>view1</view>
  <view>view2</view>
</block>
````
> 注意： <block/> 并不是一个组件，它仅仅是一个包装元素，不会在页面中做任何渲染，只接受控制属性。
- wx:if vs hidden
频繁切换：用 hidden。偶尔切换：用 wx:if。
[待测试使用](https://developers.weixin.qq.com/community/develop/doc/7d16c4c00f6a5de51eb78e4a701f4305)


## 事件
事件对象可以携带额外信息，如 id, dataset, touches;
```js
<view id="tapTest" data-hi="WeChat" bindtap="tapName">Click me!</view>
```
> 注意：事件冒泡或捕获带来的特殊影响
## 引用
- import
import可以在该文件中使用目标文件定义的template，如：
在 item.wxml 中定义了一个叫item的template：
```js
<!-- item.wxml -->
<template name="item">
  <text>{{text}}</text>
</template>
```
在 index.wxml 中引用了 item.wxml，就可以使用item模板：
```js
<import src="item.wxml" />
<template is="item" data="{{text: 'forbar'}}" />
```
- include
include 可以将目标文件除了 <template/> <wxs/> 外的整个代码引入，相当于是拷贝到 include 位置，如：
```js
<!-- index.wxml -->
<include src="header.wxml" />
<view>body</view>
<include src="footer.wxml" />
```
```js
<!-- header.wxml -->
<view>header</view>
```
```js
<!-- footer.wxml -->
<view>footer</view>
```
# WXSS
- rpx
- 样式导入 @import
使用@import语句可以导入外联样式表，@import后跟需要导入的外联样式表的相对路径，用;表示语句结束
````css
/** common.wxss **/
.small-p {
  padding:5px;
}
````
````css
/** app.wxss **/
@import "common.wxss";
.middle-p {
  padding:15px;
}
````
- 内联样式
框架组件上支持使用 style、class 属性来控制组件的样式。

style：静态的样式统一写到 class 中。style 接收动态的样式，在运行时会进行解析，请尽量避免将静态的样式写进 style 中，以免影响渲染速度。
````html
<view style="color:{{color}};" />
````
class：用于指定样式规则，其属性值是样式规则中类选择器名(样式类名)的集合，样式类名不需要带上.，样式类名之间用空格分隔。
````html
<view class="normal_view" />
````
# [基础组件](https://developers.weixin.qq.com/miniprogram/dev/component/index.html)
## 公共属性

所有组件都有以下属性：

id	String	组件的唯一标示	保持整个页面唯一
class	String	组件的样式类	在对应的 WXSS 中定义的样式类
style	String	组件的内联样式	可以动态设置的内联样式
hidden	Boolean	组件是否显示	所有组件默认显示
data-*	Any	自定义属性	组件上触发的事件时，会发送给事件处理函数

#### Userful Links
- [微信小程序中预览 PDF 文档](https://fatesinger.com/100293)
- [pdf预览](https://developers.weixin.qq.com/community/develop/doc/00086ec47c4a30b247767124e5b000)
- [获取手机号](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html)
- [官方框架页面](https://developers.weixin.qq.com/miniprogram/dev/framework/MINA.html)