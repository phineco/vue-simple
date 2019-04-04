<template>
  <div v-title data-title="检测报告列表">
    <!--<mt-header fixed title="检测报告列表" class="header"></mt-header>-->
    <div class="mainContainer" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <div v-for="(item, index) in reportList" @click.stop="gotoDetail(item.id)" >
        <mt-cell :title="item.patientName" is-link>
          <span>{{item.testDate | formatDate}}</span>
        </mt-cell>
       </div>
      <div v-if="reportList.length == 0 && noData" style="margin: 10px;">
        <p style="color:grey;font-size: 16px;">未查询到符合条件的检查记录</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '../../js/mUtils'
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
.mainContainer {
  div, p, span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.header{
  font-size: large;
}
</style>
