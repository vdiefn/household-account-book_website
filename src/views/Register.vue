<script lang="ts" setup>
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
    <div class="outer-wrapper">
      <div class="register-photo">
        <h2>使用者註冊</h2>
        <img src="/register.png" />
      </div>

      <el-form class="login-form" :model="form">
        <h2>使用者註冊</h2>
        <el-form-item label="Email" label-position="top">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="密碼" label-position="top">
          <el-input
            type="password"
            v-model="form.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="確認密碼" label-position="top">
          <el-input
            type="password"
            v-model="form.confirmedPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success">註冊</el-button>
          <el-button class="login-btn" @click="router.push('/login')" link>
            返回登入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
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

  .outer-wrapper {
    max-width: 700px;
    min-width: 300px;
    display: grid;
    grid-template-columns: 100%;
    justify-items: center;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(166, 182, 167, 0.3);

    .register-photo {
      display: none;
    }

    .login-form {
      width: 100%;
      min-width: 300px;
      padding: 0.5rem 1rem;

      h2 {
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
        color: #2f4f4f;
        font-size: 1.5rem;
      }
    }
  }

  @media (min-width: $breakpoint-tablet) {
    .outer-wrapper {
      grid-template-columns: 40% 60%;
      align-items: center;
      grid-gap: 1rem;

      .register-photo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h2 {
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
          color: #2f4f4f;
          font-size: 1.5rem;
          margin: 20px 0;
        }
      }

      .login-form {
        width: 100%;

        h2 {
          display: none;
        }
      }
    }
  }
}
</style>
