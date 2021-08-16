<template>
    <div class="musiclistdetail" v-if="musicListDetail">
        <!-- 歌单信息 -->
        <div class="listinfo">
            <!-- 歌单封面 -->
            <div class="listavatar">
                <img :src="musicListDetail.coverImgUrl" alt="233">
            </div>
            <div class="rigth">
                <!-- 标题 -->
                <div class="title">
                    <div class="titletag">歌单:</div>
                    <div class="titlecontent">{{musicListDetail.name}}</div>
                </div>
                <!-- 用户信息 -->
                <div class="user">
                    <div class="useravater">
                        <img :src="musicListDetail.creator.avatarUrl" alt="233">
                    </div>
                    <div class="username">{{musicListDetail.creator.nickname}}</div>
                    <div class="createtime">{{musicListDetail.createTime | showDate }}创建</div>
                </div>
                <!-- 操作按钮 -->
                <div class="button">
                    <div class="buttonitem playall" @click="playAll(musicListDetail.tracks)">
                        <i class="iconfont el-icon-video-play"></i>
                        <span>播放全部</span>
                    </div>
                    <div class="buttonitem" @click="clickSub">
                        <i v-if="isSub" class="iconfont el-icon-star-on"></i>
                        <i v-else class="iconfont el-icon-star-off"></i>
                        <span>{{isSub ? '已收藏':'收藏'}}</span>
                    </div>
                    <div class="buttonitem">
                        <i class="iconfont el-icon-male"></i>
                        <span>分享</span>
                    </div>
                </div>
                <!-- 标签 -->
                <div class="tags">
                    标签：
                    <div class="tagitem"
                    v-for="(item, index) in musicListDetail.tags"
                    :key="index"
                    >
                        {{item}}
                    </div>
                </div>
                <!-- 歌曲列表的歌曲数量和播放量 -->
                <div class="otherinfo">
                    <div class="musicnum">
                    歌曲:{{musicListDetail.trackCount | handleNum }}
                    </div> 
                    <div class="playcount">
                    播放次数:{{musicListDetail.playCount | handleNum }}    
                    </div>
                </div>
                <!-- 简介 -->
                <div class="desc">简介:{{musicListDetail.description}}</div>
            </div>
        </div>
        <!-- 歌曲列表 -->
        <div class="musiclist">
            <el-tabs value="first" @tab-click="ClickTab" v-if="musicListDetail.tracks">
                <el-tab-pane label="歌曲列表" name="first">
                    <el-table
                        :data="musicListDetail.tracks"
                        size="mini"
                        style="width: 100%"
                        @row-dblclick="clickRow"
                        stripe
                        lazy
                        highlight-current-row
                        :row-key="
                            (row) => {
                                return row.id;
                            }
                            "
                        >
                        <el-table-column
                            label=""
                            width="40"
                            type="index">
                        </el-table-column>
                        <el-table-column label="" width="23">
                           <i class="iconfont el-icon-download"></i>
                        </el-table-column>
                        <el-table-column prop="name" label="音乐标题" min-width="350">
                        </el-table-column>
                         <el-table-column prop="ar[0].name" label="歌手" min-width="120">
                        </el-table-column>
                         <el-table-column prop="al.name" label="专辑" min-width="170">
                        </el-table-column>
                         <el-table-column prop="dt" label="时长" min-width="100">
                        </el-table-column>
                    </el-table>
                    <div class="loadmore">登录后查看更多音乐</div>

                </el-tab-pane>

                <el-tab-pane label="评论" name="second">
                    <div class="commentlist"
                    v-if="comments.comments"
                    v-loading="isCommentLoading">
                        <!-- 精彩评论 -->
                        <comment
                            :comments="comments.hotComments"
                            :commentType="'musicList'"
                            v-if="comments.hotComments"
                            :commentId="musicListDetail.id + ''"
                            @getComment="getMusicListComment"
                            ref="hotComments"
                        >
                            <div slot="title">精彩评论</div>
                        </comment> 
                        <!-- 最新评论 -->
                         <comment
                            :comments="comments.comments"
                            :commentType="'musicList'"
                            :isHotComment="comments.hotComments ? false : true"
                            :commentId="musicListDetail.id + ''"
                            @getComment="getMusicListComment"
                            @transToHotComment="
                                (info) => {
                                    $refs.hotComments.floorComment(info.commentId, info.nickName)
                                }
                            "
                         >
                            <div slot="title">最新评论</div>
                        </comment> 
                    </div>
                    <!-- 分页 -->
                    <div class="page">
                        <el-pagination
                            background
                            small
                            layout="prev, pager, next"
                            :total="comments.total"
                            :page-size="50"
                            :current-page="currentCommentPage"
                            @current-change="commentPageChange">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>    
</template>
<script>
import { formatDate, handleNum, handleMusicTime } from "@/plugin/utils"
import Comment from '@/components/comment/Comment.vue'

