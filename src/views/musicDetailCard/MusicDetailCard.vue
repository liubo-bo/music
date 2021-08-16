<template>
    <div 
        class="musicdetailcard"
        :class="isMusicDetailCardShow ? '':'hide'"
    >
        <div class="closed" @click="closeCard">
            <i class="iconfont icon-arrow-down-bold"></i>
        </div>
        <div class="musicdetailcardcontainer" v-if="musicInfo">
            <div class="top">
                <div class="left">
                    <div class="disccontainer">
                        <div 
                            class="needle"
                            :class="$store.state.isPlay ? 'needlerotate':''"
                            ref="needle"
                        >
                            <img src="@/assets/img/MusicDetailCard/needle.png" alt="">
                        </div>
                        <div 
                            class="disc"
                            :class="[$store.state.isPlay ? '':'pause',
                            $store.state.isMusicLoad ? '':'discAnimation']"
                            ref="disc"
                        >
                            <img src="@/assets/img/MusicDetailCard/disc.png" alt="">
                            <img 
                                src="@/assets/img/test.jpg" 
                                alt=""
                                class="musicavatar"
                                v-if="!musicInfo.al"    
                            >
                            <img 
                                :src="musicInfo.al.picUrl" 
                                alt=""
                                v-else
                                class="musicavatar"
                                >
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="title">
                        <div class="musicname">{{musicInfo.name}}</div>
                        <div class="album">{{musicInfo.al.name}}</div>
                        <div class="singer">{{musicInfo.ar[0].name}}</div>
                    </div>
                    <div class="lyrics">
                        <div class="placeholder"></div>
                        <div 
                            class="lyricsitem" 
                            :class="lyricsIndex -1 == index ? 'currentlyric':''"
                            v-for="(item, index) in lyrics"
                            :key="index"
                        >
                            {{item[1]}}
                        </div>
                        <div class="placeholder"></div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <comment
                    :comments="hotComments"
                    v-if="currentCommentPage == 1"
                    :commentType="'music'"
                    :musicTitle="musicInfo.name"
                    :commentId="$store.state.musicId + ''"
                    @getComment="getMusicComment($store.state.musicId)"
                    class="commentComponent"
                >
                <div slot="title">热门评论</div>
                </comment>
                <comment
                    :comments="comment.comments"
                    :commentType="'music'"
                    :musicTitle ="musicInfo.name"
                    :commentId="$store.state.musicId + ''"
                    @getComment="getMusicComment($store.state.musicId)"
                    class="commentComponent"
                >
                <div slot="title">最新评论</div>
                </comment>
            </div>
            <div class="page">
                <el-pagination
                    layout="prev, pager, next"
                    :total="comment.total"
                    background
                    small
                    :page-size="20"
                    :current-page="currentCommentPage"
                    @current-change="ChangePage"
                    >
                </el-pagination>
            </div>
        </div>
        <div v-else class="none">
            <span>暂无播放音乐</span>
        </div>
    </div>
    
</template>
<script>
import Comment from '@/components/comment/Comment.vue'
let placeholderHeight = 0;

