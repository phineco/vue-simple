<template>
  <div v-title data-title="录入报告">
    <!--<mt-header fixed title="录入报告" class="header"></mt-header>-->
    <div class='mainContainer'>
      <mt-field label="报告名称" placeholder=""
                v-model="reportName"
                v-verify="reportName">
      </mt-field>
      <mt-field label="姓名" placeholder=""
                v-model="patientName"
                v-verify="patientName">
      </mt-field>
      <mt-field label="年龄" placeholder=""
                v-model="patientAge"
                v-verify="patientAge">
      </mt-field>
      <mt-field label="性别" placeholder=""
               disabled >
        <mt-switch :class='getGender' v-model='isMale'>{{patientGender}}</mt-switch>
      </mt-field>

      <mt-field label="PGI浓度值" placeholder=""
                v-model="vPg1"
                v-verify="vPg1">
      </mt-field>
      <mt-field label="PGII浓度值" placeholder=""
                v-model="vPg2"
                v-verify="vPg2">
      </mt-field>
      <mt-field label="G-17浓度值" placeholder=""
                v-model="vG17"
                v-verify="vG17">
      </mt-field>
      <mt-field label="HP" placeholder=""
                disabled >
        <mt-switch :class="getHpValue" v-model='hpValue'>{{vHp}}</mt-switch>
      </mt-field>
      <mt-field label="检测机构" placeholder=""
                v-model="siteName"
                v-verify="siteName">
      </mt-field>
      <mt-field label="检测日期" placeholder=""
                v-model="selectedValue" @focus.native.capture="openPicker"
                v-verify="selectedValue">
      </mt-field>

      <div >
        <ImageUploader
          ref="imageUploader"
          uploadUrl='http://www.scyllatech.cn'
          v-model='imgData'
          v-on:pick="showImg"
        ></ImageUploader>
      </div>
      <!--
      <form>
        <div class='switchOnInput'>
          <mt-cell title='上传图片'>
            <mt-switch :class="getImgValue" v-model='imgValue'></mt-switch>
          </mt-cell>
        </div>
      </form>
      -->

      <mt-actionsheet :actions="data" v-model="sheetVisible"></mt-actionsheet>

      <div class='submit-btnOn'>
        <mt-button class='loginButton'
                   type='primary'
                   size='large'
                   :disabled="isDisabled"
                   @click.native='openPrompt'>保存
        </mt-button>
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

    <!--
    <div class="prove-list-right">
      <div class="prove-right-img"
           @change="showimgUrl">
        <VueImgInputer
          id="imgjust1"
          v-model="imgUrl"
          theme="light"
          :imgSrc="默认的图"
          :nhe="false"
          noMask>
        </VueImgInputer>
      </div>
    </div>
    -->
    </div>

</template>

