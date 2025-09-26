export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
  confirmedPassword: string;
}

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}
