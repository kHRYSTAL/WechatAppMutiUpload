module.exports = {

  data: {
    imagePics: []
  },

  chooseImageUpload: function(param) {
    var that = this;
    wx.chooseImage({
      count: param.maxCount ? param.maxCount : 1, 
      sizeType: param.sizeType ? param.sizeType : ['compressed'],
      sourceType: param.sourceType ? param.sourceType : ['album', 'camera'],
      success: function (res) {
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          that.setData({
            imagePics: res.tempFilePaths
          });         
          that.uploadFile({
            url: param.remote,
            path: res.tempFilePaths,
            f: param.callback,
            c: param.complete
          });
        }
      }
    });
  },

  uploadFile: function (data) {
    var that = this;
    var i = data.i ? data.i : 0;
    var success = data.success ? data.success : 0;
    var fail = data.fail ? data.fail : 0;
    var func = data.f;
    console.log("===> start uploading image");
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: new Date().getMilliseconds().toString(),
      formData: null,
      success: (res) => {
        console.log(res);
        if (res.statusCode == '200') {
          var data = JSON.parse(res.data);
          // data example {'result': 'true', 'data': "url", 'msg':'xxx'}
          success++;
          console.log("the" + i + "upload success");
          if(data.result) {
            that.data.imagePics.splice(i, 1, data.data);
            func({ index: i, success: true, imgUrl: data.data });
          } else {
            console.log(data.msg);
            func({ index: i, success: false});
          }
        } else {
          fail++;
          console.log("the" + i + "upload status code is not 200", res);
          that.data.imagePics.splice(i, 1);
          func({ index: i, success: false});
        }
      },
      fail: (err) => {
        fail++;
        console.log("the" + i + "upload failed", err);
        console.log(err);
        that.data.imagePics.splice(i, 1);
        func({ index: i, success: false });
      },
      complete: () => {
        i++;
        if (i == data.path.length) {   // stop    
          console.log('upload complete');
          if (data.complete) {
            data.complete(that.data.imagePics);
          }
        } else { // contuine
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadFile(data);
        }
      }
    });
  }
}