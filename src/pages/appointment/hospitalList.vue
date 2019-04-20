<template>
  <div v-title data-title="GECA服务" id="bodyContent" class="bodyContainer">
    <!--<mt-header fixed title="检测报告列表" class="header"></mt-header>-->

    <div class="headerDiv">
      <div class="back" @click.stop="isDisplayFilter = !isDisplayFilter"><mt-button icon="more"></mt-button></div>
      联盟医院
    </div>

    <div class="nav-list">
      <ul class="list">

        <li @click.stop="showProvincePicker" v-if="isDisplayFilter">
          <div class="icon-box">
            <img src="../../assets/icon-address.png">
          </div>
          <div style="line-height: 10px">
            <div class="fr-text"><img class="imgArrow" src="../../assets/arrow.png"/></div>
          <div class="fr-text">{{searchProvince}}</div>
          <div class="nav-name">选择省</div>
          </div>
        </li>
<!--
        <li @click.stop="">
          <div class="icon-box">
          </div>
          <div class="fr-text"><img class="imgArrow" src="../../assets/arrow.png"/></div>
          <div class="fr-text"></div>
          <div class="nav-name">市</div>
        </li>
        -->
      </ul>

      <ul class="choose-city">
        <li :class="cityDefault == index? 'active':''" v-for="(item,index) in cityList" @click="cityDefault = index">{{item}}</li>
      </ul>


      <ul class="list">
        <div v-if="cityDefault == 0">
          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="fr-text" @click.stop="switchIcon(1)">
              <img src="../../assets/arrow-down.png" ref="show1">
            </div>
            <div class="nav-name">安徽省立医院</div>
            <div class="nav-address">安徽省 / 合肥市</div>

            <div class="btn-control" v-if="show1" style="display: block">
              <div class="btn-group">
                <div class="btn-first">预约筛查</div>
                <div class="btn-second">预约胃镜</div>
              </div>
            </div>
          </li>
          <li>
            <div class="icon-box">
              <img  src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="fr-text" @click.stop="switchIcon(2)">
              <img src="../../assets/arrow-down.png" ref="show2">
            </div>
            <div class="nav-name">安徽医科大学第一附属医院</div>
            <div class="nav-address">安徽省 / 合肥市</div>
            <div class="btn-control" v-if="show2" style="display: block">
              <div class="btn-group">
                <div class="btn-first">预约筛查</div>
                <div class="btn-second">预约胃镜</div>
              </div>
            </div>
          </li>
        </div>
      </ul>
    </div>
    <div class="line" v-if="isDisplayFilter"></div>


    <div class="mainContainer"  v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <div  class="nav-list" ref="liGroup">
        <ul class="list" v-for="(item, index) in hospitalList" >

          <li>
            <div class="icon-box">
              <img style="padding-top: 10px" src="../../assets/icon-hospitalization.png" alt="">
            </div>
            <div class="fr-text" @click.stop="displayIcon(index)">
              <img src="../../assets/arrow-down.png" class="iconImg">
            </div>
            <div class="nav-name">{{item.name}}</div>
            <div class="nav-address">{{item.province}}</div>
            <div class="btn-control">
              <div class="btn-group">
                <div class="btn-first">预约筛查</div>
                <div class="btn-second">预约胃镜</div>
              </div>
            </div>
          </li>
        </ul>

<!--
        <mt-cell :title="item.name" >
          <span>
            <mt-button disabled size="small">筛查预约</mt-button>
            <mt-button disabled size="small">胃镜预约</mt-button>
          </span>
        </mt-cell>
        -->
      </div>
    </div>
    <!--
    <div ref="picker" id="picker" class="provincePicker">
      <mt-picker :slots="slots" :itemHeight="30" ></mt-picker>
    </div>
    -->
<div class="provincePicker" @touchmove.prevent>
    <mt-popup
      v-model="popupVisible"
      position="bottom" >
      <mt-picker :slots="slots" :itemHeight="30" @change="handleConfirm" showToolbar>

        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="hideProvincePicker">取消</div>
          <div class="">请选择区域</div>
          <div class="usi-btn-sure" @click="doSearch">确定</div>
        </div>
      </mt-picker>
    </mt-popup>
</div>

  </div>
</template>

