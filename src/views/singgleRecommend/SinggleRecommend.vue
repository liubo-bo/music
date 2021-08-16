<template>
    <div class="singglerecommend">
        <div class="recommendinfo">
            <div class="title">
                <div class="cover">
                    <img src="@/assets/img/recommendMusic.png" alt="">
                </div>
                <div class="titleinfo">
                    <div class="infotop">
                        每日歌曲推荐
                    </div>
                    <div class="infobuttom">
                        系统随意推荐，爱听不听,每天6:00更新
                    </div>
                </div>
            </div>
            <div class="buttons">
                <div class="buttonitem playall" @click="playAll">
                    <i class="iconfont icon-bofang playall">播放全部</i>
                </div>
                <div class="buttonitem">
                    <i class="iconfont icon-xihuan">收藏全部</i>
                </div>
            </div>
        </div>
        <!-- 歌单 -->
        <el-table
            :data="recommendMusic"
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
        <!-- 分页 --></div>
</template>
<script>
import { handleMusicTime } from '@/plugin/utils'

export default {
    data () {
        return {
            recommendMusic: [],
            // 自取一个id作唯一标识
            recommendMusicListId: 'recommendmusic'
        }
    },
    filters: {
      handleMusicTime,  
    },
    methods: {
        async getRecommendMusic(){
            let res = await this.$http.get('/recommend/songs');
            this.recommendMusic = res.data.data.dailySongs;
            //console.log(res);
            this.recommendMusic.forEach((item, index)=>{
                this.recommendMusic[index].dt = handleMusicTime(item.dt);
            });
        },
        //双击播放
        clickRow(row){
            //console.log(row.id)
            this.$store.commit("updateMusicId", row.id);
            if(this.$store.state.musicListId != this.recommendMusicListId){
                this.$store.commit('updateMusicList', {
                    musicList: this.recommendMusic,
                    musicListId: this.recommendMusicListId
                });
            }
        },
        // 播放全部
        playAll(){
            this.$store.commit("updateMusicId", this.recommendMusic[0].id);
            if(this.recommendMusicListId != this.$store.state.musicListId){
                this.$store.commit('updateMusicList', {
                    musicList: this.recommendMusic,
                    musicListId: this.recommendMusicListId
                });
            }
        }
    },
    created () {
        this.getRecommendMusic();
    }
}
</script>
<style scoped>
.recommendinfo{
    padding: 20px;
}
.title{
    display: flex;
}
.cover{
    width: 90px;
}
.cover img{
    width: 100%;
}
.titleinfo{
    padding: 15px 10px;
}
.infobuttom{
    font-size: 12px;
}
.buttons{
    display: flex;
    margin: 8px 0 0 3px;
}
.buttonitem {
    font-size: 12px;
    border: 1px solid #ddd;
    padding: 8px 15px;
    border-radius: 20px;
    transform: scale(0.9);
}
.buttonitem i{
    font-size: 12px;
    margin-right: 5px;
    transform: scale(0.9);
}
.playall{
    background-color: #ec4141;
    color: #fff;
}
</style>