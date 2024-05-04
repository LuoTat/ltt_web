<template>
    <!-- 右侧主界面 -->
    <el-main>
        班级管理
        <!-- 查询栏 -->
        <el-form :model="clsSearchData">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="班级名称">
                        <el-input
                            v-model="clsSearchData.name"
                            clearable
                            placeholder="请输入班级名称"
                            style="width: 155px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="结课时间">
                        <el-date-picker
                            v-model="clsSearchData.closeTime"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="8"
                    align="right">
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="searchCls">
                            查 询
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增班级按钮 -->
        <el-button
            type="primary"
            @click="addClsDialogVisible = true">
            + 新增班级
        </el-button>

        <!-- 表格 -->

        <el-table :data="showClsData">
            <el-table-column
                type="index"
                label="序号"
                min-width="100px"
                align="left">
            </el-table-column>
            <el-table-column
                prop="name"
                label="班级名称"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="room"
                label="班级教室"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="openTime"
                label="开课时间"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="closeTime"
                label="结课时间"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="teacher"
                label="班主任"
                min-width="100px"
                :formatter="teacherNameFormatter">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="120px"
                align="right">
                <template slot-scope="scope">
                    <!-- 编辑班级按钮 -->
                    <el-button
                        type="primary"
                        @click="showEditClsDialog(scope.row.id)"
                        size="mini">
                        编 辑
                    </el-button>
                    <!-- 删除班级按钮 -->
                    <el-button
                        type="danger"
                        @click="showDelClsDialog(scope.row.id)"
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

        <!-- 新增班级按钮的内容 -->
        <el-dialog
            title="新增班级"
            :visible.sync="addClsDialogVisible"
            :before-close="addClsHandleClose">
            <el-form
                :model="addClsData"
                :rules="clsRules"
                ref="addClsForm">
                <el-form-item
                    label="班级名称"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addClsData.name"
                        placeholder="请输入班级名称,如:2024第01期10班">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="班级教室"
                    prop="room"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addClsData.room"
                        placeholder="请填写班级教室">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="开课时间"
                    prop="openTime"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="addClsData.openTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择开课时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="结课时间"
                    prop="closeTime"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="addClsData.closeTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择结课时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="班主任"
                    prop="teacher"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addClsData.teacher"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showTeacherData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeAddClsForm">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addClsDataSubmit">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 编辑班级按钮的内容 -->
        <el-dialog
            title="编辑班级"
            :visible.sync="editClsDialogVisible">
            <el-form
                :model="editClsData"
                :rules="clsRules"
                ref="editClsForm">
                <el-form-item
                    label="班级名称"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editClsData.name"
                        placeholder="请输入班级名称,如:2024第01期10班">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="班级教室"
                    prop="room"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editClsData.room"
                        placeholder="请输入班级教室">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="开课时间"
                    prop="openTime"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="editClsData.openTime"
                        type="date"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="结课时间"
                    prop="closeTime"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="editClsData.closeTime"
                        type="date"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="班主任"
                    prop="teacher"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select v-model="editClsData.teacher">
                        <el-option
                            v-for="item in showTeacherData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editClsDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editClsDataSubmit">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 删除班级按钮的内容 -->
        <el-dialog
            title="删除班级"
            :visible.sync="delClsDialogVisible">
            <span>您确定要删除该班级吗？</span>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="delClsDialogVisible = false">取 消</el-button>
                <el-button
                    type="danger"
                    @click="delClsDataSubmit">
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
            addClsDialogVisible: false,
            editClsDialogVisible: false,
            delClsDialogVisible: false,

            // 表单控制区
            formLabelWidth: "100px",

            // 分页控制区
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            totalPage: -1, //

            // 表单验证规则
            clsRules: {
                name: [
                    { required: true, message: "请输入班级名称", trigger: "blur" },
                    { min: 4, max: 30, message: "长度在 4 到 30 个字符", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("班级名称只能包含汉字、数字和字母"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                room: [
                    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("班级教室只能包含汉字、数字和字母"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                openTime: [{ required: true, message: "请选择开课时间", trigger: "change" }],
                closeTime: [{ required: true, message: "请选择结课时间", trigger: "change" }],
                teacher: [{ required: true, message: "请选择", trigger: "change" }],
            },

            // 查询班级区数据
            clsSearchData: {
                name: "",
                closeTime: ["", ""],
            },

            // 增加班级区数据
            addClsData: {},

            // 编辑班级区数据
            editClsData: {
                id: "",
                name: "",
                room: "",
                openTime: "",
                closeTime: "",
                teacher: "",
            },

            // 删除班级区数据
            delClsDataId: -1,

            // 显示班级区数据
            showClsData: [],

            // 显示班主任区数据
            showTeacherData: [],
        };
    },
    methods: {
        // 分页控制区方法
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.loadClsData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadClsData();
        },

        // 表格控制区方法
        // 根据班主任id获取班主任名称
        teacherNameFormatter(row) {
            let teacherItem = this.showTeacherData.find((item) => item.id === row.teacher);
            return teacherItem ? teacherItem.name : "未知";
        },

        // 查询班级区方法
        searchCls() {
            let beginDate = "";
            let endDate = "";
            if (this.clsSearchData.closeTime != null) {
                beginDate = this.clsSearchData.closeTime[0];
                endDate = this.clsSearchData.closeTime[1];
            }
            this.currentPage = 1; // 重置当前页数
            axios.get(`${serverURL}/clss?name=${this.clsSearchData.name}&begin=${beginDate}&end=${endDate}&currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showClsData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },

        // 增加班级区方法
        addClsDataSubmit() {
            this.$refs.addClsForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.post(`${serverURL}/clss`, this.addClsData).then((response) => {
                        showMessage(response, this, () => {
                            this.$refs.addClsForm.resetFields(); //清空表单数据
                            this.addClsDialogVisible = false;
                            this.loadClsData();
                        });
                    });
                }
            });
        },
        closeAddClsForm() {
            this.$refs.addClsForm.resetFields();
            this.addClsDialogVisible = false;
        },
        addClsHandleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    this.$refs.addClsForm.resetFields();
                    done();
                })
                .catch(() => {});
        },

        // 编辑班级区方法
        showEditClsDialog(id) {
            axios.get(`${serverURL}/clss/${id}`).then((response) => {
                const data = response.data.data;
                Object.keys(this.editClsData).forEach((key) => {
                    if (key in data) {
                        this.editClsData[key] = data[key];
                    }
                });
            });
            this.editClsDialogVisible = true;
        },
        editClsDataSubmit() {
            this.$refs.editClsForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.put(`${serverURL}/clss`, this.editClsData).then((response) => {
                        showMessage(response, this, () => {
                            this.$refs.editClsForm.resetFields(); //清空表单数据
                            this.editClsDialogVisible = false;
                            this.loadClsData();
                        });
                    });
                }
            });
        },

        // 删除班级区方法
        showDelClsDialog(id) {
            this.delClsDataId = id;
            this.delClsDialogVisible = true;
        },
        delClsDataSubmit() {
            // 向数据库中删除数据
            axios.delete(`${serverURL}/clss/${this.delClsDataId}`).then((response) => {
                showMessage(response, this, () => {
                    this.loadClsData();
                });
            });
            // 关闭删除对话框
            this.delClsDialogVisible = false;
        },

        // 显示班级区方法
        loadClsData() {
            // 根据当前页数和每页显示条目数获取数据,无条件查询
            axios.get(`${serverURL}/clss?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showClsData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },
    },
    mounted() {
        this.loadClsData();
        axios.get(`${serverURL}/emps?currentPage=1&pageSize=9999`).then((response) => {
            this.showTeacherData = response.data.data.rows;
        });
    },
};
</script>

<style></style>
