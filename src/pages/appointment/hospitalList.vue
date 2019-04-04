<template>
  <div v-title data-title="联盟医院">
    <!--<mt-header fixed title="检测报告列表" class="header"></mt-header>-->
    <div class="mainContainer"  v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <div v-for="(item, index) in hospitalList" >
        <mt-cell :title="item.name" >
          <span>
            <mt-button disabled size="small">筛查预约</mt-button>
            <mt-button disabled size="small">胃镜预约</mt-button>
          </span>
        </mt-cell>
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
        /*
        hospitalList: [{name:"安徽医科大学第一附属医院"},
          {name:"安徽省立医院"}
          ],*/
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
    },
    watch: {
    },
    methods: {
      loadMore() {
        if(this.lastPage) {
          return;
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
  .mainContainer {
  div, p, span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
  }
  .header{
    font-size: large;
  }
</style>
