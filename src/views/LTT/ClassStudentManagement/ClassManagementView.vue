<template>
    <!-- 右侧主界面 -->
    <el-main>
        班级管理
        <!-- 查询栏 -->
        <el-form :inline="true" :model="classSearchData" class="demo-form-inline">
            <el-form-item label="班级名称">
                <el-input v-model="classSearchData.name" placeholder="请输入班级名称"></el-input>
            </el-form-item>
            <el-form-item label="结课时间">
                <el-date-picker v-model="classSearchData.entrydate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchClass()">查询</el-button>
            </el-form-item>
        </el-form>

        <!-- 新增班级按钮 -->
        <el-button type="primary" @click="addClassDialogVisible = true">+新增班级</el-button>

        <!-- 表格 -->

        <el-table :data="showData">
            <el-table-column type="index" :index="indexMethod()" label="序号" width="80"> </el-table-column>
            <el-table-column prop="className" label="班级名称" width="100"> </el-table-column>
            <el-table-column prop="classRoom" label="班级教室" width="100"> </el-table-column>
            <el-table-column prop="openTime" label="开课时间" width="180"> </el-table-column>
            <el-table-column prop="closeTime" label="结课时间" width="180"> </el-table-column>
            <el-table-column prop="classTeacher" label="班主任" width="100"> </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- 编辑班级按钮 -->
                    <el-button type="primary" @click="showEditClassDialog(scope.$index)" size="mini">编辑</el-button>

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
            <el-form :model="addClassData" :rules="classRules" ref="addClassForm">
                <el-form-item label="班级名称" prop="className" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addClassData.className" placeholder="请输入班级名称,如:2024第01期10班"></el-input>
                </el-form-item>
                <el-form-item label="班级教室" prop="classRoom" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addClassData.classRoom" placeholder="请填写班级教室"> </el-input>
                </el-form-item>
                <el-form-item label="开课时间" prop="openTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="addClassData.openTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择开课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="结课时间" prop="closeTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="addClassData.closeTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="班主任" prop="classTeacher" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addClassData.classTeacher" placeholder="请选择">
                        <el-option label="班主任1" value="班主任1"></el-option>
                        <el-option label="班主任2" value="班主任2"></el-option>
                        <el-option label="班主任3" value="班主任3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetAddClassForm('addClassForm')">取 消</el-button>
                <el-button type="primary" @click="addClassDataSubmit('addClassForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑班级按钮的内容 -->
        <el-dialog title="编辑班级" :visible.sync="editClassDialogVisible">
            <el-form :model="editClassData" :rules="classRules" ref="editClassForm">
                <el-form-item label="班级名称" prop="className" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editClassData.className" placeholder="请输入班级名称,如:2024第01期10班"></el-input>
                </el-form-item>
                <el-form-item label="班级教室" prop="classRoom" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editClassData.classRoom" placeholder="请填写班级教室"> </el-input>
                </el-form-item>
                <el-form-item label="开课时间" prop="openTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="editClassData.openTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择开课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="结课时间" prop="closeTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="editClassData.closeTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="班主任" prop="classTeacher" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="editClassData.classTeacher" placeholder="请选择">
                        <el-option label="班主任1" value="班主任1"></el-option>
                        <el-option label="班主任2" value="班主任2"></el-option>
                        <el-option label="班主任3" value="班主任3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editClassDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editClassDataSubmit('editClassForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 删除班级按钮的内容 -->
        <el-dialog title="删除班级" :visible.sync="delClassDialogVisible">
            <span>您确定要删除该班级吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delClassDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delClassDataUpdate()">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
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
            classSearchData: {
                name: "",
                gender: "",
                entrydate: [],
            },
            classRules: {
                className: [
                    { required: true, message: "请输入班级名称", trigger: "blur" },
                    { min: 4, max: 30, message: "长度在 4 到 30 个字符", trigger: "blur" },
                ],
                classRoom: [{ min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }],
                openTime: [{ type: "date", required: true, message: "请选择开课时间", trigger: "change" }],
                closeTime: [{ type: "date", required: true, message: "请选择结课时间", trigger: "change" }],
                classTeacher: [{ required: true, message: "请选择", trigger: "change" }],
            },
            //用来绑定表单数据
            addClassData: {
                className: "", //班级名称
                classRoom: "",
                openTime: "",
                closeTime: "",
                classTeacher: "",
            },
            editClassData: {
                className: "",
                classRoom: "",
                openTime: "",
                closeTime: "",
                classTeacher: "",
            },
            delClassData: {
                index: -1,
            },
            showData: [],
            classData: [],
            SQLData: [
                { className: "班级01", classRoom: "教室01", openTime: "2021-01-01", closeTime: "2021-06-01", classTeacher: "班主任1" },
                { className: "班级02", classRoom: "教室02", openTime: "2021-02-01", closeTime: "2021-07-01", classTeacher: "班主任2" },
                { className: "班级03", classRoom: "教室03", openTime: "2021-03-01", closeTime: "2021-08-01", classTeacher: "班主任3" },
                { className: "班级04", classRoom: "教室04", openTime: "2021-04-01", closeTime: "2021-09-01", classTeacher: "班主任1" },
                { className: "班级05", classRoom: "教室05", openTime: "2021-05-01", closeTime: "2021-10-01", classTeacher: "班主任2" },
                { className: "班级06", classRoom: "教室06", openTime: "2021-06-01", closeTime: "2021-11-01", classTeacher: "班主任3" },
                { className: "班级07", classRoom: "教室07", openTime: "2021-07-01", closeTime: "2021-12-01", classTeacher: "班主任1" },
                { className: "班级08", classRoom: "教室08", openTime: "2021-08-01", closeTime: "2022-01-01", classTeacher: "班主任2" },
                { className: "班级09", classRoom: "教室09", openTime: "2021-09-01", closeTime: "2022-02-01", classTeacher: "班主任3" },
                { className: "班级10", classRoom: "教室10", openTime: "2021-10-01", closeTime: "2022-03-01", classTeacher: "班主任1" },
                { className: "班级11", classRoom: "教室11", openTime: "2021-11-01", closeTime: "2022-04-01", classTeacher: "班主任2" },
                { className: "班级12", classRoom: "教室12", openTime: "2021-12-01", closeTime: "2022-05-01", classTeacher: "班主任3" },
                { className: "班级13", classRoom: "教室13", openTime: "2022-01-01", closeTime: "2022-06-01", classTeacher: "班主任1" },
                { className: "班级14", classRoom: "教室14", openTime: "2022-02-01", closeTime: "2022-07-01", classTeacher: "班主任2" },
                { className: "班级15", classRoom: "教室15", openTime: "2022-03-01", closeTime: "2022-08-01", classTeacher: "班主任3" },
            ],
        };
    },
    methods: {
        searchClass() {
            // 待实现查询代码
            console.log(this.classSearchData);
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
        addClassDataSubmit(addClassForm) {
            this.$refs[addClassForm].validate((valid) => {
                if (!valid) {
                    alert("ERROR!");
                } else {
                    alert("Success!");
                    //判断是否有重复数据
                    //新建一个对话框，提示是否添加成功
                }
            });
        },
        resetAddClassForm(addClassForm) {
            this.$refs[addClassForm].resetFields();
            this.addClassDialogVisible = false;
        },
        showEditClassDialog(index) {
            // 将选中行的数据赋值给编辑表单
            // 计算当前选中行的索引
            let _index = index + (this.currentPage - 1) * this.pageSize;
            this.editClassData = { ...this.classData[_index] };
            this.editClassDialogVisible = true;
        },
        editClassDataSubmit(editClassForm) {
            this.$refs[editClassForm].validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //新建一个对话框，提示是否添加成功
                }
            });
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
