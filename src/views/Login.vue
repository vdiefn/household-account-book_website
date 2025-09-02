<script lang="ts" setup>
import { reactive } from "vue";

const loginForm = reactive({
  email: "",
  password: "",
});
</script>
<template>
  <div class="login-container">
    <el-form class="login-form">
      <h1>HELLO</h1>
      <h2>歡迎使用記帳系統</h2>
      <el-form-item>
        <el-input v-model="loginForm.email" />
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="loginForm.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="success">登入</el-button>
        <el-button link>註冊</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.login-container {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/background-image.jpg");
  background-repeat: no-repeat;
  background-size: cover;

  .login-form {
    width: 600px;
    height: 350px;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    h1,
    h2 {
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    }

    h1 {
      color: #2f4f4f;
      font-size: 40px;
      font-weight: 700;
    }

    h2 {
      color: #2f4f4f;
      font-size: 20px;
      margin: 20px 0;
    }
  }
}
</style>
