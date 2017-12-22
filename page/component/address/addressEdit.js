// page/component/new-pages/user/address/address.js
var app = getApp();
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

Page({
  data: {
    address: {
      id: '',
      consignee: '',
      consigneePhone: '',
      consigneeAddress: ''
    },
    formPage: ''
  },
  onLoad(option) {
    var self = this;
    var type = "add";//添加
    var formPage = option.formPage;
    if (formPage == 'updateAddress') {
      type = "update";//更新
    }
    self.setData({
      address: {
        type: type,
        id: option.id,
        consignee: option.consignee,
        consigneePhone: option.consigneePhone,
        consigneeAddress: option.consigneeAddress
      },
      formPage: formPage
    })
  },
  formSubmit() {
    var self = this;
    var formPage = self.data.formPage;
    var addressId = self.data.address.id;
    if (self.data.address.consignee && self.data.address.consigneePhone && self.data.address.consigneeAddress) {
      var param = self.data.address;
      httpUtil.http_post(URL.SERVER.address_saveAddress, param, function (res) {
        if (!res.data.error || res.data.length > 0) {
          var json = res.data;
          if (json.success) {
            self.data.address.id = json.data;
            //更新缓存中的数据
            wx.setStorage({
              key: 'address',
              data: self.data.address
            });
            //从地址管理页面进来
            if (formPage == 'updateAddress' || formPage == 'addAddress') {
              wx.redirectTo({
                url: '../address/address',
              });
            } else {//从订单页面过来
              wx.redirectTo({
                url: '../orders/ordersDetails',
              });
            }
          } else {
            tipsUtil.showConfirm(json.message);
          }
        }
      });
    } else {
      tipsUtil.showTipModel("请填写完整资料");
    }
  },
  bindName(e) {
    this.setData({
      'address.consignee': e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      'address.consigneePhone': e.detail.value
    })
  },
  bindDetail(e) {
    this.setData({
      'address.consigneeAddress': e.detail.value
    })
  }
})