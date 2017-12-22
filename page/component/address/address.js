// page/component/new-pages/user/address/address.js
var app = getApp();
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

var getAddress = function (that) {
  httpUtil.http_get(URL.SERVER.address_getAddress, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      var address = res.data;
      var hasAddress = true;
      if (address && address.length >= 5) {
        hasAddress = false;
      }
      that.setData({
        hasAddress: hasAddress,
        address: address
      });
    }
  });
}

Page({
  data: {
    address: {
      id: '',
      consignee: '',
      consigneePhone: '',
      consigneeAddress: ''
    },
    hasAddress: true
  },
  onLoad() {
    var self = this;
    getAddress(self);
  },
  onPullDownRefresh: function () {
    getAddress(this);
  }, 
  delAddress(e) {//删除收货地址
    let that = this;
    let index = e.currentTarget.dataset.index;
    let addressOdj = that.data.address;
    let address = addressOdj[index];
    let addressId = address.id;
    let consignee = address.consignee;
    tipsUtil.showConfirmCancel("确定删除收货人:" + consignee, function () {
      //删除后台数据
      var url = URL.SERVER.address_delAddress + "?id=" + addressId;
      httpUtil.http_get(url, null, function (res) {
        var json = res.data;
        if (!res.data.error || res.data.length > 0) {
          if (json.success) {
            addressOdj.splice(index, 1);
            var hasAddress = true;
            if (address && address.length >= 4) {
              hasAddress = false;
            }
            that.setData({
              hasAddress: hasAddress,
              address: addressOdj
            });
            //清除缓存中的数据
            wx.getStorage({
              key: 'address',
              success: function (res2) {
                if (res2.data.id == addressId) {
                  that.setData({
                    address: {
                      id: '',
                      consignee: '',
                      consigneePhone: '',
                      consigneeAddress: ''
                    }
                  });
                }
              }
            });
          } else {
            tipsUtil.showConfirm(json.message);
          }
        }
      });
    });
  },
  addAddress() {//添加收货地址
    wx.redirectTo({
      url: '../address/addressEdit?formPage=addAddress',
    });
  },
  editAddress(e) {//修改收货地址
    let that = this;
    let index = e.currentTarget.dataset.index;
    let addressOdj = that.data.address;
    let address = addressOdj[index];
    let id = address.id;
    let consignee = address.consignee;
    let consigneePhone = address.consigneePhone;
    let consigneeAddress = address.consigneeAddress;
    var param = "?id=" + id + "&consignee=" + consignee + "&consigneePhone=" + consigneePhone + "&consigneeAddress=" + consigneeAddress + "&formPage=updateAddress";
    wx.redirectTo({
      url: '../address/addressEdit' + param,
    });
  }
});