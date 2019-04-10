<template>
  <div>
    <!--<mt-header fixed title="检测报告详情" class="header"></mt-header>-->
    <div class="headerDiv">
      <div class="back" @click.stop="goBack"><mt-button icon="back"></mt-button></div>
      检测报告详情
    </div>

    <div class="mainContainer">
      <div v-if="reportItem.reportName" class="lineDiv" >
        <span class="firstSpan">报告名称</span>
        <span class="secondSpan">{{reportItem.reportName}}</span>
      </div>
      <div v-else class="lineDiv">
        <span class="firstSpan">检测编号</span>
        <span class="secondSpan">{{reportItem.testNo}}</span>
      </div>

      <div class="lineDiv" >
        <span class="firstSpan">姓名</span>
        <span class="secondSpan">{{reportItem.patientName}}</span>
      </div>
      <div class="lineDiv">
        <span class="firstSpan">年龄</span>
        <span class="secondSpan">{{reportItem.patientAge}}岁</span>
      </div>

      <div class="lineDiv">
        <span class="firstSpan">性别</span>
        <span class="secondSpan">{{reportItem.patientGender}}</span>
      </div>

      <div class="lineDiv">
        <span class="firstSpan">PGI浓度值</span>
        <span class="secondSpan">{{reportItem.vPg1}}</span>
      </div>

      <div class="lineDiv">
        <span class="firstSpan" >PGII浓度值</span>
        <span class="secondSpan">{{reportItem.vPg2}}</span>
      </div>

      <div class="lineDiv">
        <span class="firstSpan">G17浓度值</span>
        <span class="secondSpan">{{reportItem.vG17}}</span>
      </div>

      <div class="lineDiv">
        <span class="firstSpan">HP</span>
        <span class="secondSpan">{{reportItem.vHp}}</span>
      </div>

      <div class="lineDiv">
        <span class="firstSpan">检测地点</span>
        <span class="secondSpan">{{reportItem.siteName}}</span>
      </div>

      <div class="lineDiv">
        <span class="firstSpan">检测日期</span>
        <span class="secondSpan">{{reportItem.testDate | formatDate}}</span>
      </div>

    </div>

    <div class="line" ></div>

    <div class="mainContainer">

      <div class="lineDiv">
        <span class="firstSpan">评分</span>
        <span class="secondSpan">{{reportItem.score}}</span>
      </div>
      <div class="lineDiv">
        <span class="firstSpan">风险</span>
        <span class="secondSpan">{{reportItem.risk}}</span>
      </div>
      <div class="suggestionDiv">
        <div class="suggestion">
          建议
        </div>
        <div class="textArea">
          {{reportItem.suggestion}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {formatDate} from '../../js/mUtils'
import { Indicator } from 'mint-ui';
  export default {
    data () {
      return {
        reportId : this.$route.query.itemId,
        reportItem:{},
/*
        reportItem:{
          "createDate":1553764931412,
          "delFlag":"0",
          "diagnostic":"",
          "gecaId":"549043775453",
          "id":"cfbb213067804cc7a03b85c02428b42c",
          "isDiagnosed":0,
          "mobile":"18919604808",
          "patientAge":"68",
          "patientGender":"女",
          "patientName":"钱桂年",
          "risk":"低",
          "score":"",
          "siteName":"广州市中西医结合医院",
          "suggestion":"胃功能基本正常，每五年复查血清胃功能",
          "testDate":1551772980000,
          "testNo":"0068-02-000023",
          "vG17":"3.09",
          "vHp":"阴性",
          "vPg1":"85.95",
          "vPg2":"5.94"
        }
*/
      }
    },
    filters:{
      formatDate:function (time) {
        let obj = new Date(time);
        return formatDate(obj, 'yyyy-MM-dd hh:mm');
      }
    },
    methods: {
      goBack() {
        this.$router.replace('/reportList');
      }
    },
    create() {
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      });
    },
    mounted() {
      console.log(this.$route.query.itemId);

      let url = "/f/getReport"
      this.axios.post(url, {"id": this.reportId})
        .then(response => {
        this.reportItem = response.data;
        console.log("ok" + response.msg)
        Indicator.close();

    }).catch(error => {
        console.log("error" + error)
    });
    }

  }

</script>

<style lang="scss" scoped>
  @import 'src/css/style';
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
      float: left;
      padding-left: r(5);
      color:#fff;
      box-shadow: 0 0 1px $btn_color;
    }
    .back /deep/ .mint-button {
      height:r(90);
    }
  }

  .headerDiv /deep/ .mintui {
    font-size: $large_font_size;
  }

  .mainContainer{
    padding:0 r(30);
    div, p, span,textarea {
      font-family: Helvetica Neue, Tahoma, Arial;
      font-size: $main_font_size;
      color: $primary_text_color;
    }
  }
  .lineDiv {
    overflow:hidden;
    border-bottom:1px solid #f2f2f2;
    padding:r(25) 0 r(25) 0;
    position:relative;
    .firstSpan {
      float: left;

    }
    .secondSpan{
      float: right;
    }
  }
  .line{

    height:r(30);
    background-color: #f2f2f2;
  }
  .suggestionDiv {
    display:flex;
    overflow:hidden;
    padding:r(25) 0 r(25) 0;
    position:relative;
    .suggestion{
      float: left;
      line-height: r(100);
      width: r(200);
    }
    .textarea {
      padding-left: r(100);
      float: left;
      width: 60%;
      line-height: r(100);
    }
  }


  .header{
    font-size: large;
  }
</style>
