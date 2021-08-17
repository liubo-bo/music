// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Main from '@/views/Main.vue'

// Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     component: Main
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   }
// ]

// const router = new VueRouter({
//   routes
// })

// export default router
import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '@/views/Index.vue'
import Discover from '@/views/discover/Discover.vue'
import Rank from '@/views/discover/discoverChildren/Rank.vue'
import Recommend from '@/views/discover/discoverChildren/Recommend.vue'
import Singer from '@/views/discover/discoverChildren/Singer.vue'
import MusicList from '@/views/discover/discoverChildren/MusicList.vue'
import MusicListIndex from '@/views/discover/discoverChildren/musicListChildren/MusicListIndex.vue'
import MusicListHighquality from '@/views/discover/discoverChildren/musicListChildren/MusicListHighquality.vue'
import MusicListDetail from '@/views/musicListDetail/MusicListDetail.vue'
import SingerDetail from '@/views/singerDetail/SingerDetail.vue'
import Video from '@/views/video/Video.vue'
import VideoList from '@/views/video/videoChildren/VideoList.vue'
import MvList from '@/views/video/videoChildren/MvList.vue'
import VideoDetail from "@/views/videoDetail/VideoDetail.vue"
import SinggleRecommend from "@/views/singgleRecommend/SinggleRecommend.vue"
import Search from "@/views/search/Search.vue"
import SearchAlbum from "@/views/search/searchChildren/SearchAlbum.vue"
import SearchMusicList from "@/views/search/searchChildren/SearchMusicList.vue"
import SearchSinger from "@/views/search/searchChildren/SearchSinger.vue"
import SearchSong from "@/views/search/searchChildren/SearchSong.vue"
import SearchVideo from "@/views/search/searchChildren/SearchVideo.vue"
import Circulation from "@/views/circulation/Circulation.vue"
import CirculationSinger from "@/views/circulation/circulationChildren/CirculationSinger.vue"
import CirculationVideo from "@/views/circulation/circulationChildren/CirculationVideo.vue"


//重复点击路由，避免到当前位置的冗余导航。 简单来说就是重复触发了同一个路由
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    component: Index,
    redirect: '/discover',
    children: [
      {
        path: '/discover',
        component: Discover,
        redirect: '/discover/recommend',
        children: [
          { path: '/discover/recommend', component: Recommend },
          { 
            path: '/discover/musiclist', 
            component: MusicList,
            redirect: '/discover/musiclist/musiclistindex',
            children: [
              { path: '/discover/musiclist/musiclistindex', component: MusicListIndex }, 
              { path: '/discover/musiclist/musiclisthighquality', component: MusicListHighquality }, 
            ] 
          },
          { path: '/discover/rank', component: Rank },
          { path: '/discover/singer', component: Singer },
        ]
      },
      { path: '/musiclistdetail/:id', name: 'musicListDetail', component: MusicListDetail },
      { path: '/singerDetail/:id', name: 'singerDetail', component: SingerDetail },
      { 
        path: '/video', component: Video,
        redirect: '/video/videolist',
        children: [
          { path: '/video/videolist', component: VideoList },
          { path: '/video/mvlist', component: MvList },
        ]
      },
      { path: '/videoDetail/:id/:type', name: 'videoDetail', component: VideoDetail },
      { path: '/singglerecommend', name: 'singgleRecommend', component: SinggleRecommend },
      { 
        path: '/search',
        name: 'search',
        component: Search,
        redirect: '/search/searchsong/:id',
        children: [
          { path: '/search/searchsong/:id', component: SearchSong },
          { path: '/search/searchalbum/:id', component: SearchAlbum },
          { path: '/search/searchmusiclist/:id', component: SearchMusicList },
          { path: '/search/searchsinger/:id', component: SearchSinger },
          { path: '/search/searchvideo/:id', component: SearchVideo },
        ]
      },
      {
        path: '/circulation',
        name: 'circulation',
        component: Circulation,
        redirect: '/circulation/circulationsinger',
        children: [
          { path: '/circulation/circulationsinger', component: CirculationSinger },
          { path: '/circulation/circulationvideo', component: CirculationVideo },
        ]
      },
      
    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
