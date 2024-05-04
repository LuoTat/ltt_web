<template>
    <!-- 右侧主界面 -->
    <el-main>
        课程管理
        <!-- 查询栏 -->
        <el-form :model="crsSearchData">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="课程名称">
                        <el-input
                            v-model="crsSearchData.name"
                            clearable
                            placeholder="请输入课程名称"
                            style="width: 155px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="结课时间">
                        <el-date-picker
                            v-model="crsSearchData.closeTime"
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
                            @click="searchCrs"
                            >查 询
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增课程按钮 -->
        <el-button
            type="primary"
            @click="addCrsDialogVisible = true"
            >+ 新增课程</el-button
        >

        <!-- 表格 -->

        <el-table :data="showCrsData">
            <el-table-column
                type="index"
                label="序号"
                min-width="100px"
                align="left">
            </el-table-column>
            <el-table-column
                prop="name"
                label="课程名称"
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
                prop="classId"
                label="上课教室"
                min-width="100px"
                :formatter="classIdNameFormatter">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="120px"
                align="right">
                <template slot-scope="scope">
                    <!-- 编辑课程按钮 -->
                    <el-button
                        type="primary"
                        @click="showEditCrsDialog(scope.row.id)"
                        size="mini"
                        >编 辑</el-button
                    >
                    <!-- 删除课程按钮 -->
                    <el-button
                        type="danger"
                        @click="showDelCrsDialog(scope.row.id)"
                        size="mini"
                        >删 除</el-button
                    >
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

        <!-- 新增课程按钮的内容 -->
        <el-dialog
            title="新增课程"
            :visible.sync="addCrsDialogVisible"
            :before-close="addCrsHandleClose">
            <el-form
                :model="addCrsData"
                :rules="crsRules"
                ref="addCrsForm">
                <el-form-item
                    label="课程名称"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addCrsData.name"
                        placeholder="请输入课程名称,如:2024第01期10班"></el-input>
                </el-form-item>
                <el-form-item
                    label="开课时间"
                    prop="openTime"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="addCrsData.openTime"
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
                        v-model="addCrsData.closeTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择结课时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="上课教室"
                    prop="classId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addCrsData.classId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showClassIdData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeaddCrsForm">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addCrsDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 编辑课程按钮的内容 -->
        <el-dialog
            title="编辑课程"
            :visible.sync="editCrsDialogVisible">
            <el-form
                :model="editCrsData"
                :rules="crsRules"
                ref="editCrsForm">
                <el-form-item
                    label="课程名称"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editCrsData.name"
                        placeholder="请输入课程名称,如:2024第01期10班"></el-input>
                </el-form-item>
                <el-form-item
                    label="开课时间"
                    prop="openTime"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="editCrsData.openTime"
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
                        v-model="editCrsData.closeTime"
                        type="date"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="上课教室"
                    prop="classId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select v-model="editCrsData.classId">
                        <el-option
                            v-for="item in showClassIdData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editCrsDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editCrsDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 删除课程按钮的内容 -->
        <el-dialog
            title="删除课程"
            :visible.sync="delCrsDialogVisible">
            <span>您确定要删除该课程吗？</span>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="delCrsDialogVisible = false">取 消</el-button>
                <el-button
                    type="danger"
                    @click="delCrsDataSubmit"
                    >确 定</el-button
                >
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
            addCrsDialogVisible: false,
            editCrsDialogVisible: false,
            delCrsDialogVisible: false,

            // 表单控制区
            formLabelWidth: "100px",

            // 分页控制区
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            totalPage: -1, //

            // 表单验证规则
            crsRules: {
                name: [
                    { required: true, message: "请输入课程名称", trigger: "blur" },
                    { min: 4, max: 30, message: "长度在 4 到 30 个字符", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("课程名称只能包含汉字、数字和字母"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                openTime: [{ required: true, message: "请选择开课时间", trigger: "change" }],
                closeTime: [{ required: true, message: "请选择结课时间", trigger: "change" }],
                classId: [{ required: true, message: "请选择", trigger: "change" }],
            },

            // 查询课程区数据
            crsSearchData: {
                name: "",
                closeTime: ["", ""],
            },

            // 增加课程区数据
            addCrsData: {},

            // 编辑课程区数据
            editCrsData: {
                id: "",
                name: "",
                openTime: "",
                closeTime: "",
                classId: "",
            },

            // 删除课程区数据
            delCrsDataId: -1,

            // 显示课程区数据
            showCrsData: [],

            // 显示教室区数据
            showClassIdData: [],
        };
    },
    methods: {
        // 分页控制区方法
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.loadCrsData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadCrsData();
        },

        // 表格控制区方法
        // 根据班主任id获取班主任名称
        classIdNameFormatter(row) {
            let classItem = this.showClassIdData.find((item) => item.id === row.classId);
            return classItem ? classItem.name : "未知";
        },

        // 查询课程区方法
        searchCrs() {
            let beginDate = "";
            let endDate = "";
            if (this.crsSearchData.closeTime != null) {
                beginDate = this.crsSearchData.closeTime[0];
                endDate = this.crsSearchData.closeTime[1];
            }
            this.currentPage = 1; // 重置当前页数
            axios.get(`${serverURL}/crss?name=${this.crsSearchData.name}&begin=${beginDate}&end=${endDate}&currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showCrsData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },

        // 增加课程区方法
        addCrsDataSubmit() {
            this.$refs.addCrsForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.post(`${serverURL}/crss`, this.addCrsData).then((response) => {
                        showMessage(response, this, () => {
                            this.$refs.addCrsForm.resetFields(); //清空表单数据
                            this.addCrsDialogVisible = false;
                            this.loadCrsData();
                        });
                    });
                }
            });
        },
        closeaddCrsForm() {
            this.$refs.addCrsForm.resetFields();
            this.addCrsDialogVisible = false;
        },
        addCrsHandleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    this.$refs.addCrsForm.resetFields();
                    done();
                })
                .catch(() => {});
        },

        // 编辑课程区方法
        showEditCrsDialog(id) {
            axios.get(`${serverURL}/crss/${id}`).then((response) => {
                const data = response.data.data;
                Object.keys(this.editCrsData).forEach((key) => {
                    if (key in data) {
                        this.editCrsData[key] = data[key];
                    }
                });
            });
            this.editCrsDialogVisible = true;
        },
        editCrsDataSubmit() {
            this.$refs.editCrsForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.put(`${serverURL}/crss`, this.editCrsData).then((response) => {
                        showMessage(response, this, () => {
                            this.$refs.editCrsForm.resetFields(); //清空表单数据
                            this.editCrsDialogVisible = false;
                            this.loadCrsData();
                        });
                    });
                }
            });
        },

        // 删除课程区方法
        showDelCrsDialog(id) {
            this.delCrsDataId = id;
            this.delCrsDialogVisible = true;
        },
        delCrsDataSubmit() {
            // 向数据库中删除数据
            axios.delete(`${serverURL}/crss/${this.delCrsDataId}`).then((response) => {
                showMessage(response, this, () => {
                    this.loadCrsData();
                });
            });
            // 关闭删除对话框
            this.delCrsDialogVisible = false;
        },

        // 显示课程区方法
        loadCrsData() {
            // 根据当前页数和每页显示条目数获取数据,无条件查询
            axios.get(`${serverURL}/crss?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showCrsData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },
    },
    mounted() {
        this.loadCrsData();
        axios.get(`${serverURL}/clss?currentPage=1&pageSize=9999`).then((response) => {
            this.showClassIdData = response.data.data.rows;
        });
    },
};
</script>

<style></style>
