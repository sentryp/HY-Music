// pages/music-player/music-player.js
import playerStore,{audioContext} from "../../../store/playerStore"
import throttle from "../../../utils/throttle"

const app = getApp()

const modeNames = ["order","repeat","random"]

Page({
  data: {
   id:0,

   currentSong:{},
   currentTime:0,
   durationTime:0,
   lyricInfo:[],
   currentLyricText:"",
   currentLyricIndex:-1,
   isPlaying:true,

   sliderValue:0,
   isSliderChanging:false,
   isWaiting:false,

   lyricScrollTop:0,
   contentHeight:0,
   currentPage:0,
   statusHeight:20,

   playSongIndex:0,
   playSongList:[],
   isFirstPlay:true,

   playModeName:"order",

   stateKeys:["id","currentSong","durationTime","currentTime","lyricInfo"
   ,"currentLyricText","currentLyricIndex","isPlaying","playModeIndex"]
  },

  onLoad(options) {
    this.setData({contentHeight:app.globalData.contentHeight})
    // 1. 获取传入的ID
    const id = options.id  

    // 2.根据id播放歌曲
    // this.setupPlaySong(id)
    if(id){
      playerStore.dispatch("playMusicWithSongIdAction",id)
    }

    // 3.获取store共享数据
    playerStore.onStates(["playSongList","playSongIndex"],this.getPlaySongInfosHandler)
    playerStore.onStates(this.data.stateKeys,this.getPlayInfosHandler)
  },

  updateProgress:throttle(function(currentTime){
    // 1.更新歌曲的进度
    if(!this.data.isSliderChanging && !this.data.isWaiting){
    // 2.修改sliderValue
      const sliderValue = currentTime / this.data.durationTime * 100
      this.setData({sliderValue,currentTime})
    }
  },800,{leading:false,trailing:false}),


  // 事件监听
  onNavBackTap(){
    wx.navigateBack()
  },

  onSwiperChange(event){
    this.setData({currentPage:event.detail.current})
  },

  onNavTabItemTap(event){
    const index = event.currentTarget.dataset.index
    this.setData({currentPage:index})
  },

  onSliderChange(event){
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 1500);

    // 1.获取点击滑块位置对应的值
    const value = event.detail.value

    // 2. 获取要播放的位置时间
    const currentTime = value / 100 * this.data.durationTime
    
    // 3.设置播放器，播放计算出的时间
    audioContext.seek(currentTime / 1000)
    // 兼容手机
    audioContext.play()

    this.setData({currentTime,sliderValue:value,isSliderChanging:false,isPlaying:true})
  },

  onSliderChanging:throttle(function(event){
    const value = event.detail.value
    const currentTime = value / 100 * this.data.durationTime
    this.setData({currentTime})
    this.data.isSliderChanging = true
  },200),

  onPlayOrPauseTap(){
    playerStore.dispatch("playMusicStatusAction")
  },

  onPrevBtnTab(){
    playerStore.dispatch("playNewMusicAction",false)
  },

  onNextBtnTab(){
    playerStore.dispatch("playNewMusicAction")
  },

  onModBtnTap(){
    playerStore.dispatch("changePlayModeAction")
  },

  // store共享数据
  getPlaySongInfosHandler({playSongList,playSongIndex}){
     if(playSongList){
       this.setData({playSongList})
     }
     if(playSongIndex!==undefined){
       this.setData({playSongIndex})
     }
  },
  getPlayInfosHandler({
    id,currentSong,currentTime,durationTime,
    lyricInfo,currentLyricText,currentLyricIndex,
    isPlaying,playModeIndex,
  }){
    if(id!==undefined){
      this.setData({id})
    }
    if(currentSong){
      this.setData({currentSong})
    }
    if(currentTime!==undefined){
      // this.setData({currentTime})
      this.updateProgress(currentTime)
    }
    if(durationTime!==undefined){
      this.setData({durationTime})
    }
    if(lyricInfo){
      this.setData({lyricInfo})
    }
    if(currentLyricText){
      this.setData({currentLyricText})
    }
    if(currentLyricIndex!==undefined){
      this.setData({currentLyricIndex,lyricScrollTop:currentLyricIndex * 35})
    }
    if(isPlaying!==undefined){
      this.setData({isPlaying})
    }
    if(playModeIndex!==undefined){
      this.setData({playModeName:modeNames[playModeIndex]})
    }
  },


  onUnload(){
    playerStore.offStates(["playSongList","playSongIndex"],this.getPlaySongInfosHandler),
    playerStore.offStates(this.data.stateKeys,this.getPlayInfosHandler)
  }
})