// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import {getPlaylistDetail} from "../../services/music"
import playerStore from "../../store/playerStore"

Page({
  data:{
    type:"ranking",
    key:"newRanking",
    songInfo:{},
    id:""
  },


  onLoad(options){
    // 1确定获取数据的类型
    // type:ranking -> 榜单数据
    // type:recommend -> 推荐数据
    const type = options.type
    this.setData({type})

    // 获取store中榜单数据
    if(type === "ranking"){
      const key = options.key
      this.data.key = key
      rankingStore.onState(key,this.handleRanking)
    }else if(type === "recommend"){
      recommendStore.onState("recommendSongInfo",this.handleRanking)
    }else if(type === "menu"){
      const id = options.id
      this.data.id = id
      this.fetchMenuSongInfo()
    }
  },

  // 发送网络请求
  async fetchMenuSongInfo(){
    const res = await getPlaylistDetail(this.data.id)
    this.setData({songInfo:res.playlist})
  },

  // 事件监听
  onSongItemTap(event){
    playerStore.setState("playSongList",this.data.songInfo.tracks)
    playerStore.setState("playSongIndex",event.currentTarget.dataset.index)
  },

  // store共享数据
  handleRanking(value){
    if(this.data.type === "recommend"){
      value.name = "推荐歌曲"
      wx.setNavigationBarTitle({
        title: value.name,
      })
    }
    this.setData({songInfo:value})
   
  },



  onUnload(){
    if(this.data.type === "ranking"){
      rankingStore.offState(this.data.key,this.handleRanking)
    }else{this.data.type === "recommend"}{
      recommendStore.offState("recommendSongInfo",this.handleRanking)
    }
  } 

})