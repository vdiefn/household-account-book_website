<script lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import type { RegisterForm } from "@/types/user";

const router = useRouter();
const form = reactive<RegisterForm>({
  email: "",
  password: "",
  confirmedPassword: "",
});
</script>
<template>
  <div class="login-container">
    <el-form class="login-form" :model="form">
      <h1>HELLO</h1>
      <h2>歡迎使用記帳系統</h2>
      <el-form-item>
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="form.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="form.confirmedPassword"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="success"
          @click="router.push('/login')"
        >
          登入
        </el-button>
        <el-button link @click="handleRegister">註冊</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/background-image.jpg");
  background-repeat: no-repeat;
  background-size: cover;

  .login-form {
    width: 80%;
    min-width: 300px;
    height: 350px;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(166, 182, 167, 0.3);

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

  @media (min-width: $breakpoint-tablet) {
    .login-form {
      width: 500px;
      height: 350px;
    }
  }
}
</style>
