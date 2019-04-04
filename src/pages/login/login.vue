<template>
  <div class="login" v-title data-title="登录">
    <div class="login_logo">
			<img class="logo" src="../../assets/logo.png" />
		</div>
    <div class="login_container">
      <div class="login_container_shouji">
        <i class="iconfont icon-shouji"/>
        <input type="tel"
          name=""
          id=""
          value=""
          v-model="phoneNumber"
          v-verify="phoneNumber"
          maxlength="11" style="height: 35px;font-size: 16px">
      </div>
      <div class="login_container_jianpan">
        <i class="iconfont icon-jianpan"/>
        <input type="tel"
          name=""
          id=""
          value=""
          v-model="verfifyCode"
          v-verify="verfifyCode"
          maxlength="6"  style="height: 35px;font-size: 16px">
        <button :disabled="!verificationDisabled || time > 0"
          @click.stop.prevent="getVerification" class="fontSize" style="padding-top: 10px">{{ verification }}</button>
      </div>

    </div>
    <div class="login_footer">
      <div class="login_footer_agreement">
        点击登录，即表示您同意用户协议
        <!--<router-link to="/agreement">用户协议</router-link>-->
      </div>
      <mt-button class="loginButton"
        type="primary"
        size="large"
        :disabled="loginDisabled"
        @click="login">登录</mt-button>
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
      return this.time > 0 ? this.time + 's后重新获取' : '获取验证码';
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
  .fontSize {
    font-size: 16px;
  }
.login {
  background-color: #FFFFFF;
  padding-top: 20px;
  .login_logo {
    width: 200px;
    margin: 1px auto;
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
      margin-left: 10px;
      font-size: 16px;
    }
    input:focus {
      outline: none;
    }
    .login_container_shouji {
      padding: 10px;
      border-bottom: 1px solid rgb(245, 246, 245);
      .icon-shouji {
        font-size: 20px;
      }
      input {
        width: 80%;
      }
    }
    .login_container_jianpan {
      padding: 10px;
      border-bottom: 1px solid rgb(245, 246, 245);
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
    padding: 15px;
    .login_footer_agreement {
      text-align: center;
      font-size: 16px;
      color: grey;
      a {
        color: rgb(251, 0, 0);
        text-decoration: none;
      }
    }
    .mint-button {
      margin-top: 15px;
    }
    /*.center-link {
				margin-top:10px;
				text-align:center;
			}*/
/*
    .loginButton {
      background: rgb(251, 0, 0);
    }
    .loginButton:disabled {
      background: rgba(251, 0, 0, 0.5);
    }
    */
  }
}
</style>
