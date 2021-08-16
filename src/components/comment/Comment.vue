<template>
    <div class="hotcomments">
        <!-- 评论框 -->
        <div 
            class="comments"
            v-if="commentType != '' && commentType != 'music' && isHotComment"
        >
            <el-input 
                type="textarea"
                class="commentarea" 
                placeholder="留下你的评论"
                maxlength="140"
                v-model="commentInput"
                @input="inputComment"
            ></el-input>
            <div class="submitcommentbutton">
                <el-button 
                    size="mini"
                    round
                    class="submitcommen"
                    @click="commentMode ? submitComment() : submitFloorComment()"
                >评论</el-button>
            </div>
        </div>
        <!-- 音乐评论 -->
        <div 
            class="musiccomment"
            v-else-if="commentType != '' && commentType == 'music'"
        >
            <el-button type="primary" 
                class="commentCardSwitch" 
                size="mini"
                @click="openDialog"
                round>
                <i class="iconfont "></i>发表我的音乐评论
            </el-button>
            <el-dialog
                title=""
                :visible="isCommentDialogShow"
                width="400px"
                class="commentdialog"
                append-to-body
                @close="closeCommentDialog"
                >
                <div class="musictitle">歌曲：{{ musicTitle }}</div>
                <el-input 
                    type="textarea"
                    v-model="commentInput" 
                    placeholder="留下你的评论"
                    maxlength="140"
                    class="commentarea musiccommentarea"
                    ></el-input>
                <div class="submitcommentbutton">
                    <el-button 
                        class="submitcomment musicsubmitcomment"
                        @click="commentMode ? submitComment() : submitFloorComment()">
                    评论</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 评论模块 -->
        <div class="commentheader"><slot name="title"></slot></div>
        <div class="commentitem" v-for="(item, index) in comments" :key="index">
            <div class="commentcreatoravatar">
                <img :src="item.user.avatarUrl" alt="">
            </div>
            <!-- 评论信息 -->
            <div class="commentmain">
                <div class="commentcontent">
                    <span class="commentusernickname">{{ item.user.nickname }}: </span>
                    <span>{{item.content}}</span>
                </div>
                <!-- 评论回复 -->
                <div class="replied">
                    <div 
                        class="replieditem"
                        v-for="(item1, index1) in item.beReplied"
                        :key="index1"
                        >
                        <span class="replieduser">@{{item1.user.nickname}}: </span>
                        <span class="repliedcontent">{{item1.content}}</span>
                    </div>
                </div>
                <div class="commentbottom">
                    <div class="commentcreatedtime">
                        {{item.time | showDate}}
                    </div>
                    <div class="commentbuttons">
                        <div>
                            <i class="iconfont icon-good">{{item.likedCount}}</i>
                        </div>
                        <div>
                            <i class="iconfont icon-zhuanfa"></i>
                        </div>
                        <div>
                            <i class="iconfont icon-pinglun"
                                @click="floorComment(item.commentId, item.user.nickname)"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {formatDate} from "@/plugin/utils"
