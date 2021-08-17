import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })


const state = {
  //音乐的url
  musicId: '',
  //音乐播放状态
  isPlay: false,
  //当前播放歌单
  musicList: [],
  //当前播放歌单的id
  musicListId: '',
  //是否登录
  isLogin: false,
  //当前播放音乐的索引
  currentIndex: -1,
  //实时播放时长
  currentTime: 0,
  //用户创建的歌单
  createdMusicList: [],
  //用户收藏的歌单
  collectedMusicList: [],
  //播放器音乐详情
  isMusicDetailCardShow: false,
  //皮肤num
  stylenum: 0,
  //收藏歌曲状态
  songCollect: false,
  //用户收藏的歌曲列表
  likeMusicList: [],
  //下载歌曲信息
  downloadMusicInfo: {
    name: '',
    url: '',
  },
  //收藏歌手列表
  circulationSingerList: [],
}

const store = new Vuex.Store({
  state,
  mutations: {
    updateMusicId(state, musicId) {
      state.musicId = musicId;
      console.log("vuex的musicId" + musicId);
    },
    changePlayState(state, isPlay){
      state.isPlay = isPlay;
      console.log('vuex播放状态'+isPlay);
    },
    updateMusicList(state, payload){
      //歌单id变化是，重置播放索引
      if(payload.musicListId != state.musicListId){
        state.musicListId = payload.musicListId;
        state.currentIndex = -1;
      }
      console.log("vuex歌单列表索引"+state.currentIndex);
      //把MusicListDetail中得到的歌单重新赋值给vuex中的MusicList 深拷贝赋值 payload为它传过来的对象
      let musicList = payload.musicList.slice(0);
      state.musicList = musicList;
      console.log('updateMusicList');
    },
    //当前播放索引
    updateCurrentIndex(state, index){
      state.currentIndex = index;
      console.log("vuex当前音乐索引"+state.currentIndex);
    },
    //当前播放时间
    updateCurrentTime(state, currentTime){
      state.currentTime = currentTime;
    },
    //登录状态
    updateLoginState(state){
      state.isLogin = !state.isLogin;
    },
    //更新用户创建的歌单
    updateCreatedMusicList(state, createdMusicList){
      state.createdMusicList = createdMusicList;
    },
     //更新用户收藏的歌单
    updateCollectedMusicList(state, collectedMusicList){
      state.collectedMusicList = collectedMusicList;
    },
    //播放器详情切换
    changeMusicDetailCardState(state){
      state.isMusicDetailCardShow = !state.isMusicDetailCardShow;
      console.log(state.isMusicDetailCardShow);
    },
    //切换style num
    changeStylenum(state){
      state.stylenum += 1;
      if(state.stylenum == 4){
        state.stylenum = 0;
      }
    },
    //收藏歌曲状态
    // changeSongCollect(state){
    //   state.songCollect = ! state.songCollect;
    // },
    // 更新收藏歌曲列表
    changeLikeMusicList(state, list){
      state.likeMusicList = list;
    },
    updateDownloadMusicInfo(state, info){
      state.downloadMusicInfo = info;
    },
    //更新收藏歌手列表
    updateCirculationSingerList(state, list){
      state.circulationSingerList = list; 
    }
  }
})

export default store