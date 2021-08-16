<template>
    <div class="bottomcontrol">
        <audio 
            :src="musicUrl"
            ref="audioPlayer"
            autoplay
            :loop="isCirculation"
            @play="changeState(true)"
            @pause="changeState(false)"
            @ended="isCirculation ? '' : changeMusic('next')"
            @timeupdate="timeupdate"
        ></audio>
        <!-- 左边 -->
        <div class="left">
            <div class="avatar" @click="$store.commit('changeMusicDetailCardState')">
                <img :src="musicDetail.al.picUrl" alt="" v-if="musicDetail.al">
                <img src="@/assets/img/test.jpg" alt="" v-else>
            </div>
            <div class="musicinfo">
                <div class="musicname" v-if="musicDetail && musicDetail.name">{{musicDetail.name}}</div>
                <div class="singer" v-if="musicDetail && musicDetail.name">{{musicDetail.ar[0].name}}</div>
            </div>
            <!-- 下载按钮 -->
            <div class="downloadcontainer" @click="downloadCurrentMusic">
                <i class="inconfont el-icon-download"></i>
            </div>
        </div>
        <!-- 中间 -->
        <div class="center">
            <div class="buttons">
                <span @click="isCirculation = !isCirculation">
                    <i class="iconfont icon-xunhuan" v-if="!isCirculation"></i>
                    <i class="iconfont icon-danquxunhuan" v-else></i>
                </span>
                <span @click="musicList.length != 0 ? changeMusic('pre'):''"> <i class="iconfont el-icon-caret-left"></i> </span>
                <!-- 播放按钮 -->
                <span @click="musicList.length != 0 ? changePlayState():''"> 
                        <i class="iconfont el-icon-video-play"
                        v-if="!this.$store.state.isPlay"></i> 
                        <i class="iconfont el-icon-video-pause"
                        v-else></i>
                </span>
                <span @click="musicList.length != 0 ? changeMusic('next'):''"> <i class="iconfont el-icon-caret-right"></i> </span>
                <span @click="SongCollect"> 
                    <i class="iconfont el-icon-star-off" v-if="!isSongCollect"></i>
                    <i class="iconfont el-icon-star-on" v-else></i>
                </span>
            </div>
             <!-- 进度条 -->
            <div class="progressbar">
                <span class="currenttime">{{ currentTime | handleMusicTime }}</span>
                <el-slider
                    class="progressslider"
                    v-model="timeProgress"
                    :disabled="musicList.length == 0"
                    @change="changeProgress"
                ></el-slider>
                <span class="totaltime">{{duration}}</span>
            </div>
        </div>
       
        <!-- 右边 -->
        <div class="right">
            <div class="volumecontrol">
                <i class="iconfont el-icon-headset" @click="changeMutedState"></i>
                <el-slider
                    class="volumeslider"
                    v-model="volume"
                    @input="changeVolume"
                >
                </el-slider>
            </div>
            <div class="playlist" @click="openDrawer">
                播放列表<i class="iconfont el-icon-menu"></i>
            </div>
        </div>
        <!-- 抽屉 -->
        <el-drawer
            :visible.sync="drawer"
            :width-header="false"
            width="300">
                <div class="drawerheader">总{{musicList.length}}首</div>
                <el-table
                    v-if="musicList"
                    style="width: 100%"
                    :data="musicList"
                    stripe
                    lazy
                    highlight-current-row
                    @row-dblclick="clickRow">
                    <el-table-column prop="name" width="150px">
                    </el-table-column>
                     <el-table-column prop="ar[0].name" width="80px">
                    </el-table-column>
                     <el-table-column prop="dt" width="70px">
                    </el-table-column>
                </el-table>
        </el-drawer>
    </div>
</template>
<script>
import { handleMusicTime, returnSecond } from "@/plugin/utils"
//let lastSecond = 0;
// 音乐总时长秒数
let durationNum = 0;
//保存当前音量
let volumeSave = 0;
//当前音乐类型，用于下载
let musicType = '';

