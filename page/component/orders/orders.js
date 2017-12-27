// page/component/orders/orders.js
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");
const orderCommon = require("orderCommon");

/**
 * 获取所有订单
 */
var getOrders = function (that, currentTab) {//根据状态获取订单
  var url = URL.SERVER.order_queryOrderFormList + "?status=" + currentTab;
  httpUtil.http_get(url, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      var noMore = false;
      var orders = res.data.list;
      if (orders && orders.length > 0) {
        noMore = true;
      }
      that.setData({
        currentTab: currentTab,
        orders: res.data.list,
        noMore: noMore
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
    noMore: true,
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
  onPullDownRefresh() {
    var currentTab = this.data.currentTab;
    getOrders(this, currentTab);
  },
  orderDetail: function (e) {
    var index = e.currentTarget.dataset.idx
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
  },
  optionButton(e) {//订单操作
    var self = this;
    var orderFormId = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    if (status == 'AGPAID') {//继续支付
      self.setData({ orderFormId: orderFormId });
      orderCommon.updateOrderForm(self);
    } else {//其它修改订单状态操作
      var url = URL.SERVER.order_updateOrderForm + "?id=" + orderFormId + "&statusCode=" + status;
      httpUtil.http_post(url, null, function (res) {
        if (!res.data.error || res.data.length > 0) {
          tipsUtil.showConfirmCancel(res.data.message, function () {
            var typeStatus = res.data.type;
            if (typeStatus == 'success') {
              wx.redirectTo({
                url: '../orders/orders?currentTab=' + self.data.currentTab
              })
            }
          });
        }
      });
    }
  }
})