<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">欢迎来到智能网联汽车科普平台！</span>
      </div>
      <div class="desc"></div>
    </div>
    <div class="register">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="请设置您的账户名和密码" key="1">
            <a-alert type="error" :closable="true" v-if="error" :message="error" @close='onClose' showIcon style="margin-bottom: 24px;" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请设置您的用户名"
                v-decorator="['name', {rules: [{ required: true, message: '您还未输入账户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请设置您的密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="['password', {rules: [{ required: true, message: '您还未输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <!-- 添加管理员注册勾选框 -->
            <a-form-item>
              <a-checkbox v-model="isAdminRegister" @change="handleAdminRegisterChange">管理员注册</a-checkbox>
            </a-form-item>
            <!-- 添加管理员验证码输入框，默认隐藏 -->
            <a-form-item v-show="isAdminRegister">
              <a-input
                size="large"
                placeholder="请输入管理员验证码"
                autocomplete="off"
                v-decorator="['adminCode', {rules: []}]"
              >
                <a-icon slot="prefix" type="key" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">确定</a-button>
        </a-form-item>
        <router-link style="float: right" to="../login" >返回并登录</router-link>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
// 导入axios用于发送HTTP请求
import axios from 'axios';
export default {
  name: 'Register',
  components: { CommonLayout },
  data () {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this),
      // 添加用于绑定勾选框选中状态的数据属性，初始为false
      isAdminRegister: false,
      adminRegisterClickCount: 0
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    onSubmit() {
    this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue('name');
          const password = this.form.getFieldValue('password');
          const adminCode = this.isAdminRegister? this.form.getFieldValue('adminCode') : '';
          // 向Django后端的注册接口发送注册请求，这里假设注册接口地址是 /api/register
          axios.post('http://127.0.0.1:8000/register/', {
            username: name,
            password: password,
            adminCode: adminCode
          })
         .then(this.afterRegister);}})  
    },
   
    afterRegister(res) {
      console.log("Start the condition");
      this.logging = false;
      if (res.status==201) {
         console.log("success");
        console.log("HEllo");
        this.$router.push('/login');
        this.$message.success(res.data.message, 10);
        
      } else {
          console.log("flase");
          this.$message.error(res.data.error, 10);
        
      }
    },
    
    onClose() {
      this.error = false;
    },
    // 处理勾选框状态改变的方法
    handleAdminRegisterChange (checked) {
      // 每次点击勾选框，点击次数加1
      this.adminRegisterClickCount++;
      // 判断点击次数的奇偶性，如果是偶数次，隐藏勾选框，同时将绑定的选中状态设为false
      if (this.adminRegisterClickCount % 2 === 0) {
        this.isAdminRegister = false;
      } else {
        // 如果是奇数次，根据传入的当前勾选状态设置绑定的选中状态
        this.isAdminRegister = checked;
      }
    }
  }
}
</script>
<style lang="less" scoped>
 .common-layout{
   .top {
      text-align: center;
     .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
       .logo {
          height: 44px;
          vertical-align: top;
          marginRight: 16px;
        }
       .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
     .desc {
        font-size: 14px;
        color: @text-color-second;
        marginTop: 12px;
        marginBottom: 40px;
      }
    }
   .register{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
       .captcha-button{
          font-size: 14px;
        }
      }
     .icon {
        font-size: 24px;
        color: @text-color-second;
        marginLeft: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;
        visibility: hidden;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>