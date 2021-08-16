<template>
     <div class="main-header">
      <div class="left">
        <img src="@/assets/img/logo.png" alt="">
      </div>
      <div class="center">
        <div class="button">
          <i class="iconfont el-icon-arrow-left" @click="goBack()"></i>
          <i class="iconfont el-icon-arrow-right" @click="goForward()"></i>
        </div>
        <div class="search">
            <el-popover
              placement="bottom"
              width="300"
              v-model="isSearchPopShow"
              popper-class="searchPop"
              trigger="focus"
              >
                <el-input
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  size="mini"
                  slot="reference"
                  @input="inputSearch"
                  @keyup.enter.native="onSubmit"
                  v-model="searchInput"
                ></el-input>
                <!-- 热搜榜 -->
                <div class="hotsearch">
                  <div class="hotsearchtitle">热搜榜</div>
                  <div 
                    class="hotsearchitem"
                    v-for="(item, index) in hotSearchList"
                    :key="index"
                    :class="index < 3 ? 'active':''"
                    @click="clickHotSearchItem(item.searchWord)"
                    >
                      <div class="hotsearchindex">{{index + 1}}</div>
                      <div class="hotsearchinfo">
                        <div class="hotsearchword">{{item.searchWord}}</div>
                        <div class="hotsearchcontent">{{item.content}}</div>
                      </div>
                  </div>
                </div>
            </el-popover>
        </div>
      </div>
      <div class="right">
        <div class="style" @click="changeStyle">
            <i class="iconfont icon-yifu"></i>
        </div>
        <div class="user">
          <div class="avatar">
            <!-- 登录框 -->
           <el-popover
              placement="bottom"
              width="330"
              trigger="click"
              v-if="!userInfo.avatarUrl"
              >
                <el-form
                  label-width="80px"
                  label-position="right"
                  size="mini"
                >
                  <el-form-item
                    label="手机号码:"
                    size="mini"
                    label-width="100px"
                    required
                  >
                    <input type="text" v-model="loginForm.phonenum">
                  </el-form-item>
                  <el-form-item
                    label="密码:"
                    size="mini"
                    label-width="100px"
                    required
                  >
                    <input type="password" v-model="loginForm.password">
                  </el-form-item>
                  <div class="loginButton">
                    <el-button type="danger" size="mini" @click="login">登录</el-button>
                  </div>
                  <div class="regEnter" @click="isRegisteredShow = true">注册</div>
                </el-form>
                <img src="@/assets/img/test.jpg" alt="" slot="reference"
                  @click="isPopoverShow = !isPopoverShow">
            </el-popover>

            <!-- 已登录状态 -->
            <el-popover
              class="loginimg"
              placement="bottom"
              trigger="click"
              v-else  
              >
                <img :src="userInfo.avatarUrl" alt="" slot="reference">
                <div class="loginButton">
                  <el-button type="info" size="mini" class="logout" @click="logout">退出登录</el-button>
                </div>
            </el-popover>
          </div>
          <div class="username" v-if="userInfo.nickname">
            {{userInfo.nickname}}
          </div>
          <div class="username" v-else>点击头像登录</div>
        </div>
      </div>
      <!-- 注册-组件 -->
      <registered
        :isDialogShow="isRegisteredShow"
        @closeRegistered="closeRegistered"
      >
      </registered>
    </div>
</template>
<script>
import Registered from "@/components/registered/Registered.vue"
let timer;

