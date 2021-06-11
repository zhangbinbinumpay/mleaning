let app = getApp();
//获取云数据库引用

const db = wx.cloud.database({
  env:'mydb-be2uy'    //这里是自己的环境ID
});    

let name = null;
let password = null;

Page({
  data: {
    bigImg: 'user-unlogin.png',//默认图片，设置为空也可以
    list:[{}],
    imagerry: [{}],
  },
  onLoad: function () {
    var _this = this;
    const db = wx.cloud.database({
      env: 'mydb-be2uy'    //这里是自己的环境ID
    });
    const table = db.collection('database');

    table.get({
      success: res => {
        console.log(res.data)
        this.setData({
          list: res.data
        })
      }
    })
    const imgtable = db.collection('database_img');

    imgtable.get({
      success: res => {
        console.log(res.data)
        this.setData({
          imagerry: res.data
        })
      }
    })
},

  //输入用户名
  inputName: function (event) {
    name = event.detail.detail.value
  },
  //输入密码
  inputPassword(event) {
    password = event.detail.detail.value
  },
  //注册
  register() {
    db.collection('database').add({
      data: {
        id: "打扫房间ddd快速搭建",
        description: "dddd",
        done: true,
        due: "2020-07-06 10:22:56",
        style: {
          colorL: 'red'
        },
        tages: ['ni', 'wo', 'ts']

      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },

  register2() {
    db.collection('database').where({
        _id: "my_book"
    }).get({
      success: res => {
        console.log(res.data)
        this.setData({
          list: res.data
        })
        
      }
    })
  },
  register3(){

    let cloudID='f11f525b5f029d870050699b6f62b1e7';

    db.collection('database').doc('"book2"').update({
      // data 传入需要局部更新的数据
      data: {
        
        description:"我是修ffff改的数控"
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })
  },

  changeBigImg() {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              bigImg: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到users集合表
          
            db.collection("database_img").add({
              data: {
                bigImg: fileID
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3000
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },

  // .where({
  //      _openid: app.globalData.openid  // 填入当前用户 openid
  //   })

  // wx.showModal({
  //   title: '提示',
  //   content: '您已注册，确定要更新账号密码吗？',
  //   success: function (res) {
  //     if (res.confirm) {
  //       console.log('用户点击确定')
  //       that.saveuserinfo();
  //     }
  //   }
  // })



  //注册用户信息
  saveuserinfo() {
    // let that = this;
    admin.add({  //添加数据
      data: {
        name: name,
        password: password
      }
    }).then(res => {
      console.log('注册成功！')
      wx.showToast({
        title: '注册成功！',
        icon: 'success',
        duration: 3000
      })
      wx.redirectTo({
        url: '/pages/login/login',
      })
    })
  },
})
