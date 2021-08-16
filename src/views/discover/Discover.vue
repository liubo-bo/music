<template>
<div class="discovercontainer">
    <nav-bar @clickBarItem="clickBarItem" :nav-list="navList"></nav-bar>
    <router-view class="discover"></router-view>
</div>
</template>

<script>
import NavBar from '@/components/navbar/NavBar.vue'

export default {
    components: {
        NavBar
    },
    data() {
        return {
            navList: [
                { path: '/discover/recommend', name: '个性推荐' },
                { path: '/discover/musiclist', name: '歌单' },
                { path: '/discover/singer', name: '歌手' },
                { path: '/discover/rank', name: '排行榜' },
               
            ]
        }
    },
    methods: {
        //接收navbar传来的单机事件
       clickBarItem(path){
           this.$router.push(path);
       }
    //初始化路径时，定位到recommend
    // navactive(path){
    //   if(path === this.$router.path){
    //     return true;
    //   }
    //   if(path === '/recommend' && this.$router.path === '/'){
    //     return true;
    //   }
    //   return false;
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.discovercontainer{
    overflow: hidden;
    padding: 0 !important;
}
.discover{
    margin: auto;
    padding: 0 15px;
    overflow-y: scroll;
    height: calc(100vh - 162px);
}
</style>
