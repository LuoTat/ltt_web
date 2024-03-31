<template>
    <!-- 右侧主界面 -->
    <el-main>
        部门管理
        <!-- 新增部门按钮 -->
        <div style="margin-top: 20px">
            <el-button type="primary" @click="addDptDialogVisible = true">+ 新增部门</el-button>
        </div>
        <!-- 表格 -->

        <el-table :data="showData">
            <el-table-column type="index" label="序号" min-width="100px" align="left"> </el-table-column>
            <el-table-column prop="dptName" label="部门名称" min-width="100px"> </el-table-column>
            <el-table-column prop="lastOperationTime" label="最后操作时间" min-width="100px"> </el-table-column>
            <el-table-column label="操作" min-width="120px" align="right">
                <template slot-scope="scope">
                    <!-- 编辑部门按钮 -->
                    <el-button type="primary" @click="showEditDptDialog(scope.$index)" size="mini">编 辑</el-button>
                    <!-- 删除部门按钮 -->
                    <el-button type="danger" @click="delDptDialogVisible = true" size="mini">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 下面是当前页面所有的对话框 -->

        <!-- 新增部门按钮的内容 -->
        <el-dialog title="新增部门" :visible.sync="addDptDialogVisible" :before-close="handleClose">
            <el-form :model="addDptData" :rules="dptRules" ref="addDptForm">
                <el-form-item label="部门名称" prop="dptName" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addDptData.dptName" placeholder="请输入部门名称,长度为2-10位"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetAddDptForm('addDptForm')">取 消</el-button>
                <el-button type="primary" @click="addDptDataSubmit('addDptForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑部门按钮的内容 -->
        <el-dialog title="编辑部门" :visible.sync="editDptDialogVisible" :before-close="handleClose">
            <el-form :model="editDptData" :rules="dptRules" ref="editDptForm">
                <el-form-item label="部门名称" prop="dptName" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editDptData.dptName" placeholder="请输入部门名称,长度为2-10位"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editDptDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDptDataSubmit('editDptForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 删除班级按钮的内容 -->
        <el-dialog title="删除部门" :visible.sync="delDptDialogVisible" :before-close="handleClose">
            <span>您确定要删除该部门吗？</span>
            <span slot="footer">
                <el-button @click="delDptDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="delDptDataUpdate()">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
//import axios from "axios";

export default {
    data() {
        return {
            addDptDialogVisible: false,
            editDptDialogVisible: false,
            delDptDialogVisible: false,
            formLabelWidth: "100px",
            dptRules: {
                dptName: [
                    { required: true, message: "请输入部门名称", trigger: "blur" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
                ],
            },
            //用来绑定表单数据
            addDptData: {
                dptName: "", //班级名称
            },
            editDptData: {
                dptName: "",
            },
            delDptData: {
                index: -1,
            },
            showData: [],
            dptData: [],
            SQLData: [
                { dptName: "部门01", lastOperationTime: "2024-3-31" },
                { dptName: "部门02", lastOperationTime: "2024-3-31" },
                { dptName: "部门03", lastOperationTime: "2024-3-31" },
                { dptName: "部门04", lastOperationTime: "2024-3-31" },
                { dptName: "部门05", lastOperationTime: "2024-3-31" },
            ],
        };
    },
    methods: {
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
        loadData() {
            // 根据当前页数和每页显示条目数获取数据，这里是示例数据，您需要根据实际情况调整
            this.showData = this.dptData.slice();
        },
        addDptDataSubmit(addDptForm) {
            this.$refs[addDptForm].validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    alert("Success!");
                    //判断是否有重复数据
                    //新建一个对话框，提示是否添加成功
                }
            });
        },
        //multiple
        resetAddDptForm(addDptForm) {
            this.$refs[addDptForm].resetFields();
            this.addDptDialogVisible = false;
        },
        showEditDptDialog(index) {
            // 将选中行的数据赋值给编辑表单
            // 计算当前选中行的索引
            this.editDptData = { ...this.dptData[index] };
            this.editDptDialogVisible = true;
        },
        editDptDataSubmit(editDptForm) {
            this.$refs[editDptForm].validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //判断是否有重复数据
                    //新建一个对话框，提示是否编辑成功
                }
            });
            // 关闭编辑对话框
            this.editDptDialogVisible = false;
        },
        delDptDataUpdate() {
            // 向数据库中删除数据
            // 关闭删除对话框
            this.delDptDialogVisible = false;
        },
    },
    mounted() {
        this.dptData = this.SQLData.slice(); // 模拟从数据库中获取数据
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
