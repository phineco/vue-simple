<template>
  <div v-title data-title="检测报告列表">

    <div class="nav-list">
      <ul class="list">
        <li>
          <div class="icon-box1" >
            <img src="../../assets/icon-filter.png" alt="">
          </div>
          <div class="fr-text"></div>
          <div class="nav-name">过滤</div>
        </li>

        <li @click.stop="openPicker(0)" >
          <div class="icon-box">
          </div>
          <div style="line-height: 10px">
            <div class="fr-text"><span>{{startDate}}</span><img style="width: 12px;height: 18px;" src="../../assets/arrow.png"/></div>
            <div class="nav-name" >开始时间</div>
          </div>
        </li>

        <li @click.stop="openPicker(1)">
          <div class="icon-box">
          </div>
          <div class="fr-text"><span>{{endDate}}</span><img style="width: 12px;height: 18px;" src="../../assets/arrow.png"/></div>
          <div class="nav-name">结束时间</div>
        </li>


      </ul>
    </div>
    <div class="lineContainer">
      <div class="lineHeader">
        报告列表
      </div>
    </div>


    <!--<mt-header fixed title="检测报告列表" class="header"></mt-header>-->
    <div class="mainContainer" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <div  class="nav-list">
        <ul class="list" v-for="(item, index) in reportList" >

          <li  @click.stop="gotoDetail(item.id)" >
            <div class="icon-box">
              <img src="../../assets/icon-report.png" alt="">
            </div>
            <div class="fr-text">
              <img src="../../assets/arrow.png">
            </div>
            <div class="nav-name">{{item.patientName}}</div>
            <div class="nav-name">{{item.testDate | formatDate}}</div>
          </li>
        </ul>

       </div>
      <div v-if="reportList.length == 0 && noData" style="margin: 10px;">
        <p style="color:grey;font-size: 16px;">未查询到符合条件的检查记录</p>
      </div>
    </div>


    <div class="pickerPop" @touchmove.prevent>
      <mt-datetime-picker
        ref="picker"
        type="datetime"
        v-model="testDate"
        lockScroll="true"
        class="myPicker"
        year-format="{value}"
        month-format="{value}"
        date-format="{value}"
        hour-format="{value}"
        minute-format="{value}"
        second-format="{value}"
        @confirm="dateConfirm()"
      >
      </mt-datetime-picker>
    </div>

  </div>
</template>

