<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { reqRegister } from "@/api/user";
import type { RegisterForm } from "@/types/user";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const loading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const form = reactive<RegisterForm>({
  name: "",
  email: "",
  password: "",
  confirmedPassword: "",
});

const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (form.confirmedPassword !== "") {
      formRef.value?.validateField("confirmedPassword");
    }
    callback();
  }
};
const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("請輸入確認密碼"));
  } else if (value !== form.password) {
    callback(new Error("密碼與確認密碼不相同"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<RegisterForm>>({
  password: [
    { required: true, message: "請輸入密碼", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
  confirmedPassword: [
    {
      required: true,
      message: "請輸入確認密碼",
      trigger: "blur",
    },
    { validator: validatePass2, trigger: "blur" },
  ],
  name: [
    {
      required: true,
      message: "請輸入使用者名稱",
      trigger: "blur",
    },
    { min: 3, message: "長度至少為三位數", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      message: "請輸入Email",
      trigger: "blur",
    },
    {
      type: "email",
      message: "請輸入正確的Email帳號",
      trigger: ["blur", "change"],
    },
  ],
});

const handleRegister = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  loading.value = true;
  try {
    const res = await reqRegister(form);
    console.log(res);
    if (res.data.status === "success") {
      ElNotification({
        type: "success",
        message: "註冊成功",
      });
      router.push("/login");
    } else {
      ElNotification({
        type: "error",
        message: "註冊失敗，請聯絡管理人員",
      });
    }
  } catch (err) {
    console.error(err);
    ElNotification({
      type: "error",
      message: (err as Error).message,
    });
  }
};
</script>
<template>
  <div class="login-container">
    <div class="outer-wrapper">
      <div class="register-photo">
        <h2>使用者註冊</h2>
        <img src="/register.png" />
      </div>

      <el-form class="login-form" :model="form" :rules="rules" ref="formRef">
        <h2>使用者註冊</h2>
        <el-form-item label="姓名" label-position="top" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Email" label-position="top" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="密碼" label-position="top" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            show-password
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="確認密碼"
          label-position="top"
          prop="confirmedPassword"
        >
          <el-input
            type="password"
            v-model="form.confirmedPassword"
            show-password
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleRegister">註冊</el-button>
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

  .el-button {
    margin-top: 10px;
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
