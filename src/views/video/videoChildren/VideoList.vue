<template>
    <div class="videolist">
        <!-- 歌单navbar -->
        <div class="musiclistnavbar">
            <div class="left">
                歌单列表：
            </div>
            <div class="right">
                <second-nav-bar
                :SecondNavBarData="videoCategory"
                @clickSecondBarItem="clickSecondBarItem"
                >
                </second-nav-bar>
            </div>
        </div>
        <!-- 视频列表 -->
        <video-list-card
            :videoList="videoList"
            :videoType="'video'"
            class="mvlist"
            :isLoad="true"
            @bottomLoad="bottomLoad"
            @clickListCardItem="clickListCardItem"
        ></video-list-card>
        
    </div>
</template>
<script>
import SecondNavBar from '@/components/secondNavBar/SecondNavBar.vue'
import VideoListCard from "@/components/videoListCard/VideoListCard.vue"

export default {
    components: {
        SecondNavBar,
        VideoListCard
    },
    data () {
        return {
            //视频分类
            videoCategory: [],
            videoPage: 1,
            videoList: [],
            //当前标签
            currentTag: {},
            hasMore: true
        }
    },
    methods: {
        //请求视频标签列表
        async getVideoCategory(){
            let res = await this.$http.get('/video/category/list');
            this.videoCategory = res.data.data;
            this.currentTag = res.data.data[0];
        },
        async getSortList(){
            //let res = await this.$http.get('/video/group/list');
        },
        //根据id请求视频分类后列表
        async getVideoList(id){
            let i = 1;
            while(i){
                if(this.hasMore){
                    let res = await this.$http.get('video/group', {
                    params: {
                        id: id,
                        offset: 8 * (this.videoPage - 1)
                    }
                    });
                    //console.log(res);
                    this.hasMore = res.data.hasmore;
                    this.videoList.push(...res.data.datas);
                    this.videoPage += 1;
                    //console.log(this.videoList);
                    i--;
                } else {
                    return;
                }
            }
        },
        //点击分类处理
        clickSecondBarItem(index){
            this.videoPage = 1;
            this.videoList = [];
            this.currentTag = this.videoCategory[index];
            this.getVideoList(this.currentTag.id);
        },
        bottomLoad(){
           if(this.hasMore == true){
                console.log("触底2");
                this.videoPage += 1;
                this.getVideoList(this.currentTag.id);
            } 
        },
        //点击跳转到视频详情页
        clickListCardItem({id}){
            console.log(id);
            this.$router.push({ name: "videoDetail", params: { id, type: "video" } });
            console.log(this.$route.params)
        }
    },
    async created () {
        await this.getVideoCategory();
        await this.getVideoList(this.currentTag.id);
    }
}
</script>
<style scoped>

.mvlist{
    height: calc(100vh - 215px);
}
</style>