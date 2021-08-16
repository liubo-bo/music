<template>
    <div class="musiclistindex">
        <!-- 精品歌单入口 -->
        <div class="highqualityentry">
            <img :src="theFirsOfHighqualiity.coverImgUrl" alt="233"
            class="backgroundImg">
            <div class="cover">
                <img :src="theFirsOfHighqualiity.coverImgUrl" alt="">
            </div>
            <div class="entryinfo">
                <div class="tag"><i class="inconfont el-icon-headset"></i>精品歌单</div>
                <div class="name">{{theFirsOfHighqualiity.name}}</div>
                <div class="desc">{{theFirsOfHighqualiity.copywriter}}</div>
            </div>
        </div>
        <!-- 歌单列表 -->
        <div class="musiclistnavbar">
            <div class="left">
                歌单列表：
            </div>
            <div class="right">
                <second-nav-bar
                :SecondNavBarData="hotTags"
                @clickSecondBarItem="clickSecondBarItem"
                >
                </second-nav-bar>
            </div>
        </div>
        <!-- 展示歌单列表 -->
        <div class="listcardshow">
            <list-card
            :listCardData="musicList.playlists"
            @clickListCardItem="clickListCardItem"
            >
            </list-card>
        </div>
        <!-- 分页 -->
        <div class="page">
            <el-pagination
                background
                small
                layout="prev, pager, next"
                :total="musicList.total"
                :page-size="50"
                :current-page="currentPage"
                @current-change="musicListPageChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import SecondNavBar from '@/components/secondNavBar/SecondNavBar.vue'
import ListCard from '@/components/main/recommend/ListCard.vue'

export default {
    components: {
        SecondNavBar,
        ListCard
    },
    data () {
        return {
            theFirsOfHighqualiity: {},
            musicList: {},
            hotTags: [],
            currentTag: {},
            currentPage: 1,
            sortList: []
        }
    },
    methods: {
        async getTheFirsOfHighqualiity(){
            let res = await this.$http.get('/top/playlist/highquality');
            let firts = res.data.playlists;
            this.theFirsOfHighqualiity = firts[0];
            //console.log(firts[0]);
        },
        async getHotTag(){
            let res = await this.$http.get('/playlist/hot');
            this.currentTag = res.data.tags[0]; 
            //console.log(res.data.tags);
            this.hotTags = res.data.tags;
        },
        //根据歌名请求歌单列表
        async getMusicList(){
            //this.musicList = {};
            let res = await this.$http.get('/top/playlist',{
                params:{
                    cat: this.currentTag.name,
                    offset: 50 * (this.currentPage - 1)
                }
            });
            //console.log(res);
            //total用于分页
            this.musicList = res.data;
        },
        //获取歌单分类数据
        async getSortList(){
            console.log(1);
        },
        clickSecondBarItem(index){
            this.currentTag = this.hotTags[index];
            this.currentPage = 1;
            this.getMusicList();
        },
        clickListCardItem(id){
            console.log(id);
            this.$router.push({ name: "musicListDetail", params: { id } });
        },
        musicListPageChange(page){
            this.currentPage = page
            this.getMusicList();
        }
        
    },
    created () {
        this.getTheFirsOfHighqualiity();
        this.getHotTag();
        this.getMusicList()
    }
}
</script>
<style scoped>
.highqualityentry{
    width: 100%;
    height: 140px;
    display: flex;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
}

.backgroundImg{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    transform: translateY(-80px);
    filter: blur(30px) brightness(70%);
}
.cover{
    width: 120px;
    height: 120px;
    margin: 10px;
}
.highqualityentry img{
    width: 100%;
    border-radius: 10px;
}
.entryinfo{
    height: 100%;
}
.tag{
    width: 88px;
    font-size: 12px;
    padding: 5px 10px;
    border: 1px solid #d59e54;
    margin: 20px 10px 15px 10px;
    border-radius: 10px;
    color: #d59e54;
}
.name{
    color: #fff;
    margin: 10px 0;
}
.desc{
    color: #ccc;
    font-size: 12px;
    margin-left: 10px;
}
.musiclistnavbar{
    width: 100%;
    height: 53px;
    padding: 10px 0;
    display: flex;
}
.left{
    text-align: center;
    line-height: 40px;
}
.page{
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
}
</style>