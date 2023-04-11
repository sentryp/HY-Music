// pages/detail-search/detail-search.js
import {getSearchHot,getSearchSuggest,getSearchResult} from "../../services/search"
import debounce from "../../utils/debounce"
import stringToNodes from "../../utils/string2nodes"

const debounceGetSearchSuggest = debounce(getSearchSuggest,100)

Page({
  data: {
    hotKeywords:[],
    searchValue:"",
    suggestSongs:[],
    resultSongs:[],
    suggestSongsNode:[]
  },
onLoad(){
  // 发送网络请求
  this.fetchSearchHot()
},

 // 网络请求的方法封装
 fetchSearchHot(){
   getSearchHot().then((res)=>{
     this.setData({hotKeywords:res.result.hots})
   })
 },

 fetchSearchResult(){
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res=>{
      this.setData({resultSongs:res.result.songs})
    })
 },


//  事件绑定
 handleSearchChange(event){
   // 1.获取输入的关键字
   const searchValue = event.detail

   // 2.保存关键字
   this.setData({ searchValue })

   //3.判断关键字为空字符的处理逻辑
   if(!searchValue.length){
    this.setData({suggestSongs:[],resultSongs:[]})
    return
  }  

    // 4.根据关键字进行搜索
   if(!this.data.resultSongs.length){
     debounceGetSearchSuggest(searchValue).then((res)=>{
       if(!res.result) return
       const suggestSongs = res.result.allMatch
       this.setData({suggestSongs})

       // 转成nodes节点
       const suggestKeyWord = suggestSongs.map( item => item.keyword )
       const suggestSongsNode = suggestKeyWord.map(item => stringToNodes(item,searchValue))
       this.setData({suggestSongsNode})
     })
   }
 },

 handleSearchAction(event){
   this.setData({searchValue:event.detail})
   this.fetchSearchResult()
 },

 handleKeywordItemClick(event){
  //  1.获取关键字
   const keyword = event.currentTarget.dataset.keyword
  //  2.将关键字设置到searchValue中
   this.setData({searchValue:keyword})
  //  3.发送网络请求
   this.fetchSearchResult()
 }

})