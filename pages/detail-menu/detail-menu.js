// pages/detail-menu/detail-menu.js
import {getSongMenuTag,getSongMenuList} from "../../services/music"

Page({
  data:{
     songMenus:[]
  },
  onLoad(){
    this.fetchAllMenuList()
  },

  // 发送网络请求
  async fetchAllMenuList(){
    // 1. 获取tags
    const tagRes = await getSongMenuTag()
    const tags = tagRes.tags

    // 2.根据tags去获取对应的歌曲
    const allPromise = []
    for (const tag of tags){
     const promise = getSongMenuList(tag.name)
     allPromise.push(promise)
    }

    // 3.获取到所有的数据之后，调用一次setData
    Promise.all(allPromise).then(res => {
       this.setData({songMenus:res})
    })
  }

})