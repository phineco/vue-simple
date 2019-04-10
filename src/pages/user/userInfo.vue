<template>
  <div class="bodyContainer" v-title data-title="GECA服务">
    <div class="info-box" :style="{backgroundImage:'url('+require('assets/main-bg-2.jpeg')+')'}" @click.stop="showBarcode">
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
      <div class="barcodeDiv">
        <div class="number"><p >{{userInfo.gecaId}}</p></div>
        <div class="barcodeIcon"><img  src="../../assets/icon-barcode.png"></div>
      </div>
    </div>
    <div class="line"></div>
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

        <li @click.stop="gotoReportList">
          <div class="icon-box">
            <img src="../../assets/icon-report.png" alt="">
          </div>
          <div class="fr-text">{{reportCount}} <img class="imgArrow" src="../../assets/arrow.png"/></div>
          <div class="nav-name">检测报告</div>
        </li>

        <li>
          <div class="icon-box">
            <img src="../../assets/icon-appointment.png" alt="">
          </div>
          <div class="fr-text"></div>
          <div class="nav-name">我的预约</div>

          <div class="btn-control">
            <div class="btn-group">
              <div class="btn-first">预约中 <p>0</p></div>
              <div class="vline"></div>
              <div class="btn-first">预约成功 <p>0</p></div>
              <div class="vline"></div>
              <div class="btn-first">已完成 <p>0</p></div>
            </div>
          </div>
        </li>
      </ul>

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
        }
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
      this.getUserInfo();
    },
    methods: {
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
      })
      .catch(error => {
          console.log("error" + error)
        //MessageBox.alert("查询失败,请重试");
      })
      },
      bindingPhone() {
        this.$router.push({
          path:'/login',
        });
      },
      gotoReportList() {
        this.$router.push({
          path:'/reportList',
          query:{
            count : this.count
          }
        });
      },
      gotoHospitalList() {
        this.$router.push({
          path:'/hospitalList',
        });
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
    padding:r(30) 0;
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
    width:r(690);
    height:r(300);
    margin:0 auto;
    background:url(../../assets/userInfo-bg.png) no-repeat ;
    background-size: 100% 100%;
    padding:r(30);
    box-sizing:border-box;
    border-radius:r(8);
    position:relative;
  .info{
    overflow:hidden;
  .user-head{
    float:left;
    width:r(110);
    height:r(110);
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
    color:$btn_color;
    font-weight:bold;
    line-height:r(50);
    padding:r(30) 0;
    margin-left:r(130);
  .phone{
    margin-top:r(4);
    font-size:$main_font_size;
    color:$btn_color;
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
  .icon-box{
    width:r(55);
    height:r(55);
    float:left;
  img{
    width:100%;
  }
  }
  .fr-text{
    float:right;
    font-size:$large_font_size;
    color:$secondary_text_color;
    line-height:r(60);
  }
  .nav-name{
    margin-left:r(60);
    font-size:$large_font_size;
    color:$primary_text_color;
    line-height:r(60);
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
    width:r(280);
    height:r(60);
    margin:r(20) r(10) r(30) r(10);
    font-size: $main_font_size;
    color: $primary_text_color;
    text-align:center;
    line-height:r(60);
    p {
      color: $secondary_text_color;
    }
  }
  }

  .imgArrow {
    position:absolute;
    right:0;
    top:r(32);
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
</style>
