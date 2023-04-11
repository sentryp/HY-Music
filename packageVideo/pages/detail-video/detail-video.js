// pages/detail-video/detail-video.js
import {getMVUrl,getMVInfo,getMVRelated} from "../../../services/video"
Page({
  data:{
    id:0,
    mvUrl:"",
    danmuList:[
      {text: '哈哈哈,唱的真好听',color: '#ff0000',time: 1},
      {text: '集美们，这也太好听了吧',color: '#ff00ff',time: 2},
      {text: '爱死了',color: '#ff00ff',time: 3},
      {text: '家人们，谁懂啊',color: '#ff00ff',time: 4}
    ],
    mvInfo:{},
    relatedVideo:[]
  },
  onLoad(options){
  //  1.获取id
    const id = options.id
    this.setData({id})

  // 2.请求数据
  this.fetchMVUrl()  
  this.fetchMVInfo()
  this.fetchMVRelated()
  },

  async fetchMVUrl(){
  const res = await getMVUrl(this.data.id)
   this.setData({mvUrl:res.data.url})
  },

  async fetchMVInfo(){
    const res =  await getMVInfo(this.data.id)
    this.setData({mvInfo:res.data})
  },

  async fetchMVRelated(){
    const res = await getMVRelated(this.data.id)
    this.setData({relatedVideo:res.data})
  }
})