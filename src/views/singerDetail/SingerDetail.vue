<template>
    <div class="singerdetailcontainer" v-if="singerInfo.cover">
        <div class="singer">
            <div class="left">
                <div class="singerimg">
                    <img :src="singerInfo.cover" alt="">
                </div>
            </div>
            <div class="right">
                 <div class="singerinfo">
                    {{singerInfo.name}}
                </div>
                <div class="buttons">
                    <div class="buttonitem">
                        <i class="iconfont el-icon-star-off"></i>
                        <span>收藏</span>
                    </div>
                     <div class="buttonitem">
                        <i class="iconfont el-icon-s-home"></i>
                        <span>个人主页</span>
                    </div>
                </div>
                 <div class="otherinfo">
                     <span class="musicnum">单曲数：{{singerInfo.musicSize}}</span>
                     <span class="musicnum">专辑数：{{singerInfo.albumSize}}</span>
                     <span class="musicnum">mv数：{{singerInfo.mvSize}}</span>
                 </div>
            </div>
        </div>
        <!-- //歌曲列表 -->
        <div class="musiclist">
              <el-tabs value="first" @tab-click="handleClick">
                <el-tab-pane label="专辑" name="first">
                    <!-- 热歌50首 -->
                    <div class="hotsong" v-if="topSongs.topSongs">
                        <list-table
                        :officialListDetailItem="topSongs"
                        :cover="require('/src/assets/img/topSongsLogo.png')"
                        :listId="this.$route.params.id.toString()"
                        @handleRowDbClick="handleRowDbClick"
                        @clickCheckAll="allTopSpngs"
                        :isCheckAllShow="isCheckAllShow"
                        ></list-table>
                    </div>
                    <!-- 专辑 -->
                    <div class="albumcontainer" 
                        v-if="singerAlbum.length != 0"
                        v-infinite-scroll="load"
                        :infinite-scroll-disabled="disabled"
                        :infinite-scroll-distance="300"
                        infinite-scroll-immediate="false"
                        >
                        <div class="albumitem"
                        v-for="(item, index) in singerAlbum"
                        :key="index"
                        >
                            <list-table
                                :officialListDetailItem="item.songsObj"
                                :cover="item.album.blurPicUrl"
                                :listId="item.album.id.toString()"
                                @handleRowDbClick="handleRowDbClick"
                                @clickCheckAll="clickCheckAll"
                            >
                            <!-- <div slot="header" class="header">
                                <div class="title">{{ item.album.name }}</div>
                            </div> -->
                            </list-table>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="MV" name="second">
                    <video-list-card
                        :videoList="singerMvInfo.mvs"
                        :isLoad="true"
                        @bottomLoad="bottomLoad"
                    ></video-list-card>
                </el-tab-pane>
                <el-tab-pane label="歌手详情" name="third">
                    <div class="singerdesc">{{singerInfo.briefDesc}}</div>
                </el-tab-pane>
            </el-tabs>
        </div>  
    </div>
</template>
<script>
import ListTable from "@/components/listTable/ListTable.vue"
import { handleMusicTime } from "@/plugin/utils";
import VideoListCard from '@/components/videoListCard/VideoListCard'

