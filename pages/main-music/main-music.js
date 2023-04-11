// pages/main-music/index.js
import {getMusicBanner,getSongMenuList} from "../../services/music"
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"  
import playerStore from "../../store/playerStore"        
import {querySelect} from "../../utils/query-select"
import throttle from "../../utils/throttle"

const quetySelectThrottle = throttle(querySelect,100)


Page({
  data:{
    value:'',
    banners:[],
    bannerHeight:111,
    recommendSongs:[],

    // 歌单数据
    hotMenuList:[],
    recMenuList:[],

    // 巅峰榜数据
    rankingInfos:{},
    isRankData:false,

    // 当前正在播放的歌曲
    currentSong:{},
    isPlaying:false
  },

  onLoad(){
    this.fetchMusicBanner()
    this.fetchSongMenuList()

    // 发起action
    recommendStore.onState("recommendSongInfo",this.handleRecommendSongs)
    recommendStore.dispatch("fetchRecommendSongsAction")

    rankingStore.onState("newRanking",this.handleNewRanking)
    rankingStore.onState("originRanking",this.handleOriginRanking)
    rankingStore.onState("upRanking",this.handleUpRanking)
    rankingStore.dispatch("fetchRankingDataAction")

    playerStore.onStates(["currentSong","isPlaying"],this.handlerPlayInfos)
  },

  // 网络请求的方法封装
  async fetchMusicBanner(){
    const res = await getMusicBanner()
    this.setData({
      banners:res.banners
    })
  },

  fetchSongMenuList(){
    getSongMenuList().then(res=>{
      this.setData({hotMenuList:res.playlists})
    })
    
    getSongMenuList("华语").then(res=>{
      this.setData({recMenuList:res.playlists})
    })
  },

  // 界面的事件监听方法
  onSearchClick(){
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },

 async onBannerImageLoad(){
    // 获取image组件的高度
    const res = await quetySelectThrottle(".banner-image")
    this.setData({bannerHeight : res[0].height})
  },

  onRecommendMoreClick(){
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },

  onSongItemTap(event){
    playerStore.setState("playSongList",this.data.recommendSongs)
    playerStore.setState("playSongIndex",event.currentTarget.dataset.index)
  },

  onPlayOrPauseBtnTap(){
    playerStore.dispatch("playMusicStatusAction")
  },

  onPlayBarAlbumTap(){
    wx.navigateTo({
      url: '/packagePlayer/pages/music-player/music-player',
    })
  },

  // 从Store中获取数据
  handleRecommendSongs(value){
    if(!value.tracks) return  
    this.setData({recommendSongs:value.tracks.slice(0,6)})
  },
  handleNewRanking(value){
    if(!value.name) return
    const newRankingInfos = { ...this.data.rankingInfos, newRanking:value }
    this.setData({rankingInfos:newRankingInfos})
  },
  handleOriginRanking(value){
    if(!value.name) return
    const newRankingInfos = { ...this.data.rankingInfos, originRanking:value }
    this.setData({rankingInfos:newRankingInfos})
  },
  handleUpRanking(value){
    if(!value.name) return
    const newRankingInfos = { ...this.data.rankingInfos, upRanking:value }
    this.setData({rankingInfos:newRankingInfos})
  },
  handlerPlayInfos({currentSong,isPlaying}){
    if(currentSong){
      this.setData({currentSong})
    }
    if(isPlaying!==undefined){
      this.setData({isPlaying})
    }
  },

  onUnload(){
    recommendStore.offState("recommendSongs",this.handleRecommendSongs)
    rankingStore.offState("newRanking",this.handleNewRanking)
    rankingStore.offState("originRanking",this.handleOriginRanking)
    rankingStore.offState("upRanking",this.handleUpRanking)
  }
})