export default {
    name: "BottomControl",
    data () {
        return {
            musicDetail: {},
            musicUrl: "",
            musicList: [],
            currentMusicINdex: 0,
            // 音乐总时长
            duration: "00:00",
            drawer: false,
            // 当前播放位置
            currentTime: 0,
            //进度条位置
            timeProgress: 0,
            //是否静音
            isMuted: false,
            //音量
            volume: 50,
            //是否收藏该歌曲
            isSongCollect: false,
            //用户喜欢音乐列表
            likeMusicList: [],
            //是否循环播放当前歌曲
            isCirculation: false,
        }
    },
    watch: {
        //监听vuex中的musicId的变化
        "$store.state.musicId"(id){
            console.log("vuex的id变化了");
            //暂停当前播放的音乐
             this.pauseMusic();
             this.musicList = this.$store.state.musicList;
             this.getMusicDetailFromMusicList();
             this.getMusicDetail(id);
             durationNum = returnSecond(this.duration);
        },
        //监听播放状态
        "$store.state.isPlay"(isPlay){
            if(isPlay){
                this.playMusic();
            }else{
                this.pauseMusic();
            }
        },
        //监听currentIndex变化
        // "$store.state.currenIndex"(currentIndex, lastIndex){
        //     if(this.hasDrawerOpend) {
        //         this.handleDrawerListDOM(currentIndex, lastIndex);
        //     }
        // }

    },
    filters: {
        handleMusicTime
    },
    methods: {
        async getMusicDetail(id){
            this.musicUrl = '';
            let res = await this.$http.get('/song/url',{
                params: {
                    id: id
                }
            });
            //console.log(res);
            this.musicUrl = res.data.data[0].url;
            musicType = res.data.data[0].type.toLowerCase();
            //console.log(musicType)
            await this.getisSongCollect();
        },
        // 点击播放按钮触发事件
        changePlayState(){
            !this.$store.state.isPlay ? this.playMusic() : this.pauseMusic()
        },
        // 博放音乐
        playMusic(){
            this.$refs.audioPlayer.play();
        },
        // 暂停音乐
        pauseMusic(){
            this.$refs.audioPlayer.pause();
        },
        // audio的回调，改变vuex中的状态
        changeState(state){
            this.$store.commit("changePlayState", state);
        },
        //根据id找到的musicList中对应的musicDetail
        getMusicDetailFromMusicList(){
            this.musicList.forEach((item, index) => {
               // console.log(this.musicList[this.currentIndex]);
                if(item.id == this.$store.state.musicId){
                    //记录当前音乐的index
                    this.currentMusicINdex = index;
                    //将索引传到vuex
                    this.$store.commit("updateCurrentIndex", index);
                    this.musicDetail = item;
                    //console.log(this.musicDetail)
                    //直接从audio标签中duration属性时长会有请求时差问题，so直接从musicInfo中拿
                    this.duration = this.musicList[index].dt;
                }
            })
        },
        // 当前播放时间位置
        timeupdate(){
            //console.log(e);
            //console.log(this.$refs.audioPlayer.currentTime);
            let time = this.$refs.audioPlayer.currentTime;
            //
            this.$store.commit("updateCurrentTime", time);

            time = Math.floor(time);
            if(time){
                
                this.currentTime = time;
                //计算进度条位置
                this.timeProgress = Math.floor((time / durationNum) * 100);
                //console.log(this.timeProgress);
            }
        },
        //拖动进度条回调
        changeProgress(e){
            this.currentTime = Math.floor((e/100) * durationNum);
            this.$refs.audioPlayer.currentTime = this.currentTime;
        },
        //拖动音量回调
        changeVolume(e){
            this.$refs.audioPlayer.volume = e / 100;
            if(this.isMuted && e > 0){
                this.isMuted = false;
            }else if(e == 0 && this.isMuted == false){
                this.isMuted = true; 
            }
        },
        //点击小喇叭的回调
        changeMutedState(){
            if(this.isMuted){
                this.volume = volumeSave;
            }else{
                volumeSave = this.volume;
                this.volume = 0;
            }
            this.isMuted = !this.isMuted;
        },
        //切歌
        changeMusic(type){
            if(type == "click"){
                //this.$store.commit("updateMusicId", id);
                console.log(1)
            } else if(type == "pre"){
                let currentMusicIndex = this.$store.state.currentIndex;
                let preIndex =
                    currentMusicIndex - 1 < 0 ? this.musicList.length - 1 : currentMusicIndex - 1;
                console.log(1);    
                console.log(this.musicList[preIndex].id); 
                this.$store.commit("updateMusicId", this.musicList[preIndex].id);
            } else if(type == "next"){
                let currentMusicIndex = this.$store.state.currentIndex;
                let nextIndex =
                    currentMusicIndex + 1 == this.musicList.length ? 0 : currentMusicIndex + 1 ;
                console.log(this.musicList[nextIndex].id); 
                this.$store.commit("updateMusicId", this.musicList[nextIndex].id);
            }
        },
        clickRow(row){
            // this.changeMusic("click", row.id);
            console.log(row);
        },
        openDrawer(){
            this.drawer = !this.drawer;
        
        },
        //点击收藏歌曲
        SongCollect(){
            this.isSongCollect = !this.isSongCollect;
            //this.$store.commit('changeSongCollect');
            this.UserLikeCurrentMusic(
                this.$store.state.musicId, 
                this.isSongCollect,
                );
            this.getUserLikeMusicList();
        },
        //收藏歌曲的回调
        async UserLikeCurrentMusic(id, like){
            let res = await this.$http.get('/like', {
                params: {
                    id,
                    like,
                }
            });
            if(res.data.code == 200){
                this.$message.success('收藏成功');
            } else {
                this.$message.error('收藏失败');
            }
        },
        //获取用户喜欢的歌曲列表
        async getUserLikeMusicList(){
            var timestamp = Date.parse(new Date());
            let res = await this.$http.get('/likelist', {
                params: {
                    uid: JSON.parse(window.localStorage.getItem("userInfo")).userId,
                    timestamp,
                }
            });
            console.log(res.data)
            this.likeMusicList = res.data.ids;
            this.$store.commit("changeLikeMusicList", this.likeMusicList);

        },
        //判断当前歌曲是否被收藏
        async getisSongCollect(){
            this.isSongCollect = this.$store.state.likeMusicList.some(
                (item) => item == this.$store.state.musicId    
            );
            console.log('收藏状态' + this.isSongCollect);

        },
        // 下载歌曲
        downloadCurrentMusic(){
            console.log(this.musicDetail, this.musicUrl);
            //匹配资源的域名
            let url = this.musicUrl.match(/http.*?\.net/);
            //匹配域名名称和相应代理
            let serve = url[0].match(/http:\/(\S*).music/)[1];

            if(
                serve != "/m7" &&
                serve != "/m701" &&
                serve != "/m8" &&
                serve != "/m801" 
                ){
                    //没有对应代理
                    this.$message.console.error('没有对应代理，下载失败');
                    return;
                }
            
            let params = this.musicUrl.slice(url[0].length);

            let downloadMusicInfo = {
                url: serve + params,
                name: 
                    this.musicDetail.name + " - " + this.musicDetail.ar[0].name + "." + musicType,
            };
            console.log(downloadMusicInfo);
            this.$store.commit("updateDownloadMusicInfo", downloadMusicInfo);
        },
       
    },
    created () {
        if(window.localStorage.getItem("userInfo")){
            this.getUserLikeMusicList();
        }
        
    }
}
</script>
<style scoped>
.bottomcontrol{
    border-top: 1px solid #ddd;
    width: 100%;
    height: 55px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    z-index: 10000;
    background-color: #fff;
}
.left{
    display: flex;
    align-items: center;
    width: 140px;
}
.musicinfo{
    color: rgb(37, 37, 37);
    font-size: 12px;
    width: 80px;
}
.center{
    margin-top: 5xp;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.buttons{
    display: flex;
    align-items: center;
    height: 13px;
}
.buttons span{
    width: 50px;
    box-sizing: border-box;
    text-align: center;
}
.buttons i{
    font-size: 20px;
    color: #313131;
}
.buttons span:nth-child(3) i{
    font-size: 25px;
}
.center .el-icon-refresh .el-icon-star-off{
    font-size: 17px;
}
.right{
    display: flex;
    align-items: center;
    position: relative;
}
.volumecontrol{
    display: flex;
    align-items: center;
    margin-right: 15px;
}
.el-icon-headset{
    font-size: 18px;
    margin-right: 7px;
}
.volumeslider{
    width: 55px
}
.progressslider{
    width: 300px;
}
.el-icon-menu{
    font-size: 18px;
    margin-right: 10px;
}
.progressbar{
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #aaa;
}
.musicname{
    margin-bottom: 4px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.singer{
    transform: scale(0.9);
    margin-left: -3px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.playlist{
    font-size: 12px;
}
.avatar{
    width: 40px;
    height: 40px;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 5px;
}
.avatar img{
    width: 100%;
}
</style>