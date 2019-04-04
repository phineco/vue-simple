<template>
  <div v-title data-title="检测报告详情">
    <!--<mt-header fixed title="检测报告详情" class="header"></mt-header>-->
    <div class="mainContainer">
      <mt-cell title="报告名称" v-if="reportItem.reportName">
      <span>{{reportItem.reportName}}</span>
      </mt-cell>
      <mt-cell title="检测编号" v-else>
        <span>{{reportItem.testNo}}</span>
      </mt-cell>

      <mt-cell title="姓名" >
        <span>{{reportItem.patientName}}</span>
      </mt-cell>
      <mt-cell title="年龄" >
        <span>{{reportItem.patientAge}}岁</span>
      </mt-cell>
      <mt-cell title="性别" >
      <span>{{reportItem.patientGender}}</span>
      </mt-cell>

      <mt-cell title="PGI浓度值" >
        <span>{{reportItem.vPg1}}</span>
      </mt-cell>
      <mt-cell title="PGII浓度值" >
        <span>{{reportItem.vPg2}}</span>
      </mt-cell>
      <mt-cell title="G17浓度值" >
        <span>{{reportItem.vG17}}</span>
      </mt-cell>
      <mt-cell title="HP" >
      <span>{{reportItem.vHp}}</span>
      </mt-cell>
      <mt-cell title="检测地点" >
        <span>{{reportItem.siteName}}</span>
      </mt-cell>
      <mt-cell title="检测日期" >
        <span>{{reportItem.testDate | formatDate}}</span>
      </mt-cell>
    </div>


    <div>
      <mt-cell style="background-color: #f4f5f7;min-height: 20px" ></mt-cell>
        <mt-cell title="评分" >
          <span style="color: #000;">{{reportItem.score}}</span>
        </mt-cell>
        <mt-cell title="风险" >
          <span style="color: #000;">{{reportItem.risk}}</span>
        </mt-cell>
        <a class="mint-cell mint-field is-textarea"><!---->
          <div class="mint-cell-left"></div>
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title"><!---->
              <span class="mint-cell-text">建议</span>
            </div>
            <div class="mint-cell-value">
              <textarea readonly placeholder="" rows="3" class="mint-field-core">{{reportItem.suggestion}}</textarea>
              <div class="mint-field-clear" style="display: none;">
                <i class="mintui mintui-field-error"></i></div>
              <span class="mint-field-state is-default">
                <i class="mintui mintui-field-default"></i></span>
              <div class="mint-field-other"></div></div> <!----></div>
          <div class="mint-cell-right"></div>
        </a>

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
        reportItem:{}
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
    },
    create() {
      Indicator.open({
        text: 'Loading...',
        spinnerType: 'fading-circle'
      });
    },
    mounted() {

      console.log(this.$route.query.itemId);

      //http://localhost:8081/geca
      let url = "/f/getReport"
      //let url = "http://geca.biohitcc.com/f/hi";
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
  .mainContainer{
    div, p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }
  .header{
    font-size: large;
  }
</style>