<script>
  import { Picker } from 'mint-ui';
  import VDistpicker from 'v-distpicker'
  import {formatDate} from '../../js/mUtils'
  import store from '@/store';
  Vue.component(Picker.name, Picker);
  export default {
    components: { VDistpicker },
    data () {
      return {
        isDisplayFilter:true,
        show1:false,
        show2:false,
/*
        hospitalList: [{name:"安徽医科大学第一附属医院"},
          {name:"安徽省立医院"}
          ],*/
        slots:[{values: ['上海市',
          '安徽省',
          '四川省',
          '江苏省',
          '北京市',
          '河南省',
          '河北省',
          '广东省',
          '湖南省',
          '甘肃省',
          '宁夏自治区',
          '重庆市',
          '青海省',
          '福建省',
          '贵州省',
          '山西省',
          '浙江省',
          '湖北省',
          '山东省',
          '新疆自治区',
          '黑龙江省',
          '陕西省',
          '云南省',
          '江西省',
          '海南省',
          '广西壮族自治区',
          '内蒙古',
          '天津市',
          '西藏自治区',
          '辽宁省',
          '吉林省']}],
        cityList:['合肥市','安徽省','全国'],
        cityDefault:2,//默认选中城市
        hospitalList: [],
        pageSize:15,
        pageNo:0,
        loading:false,
        count:null,
        lastPage:false,
        selectedProvince:null,
        popupVisible:false,
        searchProvince:null,
      }
    },
    mounted() {
      //滚动组件加载时会自动调用一次,不需要这里调用
      //this.loadMore();
      //document.getElementById("bodyContent").addEventListener("click", this.hideProvincePicker);
    },
    watch: {
      cityDefault: function (newVal, oldVal) {
        console.log("From " + oldVal + " to " + newVal);
        this.hospitalList = [];
        if(newVal === 2) {
          this.searchProvince = null;
          this.pageNo = 0;
          this.lastPage = false;
          console.log("长度" + this.hospitalList.length)
          if(this.hospitalList.length == 0) {
            this.loadMore();
          }
        } else if (newVal === 1) {
          this.searchProvince = "安徽省";
          this.pageNo = 0;
          this.lastPage = false;
          this.hospitalList = [];
          this.loadMore();
        }
      }
    },
    methods: {
      switchIcon(idx) {
        console.log(this.show1)
        if (idx == 1) {
          this.show1 = this.show1?false:true;
          if (this.show1) {
            this.$refs.show1.src = require('@/assets/arrow-up.png');
          } else {
            this.$refs.show1.src = require('@/assets/arrow-down.png');
          }
        } else {
          this.show2 = this.show2?false:true;
          if (this.show2) {
            this.$refs.show2.src = require('@/assets/arrow-up.png');
          } else {
            this.$refs.show2.src = require('@/assets/arrow-down.png');
          }
        }
        console.log(this.show1)
      },
      handleConfirm(picker, value) {
        this.selectedProvince = value[0]
        console.log(value)
      },
      hideProvincePicker() {
        this.popupVisible = false;
        this.selectedProvince = null;
      },

      doSearch() {
        //当用户什么都没有选择时,取默认值
        console.log(this.selectedProvince)
        if(this.selectedProvince == null) {
          this.selectedProvince = "上海市";
        }
        this.cityDefault = 2;
        this.searchProvince = this.selectedProvince;
        this.popupVisible = false;

        this.hospitalList = [];
        this.lastPage = false;
        this.pageNo = 0;

        this.loadMore();
        console.log("doSearch")
      },
      showProvincePicker() {
        this.popupVisible = true;
        this.selectedProvince = null;
      },

      onSelected(data) {
        //alert(data.province + ' | ' + data.city + ' | ' + data.area)
        console.log(data.province + ' | ' + data.city + ' | ' + data.area)
      },
      displayIcon(index) {
        let elImg = this.$refs.liGroup.querySelectorAll('.iconImg')[index];

        let el = this.$refs.liGroup.querySelectorAll('.btn-control')[index];
        console.log(el)
        let styleName = el.style.display;
        console.log(styleName)
        if (styleName === 'none' || styleName == '') {
          el.style.display = 'block'
          elImg.src = require('@/assets/arrow-up.png');
        } else {
          el.style.display = 'none';
          elImg.src = require('@/assets/arrow-down.png');
        }
        //this.$refs.liGroup.querySelectorAll('.btn-group')[index].style.display = 'none'
      },
      loadMore() {
        console.log(this.cityDefault);
        if (this.cityDefault == 0) {
          return;
        }
        if(this.lastPage) {
          return;
        }
        if (this.loading) {
          return false;
        }
        this.pageNo = this.pageNo + 1;
        this.loading = true;
        /*setTimeout(() => {
         let last = this.reportList[this.reportList.length - 1];
         for (let i = 1; i <= 10; i++) {
         this.reportList.push(last);
         }
         this.loading = false;
         }, 2500);*/
        let url = "/f/hospitalList";
        this.axios.post(url,{"pageSize":this.pageSize, "pageNo":this.pageNo, "searchProvince":this.searchProvince})
          .then(response => {
          console.log(response.data);
        this.count = response.data.count;
        this.lastPage = response.data.lastPage;
        if (response.data.list.length == 0) {
          //store._vm.$toast("未查询到符合条件的检查记录");
          this.noData = true;
        } else {
          for(let i = 0; i < response.data.list.length; i++) {
            this.hospitalList.push(response.data.list[i]);
          }
        }

        //this.reportList.concat(response.data);
        console.log(this.hospitalList);
        this.loading = false;
      }).catch(error => {
          console.log("error" + error)
        this.loading = false;
        //MessageBox.alert("查询失败,请重试");
      });
      },
    },
  }