export default {
    name: "MusicListDetail",
    data () {
        return {
            musicListDetail: null,
            //当前评论页数
            currentCommentPage: 1,
            //评论
            comments: [],
            //评论是否在加载
            isCommentLoading: false,
            //用户是否收藏改革单
            isSub: false,
            userInfo: []
            
        }
    },
    components: {
        Comment
    },
    methods: {
        async getMusicListDetail(){
            let res = await this.$http.get('/playlist/detail',{
                params: {
                    id: this.$route.params.id,
                    //timestamp
                }
            });
            
            this.musicListDetail = res.data.playlist;
            //console.log(this.musicListDetail);
            //处理播放时间
            this.musicListDetail.tracks.forEach((item, index) => {
                this.musicListDetail.tracks[index].dt = handleMusicTime(item.dt);
            })
        },
        //获取歌单评论
        async getMusicListComment(){
            let timestamp = Date.parse(new Date());
            this.isCommentLoading = true;

            let res = await this.$http.get('/comment/playlist', {
                params: {
                    id: this.$route.params.id,
                    offset: 50 * (this.currentCommentPage - 1),
                    limit: 50,
                    timestamp
                }
            });
            //console.log(res);
            this.comments = res.data;
            this.isCommentLoading = false;
        },
        ClickTab(e){
            console.log(e.index);
            if(e.index == 1 && !this.comments.comments){
                this.getMusicListComment();
            }
        },
        clickRow(row){
            console.log("双击传值："+row.id);
            //将musicId提交到vuex中
            this.$store.commit("updateMusicId", row.id);
            //如果歌单发生变化，则提交歌单到vuex
            if(this.musicListDetail.id != this.$store.state.musicListId){
                //将歌单传到veux
                this.$store.commit("updateMusicList", {
                    musicList: this.musicListDetail.tracks,
                    musicListId: this.musicListDetail.id
                })
            }
        },
        //评论翻页
        commentPageChange(page){
            this.currentCommentPage = page;
            this.getMusicListComment();
        },
        //播放全部按钮
        playAll(ids){
             //将musicId提交到vuex中
             this.$store.commit("updateMusicId", ids[0].id);
             if(this.musicListDetail.id != this.$store.state.musicListId){
                //将歌单传到veux
                this.$store.commit("updateMusicList", {
                    musicList: this.musicListDetail.tracks,
                    musicListId: this.musicListDetail.id
                })
            }
        },
        //点击收藏
        async clickSub(){
            this.isSub = !this.isSub;
            let timestamp = Date.parse(new Date());
            await this.$http.get('/playlist/subscribe', {
                params: {
                id: this.$route.params.id,
                t: this.isSub ? 1 : 2,
                timestamp,
                }
            });

            this.getUserMusicList();
        },
        async getUserMusicList(){
            let timestamp = Date.parse(new Date());
            this.userInfo = 
                window.localStorage.getItem("userInfo") &&
                JSON.parse(window.localStorage.getItem("userInfo"));
            let res = await this.$http.get('/user/playlist', {
                params: {
                uid: this.userInfo.userId,
                timestamp,
                }
            });
            //console.log(res);
            res = res.data.playlist;
            let index = res.findIndex((item) => item.subscribed == true);
            console.log(index)
            this.collectedMUsicList = res.slice(index);
            this.$store.commit("updateCollectedMusicList", this.collectedMUsicList);
        },
        //
        getisSub(){
            this.isSub = this.$store.state.collectedMusicList.find(
                (item) => this.musicListDetail.id == item.id
            );
            //console.log(this.isSub)
        }
    },
    created () {
        
    },
    async mounted () {
        await this.getMusicListDetail();
        await this.getisSub();
    },
    filters: {
        showDate(value){
            const date = new Date(value);
            //格式化
            return formatDate(date, "yyyy-MM-dd");
        },
        handleNum,
    },
    watch: {
        "$store.state.collectedMUsicList"(current, last){
            if(last.length != 0){
                this.getisSub();
            }
        },
        '$route'(){
            this.getMusicListDetail();
            this.getUserMusicList();
            this.getisSub();
        }
    },
}
</script>
<style scoped>
.musiclistdetail{
    width: 100%; 
}
.listinfo{
    display: flex;
    padding: 25px 15px;
    align-items: center;
}
.listavatar{
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 10px;
    margin-right: 15px;
}
.listavatar img{
    width: 100%;
}
.title{
    display: flex;
    align-items: center;
}
.titletag{
    font-size: 12px;
}
.user{
    display: flex;
    align-items: center;
    margin-top: 8px;
    font-size: 12px;
}
.rigth{

    width: calc(100vw - 400px);
    padding-left: 10px;
}
.useravater{
    width: 25px;
    height: 25px;
    margin-right: 8px;
}
.useravater img{
    width: 100%;
    border-radius: 50%;
}
.username{
    color: #6191c2;
}
.createtime{
    transform: scale(0.9);
}
.button{
    display: flex;
    margin: 8px 0 0 -5px;
}
.buttonitem{
    font-size: 12px;
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    transform: scale(0.9);
}
.buttonitem i{
    font-size: 12px;
    margin-right: 3px;
    transform: scale(0.9);
}
.playall{
    background-color: #ec4141;
    color: #fff;
}
.tags{
    margin: 8px 0 0 -30px;
    display: flex;
    font-size: 12px;
    transform: scale(0.9);
}
.tagitem{
    color: #6191c2;
    margin-right: 5px;
}
.otherinfo{
    margin: 5px 0 0 -30px;
    display: flex;
    font-size: 12px;
    transform: scale(0.9);
}
.musicnum{
    margin-right: 13px;
}
.desc{
    margin: 5px 0 0 -30px;
    font-size: 12px;
    transform: scale(0.9);
    /* 超出显示省略号 */
    text-overflow: ellipsis;
    /* 文本不会换行，直到遇到<br> */
    white-space: nowrap;
    overflow: hidden;
}
.musiclist{
    /* 上 左右 下*/
    margin: -15px 15px 0;
}
.page{
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
}
</style>