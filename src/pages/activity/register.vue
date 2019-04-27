<template>
  <div>
    <div class="headerDiv">
      待筛查人员信息
    </div>
    <div class="login_container" v-if="isDisplay">

      <ul class="list">
        <li >
          <div>
            <div class="fr-text"><input v-model="name" placeholder="请输入姓名" v-verify="name" maxlength="10"/></div>
            <div class="nav-name" >姓名</div>
          </div>
          </li>
        <li>
          <div>
            <div class="">
              <div class="fruit">

                <label class="test-label"><input class="test-radio" type="radio" v-model="sex" value="男" name="radio"><span class="test-radioInput1"></span>男</label>
                <label class="test-label"><input class="test-radio" type="radio" v-model="sex" value="女" name="radio"><span class="test-radioInput2"></span>女</label>
              </div>
              </div>
            <div class="nav-name" >性别</div>
          </div>
        </li>
        <li>
          <div>
            <div class="fr-text">
              <!--<input type="text" onfocus="this.blur()" @click = "setDate" v-bind:value="selectedValue" placeholder="请选择出生日期"/>-->
              <input class="year" type="number" v-model="year" v-verify="year" oninput="if(value.length>4)value=value.slice(0,4)"/> 年
              <input class="month" type="number" v-model="month" v-verify="month" oninput="if(value.length>2)value=value.slice(0,2)"/> 月
            </div>
            <div class="nav-name" >出生年月</div>
          </div>
        </li>


        <li>
          <div >
            <div class="fr-text"><input  type="number" v-model="contact" placeholder="" v-verify="contact"/></div>
            <div class="nav-name" >随访联系电话</div>
          </div>
        </li>


      </ul>

      <div class="bind-btn" @click.stop="register">提    交</div>

      <p class="examP">注:请务必填写现场待抽血人员的实际信息!</p>
    </div>
    <div v-else class="introduce">
      <div>
        请参照以下步骤进行报名:
        <p>
          1. 扫描关注联盟微信公众号
        </p>
        <p>
          2. 在公众号菜单里选择"GECA服务",进入"个人中心"
        </p>
        <p>
          3. 绑定手机号
        </p>
        <p>
          4. 扫描筛查报名二维码,填入报名信息
        </p>
        <p>
          5. 将生成的筛查编号出示给工作人员记录
        </p>
      </div>

    </div>
  </div>
</template>

