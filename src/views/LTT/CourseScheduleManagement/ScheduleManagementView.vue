<template>
    <!-- 右侧主界面 -->
    <el-main>
        课程安排
        <!-- 查询栏 -->
        <el-form :model="schSearchData">
            <el-row>
                <el-col :span="7">
                    <el-form-item label="课程名称">
                        <el-select
                            v-model="schSearchData.courseId"
                            clearable
                            placeholder="请选择">
                            <el-option
                                v-for="item in showCourseIdData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="上课教师">
                        <el-select
                            v-model="schSearchData.empId"
                            clearable
                            placeholder="请选择">
                            <el-option
                                v-for="item in showEmpIdData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="8"
                    align="right">
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="searchSch">
                            查 询
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增课表按钮 -->
        <el-button
            type="primary"
            @click="addSchDialogVisible = true">
            + 新增课表
        </el-button>

        <!-- 表格 -->

        <el-table :data="showSchData">
            <el-table-column
                type="index"
                label="序号"
                min-width="100px"
                align="left">
            </el-table-column>
            <el-table-column
                prop="courseId"
                label="课程名称"
                min-width="100px"
                :formatter="courseIdNameFormatter">
            </el-table-column>
            <el-table-column
                prop="empId"
                label="上课教师"
                min-width="100px"
                :formatter="empIdNameFormatter">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="120px"
                align="right">
                <template slot-scope="scope">
                    <!-- 编辑课表按钮 -->
                    <el-button
                        type="primary"
                        @click="showEditSchDialog(scope.row.id)"
                        size="mini">
                        编 辑
                    </el-button>
                    <!-- 删除课表按钮 -->
                    <el-button
                        type="danger"
                        @click="showDelSchDialog(scope.row.id)"
                        size="mini">
                        删 除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 表格导航栏 -->
        <el-row>
            <el-col :span="4">
                <div style="text-align: left">
                    <el-pagination
                        @size-change="handleSizeChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :total="totalPage"
                        layout="sizes">
                    </el-pagination>
                </div>
            </el-col>
            <el-col :span="16">
                <div style="text-align: center">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :total="totalPage"
                        background
                        layout="prev,pager,next,jumper">
                    </el-pagination>
                </div>
            </el-col>
            <el-col :span="4">
                <div style="text-align: right">
                    <el-pagination
                        :total="totalPage"
                        layout="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <!-- 下面是当前页面所有的对话框 -->

        <!-- 新增课表按钮的内容 -->
        <el-dialog
            title="新增课表"
            :visible.sync="addSchDialogVisible"
            :before-close="addSchHandleClose">
            <el-form
                :model="addSchData"
                :rules="schRules"
                ref="addSchForm">
                <el-form-item
                    label="课程名称"
                    prop="courseId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addSchData.courseId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showCourseIdData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="上课教师"
                    prop="empId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addSchData.empId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showEmpIdData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeaddSchForm">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addSchDataSubmit">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 编辑课表按钮的内容 -->
        <el-dialog
            title="编辑课表"
            :visible.sync="editSchDialogVisible">
            <el-form
                :model="editSchData"
                :rules="schRules"
                ref="editSchForm">
                <el-form-item
                    label="课程名称"
                    prop="courseId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="editSchData.courseId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showCourseIdData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="上课教师"
                    prop="empId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="editSchData.empId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showEmpIdData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editSchDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editSchDataSubmit">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 删除课表按钮的内容 -->
        <el-dialog
            title="删除课表"
            :visible.sync="delSchDialogVisible">
            <span>您确定要删除该课表吗？</span>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="delSchDialogVisible = false">取 消</el-button>
                <el-button
                    type="danger"
                    @click="delSchDataSubmit">
                    确 定
                </el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
import axios from "axios";
import { serverURL } from "../../../config/server/serverURL.js";
import { showMessage } from "../../../Utils/showMessage.js";

