<template>
    <!-- 右侧主界面 -->
    <el-main>
        部门管理
        <!-- 新增部门按钮 -->
        <div style="margin-top: 20px">
            <el-button
                type="primary"
                @click="addDptDialogVisible = true"
                >+ 新增部门</el-button
            >
        </div>

        <!-- 表格 -->
        <el-table :data="showDptData">
            <el-table-column
                type="index"
                label="序号"
                min-width="100px"
                align="left">
            </el-table-column>
            <el-table-column
                prop="name"
                label="部门名称"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="最后操作时间"
                min-width="100px">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="120px"
                align="right">
                <template slot-scope="scope">
                    <!-- 编辑部门按钮 -->
                    <el-button
                        type="primary"
                        @click="showEditDptDialog(scope.row.id)"
                        size="mini"
                        >编 辑</el-button
                    >
                    <!-- 删除部门按钮 -->
                    <el-button
                        type="danger"
                        @click="showDelDptDialog(scope.row.id)"
                        size="mini"
                        >删 除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 下面是当前页面所有的对话框 -->

        <!-- 新增部门按钮的内容 -->
        <el-dialog
            title="新增部门"
            :visible.sync="addDptDialogVisible"
            :before-close="addDptHandleClose">
            <el-form
                :model="addDptData"
                :rules="dptRules"
                ref="addDptForm">
                <el-form-item
                    label="部门名称"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addDptData.name"
                        placeholder="请输入部门名称,长度为2-10位"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeAddDptForm">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addDptDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 编辑部门按钮的内容 -->
        <el-dialog
            title="编辑部门"
            :visible.sync="editDptDialogVisible">
            <el-form
                :model="editDptData"
                :rules="dptRules"
                ref="editDptForm">
                <el-form-item
                    label="部门名称"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editDptData.name"
                        placeholder="请输入部门名称,长度为2-10位"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editDptDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editDptDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 删除班级按钮的内容 -->
        <el-dialog
            title="删除部门"
            :visible.sync="delDptDialogVisible">
            <span>您确定要删除该部门吗？</span>
            <span slot="footer">
                <el-button @click="delDptDialogVisible = false">取 消</el-button>
                <el-button
                    type="danger"
                    @click="delDptDataSubmit"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            // 对话框控制区
            addDptDialogVisible: false,
            editDptDialogVisible: false,
            delDptDialogVisible: false,

            // 表单控制区
            formLabelWidth: "100px",

            // 表单规则验证区
            dptRules: {
                name: [
                    { required: true, message: "请输入部门名称", trigger: "blur" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
                ],
            },
            // 增加部门区数据
            addDptData: {},

            // 编辑部门区数据
            editDptData: {
                id: "",
                name: "",
            },

            // 删除部门区数据
            delDptDataId: "",

            // 展示部门区数据
            showDptData: [],
        };
    },
    methods: {
        // 增加部门区方法
        addDptDataSubmit() {
            this.$refs.addDptForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.post("http://localhost:8080/dpts", this.addDptData).then((response) => {
                        if (response.data.code == 1) {
                            this.$message({
                                message: "添加成功",
                                type: "success",
                            });
                            this.$refs.addDptForm.resetFields(); //清空表单数据
                            this.addDptDialogVisible = false;
                            this.loadDptData();
                        } else {
                            this.$message({
                                message: "当前部门名已存在，请重新输入",
                                type: "error",
                            });
                        }
                    });
                }
            });
        },
        closeAddDptForm() {
            this.$refs.addDptForm.resetFields();
            this.addDptDialogVisible = false;
        },
        addDptHandleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    this.$refs.addDptForm.resetFields();
                    done();
                })
                .catch(() => {});
        },

        // 编辑部门区方法
        showEditDptDialog(id) {
            axios.get(`http://localhost:8080/dpts/${id}`).then((response) => {
                const data = response.data.data;
                Object.keys(this.editDptData).forEach((key) => {
                    if (key in data) {
                        this.editDptData[key] = data[key];
                    }
                });
            });
            this.editDptDialogVisible = true;
        },
        editDptDataSubmit() {
            this.$refs.editDptForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.put("http://localhost:8080/dpts", this.editDptData).then((response) => {
                        if (response.data.code == 1) {
                            this.$message({
                                message: "修改成功",
                                type: "success",
                            });
                            this.$refs.editDptForm.resetFields(); //清空表单数据
                            this.editDptDialogVisible = false;
                            this.loadDptData();
                        } else {
                            this.$message({
                                message: "当前部门名已存在，请重新输入",
                                type: "error",
                            });
                        }
                    });
                }
            });
        },

        // 删除部门区方法
        showDelDptDialog(id) {
            this.delDptDataId = id;
            this.delDptDialogVisible = true;
        },
        delDptDataSubmit() {
            // 向数据库中删除数据
            axios.delete(`http://localhost:8080/dpts/${this.delDptDataId}`).then((response) => {
                if (response.data.code == 1) {
                    this.$message({
                        message: "删除成功",
                        type: "success",
                    });
                    this.loadDptData();
                } else {
                    this.$message({
                        message: "删除失败",
                        type: "error",
                    });
                }
            });
            // 关闭删除对话框
            this.delDptDialogVisible = false;
        },

        // 显示部门区方法
        loadDptData() {
            axios.get("http://localhost:8080/dpts").then((response) => {
                this.showDptData = response.data.data;
            });
        },
    },
    mounted() {
        this.loadDptData();
    },
};
</script>

<style></style>
