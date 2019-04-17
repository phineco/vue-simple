<template>
  <div>
    <div class="headerDiv">
      待筛查人员信息
    </div>
    <div class="login_container">

      <mt-field label="姓名" placeholder=""
                v-model="name"
                v-verify="name">
      </mt-field>
      <mt-field label="性别" placeholder=""
                disabled >
        <mt-switch :class='getGender' v-model='isMale'>{{sex}}</mt-switch>
      </mt-field>
      <div @click.stop="openPicker" class="disableInput" ref="disableInput">
        <mt-field label="出生日期" placeholder=""
                  v-model="selectedValue"
                  v-verify="selectedValue">
        </mt-field>
      </div>

      <mt-field label="随访联系电话" placeholder="可选填"
                v-model="contact"
                v-verify="contact">
      </mt-field>

      <div class="bind-btn" @click.stop="register">提    交</div>

      <p class="examP">注:请务必填写现场待抽血人员的实际信息!</p>
    </div>


    <div class="pickerPop" @touchmove.prevent>
      <mt-datetime-picker
        ref="picker"
        type="date"
        v-model="testDate"
        :endDate="endDate"
        :startDate="startDate"
        lockScroll="true"
        class="myPicker"
        year-format="{value}"
        month-format="{value}"
        date-format="{value}"
        @confirm="dateConfirm()"
      >
      </mt-datetime-picker>
    </div>

  </div>
</template>

<script type="application/ecmascript">
  import { LOGIN } from '@/store/types';
  import {sendVerifyCode,sendLogin} from '../../js/api';
  import { DatetimePicker } from 'mint-ui';
  import {formatDate} from '../../js/mUtils';
  import { MessageBox } from "mint-ui";
  import verify from 'verify-plugin';
  Vue.component(DatetimePicker.name, DatetimePicker)

  export default {
    name: '',
    data() {
      return {
        name: null,
        isMale: false,
        sex:"男",
        mobile:null,
        contact:null,
        selectedValue:null,
        testDate:null,
        startDate:new Date('1945-01-01'),
        endDate:new Date('1985-12-31'),
        examId:null
      };
    },
    verify: {
      name: [
        {
          test: 'required',
          message: '姓名不能为空'
        }
      ],
      selectedValue: [
        {
          test: 'required',
          message: '出生日期不能为空'
        }
      ],
      contact: [
        'mobile'
      ],
    },
    mounted() {
      //console.log(this.$refs.disableInput.querySelector('input'))
      this.$refs.disableInput.querySelector('input').setAttribute("disabled","disabled");
    },
    computed: {
      getGender: function() {
        if (this.isMale == true) {
          this.sex = "女";
        } else {
          this.sex = "男";
        }

      }
      ,
      isDisabled: function () {
        return !(this.$verify.validate('name', true)
          && this.$verify.validate('selectedValue', true)
        );

      }
    },
    methods: {
      openPicker () { // 打开时间选择器
        // 如果已经选过日期，则再次打开时间选择器时，日期回显（不需要回显的话可以去掉 这个判断）
        if (this.selectedValue) {
          this.testDate = this.selectedValue;
        } else {
          this.testDate = new Date('1980-01-01');
        }
        this.$refs.picker.open();
      },
      dateConfirm () { // 时间选择器确定按钮，并把时间转换成我们需要的时间格式
        //alert(this.testDate instanceof Date);
        if (this.testDate instanceof Date) {
          //如果打开日历但没有选择日期时,不会返回值
          this.selectedValue = formatDate(this.testDate, 'yyyy-MM-dd');
        }
      },

      register() {
        if (!this.$verify.check()){
          return;
          }
          let url = "/f/register"
        this.axios.post(url, {"activityId": 1,
            hospitalId: this.$route.query.hospitalId,
            name: this.name,
            sex: this.sex,
            birthday: this.testDate,
            mobile: this.mobile,
            contact: this.contact,
            isSync: 0
          }
          )
          .then(response => {

          MessageBox.alert("保存成功");
        this.examId = response.data.examId;
        console.log("ok, id=" + this.examId);
        this.$router.replace({
          path:'/userInfo',
          query:{
            examId : this.examId
          }
        });
      }).catch(error => {
          console.log("error" + error)
        MessageBox.alert("保存失败,请重试");
      });
        /*
         MessageBox.prompt(' ', '请输入标题').then(({ value }) => {
         if (value) {
         MessageBox.alert(`请输入标题是 ${ value }`, '输入成功');
         }
         });*/
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import 'src/css/style';
  .login_container {
    margin-left: r(40);
    margin-right: r(40);
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


  .pickerPop{
  /deep/ .picker{
  .picker-toolbar{
    background-color: #eee;
  .mint-datetime-action{
    font-size: 1rem;
    color: #000!important;
  }
  }
  }
  }

  .bind-btn{
    width:r(690);
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

  .disableInput{
  /deep/ .mint-field-core {
    readonly:true;
         }
   input{
     color: #000000;
   }
  }
</style>