<script>
  import {formatDate} from '../../js/mUtils'
  import { DatetimePicker } from 'mint-ui';
  Vue.component(DatetimePicker.name, DatetimePicker);
  import store from '@/store';
  export default {
    data () {
      return {
        reportList: [],
        pageSize:15,
        pageNum:0,
        phone:Vue.$utils.getLocalStorage('phone'),
        loading:false,
        noData:false,
        startDate:null,
        endDate:null,
        currentSelected:null,
        testDate:null,
/*
        reportList:[
          {
          "createDate":1553764931311,
          "delFlag":"0",
          "diagnostic":"",
          "gecaId":"549043775453",
          "id":"c0c1a34627f245528b568c4f2b62b800",
          "isDiagnosed":0,
          "mobile":"18919604808",
          "patientAge":"72",
          "patientGender":"男",
          "patientName":"李宏成",
          "risk":"",
          "score":"",
          "siteName":"广州市中西医结合医院",
          "suggestion":"胃部炎症",
          "testDate":1551410079000,
          "testNo":"0068-02-000016",
          "vG17":"1.47",
          "vHp":"阴性",
          "vPg1":"200.67",
          "vPg2":"14.73"
        },
        {
          "createDate":1553764931311,
          "delFlag":"0",
          "diagnostic":"",
          "gecaId":"549043775453",
          "id":"c0c1a34627f245528b568c4f2b62b800",
          "isDiagnosed":0,
          "mobile":"18919604808",
          "patientAge":"72",
          "patientGender":"男",
          "patientName":"李宏成",
          "risk":"",
          "score":"",
          "siteName":"广州市中西医结合医院",
          "suggestion":"胃部炎症",
          "testDate":1551410079000,
          "testNo":"0068-02-000016",
          "vG17":"1.47",
          "vHp":"阴性",
          "vPg1":"200.67",
          "vPg2":"14.73"
        },
        {
          "createDate":1553764931311,
          "delFlag":"0",
          "diagnostic":"",
          "gecaId":"549043775453",
          "id":"c0c1a34627f245528b568c4f2b62b800",
          "isDiagnosed":0,
          "mobile":"18919604808",
          "patientAge":"72",
          "patientGender":"男",
          "patientName":"李宏成",
          "risk":"",
          "score":"",
          "siteName":"广州市中西医结合医院",
          "suggestion":"胃部炎症",
          "testDate":1551410079000,
          "testNo":"0068-02-000016",
          "vG17":"1.47",
          "vHp":"阴性",
          "vPg1":"200.67",
          "vPg2":"14.73"
        },
        {
          "createDate":1553764931311,
          "delFlag":"0",
          "diagnostic":"",
          "gecaId":"549043775453",
          "id":"c0c1a34627f245528b568c4f2b62b800",
          "isDiagnosed":0,
          "mobile":"18919604808",
          "patientAge":"72",
          "patientGender":"男",
          "patientName":"李宏成",
          "risk":"",
          "score":"",
          "siteName":"广州市中西医结合医院",
          "suggestion":"胃部炎症",
          "testDate":1551410079000,
          "testNo":"0068-02-000016",
          "vG17":"1.47",
          "vHp":"阴性",
          "vPg1":"200.67",
          "vPg2":"14.73"
        },
        {
          "createDate":1553764931311,
          "delFlag":"0",
          "diagnostic":"",
          "gecaId":"549043775453",
          "id":"c0c1a34627f245528b568c4f2b62b800",
          "isDiagnosed":0,
          "mobile":"18919604808",
          "patientAge":"72",
          "patientGender":"男",
          "patientName":"李宏成",
          "risk":"",
          "score":"",
          "siteName":"广州市中西医结合医院",
          "suggestion":"胃部炎症",
          "testDate":1551410079000,
          "testNo":"0068-02-000016",
          "vG17":"1.47",
          "vHp":"阴性",
          "vPg1":"200.67",
          "vPg2":"14.73"
        }
      ],*/
      }
    },
    filters:{
      formatDate:function (time) {
        let obj = new Date(time);
        return formatDate(obj, 'yyyy-MM-dd hh:mm');
      }
    },
    mounted() {
      this.loadMore();
    },
    watch: {
      // 如果路由发生变化，再次执行该方法
      "$route": "loadMore"
    },
    methods: {
      openPicker (idx) { // 打开时间选择器
        // 如果已经选过日期，则再次打开时间选择器时，日期回显（不需要回显的话可以去掉 这个判断）
        this.currentSelected = idx;
        if (this.currentSelected == 1 && this.endDate) {
          this.testDate = this.endDate;
        } else if (this.currentSelected == 0 && this.startDate){
          this.testDate = this.startDate;
        } else {
          this.testDate = new Date();
        }
        this.$refs.picker.open();
      },
      dateConfirm () { // 时间选择器确定按钮，并把时间转换成我们需要的时间格式
        console.log(this.currentSelected);
        if(this.currentSelected == 0) {
          this.startDate = formatDate(this.testDate, 'yyyy-MM-dd hh:mm');
        } else if (this.currentSelected == 1) {
          this.endDate = formatDate(this.testDate, 'yyyy-MM-dd hh:mm');
        }
        console.log(this.startDate + "--" + this.endDate)
      },
      loadMore() {
        this.pageNum = this.pageNum + 1;
        this.loading = true;
        /*setTimeout(() => {
          let last = this.reportList[this.reportList.length - 1];
          for (let i = 1; i <= 10; i++) {
            this.reportList.push(last);
          }
          this.loading = false;
        }, 2500);*/
        let url = "/f/queryReport";
        this.axios.post(url,{"phone": this.phone, "pageSize":this.pageSize, "pageNum":this.pageNum})
          .then(response => {
          console.log(response.data);
          if (response.data.length == 0) {
            //store._vm.$toast("未查询到符合条件的检查记录");
            this.noData = true;
          } else {
            for(let i = 0; i < response.data.length; i++) {
              this.reportList.push(response.data[i]);
            }
          }


          //this.reportList.concat(response.data);
          console.log(this.reportList);
        }).catch(error => {
          console.log("error" + error)
          //MessageBox.alert("查询失败,请重试");
        });

        this.loading = false;
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
    }
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
.header{
  font-size: large;
}
  .lineContainer{
    margin: r(50) r(40) 0 r(40);
    .lineHeader {
      overflow:hidden;
      border-bottom:1px solid #f2f2f2;
      padding:r(25) r(35) r(25) 0;
      position:relative;
      font-size: r(26);
      color:#666;
    }
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
      span {
        padding-top: r(5);
        padding-right: r(30);
      }
    img{
      height:r(40);
      widows:r(30);
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
