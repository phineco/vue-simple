<template>
  <div>
    <!--<mt-header fixed title="检测报告详情" class="header"></mt-header>-->
    <div class="headerDiv">
      <div class="back" @click.stop="goBack"><mt-button icon="back"></mt-button></div>
      检测报告详情
    </div>

    <div class="mainContainer">
       <div class="lineDiv" >
         <span class="firstSpan">{{reportItem.patientName}}</span>
         <span class="center">{{reportItem.patientGender}}</span>
         <span class="secondSpan">{{reportItem.patientAge}}岁</span>
       </div>
      <div v-if="reportItem.reportName" class="lineDiv" >
        <span class="firstSpan">报告名称: {{reportItem.reportName}}</span>
        <span class="secondSpan">检测日期: {{reportItem.testDate | formatDate}}</span>
      </div>
      <div v-else class="lineDiv">
        <span class="firstSpan">检测编号: {{reportItem.testNo}}</span>
        <span class="secondSpan">检测日期: {{reportItem.testDate | formatDate}}</span>
      </div>
      <div class="lineDiv">
        <span class="firstSpan">检测医院</span>
        <span class="secondSpan">{{reportItem.siteName}}</span>
      </div>
      </div>

      <div class="line" ></div>
    <div class="mainContainer">


      <div class="row">
          <div class="first">胃蛋白酶原I(PGI):
          <span class="value">{{reportItem.vPg1}} {{reportItem.pg1Unit}}</span>
            <span class="flag" v-if="reportItem.pg1Flag === 'H'">↑</span>
            <span class="flag" v-if="reportItem.pg1Flag === 'L'">↓</span>
          </div>
          <div class="second">参考区间: {{reportItem.pg1Min}}-{{reportItem.pg1Max}} {{reportItem.pg1Unit}}</div>
        </div>
      <div>

        <div class="row">
          <div class="first" >胃蛋白酶原II(PGII):
            <span class="value">{{reportItem.vPg2}} {{reportItem.pg2Unit}}</span>
            <span class="flag" v-if="reportItem.pg2Flag === 'H'">↑</span>
            <span class="flag" v-if="reportItem.pg2Flag === 'L'">↓</span>
          </div>
          <div class="second">参考区间: {{reportItem.pg2Min}}-{{reportItem.pg2Max}} {{reportItem.pg2Unit}}</div>
        </div>
      </div>

      <div class="row">
          <div class="first">胃蛋白酶原I/II(PGR):
            <span class="value">{{reportItem.pgr}} {{reportItem.prgUnit}}</span>
            <span class="flag" v-if="reportItem.pgrFlag === 'H'">↑</span>
            <span class="flag" v-if="reportItem.pgrFlag === 'L'">↓</span>
          </div>
          <div class="second">参考区间: {{reportItem.pgrMin}}-{{reportItem.pgrMax}} {{reportItem.prgUnit}}</div>
      </div>

      <div class="row">
          <div class="first" >胃泌素17(G-17):
            <span class="value">{{reportItem.vG17}} {{reportItem.v17Unit}}</span>
            <span class="flag" v-if="reportItem.v17Flag === 'H'">↑</span>
            <span class="flag" v-if="reportItem.v17Flag === 'L'">↓</span>
          </div>
          <div class="second">参考区间: {{reportItem.v17Min}}-{{reportItem.v17Max}} {{reportItem.v17Unit}}</div>
      </div>

      <div class="lineDiv">
        <span class="firstSpan">幽门螺杆菌(HP)</span>
        <span class="secondSpan">{{reportItem.vHp}}</span>
      </div>
    </div>

    <div class="line" ></div>

    <div class="mainContainer">

      <div class="lineDiv">
        <span class="firstSpan">筛查评分</span>
        <span class="secondSpan">{{reportItem.score}}</span>
      </div>
      <!--
      <div class="lineDiv">
        <span class="firstSpan">风险</span>
        <span class="secondSpan">{{reportItem.risk}}</span>
      </div>
      -->
      <div class="suggestionDiv">
        <div class="suggestion">
          综合建议
        </div>
        <div class="textArea">
          {{reportItem.suggestion}}
        </div>
      </div>

    </div>
    <div class="line" ></div>

    <div class="mainContainer">


    <div class="hint">
      单项检测指标意义:
      <p>1) 若PGR≤3 提示中、重度胃体萎缩性胃炎。</p>
      <p>2) 若PGI＜30ug/L 提示胃体萎缩性胃炎。</p>
      <p>3) 若PGII＞11ug/L 提示胃部炎症。</p>
      <p>4) 若G-17＜1pmol/L 高酸，提示胃食管反流病；</p>
      <p>若G-17＞7pmol/L 低酸，提示胃部炎症，有萎缩性胃炎风险。</p>
    </div>
    <div class="hint">
      注意事项:
      <p>1) 服用PPI类药物后, 胃功能指标通常显著升高, 一般停药2周后可恢复为治疗前水平,</p>
      <p>若服用PPI类药物后指标升高不明显，则存在萎缩风险。</p>
      <p>2) 溃疡患者PGI,PGII,G-17三项指标会有一定程度升高。</p>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '../../js/mUtils'
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
        return formatDate(obj, 'yyyy-MM-dd');
      }
    },
    methods: {
      goBack() {
        this.$router.replace('/reportList');
      }
    },
    create() {
    },
    mounted() {
      console.log(this.$route.query.itemId);

      let url = "/f/getReport"
      this.axios.post(url, {"id": this.reportId})
        .then(response => {
        this.reportItem = response.data;
        console.log("ok" + response.msg)

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
      height:r(80);
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
      padding-right: r(10);
    }
    .center{

      padding-left: r(300);
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

  .row{
    position: relative;
    overflow:hidden;
    border-bottom:1px solid #f2f2f2;
    margin:r(5);
    line-height: r(60);
    .first{
      .value{
        padding-left: r(10);
      }
      .flag{
        float: right;
        padding-right: r(20);
      }
    }
    .second{

    }
  }

  .vline{
    float:left;
    margin-left: r(30);
    margin-right: r(30);
    margin-top: r(10);
    width: r(4);
    height: r(70);
    background: #e9e9e9;
  }
  .header{
    font-size: large;
  }

  .hint{
    margin-top: r(20);
    p{
      padding-top: r(10);
      padding-left: r(20);
    }
  }
</style>
