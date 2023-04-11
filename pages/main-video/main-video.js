// pages/main-video/main-video.js
import { getTopMV } from "../../services/video"

Page({
  data: {
   videoList:[],
   offset:0,
   hsaMore:true
  },
  
  onLoad() {
   this.fetchTop()
  },

  // 发送网络请求的方法
 async fetchTop(){
    const res = await getTopMV(this.data.offset)
    const newvideoList = [...this.data.videoList,...res.data]
    this.setData({
      videoList:newvideoList
    })
    this.data.offset = this.data.videoList.length
    if(this.data.offset>40){
      this.data.hsaMore = false
    }
  },

  // 监听上拉和下拉功能
  async onPullDownRefresh(){
     this.data.offset = 0
     this.setData({videoList:[]})
     this.data.hsaMore = true
     await this.fetchTop()
     wx.stopPullDownRefresh()
  },

  onReachBottom() {
    if(!this.data.hsaMore) return
    this.fetchTop()
  },

  // 界面事件监听的方法
  onVideoItemTap(event){
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/packageVideo/pages/detail-video/detail-video?id=${item.id}`,
    })
  }
})