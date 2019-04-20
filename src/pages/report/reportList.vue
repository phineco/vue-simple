<template>
  <div v-title data-title="GECA服务" class="bodyContainer" >

    <div class="headerDiv">
      <div class="back" @click.stop="isDisplayFilter = !isDisplayFilter"><mt-button icon="more"></mt-button></div>
      报告查询
    </div>

    <div class="search-list" >
      <ul class="list" v-if="isDisplayFilter">
      <li >
        <div class="icon-box">
          <img src="../../assets/icon-date.png">
        </div>
        <div style="line-height: 10px">
          <div class="fr-text">
            <input type="text" onfocus="this.blur()" @click = "setStartDate()" v-bind:value="startDate" placeholder=""/>
            <img class="imgArrow" src="../../assets/arrow.png"/></div>

          <div class="nav-name" >起始日期</div>
        </div>
      </li>

      <li >
        <div class="icon-box">
          <img src="../../assets/icon-date.png">
        </div>
        <div class="fr-text">
          <input type="text" onfocus="this.blur()" @click = "setEndDate()" v-bind:value="endDate" placeholder=""/>
          <img class="imgArrow"  src="../../assets/arrow.png"/></div>
        <div class="nav-name">结束日期</div>
      </li>
      </ul>
    </div>

    <div class="line" v-if="isDisplayFilter"></div>

    <div class="lineContainer">
      <div class="lineHeader">
        <div class="icon-box">
          <img src="../../assets/blue-list.png" alt="">
        </div>
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
              <img src="../../assets/file.png" alt="">
            </div>
            <div class="fr-text">
              <img class="imgArrow" src="../../assets/arrow.png">
            </div>
            <div class="nav-name">{{item.patientName}}</div>
            <div class="nav-name">{{item.testDate | formatDate}}</div>
          </li>
        </ul>

       </div>
      <div v-if="reportList.length == 0 && noData" class="emptyDiv">
        <p>未查询到符合条件的检查记录</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '../../js/mUtils'
  import { DatetimePicker } from 'mint-ui';
  Vue.component(DatetimePicker.name, DatetimePicker);
  import { Toast } from 'mint-ui';
  import store from '@/store';
  export default {
    data () {
      return {
        lastPage: false,
        count:0,
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
        isDisplayFilter:true,
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
        }
      ]*/
      }
    },
    filters:{
      formatDate:function (time) {
        let obj = new Date(time);
        return formatDate(obj, 'yyyy-MM-dd');
      }
    },
    mounted() {
      //滚动组件加载时会自动调用一次,不需要这里调用
      //this.loadMore();
    },
    watch: {
      // 如果路由发生变化，再次执行该方法
      //"$route": "loadMore"
    },
    methods: {
      setStartDate() {
        this.$picker.show({
          type:'datePicker',
          onOk: (date) =>{
          this.startDate = date;
          this.queryReport();
        }
        })

      },
      setEndDate() {
        this.$picker.show({
          type:'datePicker',
          onOk: (date) =>{
          this.endDate = date;
          this.queryReport();
        }
        })
      },
      queryReport() {
        console.log(this.startDate + "--" + this.endDate);
        if(this.startDate != null && this.endDate != null) {
          if(this.startDate > this.endDate) {
            Toast('起始日期大于结束日期!');
            return;
          }
          this.lastPage = false;
          this.pageNum = 0;
          this.reportList = [];
          this.loadMore();
        }
      },
      loadMore() {
        if(this.lastPage) {
          return;
        }

        if (this.loading) {
          return false;
        }

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
        this.axios.post(url,{"phone": this.phone, "startDate": this.startDate, "endDate": this.endDate,
          "pageSize":this.pageSize, "pageNo":this.pageNum})
          .then(response => {
          console.log(response.data);

        this.count = response.data.count;
        this.lastPage = response.data.lastPage;
        if (response.data.list.length == 0) {
          //store._vm.$toast("未查询到符合条件的检查记录");
          this.noData = true;
        } else {
          for(let i = 0; i < response.data.list.length; i++) {
            this.reportList.push(response.data.list[i]);
          }
        }
          //this.reportList.concat(response.data);
          console.log(this.reportList);
        this.loading = false;
        }).catch(error => {
          console.log("error" + error)
          //MessageBox.alert("查询失败,请重试");
          this.loading = false;
        });
      },
    gotoDetail:function(itemId) {
      let str = JSON.stringify(itemId)
      console.log(str);
      this.$router.replace('/reportItem?itemId='+itemId);
    }
  },
}

</script>

<style lang="scss" scoped>
  @import 'src/css/style';
  .bodyContainer {
    padding-bottom: 55px;
  }
.bodyContainer {
  div, p, span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
  .pickerPop /deep/ .picker-slot {
    font-size: $main_font_size;
  }

  .pickerPop /deep/.mint-datetime-action {
    font-size: $main_font_size;
    color: $secondary_text_color;
  }
  .header{
  font-size: large;
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

  .search-list{
    padding-top:r(0);
    .list{
      padding:0 r(30);
      li {
        overflow: hidden;
        border-bottom: 1px solid #f2f2f2;
        padding: r(20) r(35) r(20) 0;
        position: relative;
        line-height:r(60);
        .icon-box1 {
          width: r(55);
          height: r(55);
          float: left;
          img {
            width: 100%;
          }
        }
    .icon-box {
      width: r(32);
      height: r(32);
      float: left;
      padding-right:r(10);
      img {
        width: 100%;
      }
     }
    .fr-text {
      float: right;
      font-size: $main_font_size;
      color: $secondary_text_color;
      line-height: r(60);
      padding-top: r(5);
      span {
        padding-top: r(5);
        padding-right: r(30);
      }
      input {
        font-size: $main_font_size;
        line-height: r(50);
        border: 1px;
        width:r(200);
      }
      img {
        height: r(36);
        width: r(20);
      }
    }
    .nav-name {
      margin-left: r(0);
      font-size: $main_font_size;
      color: $primary_text_color;
      line-height: r(60);
      }
      }
    }
  }

.nav-list{
    padding-top:r(0);
  .list{
    padding:0 r(30);
  li {
    overflow: hidden;
    border-bottom: 1px solid #f2f2f2;
    padding: r(25) r(35) r(25) 0;
    position: relative;

  .icon-box1 {
    width: r(55);
    height: r(55);
    float: left;

  img {
    width: 100%;
  }

  }
  .icon-box {
    padding-top: r(20);
    width: r(55);
    height: r(55);
    float: left;

  img {
    width: 100%;
  }

  }
  .fr-text {
    float: right;
    font-size: $main_font_size;
    color: $secondary_text_color;
    line-height: r(60);

  span {
    padding-top: r(5);
    padding-right: r(30);
  }

  img {
    height: r(36);
    width: r(20);
  }

  }
  .nav-name {
    margin-left: r(60);
    font-size: $main_font_size;
    color: $primary_text_color;
    line-height: r(50);
  }
  }
  }
}
  .emptyDiv {
    margin:r(30);
    p {
      font-size: $main_font_size;
      color: $primary_text_color;
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