export default {
    components: {
        Comment
    },
    data () {
        return {
            isMusicDetailCardShow: false,
            //歌曲信息
            musicInfo: {},
            // 歌词信息
            lyrics: "",
            hotComments: [],
            currentCommentPage: 1,
            comment: [],
            //当前歌词索引
            lyricsIndex: 0,
        }
    },
    watch: {
        "$store.state.isMusicDetailCardShow"(isMusicDetailCardShow){
            this.isMusicDetailCardShow = isMusicDetailCardShow;
            this.musicInfo = this.$store.state.musicList[this.$store.state.currentIndex];
            //console.log(this.musicInfo)
            if(this.isMusicDetailCardShow && this.$store.state.musicId != ""){
                this.getMusicComment(this.$store.state.musicId);
                this.getLyric(this.$store.state.musicId);
            }
        },
        "$store.state.musicId"(musicId){
            this.musicInfo = this.$store.state.musicList[this.$store.state.currentIndex];
            if(this.isMusicDetailCardShow){
                this.getMusicComment(musicId);
                this.getLyric(musicId);
            }
        },
        //监听当前播放时间
        "$store.state.currentTime"(currentTime){
            if(this.lyrics.length > 1){
                this.getCurrentLyricsIndex(currentTime);
                this.lyricScroll(this.lyricsIndex);
            }
        }
    },
    methods: {
        closeCard(){
            this.$store.commit("changeMusicDetailCardState");
        },
        //获取歌CI信息
        async getLyric(id){
            let res = await this.$http.get('/lyric', {
                params: {
                    id,
                }
            });
            //console.log(res);
            let lyrics = res.data.lrc.lyric;
            //处理歌词
            let arr = lyrics.split('\n');
            let array = [];
            let time = "";
            let value = "";
            let result = [];

            //去空行
            arr.forEach((item)=>{
                if(item != ""){
                    array.push(item);
                }
            });
            arr = array;
            arr.forEach((item)=>{
                time = item.split(']')[0];
                value = item.split(']')[1];
                var t = time.slice(1).split(":");
                //将分钟数*60 + 秒数
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
                //console.log(result);
            });
            this.lyrics = result;
        },
        
        //获取评论
        async getMusicComment(id){
            var timestamp = Date.parse(new Date());

            if(this.currentCommentPage == 1){
                let res = await this.$http.get('/comment/hot', {
                    params: {
                        id,
                        limit: 10,
                        type: 0,
                        timestamp,
                    }
                });
                //console.log(res);
                this.hotComments = res.data.hotComments;
            }

            let res = await this.$http.get('/comment/music', {
                params: {
                    id,
                    offset: (this.currentCommentPage - 1) * 20,
                    timestamp,
                }
            });
            this.comment = res.data;
        },
        //评论翻页
        ChangePage(page){
            this.currentCommentPage = page;
            this.Comment = [];
            this.getMusicComment(this.$store.state.musicId);
        },
        //歌词滚动
        lyricScroll(currentLyric){
            let lyricsArr = document.querySelectorAll(".lyricsitem");
            let lyrics = document.querySelector(".lyrics");

            if(placeholderHeight == 0 ){
                placeholderHeight = lyricsArr[0].offsetTop - lyrics.offsetTop;
            }
            if(lyricsArr[currentLyric]){
                let distance = lyricsArr[currentLyric].offsetTop - lyrics.offsetTop;
                lyrics.scrollTo({
                    behavior: "smooth",
                    top: distance - placeholderHeight,
                });
                //console.log('站位：' + placeholderHeight)
                //console.log('前一句歌词：' + this.lyrics[currentLyric])
            }
        },
        // 获取当前歌词索引
        getCurrentLyricsIndex(currentTime){
            let lyricsIndex = 0;
            this.lyrics.forEach((item) => {
                if(lyricsIndex < this.lyrics.length - 1){
                    if(currentTime > item[0]) {
                        lyricsIndex += 1;
                    }
                }
            });
            this.lyricsIndex = lyricsIndex;
        },
    },
}
</script>
<style scoped>
.musicdetailcard{
    position: absolute;
    width: 100%;
    height: calc(100vh - 55px);
    top: 0;
    left: 0;
    z-index: 1000;
    transition: transform 0.5s;
    background-color: #fff;
    background-image: linear-gradient(to bottom, #e3e2e3, white);
}
.hide{
    transform: translateY(calc(100vh - 55px));
}
.musicdetailcardcontainer{
    height: 100%;
    overflow-y: scroll;
}
.top{
    display: flex;
    justify-content: center;
}
.left{
    width: 220px;
    margin: -20px 30px 0 -40px;
}
.disccontainer{
    margin-top: 60px;
    width: 220px;
    position: relative;
}
.needle{
    position: relative;
    left: 50%;
    width: 88px;
    height: 72px;
    z-index: 1000;
    transition: all 1s;
    transform-origin: 5.3px 5.3px;
}
.needle img{
    width: 100%;
}
.needlerotate{
    transform-origin: 5.3px 5.3px;
    transform: rotate(22deg);
}
.disc{
    width: 220px;
    height: 220px;
    position: relative;
    top: -12px;
}
.disc img:nth-child(1){
    width: 100%;
}
.disc .musicavatar{
    position: absolute;
    top: 35px;
    left: 35px;
    width: 150px;
    z-index: -1;
}
/* 碟子动画 */
.discAnimation{
    /* 无线循环 */
    animation: disc 25s linear infinite;
    animation-delay: 0.8s;
}
@keyframes disc{
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
}
.pause{
    animation-play-state: paused;
}
.lyrics{
    width: 350px;
    height: 275px;
    overflow-y: scroll;
    font-size: 12px;
    text-align: center;
}
.lyrics .lyricsitem{
    height: 20px;
    margin: 17px;
}
.right{
    width: 350px;
}
.title{
    text-align: center;
}
.title div{
    margin: 7px 0;
    color: #aaa;
    font-size: 12px;
}
.title div:nth-child(1){
    font-size: 23px;
    font-weight: 600;
    color: #000;
}
.page{
    text-align: center;
    margin-bottom: 55px;
}
.bottom{
    width: 55vw;
    margin: 40px auto;
}
.closed{
    transform: translate(30px, 20px);
}
.closed i{
    font-size: 24px;
}
.currentlyric{
    font-size: 16px;
    font-weight: 600;
    color: #000;
}
.placeholder{
    margin-top: 120px;
    border-bottom: 1px solid rgba(32, 32, 32, 0.2);
}
.none{
    width: 100%;
    height: 200px;
    line-height: 200px;
    text-align: center;
    font-size: 24px;
}
</style>