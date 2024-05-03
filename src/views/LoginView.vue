<template>
    <div class="login">
        <div class="login-content">
            <img
                src="../../public/login.png"
                class="login-image" />
            <el-form
                :model="loginEmpData"
                ref="loginEmpForm"
                class="login-form">
                <el-row>
                    <el-col
                        :span="24"
                        :push="2">
                        <h1>LTT管理系统</h1>
                    </el-col>
                </el-row>
                <el-row style="align-items: center">
                    <el-col :span="6">
                        <el-form-item style="display: flex; flex-direction: row">
                            <strong style="font-weight: bolder">用户名:</strong>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item prop="username">
                            <el-input
                                v-model="loginEmpData.username"
                                placeholder="Username"
                                class="input-login" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item style="display: flex; flex-direction: row">
                            <strong style="font-weight: bolder">密码:</strong>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item prop="password">
                            <el-input
                                type="password"
                                v-model="loginEmpData.password"
                                placeholder="Password"
                                class="input-login" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div
                    solt="footer"
                    align="right">
                    <el-button
                        type="primary"
                        @click="resetLoginEmpForm"
                        >Reset</el-button
                    >
                    <el-button
                        type="primary"
                        @click="LoginEmpSubmit"
                        >Login</el-button
                    >
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { serverURL } from "../config/server/serverURL.js";
import { showMessage } from "../Utils/showMessage.js";

export default {
    data() {
        return {
            // 登录用户信息
            loginEmpData: {},
        };
    },
    methods: {
        // 登录用户
        LoginEmpSubmit() {
            axios.post(`${serverURL}/login`, this.loginEmpData).then((response) => {
                showMessage(response, this, () => {
                    sessionStorage.setItem("jwtToken", response.data.data);
                    sessionStorage.setItem("username", this.loginEmpData.username);
                    this.$refs.loginEmpForm.resetFields(); //清空表单数据
                    this.$router.push({ name: "Home" });
                });
            });
        },
        // 重置登录用户表单
        resetLoginEmpForm() {
            this.$refs.loginEmpForm.resetFields();
        },
    },
    mounted() {},
};
</script>

<style>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-content {
    display: flex;
    align-items: center;
}

.login-image {
    margin-right: 50px;
}

.login-form {
    display: flex;
    width: 50%;
    flex-direction: column;
}
</style>
