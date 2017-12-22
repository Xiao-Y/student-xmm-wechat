// page/component/orders/orders.js
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

var getOrders = function (that, currentTab) {//根据状态获取订单
  var url = URL.SERVER.order_queryOrderFormList + "?status=" + currentTab;
  httpUtil.http_get(url, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      that.setData({
        currentTab: currentTab,
        orders: res.data.list
      });
    }
  });
}

Page({
  data: {
    navbar: [
      { title: '全部', img: 'u_order_all.png', status: 'all' },
      { title: '待付款', img: 'u_wit_pay.png', status: 'UNPAID' },
      { title: '待发货', img: 'u_wit_fahuo.png', status: 'BUSINESS_CONFIRMATION' },
      { title: '待收货', img: 'u_wit_fahuo.png', status: 'CONSIGNMENT' }],
    currentTab: 'all',
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
    var index = e.currentTarget.dataset.idx
    console.info(index);
    var param = JSON.stringify(this.data.orders[index]);
    wx.navigateTo({
      url: 'ordersDetails?formPage=orders&param=' + param,
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