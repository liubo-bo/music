<template>
    <div class="searchcontainer">
        <nav-bar
            :navList="navBar"
            @clickBarItem="clickBarItem"
        ></nav-bar>
        <router-view></router-view>
    </div>
</template>
<script>
import NavBar from '@/components/navbar/NavBar'

export default {
    name: 'search',
    components: {
        NavBar
    },
    data () {
        return {
            navBar: [
                { path: `/search/searchsong/${this.$route.params.id}`, name: '单曲' },
                { path: `/search/searchsinger/${this.$route.params.id}`, name: '歌手' },
                { path: `/search/searchvideo/${this.$route.params.id}`, name: '视频' },
                { path: `/search/searchalbum/${this.$route.params.id}`, name: '专辑' },
                { path: `/search/searchmusiclist/${this.$route.params.id}`, name: '歌单' },
            ]
        }
    },
    methods: {
        clickBarItem(path){
            if(path != this.$route.path){
                this.$router.push(path);
            }
        }
    }
}
</script>