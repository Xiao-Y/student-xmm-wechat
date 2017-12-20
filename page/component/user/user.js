// page/component/new-pages/user/user.js
var app = getApp();
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");

Page({
  data: {
    thumb: '',
    nickname: '',
  },
  onLoad() {
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })
  },
  onShow() {
    console.info("11");
  },
  myOrders() {//我的订单
    wx.navigateTo({
      url: '../orders/orders?currentTab=0',
    });
  },
  pendingPayment() {//待付款
    wx.navigateTo({
      url: '../orders/orders?currentTab=1',
    });
  },
  pendingDelivery() {//待发货
    wx.navigateTo({
      url: '../orders/orders?currentTab=2',
    });
  },
  pendingTakeDelivery() {//待收货
    wx.navigateTo({
      url: '../orders/orders?currentTab=3',
    });
  },
  /**
   * 发起支付请求
   */
  payOrders() {
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        wx.showModal({
          title: '支付提示',
          content: '<text>',
          showCancel: false
        })
      }
    })
  }
})