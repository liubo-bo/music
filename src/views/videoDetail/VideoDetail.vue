<template>
    <div class="videodetail">
        <div class="left">
            <div class="title">
                {{ $route.params.type == "mv" ? "mv详情" : "视频详情" }}
            </div>
            <video 
                :src="videoUrl"
                class="videoplayer"
                width="496px"
                height="284px"
                controls
                :poster="$route.params.type == 'mv' ? videoInfo.cover : videoInfo.coverUrl"
            ></video>
            <!-- 视频详情 -->
            <div class="videoinfo">
                <div class="user">
                    <div class="avatar">
                        <img 
                            :src="
                                ($route.params.type == 'mv' 
                                ? videoInfo.artists[0].img1v1Url 
                                : videoInfo.avatarUrl) + '?param=100y100'" 
                            alt="233"
                        >
                    </div>
                    <div class="username">
                        {{
                            $route.params.type == "mv" 
                            ? videoInfo.artists[0].name
                            : videoInfo.creator.nickname
                        }}
                    </div>
                </div>
                <!-- 视频信息 -->
                <div class="videotitle">
                    {{$route.params.type == 'mv' ? videoInfo.name : videoInfo.title}}
                </div>
                <div class="otherinfo">
                    <div class="fabu">
                        发布：{{ $route.params.type == 'mv' 
                                ? videoInfo.publishTime
                                : videoInfo.publishTime | showDate
                        }}
                    </div>
                    <div class="bofang">
                        播放{{ $route.params.type == 'mv' 
                                ? videoInfo.playCount
                                : videoInfo.playTime | handleNum
                        }}
                    </div>
                </div>
                <div class="buttons">
                    <div class="buttonitem">
                        <i class="iconfont icon-good" :class="isLike ? 'red':''"></i>
                        {{ isLike ? "已赞":"赞" }}
                    </div>
                    <div class="buttonitem">
                        <i class="iconfont icon-xihuan" :class="isSub ? 'red':''"></i>
                        {{ isLike ? "已收藏":"收藏" }}
                    </div>
                    <div class="buttonitem">
                        <i class="iconfont icon-zhuanfa"></i>分享
                    </div>
                </div>
            </div>
            <!-- 视频评论 -->
            <div class="comment">
                <div class="title commenttitle">评论</div>
                <div class="commentlist"
                    v-if="comments.comments"
                    v-loading="isCommentLoading"    
                >
                    <!-- 精彩评论 -->
                    <comment
                        :comments="comments.hotComments"
                        :commentType="$route.params.type == 'mv' ? 'mv':'video'"
                        :commentId="$route.params.id + ''"
                        @scrollToComment="scrollToComment"
                        v-if="comments.hotComments"
                        @getComment="
                            $route.params.type == 'mv' 
                            ? getMvComment()
                            : getVideoComment()"
                        ref="hotComments"
                    ><div slot="title">精彩评论</div></comment>
                    <!-- 最新评论 -->
                    <comment
                        :comments="comments.comments"
                        :commentType="$route.params.type == 'mv' ? 'mv':'video'"
                        :commentId="$route.params.id + ''"
                        @scrollToComment="scrollToComment"
                        :isHotComment="comments.hotComments ? false : true"
                        @transToHotComment="
                            (info) => {
                                $refs.hotComments.floorComment(info.commentId, info.nickName)
                            }
                        "
                    ><div slot="title">最新评论</div></comment>
                    <div class="page">
                        <el-pagination
                            layout="prev, pager, next"
                            :total="comments.total"
                            background
                            small
                            :page-size="20"
                            :current-page="commentPage"
                            @current-change="commentPageChange"
                            >
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 相关推荐 -->
        <div class="right">
            <div class="title">相关推荐</div>
            <div 
                class="relatedvideoitem"
                v-for="(item, index) in relatedVideo"
                :key="index"
                @click="goToRelatedVideo(item.vid)"
                >
                <div class="relatedvideoitemcover">
                    <img :src="item.coverUrl + '?param=300y180'" alt="">
                    <div class="relatedvideoitemplaycount">
                        <i class="iconfont icon-shipin"></i>{{item.playTime | handleNum}}
                    </div>
                    <div class="relatedvideoitemtime">
                        {{item.durationms | handleMusicTime}}
                    </div>
                </div>
                <div class="relatedvideoiteminfo">
                    <div class="title">{{item.title}}</div>
                    <div class="creator">{{item.creator[0].userName}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {handleNum, handleMusicTime, formatDate } from '@/plugin/utils.js'
import Comment from '@/components/comment/Comment.vue'

export default {
    name: "videoDetail",
    components: {
        Comment
    },
    filters: {
        handleNum, 
        handleMusicTime,
        showDate(value){
            const date = new Date(value);
            return formatDate(date, "yyyy-MM-dd");
        }
    }, 
    data () {
        return {
            videoInfo: [],
            //video视频地址
            videoUrl: "",
            //video评论
            comments: [],
            //是否喜欢
            isLike: false,
            //是否收藏
            isSub: false,
            //当前评论页数
            commentPage: 1,
            //评论是否正在加载
            isCommentLoading: false,
            // 推荐视频信息
            relatedVideo: [],
        }
    },
    methods: {
        //请求video详情
        async getVideoDetail(){
            let res = await this.$http.get('/video/detail', {
                params: {
                    id: this.$route.params.id,
                }
            });
            //console.log(res);
            this.videoInfo = res.data.data
        },
        //请求推荐视频
        async getrelatedVideo(){
            let res = await this.$http.get('/related/allvideo', {
                params: {
                    id: this.$route.params.id,
                }
            });
            console.log(res);
            this.relatedVideo = res.data.data
        },
        // 请求video地址
        async getMvUrl(){
            let res = await this.$http.get('/video/url', {
                params: {
                    id: this.$route.params.id,
                }
            });
            //console.log(res);
            this.videoUrl = res.data.urls[0].url;
        },
        //请求video评论
        async getVideoComment(){
            let timestamp = Date.parse(new Date());
            this.isCommentLoading = true;

            let res = await this.$http.get('/comment/video', {
                params: {
                    id: this.$route.params.id,
                    offset: 20 * (this.commentPage - 1),
                    timestamp
                }
            });
            this.comments = res.data; 
            this.isCommentLoading = false;
            //console.log(res);
        },
        //位置定位到评论框
        scrollToComment(){
            let videoDetail = document.querySelector(".videoinfo");
            //let commentTitle = document.querySelector(".commenttitle");
            //console.log([videoDetail]);
            //console.log([commentTitle]);
            console.log('聚焦');
            videoDetail.scrollTo({
                behavior: "smooth",
                top: 200+ 'px',
            });
        },
        //点击评论翻页
        commentPageChange(page){
            this.commentPage = page;
            if(this.$route.params.type == 'video'){
                this.getVideoComment();
            }
            if(this.$route.params.type == 'mv'){
                //this.getVideoComment();
            }
        },
        //点击推荐视频
        goToRelatedVideo(id){
            this.$router.push({ name: "videoDetail", params: { id, type: "video" } });
        }

    },
    async created () {
        this.getrelatedVideo();
        if(this.$route.params.type == "video"){
            await this.getVideoDetail();
            this.getMvUrl();
            this.getVideoComment();
        }
        
    },
    watch: {
        '$route'(){
            // if(to !== from){
            //     this.$route.go(0);
            // }
            this.getrelatedVideo();
            if(this.$route.params.type == "video"){
                this.getVideoDetail();
                this.getMvUrl();
                this.getVideoComment();
            }
        }
    }
}
</script>
<style scoped>
.videodetail{
    display: flex;
    justify-content: center;
}
.left{
    width: 500px;
}
.left .title{
    font-weight: 600;
    color: #000;
    margin: 10px 0;
}
.videoplayer{
    background-color: black;
}
.user{
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.avatar{
    height: 40px;
    width: 40px;
    margin-right: 10px;
}
.avatar img{
    width: 100%;
    border-radius: 50%;
}
.otherinfo{
    display: flex;
    font-size: 12px;
    color: #aaa
}
.otherinfo div{
    margin: 10px 20px;
}
.videotitle{
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
}
.buttons{
    display: flex;
    font-size: 12px;
}
.buttonitem{
    padding: 5px 20px;
    border: 1px solid #aaa;
    border-radius: 20px;
    margin-right: 15px;
}
.page{
    text-align: center;
    padding-bottom: 10px;
}
.right{
    width: 300px;
}
.right .title{
    font-weight: 600;
    color: #000;
    margin: 10px 0;
}
.relatedvideoitemcover{
    width: 150px;
    position: relative;
    color: #fff;
    font-size: 12px;
    border-radius: 10px;
    overflow: hidden;
}
.relatedvideoitemcover img{
    width: 100%;
}
.relatedvideoitemplaycount{
    position: absolute;
    top: 0;
    right: 0;
    transform: scale(0.9);
}
.relatedvideoitemtime{
    position: absolute;
    bottom: 5px;
    right: 0;
}
.relatedvideoitem{
    display: flex;
    margin: 5px 0;
}
.relatedvideoiteminfo{
    width: 150px;
    font-size: 12px;
    padding-left: 5px;
}
.relatedvideoiteminfo .creator{
    color: #999;
    margin-top: 20px;
}
.relatedvideoiteminfo .title{
    font-weight: normal;
    font-size: 12px;
}
</style>