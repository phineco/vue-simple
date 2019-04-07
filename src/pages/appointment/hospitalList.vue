<template>
  <div v-title data-title="联盟医院" id="bodyContent">
    <!--<mt-header fixed title="检测报告列表" class="header"></mt-header>-->

    <div class="nav-list">
      <ul class="list">
        <li>
          <div class="icon-box1" >
            <img src="../../assets/icon-filter.png" alt="">
          </div>
          <div class="fr-text"></div>
          <div class="nav-name">过滤</div>
        </li>

        <li @click.stop="showProvincePicker" >
          <div class="icon-box">
          </div>
          <div style="line-height: 10px">
          <div class="fr-text"><img style="width: 12px;height: 18px;" src="../../assets/arrow.png"/></div>
          <div class="nav-name">省</div>
          </div>
        </li>

        <li @click.stop="">
          <div class="icon-box">
          </div>
          <div class="fr-text"><img style="width: 12px;height: 18px;" src="../../assets/arrow.png"/></div>
          <div class="nav-name">市</div>
        </li>

        <div class="hide">
          <v-distpicker type="mobile" wrapper="distpicker" static-placeholder hide-area @selected="onSelected"></v-distpicker>
        </div>


      </ul>
    </div>

    <div class="mainContainer"  v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <div  class="nav-list" ref="liGroup">
        <ul class="list" v-for="(item, index) in hospitalList" >

          <li>
            <div class="icon-box">
              <img src="../../assets/icon-hospital.png" alt="">
            </div>
            <div class="fr-text" @click.stop="displayIcon(index)">
              <img src="../../assets/arrow-down.png" class="iconImg">
            </div>
            <div class="nav-name">{{item.name}}</div>
            <div class="nav-name">{{item.province}}</div>
            <div class="btn-control">
              <div class="btn-group">
                <div class="btn-first">预约胃镜</div>
                <div class="btn-second">预约筛查</div>
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
    <div ref="picker" id="picker" class="provincePicker">
      <mt-picker :slots="slots" :itemHeight="30" ></mt-picker>
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
/*
        hospitalList: [{name:"安徽医科大学第一附属医院"},
          {name:"安徽省立医院"}
          ],*/
        slots:[{values: ['安徽省', '广东省', '江西省']}],
        hospitalList: [],
        pageSize:15,
        pageNo:0,
        loading:false,
        count:null,
        lastPage:false
      }
    },
    mounted() {
      this.loadMore();
      document.getElementById("bodyContent").addEventListener("click", this.hideProvincePicker);
    },
    watch: {
    },
    methods: {
      hideProvincePicker() {
        return;
        let el = this.$refs.picker;
        console.log(el)
        let styleName = el.style.display;
        console.log(styleName);
        el.style.display = 'none';
      },
      showProvincePicker() {

        let el = this.$refs.picker;
        console.log(el)
        let styleName = el.style.display;
        console.log(styleName)
        if (styleName === 'none' || styleName == '') {
          el.style.display = 'block'
        } else {
          el.style.display = 'none';
        }
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
        this.axios.post(url,{"pageSize":this.pageSize, "pageNo":this.pageNo})
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
      }).catch(error => {
          console.log("error" + error)
        //MessageBox.alert("查询失败,请重试");
      });

        this.loading = false;
      },
    },
  }

</script>

<style lang="scss" scoped>
  @import 'src/css/style';
  .mainContainer {
    div, p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }

  .provincePicker {
    display: none;
  }

  .provincePicker /deep/ .picker-slot {
    font-size: r(26);
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
          width:r(40);
          height:r(40);
          float:left;
        img{
          width:100%;
        }
        }
      .icon-box{
        padding-top: r(20);
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
        img{
          height: r(70);
          widows: r(70);
        }
      }
      .nav-name{
        margin-left:r(60);
        font-size:r(26);
        color:#666;
        line-height:r(40);
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
          background: #095795;
          font-size:r(20);
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
          background: #095795;
          font-size:r(20);
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
      height:r(26);
      background:url(../../assets/arrow-down.png) no-repeat ;
      background-size: 100% 100%;
      }
    */
    }
  }
</style>
