<template>
  <div class="bodyContainer" v-title data-title="GECA服务">
    <div class="info-box">
      <div class="info">
        <div class="user-head">
          <img   v-if="userInfo.photo" v-bind:src="userInfo.photo"/>
          <img  v-else src="../../assets/userPhoto.png"/>
        </div>
        <div class="name" :class="userInfo.mobile? 'set-pad':''">
          <p>{{userInfo.nickName}}</p>
          <p class="phone" v-if="userInfo.mobile">{{userInfo.mobile.substr(0,3)}}****{{userInfo.mobile.substr(-4)}}</p>
        </div>
      </div>
    </div>
    <div class="bind-tip-box" v-if="!userInfo.mobile">
      <div class="bind-btn" @click.stop="bindingPhone">绑定手机号</div>
      <ul class="tips">
        <li>为了给您提供更好的服务，请先绑定手机。
          绑定手机后您将获得以下服务：</li>
        <li>1、查看检测报告；</li>
        <li> 2、预约筛查、胃镜；</li>
      </ul>
    </div>
    <div class="nav-list" v-else>
      <ul class="list">
        <!--
        <li @click.stop="showBarcode">
          <div class="icon-box">
            <img src="../../assets/blue-id-badge.png" alt="">
          </div>
          <div class="fr-text">{{userInfo.gecaId}}<img class="imgArrow" src="../../assets/arrow.png"/></div>
          <div class="nav-name">GECA ID </div>
        </li>

        <li @click.stop="gotoReportList">
          <div class="icon-box">
            <img src="../../assets/blue-file-medical.png" alt="">
          </div>
          <div class="fr-text">{{reportCount}} <img class="imgArrow" src="../../assets/arrow.png"/></div>
          <div class="nav-name">检测报告</div>
        </li>
        -->
<!--
        <li>
          <div class="icon-box">
            <img src="../../assets/blue-hospital.png" alt="">
          </div>
          <div class="fr-text"></div>
          <div class="nav-name">我的预约</div>

          <div class="btn-control">
            <div class="btn-group">
              <div class="btn-first"><img src="../../assets/icon-adding.png"/>预约中 <p>0</p></div>
              <div class="vline"></div>
              <div class="btn-first"><img src="../../assets/icon-processing.png"/>预约成功 <p>0</p></div>
              <div class="vline"></div>
              <div class="btn-first"><img src="../../assets/icon-finish.png"/>已完成 <p>0</p></div>
            </div>
          </div>
        </li>
        -->
      </ul>

      <div class="examDiv"  v-if="!examId">
        <div class="title">
          <div style="text-align: center">2019年全国早期胃癌防治宣传月</div>
          <div style="text-align: center">筛查活动</div>
        </div>
        <div class="scan-btn" @click.stop="scan">扫码报名</div>
        <p class="examP">注:本次活动以线下现场报名为准</p>
      </div>
      <div v-else class="examDiv">
        <div class="examId">筛查编号: {{registerInfo.examId}}</div>
        <div class="cellDiv">
          <mt-cell title="姓名"><span >{{registerInfo.name}}</span></mt-cell>
          <mt-cell title="性别"><span >{{registerInfo.sex}}</span></mt-cell>
          <mt-cell title="出生日期"><span >{{registerInfo.birthday | formatDate}}</span></mt-cell>
          <mt-cell title="随访联系电话" v-if="registerInfo.contact"><span >{{registerInfo.contact}}</span></mt-cell>
          <mt-cell title="报名时间"><span >{{registerInfo.createDate | formatTime}}</span></mt-cell>
          <mt-cell></mt-cell>
        </div>
      </div>

    </div>

    <div class='popContainer' v-if="userInfo.gecaId" @click.stop="hideBarcode" ref="barcodeDiv" @touchmove.prevent>
      <div class="barcode" >
        <VueBarcode  :value="userInfo.gecaId" :options="barcode_option" tag="svg" ></VueBarcode>
      </div>
    </div>
  </div>
</template>

