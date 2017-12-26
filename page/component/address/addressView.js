// page/component/address/addressView.js
var app = getApp();
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

var getAddress = function (that, options) {
  var addressId = options.addressId;
  httpUtil.http_get(URL.SERVER.address_getAddress, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      var addresses = res.data;
      for (var i = 0; i < addresses.length; i++) {
        var address = addresses[i];
        address.selected = false;
        if (address.id === addressId) {
          address.selected = true;
        }
      }
      that.setData({
        addresses: addresses
      });
    }
  });
}

Page({
  data: {
    addresses: {
      id: '',
      consignee: '',
      consigneePhone: '',
      consigneeAddress: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getAddress(this, options);
  },
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let addresses = this.data.addresses;
    const selected = addresses[index].selected;
    for (var i = 0; i < addresses.length; i++) {
      addresses[i].selected = false;
    }
    addresses[index].selected = true;
    this.setData({
      addresses: addresses
    });
  },
  changeAddress() {
    var param = this.data.addresses.filter(this.selectedFilter);
    if(param && param.length > 0){
      param = param[0];
    }else{
      tipsUtil.showConfirm("请选择收货地址！");
      return false;
    }
    //更新缓存中的数据
    wx.setStorage({
      key: 'address',
      data: param
    });
    wx.navigateBack();
  },
  selectedFilter(element, index, array) {//过滤所有选种的商品
    return (element.selected);
  }
})