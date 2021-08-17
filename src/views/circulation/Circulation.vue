<template>
    <div class="circulation">
        <nav-bar
            :navList="navBarData"
            @clickBarItem="clickBarItem"
        ></nav-bar>
        <router-view></router-view>
    </div>
</template>
<script>
import NavBar from '@/components/navbar/NavBar'

export default {
    components: {
        NavBar
    },
    data () {
        return {
            navBarData: [
                { path: '/circulation/circulationsinger', name: '歌手' },
                { path: '/circulation/circulationvideo', name: '视频' },
            ]
        }
    },
    methods: {
        clickBarItem(path){
            this.$router.push(path);
        }
    }
}
</script>
<style scoped>

</style>