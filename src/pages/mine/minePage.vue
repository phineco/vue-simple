<template>
  <div class="mainPage">
    <div class="info-box" :style="{backgroundImage:'url('+require('assets/userInfo-bg.png')+')'}">
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
      <p class="number">{{userInfo.gecaId}}</p>
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
          <div class="fr-text">{{reportCount}}</div>
          <div class="nav-name">检测报告</div>
        </li>

        <li @click.stop="gotoHospitalList">
          <div class="icon-box">
            <img src="../../assets/icon-appointment.png" alt="">
          </div>
          <div class="fr-text">全部</div>
          <div class="nav-name">预约</div>
        </li>

      </ul>
      <ul class="choose-city">
        <li :class="cityDefault == index? 'active':''" v-for="(item,index) in cityList" @click="cityDefault = index">{{item}}</li>
      </ul>
      <ul class="list">
        <div v-if="cityDefault == 0 || cityDefault == 1">
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">安徽省立医院</div>
          </li>
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">安徽医科大学第一附属医院</div>
          </li>
        </div>
        <div v-if="cityDefault == 1 || cityDefault == 2">
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">皖南医学院第二附属医院</div>
          </li>
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">淮北市人民医院</div>
          </li>
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">蚌埠医学院第一附属医院</div>
          </li>
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">皖南医学院弋矶山医院</div>
          </li>
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">安徽省蚌埠医学院第二附属医院</div>
          </li>
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="nav-name">安庆市立医院 </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import { GridView, Swipe } from '@/components';
  export default {
    data() {
      return {
        userInfo:{
          nickName:'',
          mobile:null,
          gecaId:null,
          photo:null
        },
        cityList:['合肥市','安徽省','其它'],
        cityDefault:0,//默认选中城市
        reportCount:0,
        phone:Vue.$utils.getLocalStorage('phone'),
      };
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
              this.count = response.data;
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
  .mainPage{
    padding:r(30) 0;
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
    font-size:r(32);
    color:#115dae;
    font-weight:bold;
    line-height:r(50);
    padding:r(30) 0;
    margin-left:r(130);
  .phone{
    margin-top:r(4);
    font-size:r(30);
    color:#115dae;
  }
  }
  .set-pad{
    padding:r(18) 0 r(10);
    line-height:r(40);
  }
  }
  .number{
    font-size:r(30);
    font-weight:bold;
    color:#095795;
    position:absolute;
    bottom:r(30);
    right:r(30);
    line-height:r(40);
  }
  }
  .bind-tip-box{
    overflow:hidden;
  .bind-btn{
    width:r(690);
    height:r(90);
    margin:r(50) auto 0;
    border-radius:r(6);
    background: #095795;
    font-size:r(34);
    color:#fff;
    text-align:center;
    line-height:r(90);
  }
  .tips{
    margin-top:r(50);
  li{
    padding-left: r(30);
    font-size:r(30);
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
    width:r(40);
    height:r(40);
    float:left;
  img{
    width:100%;
  }
  }
  .fr-text{
    float:right;
    font-size:r(26);
    color:#147fc3;
    line-height:r(40);
  }
  .nav-name{
    margin-left:r(60);
    font-size:r(26);
    color:#666;
    line-height:r(40);
  }
  }
  li:before{
    content:'';
    position:absolute;
    right:0;
    top:r(32);
    width:r(14);
    height:r(26);
    background:url(../../assets/arrow.png) no-repeat ;
    background-size: 100% 100%;
  }
  }
  }
  .choose-city{
    overflow:hidden;
    padding:r(30) r(30) r(30) r(0);
    margin-top:r(30);
    text-align:right;
  li{
    display:inline-block;
    width:r(150);
    border:1px solid #095795;
    height:r(60);
    font-size:r(28);
    color:#095795;
    text-align:center;
    line-height:r(60);
    border-radius:r(6);
    margin-left:r(25);
    text-align:center;
  }
  .active{
    background: #095795;
    color:#fff;
  }
  }
</style>
