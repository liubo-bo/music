<template>
    <div class="videolistcardcontainer">
        <div 
            class="videolistcard"
            v-if="videoType == 'singerMv' || videoType == 'mv'"
            v-infinite-scroll="load"
            :infinite-scroll-disabled="disabled"
            :infinite-scroll-distance="300"
            infinite-scroll-immediate="false"
        >
            <div
                class="carditem"
                v-for="(item, index) in videoList"
                :key="index"
                @click="clickListCardItem(item.id, index, item,type)"
            >
                <div class="videocover">
                    <img :src="item.imgurl" alt="">
                
                    <div class="playcount">
                        <i class="iconfont el-icon-video-play"></i>{{ item.playCount | handleNum}}
                    </div>
                    <div class="videotime">
                        {{ item.duration | handleMusicTime}}
                    </div>
                </div>
                <div class="videotitle">{{item.name}}</div>
                <div class="singer">{{item.artistName}}</div>
            </div>
        </div>

        <div 
            class="videolistcard"
            v-else-if="videoType == 'video'"
            v-infinite-scroll="load"
            :infinite-scroll-disabled="disabled"
            :infinite-scroll-distance="300"
            :infinite-scroll-immediate="false"
            >
            <div
                class="carditem"
                v-for="(item, index) in videoList"
                :key="index"
                @click="clickListCardItem(item.vid || item.data.vid, index, item.type)"
            >
                <div  class="videocover">
                    <img :src="item.data.coverUrl" alt="">
                    <div class="playcount">
                        <i class="iconfont el-icon-video-play"></i>{{ item.data.playTime | handleNum}}
                    </div>
                    <div class="videotime">
                        {{ item.data.durationms | handleMusicTime}}
                    </div>
                </div>
                 <div class="videotitle">{{ item.data.title }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { handleMusicTime, handleNum } from "@/plugin/utils";

export default {
    name: "VideoListCard",
    props: {
        videoList:{
            type: Array,
            default() {
                return [];
            }
        },
        isLoad: {
            type: Boolean,
            default() {
                return false;
            }
        },
        videoType: {
            type: String,
            default() {
                return "singerMv"
            }
        }
    },
    data () {
        return {
            disabled: true,
        }
    },
    filters: {
        handleMusicTime,
        handleNum
    },
    methods: {
        load() {
            console.log("触底");
            this.disabled = true;
            this.$emit("bottomLoad");
        },
        clickListCardItem(id, index, type){
            this.$emit("clickListCardItem", {id, index, type})
        }
    },
    watch: {
        videoList() {
            if(this.isLoad == true){
                if(this.videoList.length != true){
                    this.disabled = false;
                } else {
                    this.disabled =true;
                }
            }
        }
    }
    
}
</script>
<style scoped>
.videolistcard{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.carditem{
    max-width: 228px;
    width: 14.3vw;
    margin-right: 1%;
    margin-left: 1%;
    margin-bottom: 20px;
    cursor: pointer;
}
.videocover{
    display: flex;
    width: 100%;
    height: 8.6vw;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    align-items: center;
    background-color: #000;
}
.videocover img{
    width: 14.3vw;
    height: 9vw;
}
.playcount{
    position: absolute;
    font-size: 12px;
    color: #fff;
    top: 0;
    right: 5px;    
    transform: scale(0.9);
}
.videotime{
    position: absolute;
    font-size: 12px;
    color: #fff;
    bottom: 5px;
    right: 5px;    
    transform: scale(0.9);
}
.videotitle{
    font-size: 12px;
    margin-top: 8px;
    line-height: 16px;
}
.singer{
    font-size: 12px;
    padding: 0;
    margin: 1px 0 0 -1px;
    transform: scale(0.9) translate(-5%);
}
</style>