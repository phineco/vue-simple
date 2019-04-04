<template>
  <div class="pageContent" v-title data-title="个人中心">

    <div class="head-container">
      <div class="headImgDiv">

        <img class="headImg" v-if="userInfo.photo" v-bind:src="userInfo.photo"/>
        <img class="headImg" v-else src="../../assets/userPhoto.png"/>
      </div>
      <div class="user-info">
        <div class="name"><span>{{userInfo.nickName}}</span></div>
        <div v-if="userInfo.mobile"><span>{{userInfo.mobile.substr(0,3)}}****{{userInfo.mobile.substr(-4)}}</span></div>
      </div>
    </div>

    <div class="box">
        <div class="gecaInfo"><p>GECA唯一编码</p><p>{{userInfo.gecaId}}</p></div>
        <div class="barcode" style="padding-right: 20px; float: right">
          <VueBarcode :value="userInfo.gecaId" :options="barcode_option" tag="svg" ></VueBarcode>
        </div>
    </div>

  <div v-if="!userInfo.mobile" style="height: 400px">
    <div style=" text-align: center;padding: 15px;">
        <mt-button type="primary"
                 size="large" @click="bindingPhone">绑定手机号</mt-button>

    </div>
    <div style="padding-left: 15px;" class="desc">
        <p>
        为了给您提供更好的服务，请先绑定手机。
        </p>
        <p>
        绑定手机后您将获得以下服务：
        </p>
        <p>
        1、	查看检测报告；
        </p>
        <p>
        2、	预约筛查、胃镜；
        </p>
    </div>
  </div>

    <div v-else>
      <div></div>
      <mt-cell title="检测报告" is-link to="/reportList">

      </mt-cell>

      <mt-cell title="预约" is-link to="/hospitalList">

      </mt-cell>
    </div>


    <div class="mainContainer">
      <div v-for="(item, index) in reportList" @click.stop="gotoDetail(item.id)" >
        <mt-cell :title="item.patientName" is-link>
          <span>{{item.testDate | formatDate}}</span>
        </mt-cell>
      </div>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import VueBarcode from '@xkeshi/vue-barcode';
  import {formatDate} from '../../js/mUtils';
  export default {
    data() {
      return {
        userInfo: {
          mobile:null,
          nickName:"test",
          gecaId:"122345667877"
        },
        mobile:null,
        reportList:[],
        barcode_option:{
          displayValue: false, //是否默认显示条形码数据
          textPosition  :'bottom', //条形码数据显示的位置
          background: '#bfdcf7', //条形码背景颜色
          valid: function (valid) {
            console.log(valid)
          },
          width:'1px',//单个条形码的宽度
          height: '35px',
          fontSize: '14px' //字体大小
        }
      };
    },
    computed: {
      headImg() {
        return (
          this.userInfo.photo ||
          require('@/assets/userPhoto.png')
        );
      }
    },
    components: {
      VueBarcode
    },
    mounted() {
      this.getUserInfo();
    },
    watch: {
      '$route.path': function (newVal, oldVal) {
        console.log("From " + oldVal + " to " + newVal);
        if(newVal === '/userInfo' && oldVal === '/login') {
          this.getUserInfo();
        }
      }
    },
    filters:{
      formatDate:function (time) {
        let obj = new Date(time);
        return formatDate(obj, 'yyyy-MM-dd hh:mm');
      }
    },
    methods: {
      getUserInfo() {
        console.log("getUserInfo");
        let url = "/f/userInfo"
        //let url = "http://geca.biohitcc.com/f/hi";
        this.axios.post(url, {})
          .then(response => {
          this.userInfo = response.data;
        if (this.userInfo.mobile) {
          this.mobile = this.userInfo.mobile;
        }
      })
      .catch(error => {
          console.log("error" + error)
        //MessageBox.alert("查询失败,请重试");
      });
      },
      getMyExplaination() {
        let url = "/f/getMyReportList";
        this.axios.post(url,{"phone": this.phone})
          .then(response => {
          this.reportList = response.data;
        console.log(this.reportList);
      }).catch(error => {
          console.log("error" + error)
        //MessageBox.alert("查询失败,请重试");
      });
      },

      gotoDetail:function(itemId) {
        let str = JSON.stringify(itemId)
        console.log(str);
        this.$router.push({
          path:'/reportItem',
          query:{
            itemId : itemId
          }
        });
      },
      bindingPhone() {
        this.$router.push({
          path:'/login',
        });
      },
      gotoAppointment() {
        console.log("gotoAppointment")
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import 'src/css/mixin';
  .pageContent{
    background-color: #FFFFFF;
  div, p, span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
  }

  .head-container {
    display: -webkit-flex;
    display: flex;
    width: 400px;
    height: 100px;
    background-color: #bfdcf7;
  }

  .headImgDiv {
    padding:r(74) r(30) 0 r(40);
    width: r(140);
    height: r(140);
    position: relative;
    .headImg {
      width: r(140);
      height: r(140);
      border: 2px solid #f7e1b1;
      border-radius: 50%;
    }
  }

  .head-img {
    width: r(150);
    height: r(150);
    border-radius: 50%;
    margin: 30px 0px 0 30px;
  }
  .user-info {
    height: 100px;
    margin: 10px;
  }
  .name{
    padding-top:r(80)
  }

  .box{
    margin: 0 auto;
    display: -webkit-flex;
    display: flex;
    width: 400px;
    height: 65px;
    background-color: #bfdcf7;
    position: relative;
      .barcode {
        height:r(120);
      }
  }
  .gecaInfo{
    padding-left: 60px;
    padding-top: 8px;
    p{
      font-size: 16px;
      margin: 3px;
    }
  }
  .desc{
    p {
      margin: 5px;
      font-size: 18px;
      color: grey;
    }
  }
</style>
