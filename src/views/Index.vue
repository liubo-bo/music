<template>
  <div class="main">
    <div class="background">
        <div 
          :class="[
            $store.state.stylenum == 0 ? '':'',
            $store.state.stylenum == 1 ? 'red':'',
            $store.state.stylenum == 2 ? 'green':'',
            $store.state.stylenum == 3 ? 'yellow':'',
          ]"
          
        ></div>
    </div>
    <el-container>
      <el-header>
          <main-header></main-header>
      </el-header>
    
      <el-container>
        <el-aside width="160px">
          <el-menu
          router
          active-text-color="black"
          :default-active="defaultActive"
         >
            <el-menu-item index="/discover">
              <i class="iconfont el-icon-sunny"></i>
              <span slot="title">发现音乐</span>
            </el-menu-item>
            <el-menu-item index="/video">
              <i class="iconfont el-icon-video-camera"></i>
              <span slot="title">视频</span>
            </el-menu-item>
            <el-menu-item index="/favorites">
              <i class="iconfont el-icon-more-outline "></i>
              <span slot="title">收藏</span>
            </el-menu-item>
            <el-menu-item index="/singglerecommend">
              <i class="iconfont el-icon-sugar"></i>
              <span slot="title">每日推荐</span>
            </el-menu-item>
            <el-menu-item-group>
              <template slot="title" class="groupTitle">
                创建的歌单
              </template>
              <el-menu-item
                v-for="(item, index) in createMUsicList"
                :key="index"
                :index="'/musiclistdetail/' + item.id"
              >
              <i class="iconfont icon-gedan">{{item.name}}</i>  
              </el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
              <template slot="title" class="groupTitle">
                收藏的歌单
              </template>
              <el-menu-item
                v-for="(item, index) in collectedMUsicList"
                :key="index"
                :index="'/musiclistdetail/' + item.id"
              >
              <i class="iconfont icon-gedan">{{item.name}}</i> 
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
          <!-- <main-aside
            @nav-click="toPath"
          ></main-aside> -->
        </el-aside>

        <el-main>
          <router-view class="routerview"></router-view>
        </el-main>
      </el-container>
      <music-detail-card></music-detail-card>
      <bottom-control></bottom-control>
    </el-container>
  </div>
  
</template>

<script>
// @ is an alias to /src

import MainHeader from '@/components/headerBar/MainHeader.vue'
import BottomControl from '@/components/bottomControl/BottomControl.vue'
import MusicDetailCard from '@/views/musicDetailCard/MusicDetailCard.vue'

export default {
  name: 'Main',
  components: {
    BottomControl,
    MainHeader,
    MusicDetailCard,
  },
  data () {
    return {
      //用户创建的歌单
      createMUsicList: [],
      //用户收藏的歌单
      collectedMUsicList: [],
      //路由首地址
      defaultActive: "",
    }
  },
  methods: {
    //请求用户歌单
    async getUserMusicList(){
      if(!this.$store.state.isLogin){
        this.$message.error('请先登录！');
        return;
      }
      let timestamp = Date.parse(new Date());
      this.userInfo = 
        window.localStorage.getItem("userInfo") &&
        JSON.parse(window.localStorage.getItem("userInfo"));
      let res = await this.$http.get('/user/playlist', {
        params: {
          uid: this.userInfo.userId,
          timestamp,
        }
      });
      //console.log(res);
      res = res.data.playlist;
      let index = res.findIndex((item) => item.subscribed == true);
      //console.log(index)
      //console.log(1)
      this.createMUsicList = res.slice(0, index);
      this.collectedMUsicList = res.slice(index);
      this.createMUsicList[0].name = "我喜欢的音乐";
      //console.log(this.createMUsicList);
      //console.log(this.collectedMUsicList);
      this.$store.commit("updateCreatedMusicList", this.createMUsicList);
      this.$store.commit("updateCollectedMusicList", this.collectedMUsicList);
    }
    
  },
  created () {
    //取出路由首地址，用于侧边栏导航
    this.defaultActive = "/" + this.$route.path.split("/")[1];
    //顶部读取登录转台需要一定时间
    setTimeout(()=>{
      this.getUserMusicList();
    },500);
  },
  watch: {
    //监听收藏歌单变化
    "$store.state.collectMusicList"(current){
      this.collectMusicList = current;
    },
    "$route.path"(){
      this.defaultActive = "/" + this.$route.path.split("/")[1];
    },
    '$route'(){
        this.getUserMusicList();
    }
  }
}
</script>
<style scoped>
/* .isActive{
  background-color: #f6f6f7;
  font-style: 14px;
  font-weight: 600;
} */
.el-header{
  padding: 0;
  margin: 0;
  z-index: 100;
  background-color: #ec4141;
  height: 50px !important;
}
.el-aside{
  margin-top: 0;
  height: calc(100vh - 105px);
  border-right: 1px solid #ccc;
  text-align: center;
}
.el-menu{
  border: none;
}
.iconfont{
  font-size: 14px;
  margin: 5px !important;
}
.el-menu-item{
  font-size: 8px;
  padding-right: 0 0 0 10px !important;
  margin: 5px 0 !important;
  height: 30px;
  line-height: 30px;
  text-align: left;
}
.el-menu-item:hover{
  background-color: #f5f5f6 !important;
}
.el-menu-item-group{
  margin-top: 10px;
  text-align: left;
}
.el-main{
  padding: 0;
}
.routerview{
  height: calc(100vh - 105px);
}
.red{
  width: 1000px;
  height: 800px;
  background-color: red;
}
.yellow{
  width: 1000px;
  height: 800px;
  background-color: yellow;
}
.green{
  width: 1000px;
  height: 800px;
  background-color: green;
}
.background{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  filter: blur(90px) brightness(60%);
}
</style>
