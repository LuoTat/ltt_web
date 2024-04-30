<template>
    <div style="width: 1400px; margin: auto">
        <!-- 用户登录 -->
        <el-form
            :model="loginEmpData"
            ref="loginEmpForm">
            <el-form-item
                label="用户名"
                prop="username"
                label-job="left"
                :label-width="formLabelWidth">
                <el-input v-model="loginEmpData.username"></el-input>
            </el-form-item>
            <el-form-item
                label="密码"
                prop="password"
                label-job="left"
                :label-width="formLabelWidth">
                <el-input v-model="loginEmpData.password"> </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="resetLoginEmpForm">取 消</el-button>
            <el-button
                type="primary"
                @click="LoginEmpSubmit"
                >登录</el-button
            >
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            // 表单控制区
            formLabelWidth: "100px",

            // 登录用户信息
            loginEmpData: {},
        };
    },
    methods: {
        // 登录用户
        LoginEmpSubmit() {
            axios.post("http://localhost:8080/login", this.loginEmpData).then((response) => {
                // 存储JWT令牌
                if (response.data.code == 1) {
                    this.$message({
                        message: "你过馆！！！",
                        type: "success",
                    });
                    this.$refs.loginEmpForm.resetFields(); //清空表单数据
                    sessionStorage.setItem("jwtToken", response.data.data);
                    this.$router.push({ name: "Home" });
                } else {
                    this.$message({
                        message: "用户名或密码错误",
                        type: "error",
                    });
                }
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

<style></style>
