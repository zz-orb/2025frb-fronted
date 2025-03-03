<template>
    <common-layout>
      <div class="top">
        <div class="header">
          <img alt="logo" class="logo" src="@/assets/img/logo.png" />
          <span class="title">重置用户信息</span>
        </div>
        <div class="desc"></div>
      </div>
      <div class="login">
        <a-form @submit="onSubmit" :form="form">
          <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
            <a-tab-pane tab="重置用户信息" key="1">
              <a-alert type="error" :closable="true" v-if="error" :message="error" @close='onClose' showIcon style="margin-bottom: 24px;" />
              <a-form-item>
                <a-input
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="请输入新用户名^^"
                  v-decorator="['name', {rules: [{ required: true, message: '您还未输入账户名', whitespace: true}]}]"
                >
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  size="large"
                  placeholder="请输入新密码^^"
                  autocomplete="autocomplete"
                  type="password"
                  v-decorator="['password', {rules: [{ required: true, message: '您还未输入密码', whitespace: true}]}]"
                >
                  <a-icon slot="prefix" type="lock" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">确认</a-button>
          </a-form-item>
        </a-form>
      </div>
    </common-layout>
  </template>
  
  <script>
  import CommonLayout from '@/layouts/CommonLayout'
  import {mapMutations} from 'vuex'
  import axios from 'axios'
  export default {
  name: 'Information',
  components: { CommonLayout },
  data () {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
   ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue('name');
          const password = this.form.getFieldValue('password');
          // 向Django后端的注册接口发送注册请求，这里假设注册接口地址是 /api/register
          axios.post('http://127.0.0.1:8000/user_center/', {
            username: name,
            password: password
          })
         .then(this.afterRegister)
         .catch((error) => {
            this.logging = false;
            this.error = error.response.data;
          });
        }
      });
    },
    afterRegister(res) {
      this.logging = false;
      if (res.status == 200) {
        console.log('修改信息成功');
        this.$message.success(res.data.message, 30);
      } else {
        console.log('修改信息失败');
      }
    },
    onClose() {
      this.error = false;
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
            margin-right: 16px;
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
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
      .login{
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
          margin-left: 16px;
          vertical-align: middle;
          cursor: pointer;
          transition: color 0.3s;
  
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
  </style>
  