export default {
    data() {
        return {
            // 对话框控制区
            addSchDialogVisible: false,
            editSchDialogVisible: false,
            delSchDialogVisible: false,

            // 表单控制区
            formLabelWidth: "100px",

            // 分页控制区
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            totalPage: -1, //

            // 表单验证规则
            schRules: {
                courseId: [{ required: true, message: "请选择", trigger: "change" }],
                empId: [{ required: true, message: "请选择", trigger: "change" }],
            },

            // 查询课表区数据
            schSearchData: {
                courseId: "",
                empId: "",
            },

            // 增加课表区数据
            addSchData: {},

            // 编辑课表区数据
            editSchData: {
                id: "",
                courseId: "",
                empId: "",
            },

            // 删除课表区数据
            delSchDataId: -1,

            // 显示课表区数据
            showSchData: [],

            // 显示教室区数据
            showCourseIdData: [],

            // 显示员工区数据
            showEmpIdData: [],
        };
    },
    methods: {
        // 分页控制区方法
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.loadSchData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadSchData();
        },

        // 表格控制区方法
        // 根据课程id获取课程名称
        courseIdNameFormatter(row) {
            let courseItem = this.showCourseIdData.find((item) => item.id === row.courseId);
            return courseItem ? courseItem.name : "未知";
        },
        // 根据员工id获取员工名称
        empIdNameFormatter(row) {
            let empItem = this.showEmpIdData.find((item) => item.id === row.empId);
            return empItem ? empItem.name : "未知";
        },

        // 查询课表区方法
        searchSch() {
            this.currentPage = 1; // 重置当前页数
            axios.get(`${serverURL}/schs?courseId=${this.schSearchData.courseId}&empId=${this.schSearchData.empId}&currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showSchData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },

        // 增加课表区方法
        addSchDataSubmit() {
            this.$refs.addSchForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.post(`${serverURL}/schs`, this.addSchData).then((response) => {
                        showMessage(response, this, () => {
                            this.$refs.addSchForm.resetFields(); //清空表单数据
                            this.addSchDialogVisible = false;
                            this.loadSchData();
                        });
                    });
                }
            });
        },
        closeaddSchForm() {
            this.$refs.addSchForm.resetFields();
            this.addSchDialogVisible = false;
        },
        addSchHandleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    this.$refs.addSchForm.resetFields();
                    done();
                })
                .catch(() => {});
        },

        // 编辑课表区方法
        showEditSchDialog(id) {
            axios.get(`${serverURL}/schs/${id}`).then((response) => {
                const data = response.data.data;
                Object.keys(this.editSchData).forEach((key) => {
                    if (key in data) {
                        this.editSchData[key] = data[key];
                    }
                });
            });
            this.editSchDialogVisible = true;
        },
        editSchDataSubmit() {
            this.$refs.editSchForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.put(`${serverURL}/schs`, this.editSchData).then((response) => {
                        showMessage(response, this, () => {
                            this.$refs.editSchForm.resetFields(); //清空表单数据
                            this.editSchDialogVisible = false;
                            this.loadSchData();
                        });
                    });
                }
            });
        },

        // 删除课表区方法
        showDelSchDialog(id) {
            this.delSchDataId = id;
            this.delSchDialogVisible = true;
        },
        delSchDataSubmit() {
            // 向数据库中删除数据
            axios.delete(`${serverURL}/schs/${this.delSchDataId}`).then((response) => {
                showMessage(response, this, () => {
                    this.loadSchData();
                });
            });
            // 关闭删除对话框
            this.delSchDialogVisible = false;
        },

        // 显示课表区方法
        loadSchData() {
            // 根据当前页数和每页显示条目数获取数据,无条件查询
            axios.get(`${serverURL}/schs?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showSchData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },
    },
    mounted() {
        this.loadSchData();
        axios.get(`${serverURL}/crss?currentPage=1&pageSize=9999`).then((response) => {
            this.showCourseIdData = response.data.data.rows;
        });
        axios.get(`${serverURL}/emps?currentPage=1&pageSize=9999`).then((response) => {
            this.showEmpIdData = response.data.data.rows;
        });
    },
};
</script>

<style></style>