<script>
  import VueBarcode from '@xkeshi/vue-barcode';

  import {formatDate} from '../../js/mUtils'
  const wx = require("weixin-js-sdk");

  export default {
    data() {
      return {
        userInfo:{
          nickName:'',
          mobile:null,
          gecaId:null,
          photo:null
        },
        phone:Vue.$utils.getLocalStorage('phone'),
        reportCount:0,
        barcode_option:{
          displayValue: true, //是否默认显示条形码数据
          textPosition  :'bottom', //条形码数据显示的位置
          background: '#ffffff', //条形码背景颜色
          valid: function (valid) {
            console.log(valid)
          },
          width:'2px',//单个条形码的宽度
          height: '55px',
          fontSize: '20px', //字体大小
        },

        examId:Vue.$utils.getLocalStorage('examId'),
        hospitalId:Vue.$utils.getLocalStorage('hospitalId'),
        registerInfo:{},
      };
    },
    watch: {
      '$route.path': function (newVal, oldVal) {
        console.log("From " + oldVal + " to " + newVal);
        if(newVal === '/userInfo' && oldVal === '/login') {
          this.getUserInfo();
        }
      }
    },
    components: {
      VueBarcode
    },
    filters:{
      formatTime:function (time) {
        let obj = new Date(time);
        return formatDate(obj, 'yyyy-MM-dd hh:mm');
      },
      formatDate:function (time) {
        let obj = new Date(time);
        return formatDate(obj, 'yyyy-MM-dd');
      }
    },
    computed: {
      /*
       headImg() {
       return (
       this.userInfo.photo ||
       require('@/assets/userPhoto.png')
       );
       }*/
    },
    mounted() {
      if (this.$route.query.examId) {
        this.examId = this.$route.query.examId;
        Vue.$utils.setLocalStorage('examId', this.examId);
      }

      if (this.$route.query.hospitalId) {
        this.hospitalId = this.$route.query.hospitalId;
        Vue.$utils.setLocalStorage('hospitalId', this.hospitalId);


      }

      this.getUserInfo();
      this.getRegisterInfo();
    },
    methods: {
      getRegisterInfo() {
        if(this.examId) {
          if (this.hospitalId) {

          } else {
            this.hospitalId = null;
          }
          let url = '/f/getRegisterInfo';
          this.axios.post(url, {
              examId:this.examId,
              hospitalId: this.hospitalId
          })
            .then(response => {
            this.registerInfo = response.data;
        })
        }
      },

      scan() {
        let href =  encodeURIComponent(window.location.href.split('#')[0]);
        let url = "/jsapi?url=" + href;
        this.axios.get(url)
          .then(response => {
          console.log("ok" + response)

        wx.config({
          appId: response.data.appid, // 必填，公众号的唯一标识
          timestamp: response.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
          signature: response.data.signature,// 必填，签名，见附录1
          jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function () {
          console.log('ready=');
          wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              //alert("1" + res.resultStr);
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              console.log('result=' + result);
              //this.$router.replace("/register?" + result);
            }
          });
        })

      })
      },
      showBarcode() {
        if (this.userInfo.gecaId) {
          let el = this.$refs.barcodeDiv;
          el.style.display = "block";
        }
      },
      hideBarcode() {
        let el = this.$refs.barcodeDiv;
        el.style.display = "none";
      },
      getUserInfo() {
        console.log("getuserInfo");
        let url = "/f/userInfo"
        //let url = "http://geca.biohitcc.com/f/hi";
        this.axios.post(url, {})
          .then(response => {
          this.userInfo = response.data;

        //手机号不为空,则取记录总数
        /*
        if (this.userInfo.mobile) {
          this.axios.post("/f/getReportCount", {"phone":this.phone})
            .then(response => {
            this.reportCount = response.data;
        })
        .catch(error => {
            console.log("error" + error)
          //MessageBox.alert("查询失败,请重试");
        })
        }
        */
      })
      .catch(error => {
          console.log("error" + error)
        //MessageBox.alert("查询失败,请重试");
      })
      },
      bindingPhone() {
        this.$router.replace('/login');
      },
      gotoReportList() {
        this.$router.replace('/reportList');
      },
      gotoHospitalList() {
        this.$router.replace('/hospitalList');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import 'src/css/style';

  .bodyContainer {
    div, p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }
  .popContainer{
    display: none;
    z-index:100;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #808080;
    opacity:0.9;
    .barcode {
      text-align:center;
      line-height: r(300);
      position: relative;
      margin: 0 auto;
      padding-top: 50%;
      height: r(300);
    }
  }
  .info-box{
    height:r(200);
    margin:0 auto;
    background-color: $btn_color;
    background-size: 100% 100%;
    padding:r(30);
    position:relative;
  .info{
    overflow:hidden;
    padding-left:r(30);
    padding-top:r(30);
  .user-head{
    float:left;
    width:r(120);
    height:r(120);
    border-radius:50%;
    border:1px solid #fff;
  img{
    width:100%;
    height:100%;
    border-radius:100%;
  }
  }
  .name{
    font-size:$main_font_size;
    color: #ffffff;
    font-weight:bold;
    line-height:r(50);
    padding:r(30);
    margin-left:r(160);
  .phone{
    margin-top:r(15);
    font-size:$main_font_size;
    color:#ffffff;
  }
  }
  .set-pad{
    padding:r(18) 0 r(10);
    line-height:r(40);
  }
  }
  .barcodeDiv {
    padding-top: r(80);
    display:flex;
      .number{
        padding: r(15) r(15) 0  r(320);
        font-size: 1rem;
        font-weight:900;
        color:$btn_color;
        line-height:r(40);
        float: right;
      }
      .barcodeIcon{
        padding-right: r(20);
        float: right;
      }
  }

  }
  .bind-tip-box{
    overflow:hidden;
  .bind-btn{
    width:r(690);
    height:r(90);
    margin:r(50) auto 0;
    border-radius:r(6);
    background: $btn_color;
    font-size:$large_font_size;
    color:#fff;
    text-align:center;
    line-height:r(90);
  }
  .tips{
    margin-top:r(50);
  li{
    padding-left: r(30);
    font-size:$main_font_size;
    color:#333;
    line-height:r(40);
    margin-bottom:r(10);
  }
  }
  }
  .line{
    margin-top:r(30);
    height:r(30);
    background-color: #f2f2f2;
  }
  .nav-list{
    padding-top:r(0);
  .list{
    padding:0 r(30);
  li{
    overflow:hidden;
    border-bottom:1px solid #f2f2f2;
    padding:r(25) r(35) r(25) 0;
    position:relative;
    line-height:r(55);
  .icon-box{
    width:r(55);
    height:r(55);
    padding-top: r(5);
    float:left;
    img{
      width:100%;
    }
  }
  .fr-text{
    float:right;
    font-size:$large_font_size;
    color:$secondary_text_color;
    line-height:r(70);
  }
  .nav-name{
    margin-left:r(70);
    font-size:$large_font_size;
    color:$primary_text_color;
    line-height:r(70);
  }
  }
  /*
  li:before{
    content:'';
    position:absolute;
    right:0;
    top:r(32);
    width:r(14);
    height:r(28);
    background:url(../../assets/arrow.png) no-repeat ;
    background-size: 100% 100%;
  }*/
  }
  }

  .btn-group {
    padding-left: r(80);
    display:flex;
    line-height:r(60);
  .btn-first{
    width:r(400);
    height:r(60);
    margin:r(20) r(10) r(30) r(10);
    font-size: $main_font_size;
    color: $primary_text_color;
    text-align:center;
    line-height:r(60);
    p {
      color: $secondary_text_color;
    }
    img {
      width:r(32);
      height:r(32);
      padding-right: r(5);
    }
  }
  }

  .imgArrow {
    position:absolute;
    right:0;
    top:r(40);
    width:r(20);
    height:r(36);
  }

  .vline{
    float:left;
    margin-top: r(50);
    width: r(4);
    height: r(70);
    background: #e9e9e9;
  }

  .examDiv {
    .title{
      margin: r(50) auto 0;
      div {
        margin: r(20);
        color: $secondary_text_color;
      }
    }
    .examId {
      text-align:center;
      font-size: r(60);
      margin:r(60);
    }
    p {
      color: red;
      text-align:center;
      font-size: $large_font_size;
      margin:r(50) auto 0;

    }
    .cellDiv{
      span {
        color: $primary_text_color;
      }
    }
    .scan-btn{
      width:r(670);
      height:r(90);
      margin:r(100) auto 0;
      border-radius:r(6);
      background: $btn_color;
      font-size:$large_font_size;
      color:#fff;
      text-align:center;
      line-height:r(90);
    }

  }
</style>
