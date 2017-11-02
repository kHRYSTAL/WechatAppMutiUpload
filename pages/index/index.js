//index.js
const uploadImg = require("../../lib/uploadImg.js");
var extend = require('../../lib/extend.js');

const app = getApp()
var pageConf = {
  data: {
    imageUrl: ''
  },

  bindViewTap: function (e) {
    var that = this;
    that.chooseImageUpload({
      maxCount: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      remote: 'https://192.168.1.125:8001/upload/image/',
      callback: function (res) {
        console.log("get upload response:", res);
        if (res.success) { // example {'success': true, 'index': 0, imgUrl:'url'}
          console.log("set image url", res.imgUrl);
          that.setData({
            imageUrl: res.imgUrl
          });
        }
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
}

// deep clone, notice the second argument is pageConf
var conf = extend(true, pageConf, uploadImg);
console.log("pageConf===>", pageConf);
Page(conf);

