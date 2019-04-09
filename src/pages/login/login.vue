<template>
  <div class="login" v-title data-title="登录">
    <div class="login_logo">
      <img class="logo" src="../../assets/logo.png" />
    </div>
    <div class="login_container">
      <div class="login_container_shouji">
        <div class="phoneIcon">
          <img src="../../assets/icon-phonenumber.png"/>
        </div>

        <div class="inputDiv">
          <input type="tel"
                 name=""
                 id=""
                 value=""
                 placeholder="请输入手机号"
                 v-model="phoneNumber"
                 v-verify="phoneNumber"
                 maxlength="11" >
        </div>
      </div>
      <div class="login_container_jianpan">
        <div class="phoneIcon">
          <img src="../../assets/icon-password.png"/>
        </div>
        <div class="inputDiv">
          <input type="tel"
                 name=""
                 id=""
                 value=""
                 placeholder="请输入验证码"
                 v-model="verfifyCode"
                 v-verify="verfifyCode"
                 maxlength="6" >

          <button :disabled="!verificationDisabled || time > 0"
                  @click.stop.prevent="getVerification" class="verifyBtn">{{ verification }}</button>

        </div>
      </div>

    </div>
    <div class="login_footer">
      <div class="bind-btn" @click.stop="login" >
        登录
      </div>

      <div class="login_footer_agreement">
        点击登录，即表示您同意用户协议
        <!--<router-link to="/agreement">用户协议</router-link>-->
      </div>

    </div>
    <div style="height: 150px">

    </div>
  </div>
</template>

<script type="application/ecmascript">
  import { LOGIN } from '@/store/types';
  import {sendVerifyCode,sendLogin} from '../../js/api';

  export default {
    name: '',
    data() {
      return {
        phoneNumber: '',
        time: 0,
        verfifyCode: '',
        verifyCodeTip:'',//验证码提示,
      };
    },
    verify: {
      phoneNumber: [
        {
          test: 'required',
          message: '手机号码不能为空'
        },
        'mobile'
      ],
      verfifyCode: [
        {
          test: 'required',
          message: '验证码不能为空'
        },
        {
          test: /^(\+|-)?\d+($|\.\d+$)/,
          message: '请正确输入验证码'
        },
        {
          minLength: 6
        }
      ]
    },
    computed: {
      verification() {
        return this.time > 0 ? this.time + 's后重试' : '获取验证码';
      },
      verificationDisabled() {
        return this.$verify.validate('phoneNumber', true);
      },
      loginDisabled() {
        return !(
          this.verificationDisabled && this.$verify.validate('verfifyCode', true)
        );
      }
    },
    methods: {
      timer() {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        }
      },
      getVerification() {
        this.time = 60;
        this.timer();
        //sendVerifyCode();
        //var result =  sendVerifyCode(this.phoneNumber);
        this.axios.post("/sendVerifyCode", {phone: this.phoneNumber})
          .then(response => {
          console.log("ok" + response.data)

      })
      .catch(error => {
          console.log("error" + error)
      })
      },
      login() {
        if (this.$verify.check()) {
          console.log("sendLogin")
          this.axios.post("/login", {"phone": this.phoneNumber,
              "code": this.verfifyCode,})
            .then(response => {
            console.log("ok" + response);
          this.$router.push('/userInfo');
          this.$store.dispatch(LOGIN, 'token');
        })
        .catch(error => {
            console.log("error" + error)
        })
        } else {
          console.log("error")
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import 'src/css/style';


  .login {
    background-color: #FFFFFF;
    padding-top: r(30);

  .login_logo {
    width: 200px;
    margin: 0 auto;
  .logo {
    width: 100%;
  }
  }
  .login_container {
  div, p, span {
    font-family: Helvetica Neue, Tahoma, Arial;
  };
  input {
    border: none;
    /*border-left: 1px solid grey;*/
    margin-left: r(40);
    font-size: r(32);
  }
  input:focus {
    outline: none;
  }
  .login_container_shouji {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid rgb(245, 246, 245);
  .phoneIcon {
    width: 10%;
  img {
    width: r(40);
  }
  }
  .inputDiv {
    height: r(60);
    font-size: r(32)
  }
  .icon-shouji {
    font-size: 20px;
  }
  input {
    width: 80%;
  }
  }
  .login_container_jianpan {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid rgb(245, 246, 245);
  .phoneIcon {
    width: 10%;
  img {
    width: r(40);
  }
  }
  .inputDiv {
    height: r(60);
    font-size: r(32);
  .verifyBtn{
    padding-top: r(10);
    font-size: r(32);
  }
  }
  .icon-jianpan {
    font-size: 20px;
  }

  button {
    color: rgb(251, 0, 0);
    border: none;
    background-color: inherit;
    float: right;
  }
  button:disabled {
    color: rgba(251, 0, 0, 0.5);
  }
  }
  }
  .login_footer {
    padding: 0px;
  .bind-btn{
    width:r(690);
    height:r(90);
    margin:r(20) auto 0;
    border-radius:r(6);
    background: #095795;
    font-size:r(34);
    color:#fff;
    text-align:center;
    line-height:r(90);
  }
  .login_footer_agreement {
    padding-top: r(30);
    text-align: center;
    font-size: r(28);
    color: grey;
  a {
    color: rgb(251, 0, 0);
    text-decoration: none;
  }
  }

  }
  }
</style>