export default {
    filters: {
        showDate(value){
            const date = new Date(value);
            return formatDate(date, "yyyy-MM-dd");
        }
    },
    props: {
        isHotComment: {
            type: Boolean,
            default() {
                return true;
            }
        },
        commentType: {
            type: String,
            default() {
                return "";
            }
        },
        comments: {
            type: Array,
            default() {
                return [];
            }
        },
        commentId: {
            type: String,
            default() {
                return "";
            }
        },
        musicTitle: {
            type: String,
            default() {
                return "";
            }
        }
    },
    data () {
        return {
            commentInput: "",
            //是否显示评论dialog
            isCommentDialogShow: false,
            //评论模式 true是常规， false是楼层评论
            commentMode: true,
            //用于暂存楼层评论的id
            floorCommentId: "",
            //楼层回复前几个字的长度
            floorCommentInputlength: 0,

        }
    },
    methods: {
        //监听input输入框状态
        inputComment(){
            console.log(1);
        },
        getcommenttype(commenttype){
            let type;
            switch(commenttype){
                case "album":
                    type = 3;
                    break;
                case "musicList":
                    type = 2;
                    break;
                case "music":
                    type = 0;
                    break;
                case "mv":
                    type = 1;
                    break;
                case "video":
                    type = 5;
                    break;
            }
            return type;
        },
        //提交普通评论
        async submitComment(){
            if(!this.$store.state.isLogin){
                this.$message.warning("需要登录爱能评论哦！");
                return;
            }
            //判断内容空
            if(this.commentInput == ""){
                this.$message.warning("评论不能为空哦！");
                return;
            }
            //判断评论类型
            //console.log(this.commentId)
            let typecopy = this.getcommenttype(this.commentType);
            let res = await this.$http.get('/comment', {
                params: {
                    t: 1,
                    id: this.commentId,
                    type: typecopy,
                    content: this.commentInput
                }
            }).catch((err)=>{
                this.$message.error(err.response.data.msg)
            });
            if(!res){
                return;
            }
            //console.log(res);
            if(res.data.code == 200){
                //清空文本框，关闭卡片
                if(this.currentType == 'music'){
                    this.isCommentDialogShow = false;
                }
                this.commentInput = "";
                this.$emit("getComment");
                this.$message.success("评论成功!");
            } else {
                this.$message.error("评论失败！");
            }
        },
        //提交楼层评论按钮触发
        async submitFloorComment(){
            if(!this.$store.state.isLogin){
                this.$message.warning("需要登录爱能评论哦！");
                return;
            }
            //判断内容空
            if(this.commentInput == ""){
                this.$message.warning("评论不能为空哦！");
                return;
            }
            //判断评论类型
            //console.log(this.commentId)
            let typecopy = this.getcommenttype(this.commentType);
            let str = this.commentInput;
            let res = await this.$http.get('/comment', {
                params: {
                    t: 2,
                    id: this.commentId,
                    type: typecopy,
                    content: str.substring(this.floorCommentInputlength),
                    commentId: this.floorCommentId
                }
            }).catch((err)=>{
                this.$message.error(err.response.data.msg)
            });
            if(!res){
                return;
            }
            //console.log(res);
            if(res.data.code == 200){
                //清空文本框，关闭卡片
                if(this.currentType == 'music'){
                    this.isCommentDialogShow = false;
                }
                this.commentInput = "";
                this.commentMode = true;
                this.floorCommentInputlength = 0;
                this.floorCommentId = "";
                this.isCommentDialogShow = false;
                this.$emit("getComment");
                this.$message.success("评论成功!");
            } else {
                this.$message.error("评论失败！");
            }
        },
        //点击楼层评论按钮定位到评论框,commentId是评论id，nick是当前用户name
        floorComment(commentId, nickName){
            // console.log(commentId, nickName);
            // 如果isHotComment为false，说明没有文本框
            if(this.isHotComment == false){
                this.$emit("transToHotComment", { commentId, nickName });
            }
            if(this.commentType != 'music'){
                //让父元素移动到评论框
                this.$emit("scrollToComment");
                // 让评论框获得焦点
                let input = document.querySelector('.commentarea');
                // 阻止focus定位
                input.children[0].focus({ preventScroll: false });
            } else {
                this.openDialog();
            }
            this.commentInput = "回复" + nickName + " :";
            this.floorCommentInputlength = this.commentInput.length;
            //将评论模式改为楼层评论
            this.commentMode = false;
            this.floorCommentId = commentId;
        },
        //music评论打开dialog
        openDialog(){
            this.isCommentDialogShow = !this.isCommentDialogShow;
        },
        //关闭评论框
        closeCommentDialog(){
            this.isCommentDialogShow = !this.isCommentDialogShow;
        }
    }

}
</script>
<style scoped>
.commentheader{
    font-size: 14px;
    font-weight: 600;
    padding: 10px 0;
}
.commentitem{
    display: flex;
    margin: 5px 0;
    padding: 10px 0 20px;
    font-size: 12px;
    border-bottom: 1px solid #eee;
}
.commentcreatoravatar{
    width: 35px;
    height: 35px;
    margin: 0 10px 0 0;
}
.commentcreatoravatar img{
    width: 100%;
    border-radius: 50%;
}
.commentmain{
    width: calc(100% - 50px);
}
.commentusernickname{
    color: #5a8ab9;
}
.replied{
    background-color: #f4f4f4;
    border-radius: 5px;
}
.replieditem{
    padding: 7px 10px;
    line-height: 20px;
    margin-top: 5px;
}
.replieduser{
    color: #5a8ab9;
}
.commentbottom{
    margin-top: 5px;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: space-between;
    color: rgb(172,172,172);
}
.commentbuttons{
    margin-right: 8px;
    display: flex;
    align-items: center;
}
.commentbuttons div{
    padding: 0 8px;
    transform: scale(0.85);
}
.commentbottons div:nth-child(1){
    font-size: 14px;
}
.submitcommentbutton{
    width: 100%;
    text-align: right;
}
.submitcommen{
    margin-top: 3px;
}
</style>