<script type="application/ecmascript">
  import { LOGIN } from '@/store/types';
  import {sendVerifyCode,sendLogin} from '../../js/api';
  import {formatDate, getCookieByName} from '../../js/mUtils';
  import { MessageBox } from "mint-ui";
  import verify from 'verify-plugin';
  import { Toast } from 'mint-ui';


  export default {
    name: '',
    data() {
      return {
        isDisplay:false,
        name: null,
        isMale: false,
        sex: null,
        mobile:null,
        contact:null,
        selectedValue:"1980-01-01",
        examId:null,
        year:null,
        month:null,
        options:[{label:'男', value:'男'}, {label:'女', value:'女'}]
      };
    },
    verify: {
      name: [
        {
          test: 'required',
          message: '姓名不能为空'
        }
      ],
      year:[
        'number',
        {
          test: 'required',
          message: '年不能为空'
        },
        {
          min:1900,
        },
        {
          max:2019
        }
      ],
      month:[
        'number',
        {
          test: 'required',
          message: '月不能为空'
        },
        {
          min:1,
        },
        {
          max:12
        }
      ],
      selectedValue: [
        'number',
        {
          test: 'required',
          message: '出生年月不能为空'
        }
      ],
      contact: [
        'mobile'
      ],
    },
    mounted() {
      if (getCookieByName("mxgs_token") != "") {
        this.getRegisterInfo();
      } else {

      }
    },
    computed: {
    },
    methods: {
      getRegisterInfo() {
        let url = '/f/getRegisterInfo';
        this.axios.post(url, {})
          .then(response => {
          this.registerInfo = response.data;
           if (this.registerInfo.examId != 0) {
             MessageBox.alert("您已经报过名");
             this.$router.replace({
               path:'/userInfo'
             });
           } else {
             this.isDisplay = true;
           }

      })
      },
      register() {
        if (!this.$verify.check()){
          return;
          }

        if(this.sex == null) {
          Toast("请选择性别");
          return;
        }

          this.selectedValue = new Date();
          this.selectedValue.setFullYear(this.year, this.month - 1, 1);


          let url = "/f/register"
        this.axios.post(url, {"activityId": 1,
            hospitalId: this.$route.query.hospitalId,
            name: this.name,
            sex: this.sex,
            birthday: this.selectedValue,
            mobile: this.mobile,
            contact: this.contact,
            age: this.age,
            isSync: 0
          }
          )
          .then(response => {


        this.examId = response.data.examId;
        console.log("ok, id=" + this.examId);
        if (this.examId == 0) {
          MessageBox.alert("请先绑定手机号");
          this.$router.replace({
            path:'/userInfo'
          });
        } else {
          MessageBox.alert("保存成功");
          this.hospitalId = response.data.hospitalId;
          this.$router.replace({
            path:'/userInfo',
            query:{
              examId : this.examId,
              hospitalId: this.hospitalId
            }
          });
        }

      }).catch(error => {
          console.log("error" + error)
        MessageBox.alert("保存失败,请重试");
      });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import 'src/css/style';
  .login_container {
    div, p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
      font-size: $main_font_size;
    }
    .examP{
      color: red;
      text-align:center;
      font-size: $large_font_size;
      margin:r(50) auto 0;

    }
    /deep/ .mint-cell-wrapper {
           font-size: $main_font_size;
         }
  }

  .bind-btn{
    width:r(670);
    height:r(90);
    margin:r(50) auto 0;
    border-radius:r(6);
    background: $btn_color;
    font-size:$large_font_size;
    color:#fff;
    text-align:center;
    line-height:r(90);
  }
  .headerDiv {
    width: 100%;
    height: r(90);
    background: $btn_color;
    font-size: $large_font_size;
    color: #fff;
    text-align: center;
    line-height: r(90);
    background-color: $secondary_text_color;
  }

.list{
  background-color:#ffffff;
  li {
    margin-left: r(20);
    margin-right: r(20);
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
    line-height: r(60);
    padding-top: r(5);
    span {
      padding-top: r(5);
      padding-right: r(30);
    }
    input{
      font-size: $main_font_size;
      line-height: r(45);
      border: 1px;

    }
    .year {
      text-align: right;
      width: r(140);
    }
    .month {
      text-align: right;
      width: r(80);
    }
  img {
    height: r(36);
    width: r(20);
  }
  }
  .nav-name {
    font-size: $main_font_size;
    color: $primary_text_color;
    line-height: r(60);
  }
  }
  }
  .introduce{
    font-family: Helvetica Neue, Tahoma, Arial;
    margin:20px auto 0;
    div {
      font-size: $large_font_size;
      padding: r(20);
    }
    p {
      padding: r(10);
      font-size: $main_font_size
    }
  }

  .fruit{
    float: right;
    font-size: $main_font_size;
    line-height: r(60);
  }
  .test-label{
    padding-left: r(30);
    display:inline-block
  }
  .test-radio{display:none}
  .test-radioInput1{
    background:url('../../assets/icon_RadioButtonUnse.png') no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    display:inline-block;
    height: r(45);
    margin-right:r(20);
    vertical-align:middle;
    width:r(45);
  }
  .test-radio:checked+
  .test-radioInput1{
    background:url('../../assets/icon_RadioButtonSele.png') no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    display:inline-block;
    vertical-align:middle;
    margin-right:r(20);
    height:r(45);
    width:r(45);
  }

  .test-radioInput2{
    background:url('../../assets/icon_RadioButtonUnse.png') no-repeat;
    background-size:100% 100%;-moz-background-size:100% 100%;
    display:inline-block;
    height: r(45);
    margin-right:r(20);
    vertical-align:middle;
    width:r(45);
  }
  .test-radio:checked+
  .test-radioInput2{
    background:url('../../assets/icon_RadioButtonSele.png') no-repeat;
    background-size:100% 100%;-moz-background-size:100% 100%;
    display:inline-block;
    vertical-align:middle;
    margin-right:r(20);
    height:r(45);
    width:r(45);
  }

</style>