export default {
    data () {
        return {
            // 歌手信息
            singerInfo: {},
            //热歌50首
            topSongs: {},
            //专辑页数
            albumPage: 1,
            //歌手专辑
            singerAlbum: [],
            isAlbumMore: false,
            disabled: true,
            //是否显示查看全部按钮
            isCheckAllShow: true,
            //mv页数
            videoPage: 1,
            //mv信息
            singerMvInfo: { mvs: [], hasMore: false}
            
        }
    },
    components: {
        ListTable,
        VideoListCard
    },
    watch: {
        singerAlbum() {
            if(this.isLoad == true){
                if(this.singerAlbum.length != 0 && this.isAlbumMore){
                    this.disabled = false
                } else {
                    this.disabled = true;
                }
            }
        }
    },
    methods: {
        async getSingerInfo(){
            let res = await this.$http.get('/artist/detail',{
                params: {
                    id: this.$route.params.id,
                }
            });
            this.singerInfo = res.data.data.artist;
            //console.log(this.singerInfo);
        },
        //热歌50首
        async getSingerTopSongs(){
            let res = await this.$http.get('artist/top/song', {
                params: {
                    id: this.$route.params.id
                }
            });
            let topSongs = res.data.songs;
            
            topSongs.forEach((item,index) => {
                topSongs[index].dt = handleMusicTime(item.dt); 
            });
            //topSongs改成对象，并向里面添加isOpen属性，用于点击查看列表所有歌曲
            this.topSongs = { topSongs, isOpen: false };
            //console.log(this.topSongs);
        },
        //专辑
        async getAlbumInfo(){
            let res = await this.$http.get('/artist/album', {
                params: {
                    id: this.$route.params.id,
                    limit: 20,
                    offset: (this.albumPage - 1) * 20,
                }
            });
            this.isAlbumMore = res.data.more;
            res = res.data.hotAlbums;
            res.forEach(item => {
                this.getAlbumDetail(item.id);
            })
            //console.log(res);
        },
        // 专辑详情
        async getAlbumDetail(id){
            let res = await this.$http.get('/album', {
                params:{
                    id:id
                }
            })
            res = res.data;
           // console.log(res)
            let songs = res.songs;
            songs.forEach((item, index) => {
                songs[index].dt = handleMusicTime(item.dt);
            });
            res.songsObj = { songs };
            this.singerAlbum.push(res);
            //console.log(this.singerAlbum);
           // console.log(res)
        },
        //请求歌手mv列表
        async getSingerMv(){
            let res = await this.$http.get('/artist/mv', {
                params: {
                    id: this.$route.params.id,
                    limit: 20 *this.videoPage
                }
            });
            console.log(res.data);
            this.singerMvInfo = res.data;
        },
        //收藏歌手列表
        async getSubSingerList(){
            let res = await this.$http.get('/artist/sublist', {
                params: {
                    limit: 1000,
                    //timestamp,
                }
            })
            console.log(res);
        },
       handleClick(){
           console.log(11);
       },
       handleRowDbClick({ id, index, listId }){
           if(listId != this.$route.params.id){
               let musicListIndex = this.singerAlbum.findIndex(
                (item) => item.album.id == listId
                );
                console.log(musicListIndex);
                this.$store.commit("updateMusicId", id);
                console.log(index);
                //console.log(listId);
                if(listId != this.$store.state.musicList){
                    //重新传歌单到vuex
                    this.$store.commit("updateMusicList", {
                        musicList: this.singerAlbum[musicListIndex].songs,
                        musicListId: listId,
                    })
                }
           }else{
                this.$store.commit("updateMusicId", id);
                if (this.$route.params.id != this.$store.state.musicListId) {
                    // 将歌单传到vuex
                    this.$store.commit("updateMusicList", {
                        musicList: this.topSongs.topSongs,
                        musicListId: this.$route.params.id,
                    });
                }
            }
       },
        // 专辑上拉触底加载
        load() {
            console.log("上拉触底");
            this.disabled = true;
            this.albumPage += 1;
            this.getAlbumInfo();
        },
        //查看50首热歌全部
        allTopSpngs(listId){
            this.topSongs.isOpen = true;
            this.isCheckAllShow = false;
            console.log(listId);
        },
        //查看专辑全部歌曲
        clickCheckAll(listId){
            console.log(listId);
            //this.$route.push({ name: "album", params: { id: listId } });
        },
        bottomLoad(){
            if(this.singerMvInfo.hasMore == true){
                console.log("触底2");
                this.videoPage += 1;
                this.getSingerMv();
            } 
        }
    },
    created () {
            this.getSingerInfo();
            this.getSingerTopSongs();
            this.getAlbumInfo();
            this.getSingerMv();
    }
}
</script>
<style scoped>
.singerdetailcontainer{
    width: 100%;
}
.singer{
    width: 100%;
    display: flex;
    align-items: center;
} 
.left{
    width: 150px;
    height: 150px;
    border-radius: 10px;
    margin-right: 15px;
}
.left img{
    width: 100%;
}
.right{
    display: flex;
    position: relative;
    width: 100%;
    height: 150px;
}
.singerinfo{
    position: absolute;
    left: 0;
    top: 10px;
}
.otherinfo{
    position: absolute;
    left: 0;
    bottom: 50px;
    font-size: 12px;
}
.musicnum{
    margin-right: 20px
}
.musiclist{
    margin: 0 10px;
}
.buttons{
    position: absolute;
    display: flex;
    top: 40px;
}
.buttonitem{
    margin-right: 20px;
    font-size: 12px;
    border: 1px solid #999;
    border-radius: 20px;
    padding: 8px 15px;
}
.singerdesc{
    font-size: 12px;
    color: #373737;
    line-height: 25px;
    letter-spacing: 0.5px;
    text-indent: 2em;
}
</style>