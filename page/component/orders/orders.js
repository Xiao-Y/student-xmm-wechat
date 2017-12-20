// page/component/orders/orders.js
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

var getOrders = function (that, currentTab) {//根据状态获取订单
  var orders = [
    { number: "123123123123", name: "uojoeo", count: "6", status: "待付款", money: "23.56", unitPrice: 15 },
    { number: "123123123123", name: "驱蚊器驱蚊器器欠妥仍然蚊器仍驱蚊器欠妥仍然", count: "6", status: "待付款", money: "23.56" },
    { number: "123123123123", name: "uojoeo", count: "6", status: "待付款", money: "23.56", unitPrice: 15 },
    { number: "123123123123", name: "uojoeo", count: "6", status: "待付款", money: "23.56", unitPrice: 15 },
    { number: "123123123123", name: "uojoeo", count: "6", status: "待付款", money: "23.56", unitPrice: 15 },
    { number: "123123123123", name: "uojoeo", count: "6", status: "待付款", money: "23.56", unitPrice: 15 }];

  that.setData({
    currentTab: currentTab,
    orders: orders
  })
}

Page({
  data: {
    navbar: [{ title: '全部', img: 'u_order_all.png' },
    { title: '待付款', img: 'u_wit_pay.png' },
    { title: '待发货', img: 'u_wit_fahuo.png' },
    { title: '待收货', img: 'u_wit_fahuo.png' }],
    currentTab: 0,
    orders: []
  },
  navbarTap: function (e) {//点击导航时
    var currentTab = e.currentTarget.dataset.idx;
    getOrders(this, currentTab);
  },
  onLoad: function (options) {//页面加载
    var currentTab = options.currentTab;
    getOrders(this, currentTab);
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.idx
    console.info(orderId);
    wx.navigateTo({
      url: 'ordersDetails?orderId=' + orderId,
    })
  },
  toPay() {//支付
    wx.showModal({
      title: '提示',
      content: '本系统只做演示，支付系统已屏蔽',
      complete() {
        wx.switchTab({
          url: '/page/component/user/user'
        })
      }
    })
  }
})