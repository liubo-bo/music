<template>
    <div class="registered">
        <el-dialog
            :visible.sync="isDialogShow"
            width="400px"
            @close="closeRegistered"
            append-to-body
            custom-class="registeredDialog"
            >
            <div class="registeredcontainer">
                <div class="registeredinfo">
                    <img src="@/assets/img/registered.png" alt="">
                </div>
                <!-- 1 -->
                <el-form class="form" :model="userInfo" v-if="currentStep == 0">
                    <el-form-item>
                        <el-input 
                            class="mobile"
                            v-model="userInfo.mobile" 
                            placeholder="请输入手机号"
                            size="mini"
                            prefix-icon="el-icon-mobile-phone"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input 
                            class="password"
                            v-model="userInfo.password" 
                            placeholder="请输入密码"
                            size="mini"
                            prefix-icon="el-icon-lock"
                        ></el-input>
                        <div class="tip">
                            密码8~20位，至少包含字母/数字/字符2种组合
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            @click="submitCount"
                            size="small"
                            :isloading="isButtonLoading"
                        >注册</el-button>
                    </el-form-item>
                </el-form>

                <!-- 2 -->
                <el-form class="form" v-else-if="currentStep == 1">
                    <el-form-item class="codeinput">
                        <el-input 
                            class="mobile"
                            prefix-icon="el-icon-key"
                            size="small"
                            v-model="code"
                            placeholder="请填写验证码"
                        ></el-input>
                        <div class="codebuttoncontainer">
                            <div class="codebutton" v-if="!isCountDownShow">
                                获取验证码
                            </div>
                            <div class="countdown" v-else>{{countDown}}
                                <span>s</span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="submitCode" size="small" :loading="isButtonLoading">下一步</el-button>
                    </el-form-item>
                </el-form>

                <el-form class="form" v-else-if="currentStep == 2">
                    <el-form-item>
                        <el-input 
                            v-model="userInfo.nickname"
                            class="mobile"
                            size="small"
                            placeholder="请填写昵称"
                            prefix-icon="el-icon-user"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            size="samll"
                            :loading="isButtonLoading"
                            @click="finishRegistered"
                        >完成注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
           
        </el-dialog>
    </div>    
</template>
<script>

let timer;
export default {
    props: {
        isDialogShow: {
            type: Boolean,
            default(){
                return false;
            }
        }
    },
    data () {
        return {
            userInfo:{
                mobile: "",
                password: "",
                nickname: "",
            },
            //当前注册步骤索引
            currentStep: 0,
            //是否显示倒计时
            isCountDownShow: false,
            //倒计时时长
            countDown: 60,
            //按钮是否正在加载
            isButtonLoading: false,
            code: "",
        }
    },
    methods: {
        //发生验证码
        async getCode(){
            let res = await this.$http.get('/captcha/sent', {
                params: {
                   phone: this.userInfo.mobile
                }
            });
            //console.log(res);
            if(res.data.code == 200){
                //倒计时开始
                this.countDown = 60;
                this.isCountDownShow = true;
                timer = setInterval(()=>{
                   if(this.countDown == 0){
                    clearTimeout(timer);
                    this.isCountDownShow = false;
                    return;
                   }
                   this.countDown--;
                },1000);
            } else {
                this.$message.error(res.data.message);
            }
        },
        //点击注册
        async submitCount(){
            this.isButtonLoading = true;
            if(this.userInfo.password.length < 8 || this.userInfo.mobile.length != 11){
                this.$message.error("手机或密码格式错了！");
                this.isButtonLoading = false;
                return;
            }
            //验证手机号是否存在
            let verifyMobie = await this.$http.get('/cellphone/existence/check', {
                params: {
                    phone: this.userInfo.mobile,
                }
            });
            console.log(verifyMobie);
            //如果手机号不存在 发生验证码
            if(verifyMobie.data.exist !== 1){
                await this.getCode();
                this.isButtonLoading = false;
                //进入步骤2
                this.currentStep = 1;
            } else {
                this.isButtonLoading = false;
                this.$message.warning("您已经注册过了哦");
                //关闭当前注册科
                this.$emit("closeRegistered");
            }
        },
        //提交验证码
        async submitCode(){
            this.isButtonLoading = true;
            if(this.code.length != 4){
                this.isButtonLoading = false;
                this.$message.error("验证码格式错误");
                return;
            }

            let verifyCode = await this.$http.get('/captcha/verify', {
                params: {
                    phone: this.userInfo.mobile,
                    captcha: this.code,
                }
            }).catch((err)=>{
                this.$message.error(err.response.data.message);
                this.isButtonLoading = false;
            });
            if(!verifyCode){
                return;
            }
            this.isButtonLoading = false;
            //console.log(verifyCode);
            if(verifyCode.data.data){
                //验证通过，进入步骤3
                this.currentStep = 2;
            }
        },
        //完成注册
        async finishRegistered(){
            this.isButtonLoading = true;
            let res = await this.$http.get('/register/cellphone', {
                params: {
                    captcha: this.code,
                    phone: this.userInfo.mobile,
                    password: this.userInfo.password,
                    nickname: this.userInfo.nickname,
                }
            }).catch((err)=>{
                this.$message.error(err.response.data.message);
                this.isButtonLoading = false;
            });
            if(!res){
                return;
            }
            this.isButtonLoading = false;
            if(res.data.code == 200){
                this.$message.success("注册成功");
                this.$emit("closeRegistered");
            } else {
                this.$message.error("注册失败");
            }
        },
        //关闭注册科
        closeRegistered(){
            //重置所有数据
            this.userInfo = {
                mobile: "",
                password: "",
                nickname: "",
            };
            this.currentStep = 0;
            this.code = "",
            this.isButtonLoading = false;
            this.isCountDownShow = false;
            this.countDown = 60;
            
            this.$emit("closeRegistered");
        }
    }
}
</script>
<style scoped>
.registeredcontainer{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}
.registeredinfo{
    font-weight: bold;
    text-align: center;
    margin: 10px 0;
}
.el-input>>>.el-input__inner{
  background-color: #fff !important;
  color: #000 !important;
  border-radius: 15px;
}
.form{
    width: 80%;
    text-align: center;
}
.registeredinfo{
    width: 50%;
}
.registeredinfo img{
    width: 100%;
}
.el-button{
    width: 100%;
    background-color: red;
    color: #fff;
}
.tip{
    font-size: 12px;
}
</style>