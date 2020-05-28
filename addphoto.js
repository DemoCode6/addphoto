// pages/addphoto/addphoto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readyuan:false,
    // demo
    id:'',                               //上传时后端返回的图片ID,拼接后存入
    joinString:'',                    
    uploaderList: [],              //保存上传图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    showUpload: true, 
    // demo
  },
  // 选择相册中的图片或者拍照
  choose_img(){
    // 系统API选择相册中的图片或者拍照
    wx.chooseImage({
      success: (res)=> {
        // console.log(res)
        // 1.取出图片路径
        const path = res.tempFilePaths[0]
        // 2.取出的路径放到imgpath中在wxml中展示
        this.setData({
          imgpath:path
        })
      },
    })
  },

  // 上传视频
  addvideo(){
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 15,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
      }
    })
  },
  readclick(){
    this.setData({
      readyuan : !this.data.readyuan
    })
  },



  // demo

  //上传图片
  upload: function (e) {
    var that = this;
//选择图片
    wx.chooseImage({
      count: 6 - that.data.uploaderNum, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.uploaderList.concat(res.tempFilePaths);
        var uploaderList = res.tempFilePaths;
        that.setData({
          uploaderList: that.data.uploaderList.concat(res.tempFilePaths),
        })
        that.setData({
          uploaderNum: that.data.uploaderList.length
        })

        if (uploaderList.length == 6) {
          that.setData({
            showUpload:false
          })
          console.log(that.showUpload)
        }
        for (var i = 0; i < uploaderList.length; i++) {
          wx.uploadFile({
            url: 'xxxxx',
            filePath: uploaderList[i],
            name: 'files',
            formData: {
              files: uploaderList,
            },
            success: function (res) {
               var id = JSON.parse(res.data).data.attIdthat.setData({
                id: that.data.id + `${id},`,
                joinString: (that.data.id + `${id},`).slice(0, -1)
              })
            }
          })        }
      }
    })
  },

  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
 // 删除图片
  clearImg: function (e) {
    var that = this
    var nowList = [];//新数据
    var uploaderList = that.data.uploaderList;//原数据
    
    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        var arr = that.data.joinString.split(',')
            arr.splice(i, 1);                              //删除图片的同时删除掉其对应的ID
            var newArr = arr.join(',')
            that.setData({
              joinString:newArr,
              id:newArr+','
            })
           } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true,
    })
   },
})