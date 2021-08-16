<template>
    <div class="searchsong">
        <div class="title">找到 {{songCount}} 首单曲</div>
        <div class="multimatch" v-if="mulitMatch.artist && currentPage == 1">
            <div class="matchtitle">最佳匹配</div>
            <div class="matchresult">
                <div class="matchcover">
                    <img :src="mulitMatch.artist[0].img1v1Url + '?param==200y200'" alt="">
                </div>
                <div class="matchname">歌手：{{mulitMatch.artist[0].name}}</div>
                <i class="iconfont icon-arrow-right-bold"></i>
            </div>
        </div>
        <!-- 歌单 -->
        <el-table
            :data="searchSongList"
            style="width: 100%"
            stripe
            highlight-current-row
            size="mini"
            @row-dblclick="clickRow"
            >
            <el-table-column
                width="30"
                type="index"
                >
            </el-table-column>
            <el-table-column
                width="30">
                <i class="iconfont icon-download"></i>
            </el-table-column>
            <el-table-column
                prop="name"
                min-width="200"
                label="音乐标题"
                >
            </el-table-column>
            <el-table-column
                prop="ar[0].name"
                min-width="100"
                label="歌手"
                >
            </el-table-column>
            <el-table-column
                prop="al.name"
                min-width="170"
                label="专辑"
                >
            </el-table-column>
            <el-table-column
                prop="dt"
                min-width="60"
                label="时长"
                >
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="page">
            <el-pagination
                layout="prev, pager, next"
                :total="songCount"
                small
                background
                :page-size="30"
                :current-page="currentPage"
                @current-change="pageChange"
                >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { handleMusicTime } from '@/plugin/utils'

export default {
    name: 'SearchSong',
    data () {
        return {
            currentPage: 1,
            searchSongList: [],
            songCount: 0,
            mulitMatch: {},
        }
    },
    filters: {
        handleMusicTime
    },
    methods: {
        //获取最佳匹配
        async getMultMath(){
            let res = await this.$http.get('/search/multimatch', {
                params: {
                    keywords: this.$route.params.id,
                }
            });
            //console.log(res);
            this.mulitMatch = res.data.result;
        },
        //请求搜索单曲
        async getSearchSong(){
            let res = await this.$http.get('/cloudsearch', {
                params: {
                    keywords: this.$route.params.id,
                    offset: 30 * (this.currentPage - 1),
                }
            });
            //console.log(res);
            this.searchSongList = res.data.result.songs;
            this.songCount = res.data.result.songCount;
            this.searchSongList.forEach((item, index)=>{
                this.searchSongList[index].dt = handleMusicTime(item.dt);
            });
        },
        // 换页
        pageChange(page){
            this.currentPage = page;
            this.searchSongList = [];
            this.getSearchSong();
        },
        // 双击
        clickRow(row){
            //console.log(row)
            let musicList = this.$store.state.musicList;
            let isExist = musicList.find((item) => item.id == row.id);
            let currentIndex = this.$store.state.currentIndex;
            if(isExist){
                this.$store.commit('updateMusicId', row.id);
                return;
            }
            musicList.splice(currentIndex + 1, 0, row);
            this.$store.commit("updateMusicList", {
                musicList,
                musicListId: this.$store.state.musicListId,
            });
            this.$store.commit('updateMusicId', row.id);    
            // if(this.$store.state.musicListId != this){

            // }
        }
    },
    created () {
        this.getMultMath();
        this.getSearchSong();
    },
    watch: {
        "$route"(){
            this.getMultMath();
            this.getSearchSong();
        }
    }
}
</script>
<style scoped>
.searchsong{
    width: 1000px;
    padding: 0 15px;
    transform: translateX(10%);
}
.title{
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
}
.matchtitle{
    font-size: 12px;
    margin: 5px 0;
    color: #000;
}
.matchresult{
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    background-color: #f4f4f4;
    width: 270px;
    height: 65px;
    margin-bottom: 20px;
}
.matchcover{
    width: 65px;
    height: 65px;
}
.matchcover img{
    width: 100%;
}
.matchname{
    font-size: 13px;
    color: #000;
    margin-left: 10px;
}
.multimatch i{
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
}
.page{
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
    margin: 20px 0;
}
</style>