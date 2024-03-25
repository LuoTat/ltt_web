<template>
    <el-container style="border: 1px, solid, #eee">
        <!-- 标题位置，加按钮 -->
        <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)">
            LTT管理系统
            <el-button type="primary" @click="editPasswd()">修改密码</el-button>
            <el-button type="primary" @click="logOut()">退出登录</el-button>
        </el-header>

        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
                <el-menu router :default-openeds="['1', '2', '3']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>班级学员管理</template>
                        <el-menu-item index="/ClassStudentManagement/ClassManagement">班级管理 </el-menu-item>
                        <el-menu-item index="/ClassStudentManagement/StudentManagement"> 学员管理 </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-message"></i>系统信息管理</template>
                        <el-menu-item index="/SystemInformationManagement/DepartmentManagementView.vue"> 部门管理 </el-menu-item>
                        <el-menu-item index="/SystemInformationManagement/EmployeeManagementView.vue"> 员工管理 </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-message"></i>数据统计管理</template>
                        <el-menu-item index="/DataStatisticsManagement/EmployeeInformationStatisticsView.vue"> 员工信息统计 </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!-- 右侧主界面 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script></script>

<style></style>
