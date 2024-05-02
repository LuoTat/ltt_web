<template>
    <div style="width: 1400px; margin: auto">
        <el-container style="border: 1px, solid, #eeeeee">
            <!-- 标题位置，加按钮 -->
            <el-header style="font-size: 40px; background-color: #eef1f6; display: grid; grid-template-columns: 1fr auto auto">
                <div>LTT管理系统</div>
                <el-button
                    type="primary"
                    @click="editPasswdDialogVisible = true"
                    >修改密码</el-button
                >
                <el-button
                    type="primary"
                    @click="logOut()"
                    >退出登录</el-button
                >
            </el-header>

            <el-container>
                <!-- 侧边栏 -->
                <el-aside width="200px">
                    <el-menu
                        router
                        :default-openeds="['1', '2', '3']">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>班级学员管理</template>
                            <el-menu-item :index="{ name: 'ClassManagement' }">班级管理 </el-menu-item>
                            <el-menu-item :index="{ name: 'StudentManagement' }"> 学员管理 </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-message"></i>系统信息管理</template>
                            <el-menu-item :index="{ name: 'DepartmentManagement' }"> 部门管理 </el-menu-item>
                            <el-menu-item :index="{ name: 'EmployeeManagement' }"> 员工管理 </el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="el-icon-message"></i>数据统计管理</template>
                            <el-menu-item :index="{ name: 'EmployeeInformationStatistics' }"> 员工信息统计 </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>

                <!-- 右侧主界面 -->
                <el-main>
                    <router-view></router-view>

                    <!-- 修改密码对话框 -->
                    <el-dialog
                        title="修改密码"
                        :visible.sync="editPasswdDialogVisible"
                        :before-close="editPasswdHandleClose">
                        <el-form
                            :model="editPasswdData"
                            :rules="passwdRules"
                            ref="editPasswdForm">
                            <el-form-item
                                label="原密码"
                                prop="oldPasswd"
                                label-job="left"
                                :label-width="formLabelWidth">
                                <el-input
                                    v-model="editPasswdData.oldPasswd"
                                    placeholder="请输入旧密码（默认密码为123456）"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="新密码"
                                prop="newPasswd"
                                label-job="left"
                                :label-width="formLabelWidth">
                                <el-input
                                    v-model="editPasswdData.newPasswd"
                                    placeholder="请输入新密码">
                                </el-input>
                            </el-form-item>
                            <el-form-item
                                label="确认密码"
                                prop="confirmPasswd"
                                label-job="left"
                                :label-width="formLabelWidth">
                                <el-input
                                    v-model="editPasswdData.confirmPasswd"
                                    placeholder="请再次输入新密码">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer">
                            <el-button @click="closeEditPasswdForm">取 消</el-button>
                            <el-button
                                type="primary"
                                @click="editPasswdSubmit"
                                >确 定</el-button
                            >
                        </div>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import axios from "axios";
import { serverURL } from "../config/server/serverURL.js";
import { showMessage } from "../Utils/showMessage.js";

export default {
    data() {
        return {
            // 表单控制区
            formLabelWidth: "100px",

            // 修改密码对话框控制区
            editPasswdDialogVisible: false,

            // 修改密码区数据
            editPasswdData: {
                oldPasswd: "",
                newPasswd: "",
                confirmPasswd: "",
            },
        };
    },
    methods: {
        // 修改密码区方法
        editPasswdSubmit() {
            let jwt = sessionStorage.getItem("jwtToken");
            this.$refs.editPasswdForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios
                        .put(`${serverURL}/emps/changepwd`, {
                            params: {
                                jwt: jwt,
                                oldPasswd: this.editPasswdData.oldPasswd,
                                newPasswd: this.editPasswdData.newPasswd,
                            },
                        })
                        .then((response) => {
                            showMessage(response, this, () => {
                                this.$refs.editPasswdForm.resetFields(); //清空表单数据
                                this.editPasswdDialogVisible = false;
                            });
                        });
                }
            });
        },
        closeEditPasswdForm() {
            this.$refs.editPasswdForm.resetFields();
            this.editPasswdDialogVisible = false;
        },
        // 退出登录
        logOut() {
            this.$router.push({ name: "Login" });
        },
    },
};
</script>

<style></style>
