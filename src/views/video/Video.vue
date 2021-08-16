<template>
    <div class="videocontainer">
        <nav-bar
            :navList="navList"
            @clickBarItem="clickBarItem"
        ></nav-bar>
        <router-view></router-view>
    </div>
</template>
<script>
import NavBar from "@/components/navbar/NavBar.vue"
export default {
    name: "VideoList",
    components: {
        NavBar
    },
    data () {
        return {
            navList: [
                { path: '/video/videolist', name: '视频' },
                { path: '/video/mvlist', name: 'MV' }
            ]
        }
    },
    methods: {
        clickBarItem(path){
            this.$router.push(path);
        }
    },
    created () {
        if(!this.$store.state.isLogin){
            this.$message.error('视频页面只有登录后才能访问哈');
            this.$router.replace('/index');
        }
    }
}
</script>