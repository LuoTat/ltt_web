<template>
    <div style="text-align: center">
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
                    <el-menu :default-openeds="['1', '3']">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>班级学员管理</template>
                            <el-menu-item index="/ClassStudentManagement/StudentManagement">班级管理 </el-menu-item>
                            <el-menu-item index="1-2">
                                <router-link to="/ClassStudentManagement/StudentManagement">学员管理</router-link>
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-message"></i>系统信息管理</template>
                            <el-menu-item index="1-1">
                                <router-link to="/DepartmentManagement">部门管理</router-link>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <router-link to="/EmployeeManagement">员工管理</router-link>
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="el-icon-message"></i>数据统计管理</template>
                            <el-menu-item index="1-1">
                                <router-link to="/EmployeeInformationStatistics">员工信息统计</router-link>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>

                <!-- 右侧主界面 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
//import axios from "axios";

export default {
    data() {
        return {
            addClassDialogVisible: false,
            editClassDialogVisible: false,
            delClassDialogVisible: false,
            formLabelWidth: "100px",
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            total: 0, // 总条目数
            searchForm: {
                name: "",
                gender: "",
                entrydate: [],
            },
            rules: {
                className: [
                    { required: true, message: "请输入班级名称", trigger: "blur" },
                    { min: 4, max: 30, message: "长度在 4 到 30 个字符", trigger: "blur" },
                ],
                classRoom: [
                    { required: false, message: "请填写班级教室", trigger: "blur" },
                    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
                ],
                openTime: [{ type: "date", required: true, message: "请选择开课时间", trigger: "change" }],
                closeTime: [{ type: "date", required: true, message: "请选择结课时间", trigger: "change" }],
                classTeacher: [{ required: true, message: "请选择", trigger: "change" }],
            },
            //用来绑定表单数据
            addClassForm: {
                className: "", //班级名称
                classRoom: "",
                openTime: "",
                closeTime: "",
                classTeacher: "",
            },
            editClassForm: {
                className: "",
                classRoom: "",
                openTime: "",
                closeTime: "",
                classTeacher: "",
            },
            delClassForm: {
                index: -1,
            },
            showData: [],
            classData: [],
            SQLData: [
                { className: "班级1", classRoom: "教室1", openTime: "2021-01-01", closeTime: "2021-06-01", classTeacher: "班主任1" },
                { className: "班级2", classRoom: "教室2", openTime: "2021-02-01", closeTime: "2021-07-01", classTeacher: "班主任2" },
                { className: "班级3", classRoom: "教室3", openTime: "2021-03-01", closeTime: "2021-08-01", classTeacher: "班主任3" },
                { className: "班级4", classRoom: "教室4", openTime: "2021-04-01", closeTime: "2021-09-01", classTeacher: "班主任4" },
                { className: "班级5", classRoom: "教室5", openTime: "2021-05-01", closeTime: "2021-10-01", classTeacher: "班主任5" },
                { className: "班级6", classRoom: "教室6", openTime: "2021-06-01", closeTime: "2021-11-01", classTeacher: "班主任6" },
                { className: "班级7", classRoom: "教室7", openTime: "2021-07-01", closeTime: "2021-12-01", classTeacher: "班主任7" },
                { className: "班级8", classRoom: "教室8", openTime: "2021-08-01", closeTime: "2022-01-01", classTeacher: "班主任8" },
                { className: "班级9", classRoom: "教室9", openTime: "2021-09-01", closeTime: "2022-02-01", classTeacher: "班主任9" },
                { className: "班级10", classRoom: "教室10", openTime: "2021-10-01", closeTime: "2022-03-01", classTeacher: "班主任10" },
                { className: "班级11", classRoom: "教室11", openTime: "2021-11-01", closeTime: "2022-04-01", classTeacher: "班主任11" },
                { className: "班级12", classRoom: "教室12", openTime: "2021-12-01", closeTime: "2022-05-01", classTeacher: "班主任12" },
                { className: "班级13", classRoom: "教室13", openTime: "2022-01-01", closeTime: "2022-06-01", classTeacher: "班主任13" },
                { className: "班级14", classRoom: "教室14", openTime: "2022-02-01", closeTime: "2022-07-01", classTeacher: "班主任14" },
                { className: "班级15", classRoom: "教室15", openTime: "2022-03-01", closeTime: "2022-08-01", classTeacher: "班主任15" },
            ],
        };
    },
    methods: {
        searchClass() {
            // 待实现查询代码
            console.log(this.searchForm);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.loadData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData();
        },
        loadData() {
            // 根据当前页数和每页显示条目数获取数据，这里是示例数据，您需要根据实际情况调整
            this.showData = this.classData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
            this.total = this.classData.length;
        },
        indexMethod() {
            return (this.currentPage - 1) * this.pageSize + 1;
        },
        showEditClassDialog(index) {
            // 将选中行的数据赋值给编辑表单
            this.editClassForm = { ...this.classData[index - 1] };
            this.editClassDialogVisible = true;
        },
        addClassDataUpdate() {
            this.addClassForm.index = this.SQLData.length + 1;
            this.SQLData.push({ ...this.addClassForm }); //模拟更新数据库
            this.classData.push({ ...this.addClassForm }); //更新表格数据
            this.loadData(); // 刷新表格
            // 关闭编辑对话框
            this.addClassDialogVisible = false;
        },
        editClassDataUpdate() {
            //使用班级名称作为唯一标识，找到对应的数据
            let index = -1;
            this.SQLData[index - 1] = { ...this.editClassForm }; //模拟更新数据库
            this.classData[index - 1] = { ...this.editClassForm }; //更新表格数据
            this.loadData(); // 刷新表格
            // 关闭编辑对话框
            this.editClassDialogVisible = false;
        },
        delClassDataUpdate() {
            // 关闭删除对话框
            this.delClassDialogVisible = false;
        },
    },
    mounted() {
        this.classData = this.SQLData.slice(); // 模拟从数据库中获取数据
        this.loadData(); // 初始化时加载数据
        // axios.this.loadData();
        //     // .get("https://mock.apifox.cn/m1/3128855-0-default/emp/list")
        //     // .then((response) => {
        //     //     this.Temp = response.data.data;
        //     //     this.loadData();
        //     // })
        //     .catch((error) => {
        //         console.log(error);
        //     });
    },
};
</script>

<style></style>
