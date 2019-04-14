<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$router.currentRoute.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$router.currentRoute.meta.keepAlive" />
    <div class="app_footer"
         v-show="isShowTab">
      <!--
      <router-link to="/userInfo">
        <i class="iconfont icon-shouye" />
        <p>主页</p>
      </router-link>
      <router-link to="/reportList">
        <i class="iconfont icon-tabproducticon" />
        <p>检测报告</p>
      </router-link>
      <router-link to="/hospitalList">
        <i class="iconfont icon-wode" />
        <p>预约</p>
      </router-link>-->

      <ul class="choose-city" >
        <li :class="cityDefault == 0? 'active':''"  @click="cityDefault = 0; goto(0)" >
        <i class="iconfont icon-shouye" />
          <p>主页</p>
       </li>
        <li :class="cityDefault == 1? 'active':''"  @click="cityDefault = 1; goto(1)">
          <i class="iconfont icon-tabproducticon" />
          <p>检测报告</p>
        </li>
        <li :class="cityDefault == 2? 'active':''"  @click="cityDefault = 2; goto(2)">
          <i class="iconfont icon-wode" />
          <p>预约</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: 'app',
    data() {
      return {
        search: '',
        cityDefault:0,
      };
    },
    methods: {
      goto(idx) {
        if (idx == 0) {
          this.$router.replace("/userInfo")
        } else if (idx == 1) {
          this.$router.replace("/reportList")
        } else if (idx == 2) {
          this.$router.replace("/hospitalList")
        }
      }
    },
    computed: {
      /**
       * 是否显示底部tab
       */
      isShowTab() {
        return /hospitalList|userInfo|reportList/.test(this.$route.path);
      },
      ...mapState({
          pageDirection: state => state.global.pageDirection
  })
  },
  created() {
    //解决微信 title 设置异常问题
    document.setTitle = title => {
      document.title = title;
      if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
        var i = document.createElement('iframe');
        i.src = '../favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
          setTimeout(function() {
            i.remove();
          }, 9);
        };
        document.body.appendChild(i);
      }
    };
  },
  beforeCreate() {}
  };
</script>

<style lang="scss" scoped>
  @import 'src/css/style';
  .PB-48 {
    padding-bottom: 56px;
  }

  .choose-city{
    overflow:hidden;
    text-align:center;
  li{
    display:inline-block;
    width:r(150);
   // border:1px solid $btn_color;
    height:r(40);
    font-size:$small_font_size;
    color: $primary_text_color;
    text-align:center;
    line-height:r(40);
    margin-left:r(60);
    text-align:center;
    i{
      font-size: 1.2rem;
    }
    p{
      padding-bottom: r(10);
    }
  }
  .active{
    color:$btn_color;;
  }
  }

  .app_footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #fff;
    border-top: 1px solid #e8e8e8;
  a {
    display: block;
    flex: 1;
    text-align: center;
    text-decoration: none;
    font-size: $small_font_size;
    color: $primary_text_color;
  i {
    font-size: 30px;
  }
  }
  .router-link-exact-active,
  .router-link-active {
  i {
    color: $secondary_text_color;
  }
  p {
    color: $secondary_text_color;
  }
  }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  .child-view {
    position: relative;
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }
  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }
</style>
