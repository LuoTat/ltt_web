<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee">
            <!-- 标题位置，加按钮 -->
            <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)">LTT管理系统</el-header>

            <el-container>
                <!-- 侧边栏 -->
                <el-aside width="200px">
                    <el-menu :default-openeds="['1', '3']">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>班级学员管理</template>
                            <el-menu-item index="1-1">
                                <router-link to="/ClassManagement">班级管理</router-link>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <router-link to="/StudentManagement">学员管理</router-link>
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
                    <!-- 查询栏 -->
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="班级名称">
                            <el-input v-model="searchForm.name" placeholder="请输入班级名称"></el-input>
                        </el-form-item>

                        <el-form-item label="结课时间">
                            <el-date-picker v-model="searchForm.entrydate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchClass">查询</el-button>
                        </el-form-item>
                    </el-form>

                    <!-- 新增班级按钮 -->
                    <el-button type="primary" @click="addClassDialogVisible = true">+新增班级</el-button>

                    <!-- 表格 -->
                    <el-table :data="showData">
                        <el-table-column prop="index" label="序号" width="80"> </el-table-column>
                        <el-table-column prop="className" label="班级名称" width="100"> </el-table-column>
                        <el-table-column prop="classRoom" label="班级教室" width="100"> </el-table-column>
                        <el-table-column prop="openTime" label="开课时间" width="180"> </el-table-column>
                        <el-table-column prop="closeTime" label="结课时间" width="180"> </el-table-column>
                        <el-table-column prop="classTeacher" label="班主任" width="100"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- 编辑班级按钮 -->
                                <el-button type="primary" @click="showEditClassDialog(scope.row.index)" size="mini">编辑</el-button>

                                <!-- 删除班级按钮 -->
                                <el-button type="danger" @click="delClassDialogVisible = true" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- 表格导航栏 -->
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total" background layout="sizes,prev,pager,next,jumper,total"> </el-pagination>

                    <!-- 下面是当前页面所有的对话框 -->

                    <!-- 新增班级按钮的内容 -->
                    <el-dialog title="新增班级" :visible.sync="addClassDialogVisible">
                        <el-form :model="addClassForm">
                            <el-form-item label="班级名称" label-position="left" :label-width="formLabelWidth">
                                <el-input v-model="addClassForm.className" placeholder="请输入班级名称"></el-input>
                            </el-form-item>
                            <el-form-item label="班级教室" label-position="left" :label-width="formLabelWidth">
                                <el-input v-model="addClassForm.classRoom" placeholder="请填写班级教室"> </el-input>
                            </el-form-item>
                            <el-form-item label="开课时间" label-position="left" :label-width="formLabelWidth">
                                <el-date-picker v-model="addClassForm.openTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择开课时间"> </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结课时间" label-position="left" :label-width="formLabelWidth">
                                <el-date-picker v-model="addClassForm.closeTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结课时间"> </el-date-picker>
                            </el-form-item>
                            <el-form-item label="班主任" label-position="left" :label-width="formLabelWidth">
                                <el-select v-model="addClassForm.classTeacher" placeholder="请选择">
                                    <el-option label="班主任1" value="1"></el-option>
                                    <el-option label="班主任2" value="2"></el-option>
                                    <el-option label="班主任3" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="addClassDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addClassDialogVisible = false">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 编辑班级按钮的内容 -->
                    <el-dialog title="编辑班级" :visible.sync="editClassDialogVisible">
                        <el-form :model="editClassForm">
                            <el-form-item label="班级名称" label-position="left" :label-width="formLabelWidth">
                                <el-input v-model="editClassForm.className" placeholder="请输入班级名称"></el-input>
                            </el-form-item>
                            <el-form-item label="班级教室" label-position="left" :label-width="formLabelWidth">
                                <el-input v-model="editClassForm.classRoom" placeholder="请填写班级教室"> </el-input>
                            </el-form-item>
                            <el-form-item label="开课时间" label-position="left" :label-width="formLabelWidth">
                                <el-date-picker v-model="editClassForm.openTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择开课时间"> </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结课时间" label-position="left" :label-width="formLabelWidth">
                                <el-date-picker v-model="editClassForm.closeTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结课时间"> </el-date-picker>
                            </el-form-item>
                            <el-form-item label="班主任" label-position="left" :label-width="formLabelWidth" placeholder="请选择">
                                <el-select v-model="editClassForm.classTeacher">
                                    <el-option label="班主任1" value="班主任1"></el-option>
                                    <el-option label="班主任2" value="班主任2"></el-option>
                                    <el-option label="班主任3" value="班主任3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="editClassDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="editClassDataUpdata">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 删除班级按钮的内容 -->
                    <el-dialog title="删除班级" :visible.sync="delClassDialogVisible" width="30%" :before-close="handleClose">
                        <span>您确定要删除该班级吗？</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="delClassDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="delClassDialogVisible = false">确 定</el-button>
                        </span>
                    </el-dialog>
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
            formLabelWidth: "80px",
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            total: 0, // 总条目数
            searchForm: {
                name: "",
                gender: "",
                entrydate: [],
            },
            //用来绑定表单数据
            addClassForm: {
                index: -1,
                className: "",
                classRoom: "",
                openTime: "",
                closeTime: "",
                classTeacher: "",
            },
            editClassForm: {
                index: -1,
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
                { index: 1, className: "班级1", classRoom: "教室1", openTime: "2021-01-01", closeTime: "2021-06-01", classTeacher: "班主任1" },
                { index: 2, className: "班级2", classRoom: "教室2", openTime: "2021-02-01", closeTime: "2021-07-01", classTeacher: "班主任2" },
                { index: 3, className: "班级3", classRoom: "教室3", openTime: "2021-03-01", closeTime: "2021-08-01", classTeacher: "班主任3" },
                { index: 4, className: "班级4", classRoom: "教室4", openTime: "2021-04-01", closeTime: "2021-09-01", classTeacher: "班主任4" },
                { index: 5, className: "班级5", classRoom: "教室5", openTime: "2021-05-01", closeTime: "2021-10-01", classTeacher: "班主任5" },
                { index: 6, className: "班级6", classRoom: "教室6", openTime: "2021-06-01", closeTime: "2021-11-01", classTeacher: "班主任6" },
                { index: 7, className: "班级7", classRoom: "教室7", openTime: "2021-07-01", closeTime: "2021-12-01", classTeacher: "班主任7" },
                { index: 8, className: "班级8", classRoom: "教室8", openTime: "2021-08-01", closeTime: "2022-01-01", classTeacher: "班主任8" },
                { index: 9, className: "班级9", classRoom: "教室9", openTime: "2021-09-01", closeTime: "2022-02-01", classTeacher: "班主任9" },
                { index: 10, className: "班级10", classRoom: "教室10", openTime: "2021-10-01", closeTime: "2022-03-01", classTeacher: "班主任10" },
                { index: 11, className: "班级11", classRoom: "教室11", openTime: "2021-11-01", closeTime: "2022-04-01", classTeacher: "班主任11" },
                { index: 12, className: "班级12", classRoom: "教室12", openTime: "2021-12-01", closeTime: "2022-05-01", classTeacher: "班主任12" },
                { index: 13, className: "班级13", classRoom: "教室13", openTime: "2022-01-01", closeTime: "2022-06-01", classTeacher: "班主任13" },
                { index: 14, className: "班级14", classRoom: "教室14", openTime: "2022-02-01", closeTime: "2022-07-01", classTeacher: "班主任14" },
                { index: 15, className: "班级15", classRoom: "教室15", openTime: "2022-03-01", closeTime: "2022-08-01", classTeacher: "班主任15" },
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
        showEditClassDialog(index) {
            // 将选中行的数据赋值给编辑表单
            this.editClassForm = { ...this.classData[index - 1] };
            this.editClassDialogVisible = true;
        },
        editClassDataUpdata() {
            const index = this.editClassForm.index;
            this.SQLData[index - 1] = { ...this.editClassForm }; //模拟更新数据库
            this.classData[index - 1] = { ...this.editClassForm }; //更新表格数据
            this.loadData(); // 刷新表格
            // 关闭编辑对话框
            this.editClassDialogVisible = false;
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