<script type="text/babel">
  import ImageUploader from '../../components/image-uploader';
  import { MessageBox } from "mint-ui";
  import {formatDate, initWxUploadImage} from '../../js/mUtils';
  import { DatetimePicker } from 'mint-ui';
  import VueImgInputer from '../../components/imgInputer'
  import verify from 'verify-plugin';
  Vue.component(DatetimePicker.name, DatetimePicker)

  export default {
    data() {
      return {
        // action sheet 选项内容
        reportName:null,
        patientName:null,
        patientAge:null,
        patientGender:"男",
        vPg1:null,
        vPg2:null,
        vG17:null,
        vHp:"阴性",
        siteName:null,
        testDate:null,
        selectedValue: null,

        isMale: false,
        hpValue: false,

        itemId:null,
        save: false,
        data: [{
          name: "拍照",
          method: this.getCamera	// 调用methods中的函数
        }, {
          name: "从相册中选择",
          method: this.getLibrary	// 调用methods中的函数
        }],
        // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
        sheetVisible: false,
        imgData:null

      };
    },
    verify: {
      reportName: [
        {
          test: 'required',
          message: '报告名称不能为空'
        }
      ],
      patientName: [
        {
          test: 'required',
          message: '姓名不能为空'
        }
      ],
      patientAge: [
        {
          test: 'required',
          message: '年龄不能为空'
        },
        'positiveInt'
      ],
      vPg1: [
        {
          test: 'required',
          message: 'PGI浓度值不能为空'
        },
        'integerNum'
      ],
      vPg2: [
        {
          test: 'required',
          message: 'PGII浓度值不能为空'
        },
        'integerNum'
      ],
      vG17: [
        {
          test: 'required',
          message: 'G-17浓度值不能为空'
        },
        'integerNum'
      ],
      siteName: [
        {
          test: 'required',
          message: '检测机构不能为空'
        }
      ],
      selectedValue: [
        {
          test: 'required',
          message: '检测日期不能为空'
        }
      ]
    },
    components: {
      VueImgInputer,
      ImageUploader
    },
    methods: {
      showImg (data) {
        console.log(data);
        this.imgData = data.base64;

      },
      openPicker () { // 打开时间选择器
        // 如果已经选过日期，则再次打开时间选择器时，日期回显（不需要回显的话可以去掉 这个判断）
        if (this.selectedValue) {
          this.testDate = this.selectedValue
        } else {
          this.testDate = new Date()
        }
        this.$refs.picker.open();
      },
      dateConfirm () { // 时间选择器确定按钮，并把时间转换成我们需要的时间格式
        this.selectedValue = formatDate(this.testDate, 'yyyy-MM-dd hh:mm');
      },
      actionSheet() {
        // 打开action sheet
        this.sheetVisible = true;
      },
      getCamera() {
        console.log("打开照相机");
      },
      getLibrary() {
        console.log("打开相册");
      },
      ttt() {
        MessageBox.alert("11");
      },
      openPrompt() {
         let url = "/f/createReport"
         this.axios.post(url, {"id": this.reportId,
            reportName: this.reportName,
            patientName: this.patientName,
            patientAge: this.patientAge,
            patientGender: this.patientGender,
            vPg1: this.vPg1,
            vPg2: this.vPg2,
            vG17: this.vG17,
            vHp: this.vHp,
            siteName: this.siteName,
            testDate: this.selectedValue,
            photo: this.imgData
          }
         )
         .then(response => {

            MessageBox.alert("保存成功");
            this.itemId = response.data.id;
           console.log("ok, id=" + this.itemId);
           this.$router.push({
             path:'/reportItem',
             query:{
               itemId : this.itemId
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
    },
    computed: {
      getGender: function() {
        if (this.isMale == true) {
          this.patientGender = "女";
        } else {
          this.patientGender = "男";
        }

      }, getImgValue: function() {
        if (this.imgValue == true) {
          this.sheetVisible = true;
        }

      }, getHpValue: function() {
        if (this.hpValue == true) {
          this.vHp = "阳性";
        } else {
          this.vHp = "阴性";
        }

      },
      isDisabled: function () {
        return !(this.$verify.validate('reportName', true)
          && this.$verify.validate('patientName', true)
          && this.$verify.validate('patientAge', true)
          && this.$verify.validate('vG17', true)
          && this.$verify.validate('vPg1', true)
          && this.$verify.validate('vPg2', true)
          && this.$verify.validate('siteName', true)
          && this.$verify.validate('selectedValue', true)
        );

      }
    }, created() {
      /* MessageBox.prompt('请输入密码', {
       inputValidator: (val) => {
       if (val === null) {
       return true;//初始化的值为null，不做处理的话，刚打开MessageBox就会校验出错，影响用户体验
       }
       return !(val.length < 6 || val.length > 8)
       }, inputErrorMessage: '密码长度必须在6~8位'
       }).then((val) => {
       console.info('confirm,value is' + val.value)
       }, () => {
       console.info('cancel')
       })*/
      /*  */
    }
  };

</script>

<style lang='scss' scoped>
  .mainContainer{
    div, p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }
  .header{
    font-size: large;
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

  .submit-btnOn {
    padding: 15px;
  }
</style>