export default {
    components: {
      Registered,
    },
    data() {
      return {
        loginForm: {
          phonenum:"",
          password:"",
        },
        userInfo: {},
        isPopoverShow: false,
        searchInput: "",
        // 热搜列表数据
        hotSearchList: [],
        // 是否显示搜索pop
        isSearchPopShow: false,
        // 搜索框列表
        searchSuggestList: [],
        //显示注册组件
        isRegisteredShow: false,
        ischeckStyle: false,
        //style索引
        stylenum: 0,
      };
    },
    mounted () {
      
    },
    methods: {
      async loginByCellphone(){
        //const res = await this.$http.get(`/login/cellphone?phone=${this.loginForm.phonenum}&password=${this.loginForm.password}`);
        
        const res = await this.$http.get('/login/cellphone',{
          params: {
            phone: this.loginForm.phonenum,
            password: this.loginForm.password
          }
        })
        //登陆成功
        if(res.data.code == 200){
          //将请求到的个人用户信息存入localstorage
          window.localStorage.setItem(
            "userInfo",
            JSON.stringify(res.data.profile)
          );
         this.userInfo = res.data.profile;
         this.isPopoverShow = false;
         this.$message.success('登陆成功');
        this.$store.commit("updateLoginState");
         console.log('登陆成功！');
         //刷新页面
         this.router.go(0);
        }else{
          console.log('登录失败');
        }
      },
      login(){
        this.loginByCellphone();
      },
      logout(){
        this.userInfo = {};
        window.localStorage.setItem("userInfo", "");
        this.$store.commit("updateLoginState");
        this.$message.success("退出成功！");
        this.$router.go(0);
      },
      goForward(){
        this.$router.go(1);
      },
      goBack(){
        this.$router.go(-1);
      },
      //搜索框的回调
      inputSearch(e){
        clearTimeout(timer);
        if(e != ""){
          timer = setTimeout(()=>{
            this.getSearchSuggest(e);
          },500);
        } else {
          this.searchSuggestList = {};
          return;
        }
      },
      // 获取搜索建议
      async getSearchSuggest(word){
        let res = await this.$http.get('/search/suggest', {
          params: {
            keywords: word,
          }
        });
       // console.log(res);
        this.searchSuggestList = res.data.result;
      },
      //获取热搜列表
      async getHotSearch(){
        let res = await this.$http.get('/search/hot/detail');
        //console.log(res);
        this.hotSearchList = res.data.data;
      },
      // 点击热搜榜的歌
      clickHotSearchItem(searchWord){
        this.searchInput = searchWord;
        this.goSearch();
      },
      //搜索按下回车
      onSubmit(e){
        if(e.keyCode == 13 && this.searchInput != ""){
          this.goSearch();
        }
      },
      //搜索跳转
      goSearch(){
        this.isSearchPopShow = false;
        this.$router.push({ name: "search", params: { id: this.searchInput } })
      },
      //关闭注册框
      closeRegistered(){
        this.isRegisteredShow = false;
      },
      //style
      changeStyle(){
        this.$store.commit("changeStylenum");
      }
    },
    created () {
      this.getHotSearch();
      //如果登录成功
      if(window.localStorage.getItem("userInfo")){
        this.$store.commit("updateLoginState");
        //从locals中获取userinfo
        this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      }
      console.log(this.$store.state.isLogin)
    }
}
</script>
<style scoped>
.main-header{
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    position: relative;
}
.left{
  width: 110px;
  margin: 0 50px 0 10px;
}
.left img{
  width: 100%;
}
.center{
  display: flex;
  align-items: center;
}
.button i{
  background-color: #e13e3e;
  font-size: 12px;
  color: #fff;
  margin: 0 5px;
  padding: 5px;
  border-radius: 50%;
}
.right{
  position: absolute;
  display: flex;
  right: 50px;
  line-height: 50px;
  align-items: center;
}
.user{
  display: flex;
}
.avatar{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 7px;
  cursor: pointer;
}
.avatar img{
  width: 100%;
}
.username{
  font-size: 12px;
  color: #fff;
  width: 100px;
  line-height: 30px;
}
.loginButton{
  width: 100%;
  text-align: center;
}
.loginButton .el-button{
  width: 200px;
}
.regEnter{
  width: 100%;
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
}
.el-input{
  width: 80%;
  color: #fff;
}
/* .el-input--mini .el-input__inner{
  height: 30px !important;
  transform: scale(0.9);
} */
.el-input>>>.el-input__icon{
  color: #fff;
  transform: scale(0.9);
}
/* .el-input>>>.el-input--mini{
  color: #fff;
  transform: scale(0.9);
} */
.el-input>>>.el-input__inner{
  background-color: #e13e3e !important;
  color: #fff !important;
  border-radius: 15px;
  border: none;
}
.hotsearchtitle{
  margin: 10px 15px;
  padding-left: 15px;
}
.hotsearchitem{
  display: flex;
  padding: 5px 5px 10px 15px;
  align-items: center;
  cursor: pointer;
}
.hotsearchitem:hover{
  background-color: #f2f2f2;
}
.hotsearchindex{
  margin-right: 10px;
  color: #aaa;
}
.hotsearchword{
  font-size: 12px;
}
.hotsearchcontent{
  font-size: 12px;
  color: #666;
  transform: scale(0.9) translateX(-5%);
}
.active .hotsearchindex{
color: #e13e3e;
}
.active .hotsearchword{
  font-weight: 600;
}
.style i{
  font-size: 20px;
  margin-right: 10px;
  background-color: wheat;
  border-radius: 10px;
}
</style>