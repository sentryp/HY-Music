import {HYEventStore} from "hy-event-store"
import {getPlaylistDetail} from "../services/music"

const recommendStore = new HYEventStore({
  state:{
    recommendSongInfo:{}
  },
  actions:{
    async fetchRecommendSongsAction(ctx){
      const res = await getPlaylistDetail(3778678)
      ctx.recommendSongInfo = res.playlist
    }
  }
})    

export default recommendStore