</script>

<style lang="scss" scoped>
  @import 'src/css/style';
  .bodyContainer {
    padding-bottom: 55px;
  }
  .lineContainer{
    margin: r(40) r(40) 0 r(40);
    border-bottom:1px solid #f2f2f2;
  .lineHeader {
    overflow:hidden;
    position:relative;
    font-size: $large_font_size;
    color:$primary_text_color;
    line-height:r(60);
  .icon-box{
    padding-bottom: r(20);
    padding-right: r(10);
    width: r(55);
    height: r(55);
    float: left;
  img{
    width: 100%;
  }
  }
  }
  }

  .bodyContainer {
  div, p, span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
  }

  .provincePicker /deep/ .mint-popup{
    width: 100%;
  }

  .provincePicker /deep/ .picker-slot {
    font-size: $main_font_size;
  ;
  }

  .address-container{
    font-size: r(10);
  }
  .distpicker{
    line-height:r(60);
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
        .icon-box1{
          width:r(55);
          height:r(55);
          float:left;
        img{
          width:100%;
        }
        }
      .icon-box{
        width:r(55);
        height:r(55);
        float:left;
        img{
          width:100%;
        }
      }
      .fr-text{
        float: right;
        font-size:$main_font_size;
        color:$secondary_text_color;
        line-height:r(40);
        padding-top:r(10);
      }
      .nav-name{
        margin-left:r(80);
        font-size:$main_font_size;
        color:$primary_text_color;
        line-height:r(50);
      }
      .nav-address{
         margin-left:r(80);
         font-size:$small_font_size;
         color:$primary_text_color;
         line-height:r(50);
       }
      .btn-control{
        display:none;
        .btn-group {
          padding-left: r(140);
          display:flex;
          line-height:r(60);
        .btn-first{
          width:r(180);
          height:r(60);
          margin:r(50) auto 0;
          border-radius:r(6);
          background: $btn_disabled;
          font-size:$main_font_size;
          color:#fff;
          text-align:center;
          line-height:r(60);
        }
        .btn-second{
          float: right;
          width:r(180);
          height:r(60);
          margin:r(50) auto 0;
          border-radius:r(6);
          background: $btn_disabled;
          font-size:$main_font_size;
          color:#fff;
          text-align:center;
          line-height:r(60);
        }
        }
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
      background:url(../../assets/arrow-down.png) no-repeat ;
      background-size: 100% 100%;
      }
    */
    }
  }

  .choose-city{
    display:none;
    overflow:hidden;
    padding:r(30) r(30) r(30) r(0);
    text-align:right;
  li{
    display:inline-block;
    width:r(150);
    border:1px solid $btn_color;
    height:r(60);
    font-size:$main_font_size;
    color:$btn_color;
    text-align:center;
    line-height:r(60);
    border-radius:r(6);
    margin-left:r(25);
    text-align:center;
  }
  .active{
    background: $btn_color;
    color:#fff;
  }
  }

  .picker-toolbar-title {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 40px;
    line-height: 40px;
    color: $primary_text_color;
    font-size: $main_font_size;
    .usi-btn-cancel,
     .usi-btn-sure {
       color: $btn_color;
     }
  }

  .imgArrow {
    position:absolute;
    right:0;
    top:r(40);
    width:r(20);
    height:r(36);
  }

  .line{

    height:r(30);
    background-color: #f2f2f2;
  }

  .headerDiv{
    width:100%;
    height:r(90);
    background: $btn_color;
    font-size:$large_font_size;
    color:#fff;
    text-align:center;
    line-height:r(90);
    background-color: $secondary_text_color;
  .back /deep/ .mint-button--default{
    float: right;
    padding-right: r(10);
    color:#fff;
    box-shadow: 0 0 1px $btn_color;
  }
  .back /deep/ .mint-button {
    height:r(80);
  }
  }
</style>
