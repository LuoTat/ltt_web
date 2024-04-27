<template>
    <!-- 右侧主界面 -->
    <el-main>
        员工管理
        <!-- 查询栏 -->
        <el-form :model="empSearchData">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="姓名">
                        <el-input
                            v-model="empSearchData.name"
                            clearable
                            placeholder="请输入员工姓名"
                            style="width: 155px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="性别">
                        <el-select
                            v-model="empSearchData.gender"
                            clearable
                            placeholder="请选择"
                            style="width: 140px">
                            <el-option
                                v-for="item in genderOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="入职时间">
                        <el-date-picker
                            v-model="empSearchData.entryDate"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="4"
                    align="right">
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="searchEmp"
                            >查 询</el-button
                        >
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增员工按钮 -->
        <div style="margin-top: 10px">
            <el-button
                type="primary"
                @click="addEmpDialogVisible = true"
                >+ 新增员工</el-button
            >
            <el-button
                type="primary"
                @click="multDelEmpDialogVisible = true"
                >- 批量删除</el-button
            >
        </div>

        <!-- 表格 -->
        <el-table
            ref="multiDelTable"
            :data="showEmpData"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                min-width="50px"
                align="left"
                fixed="left">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="image"
                label="图像"
                width="180">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.image"
                        width="100px"
                        height="70px" />
                </template>
            </el-table-column>
            <el-table-column
                prop="gender"
                label="性别"
                min-width="100px"
                :formatter="(row) => genderOptions.find((option) => option.value === row.gender)?.label || ''">
            </el-table-column>
            <el-table-column
                prop="entryDate"
                label="入职时间"
                min-width="120px">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="最后操作时间"
                min-width="120px">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="240px"
                align="right"
                fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑员工按钮 -->
                    <el-button
                        type="primary"
                        @click="showEditEmpDialog(scope.row.id)"
                        size="mini"
                        >编 辑</el-button
                    >
                    <!-- 删除员工按钮 -->
                    <el-button
                        type="danger"
                        @click="showDelEmpDialog(scope.row.id)"
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

        <!-- 新增员工按钮的内容 -->
        <el-dialog
            title="新增员工"
            :visible.sync="addEmpDialogVisible"
            :before-close="addEmpHandleClose">
            <el-form
                :model="addEmpData"
                :rules="empRules"
                ref="addEmpForm">
                <el-form-item
                    label="用户名"
                    prop="username"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addEmpData.username"
                        placeholder="请输入用户名，2-20字符，不可重复"></el-input>
                </el-form-item>
                <el-form-item
                    label="员工姓名"
                    prop="name"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addEmpData.name"
                        placeholder="请输入员工姓名，2-10个字">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="性别"
                    prop="gender"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addEmpData.gender"
                        placeholder="请选择">
                        <el-option
                            v-for="item in genderOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="图像"
                    prop="image"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-upload
                        class="avatar-uploader"
                        action="http://localhost:8080/upload"
                        name="image"
                        :show-file-list="false"
                        :on-success="addEmpHandleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img
                            v-if="addEmpData.image"
                            :src="addEmpData.image"
                            class="avatar" />
                        <i
                            v-else
                            class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item
                    label="职位"
                    prop="job"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addEmpData.job"
                        placeholder="请选择">
                        <el-option
                            v-for="item in jobOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="入职时间"
                    prop="entryDate"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="addEmpData.entryDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择入职时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="归属部门"
                    prop="deptId"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addEmpData.deptId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showDptData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeAddEmpForm">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addEmpDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 编辑员工按钮的内容 -->
        <el-dialog
            title="编辑员工"
            :visible.sync="editEmpDialogVisible">
            <el-form
                :model="editEmpData"
                :rules="empRules"
                ref="editEmpForm">
                <el-form-item
                    label="用户名"
                    prop="username"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editEmpData.username"
                        placeholder="请输入用户名，2-20字符，不可重复"></el-input>
                </el-form-item>
                <el-form-item
                    label="员工姓名"
                    prop="name"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editEmpData.name"
                        placeholder="请输入员工姓名，2-10个字">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="性别"
                    prop="gender"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="editEmpData.gender"
                        placeholder="请选择">
                        <el-option
                            v-for="item in genderOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="图像"
                    prop="image"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-upload
                        class="avatar-uploader"
                        action="http://localhost:8080/upload"
                        name="image"
                        :show-file-list="false"
                        :on-success="editEmpHandleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img
                            v-if="editEmpData.image"
                            :src="editEmpData.image"
                            class="avatar" />
                        <i
                            v-else
                            class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item
                    label="职位"
                    prop="job"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="editEmpData.job"
                        placeholder="请选择">
                        <el-option
                            v-for="item in jobOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="入职时间"
                    prop="entryDate"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="editEmpData.entryDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择入职时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="归属部门"
                    prop="deptId"
                    label-job="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="editEmpData.deptId"
                        placeholder="请选择">
                        <el-option
                            v-for="item in showDptData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editEmpDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editEmpDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 批量删除按钮的内容 -->
        <el-dialog
            title="批量删除员工"
            :visible.sync="multDelEmpDialogVisible"
            width="30%">
            <span>您确定要删除所选员工吗？</span>
            <span slot="footer">
                <el-button @click="multDelEmpDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="multDelEmpDataSubmit()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <!-- 删除员工按钮的内容 -->
        <el-dialog
            title="删除员工"
            :visible.sync="delEmpDialogVisible"
            width="30%">
            <span>您确定要删除该员工吗？</span>
            <span slot="footer">
                <el-button @click="delEmpDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="delEmpDataSubmit"
                    >删除</el-button
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
            addEmpDialogVisible: false,
            editEmpDialogVisible: false,
            delEmpDialogVisible: false,
            multDelEmpDialogVisible: false,

            // 表单控制区
            formLabelWidth: "100px",

            // 分页控制区
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            totalPage: -1, // 总条目数

            // 表单规则验证区
            empRules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[A-Za-z0-9]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("用户名只能包含数字和字母"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[\u4e00-\u9fa5]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("姓名只能包含中文"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                gender: [{ required: true, message: "请选择", trigger: "change" }],
            },

            // 性别选择区数据
            genderOptions: [
                { label: "男", value: 1 },
                { label: "女", value: 2 },
            ],

            // 职位选择区数据
            jobOptions: [
                { label: "班主任", value: 1 },
                { label: "讲师", value: 2 },
                { label: "学工主管", value: 3 },
                { label: "研主管", value: 4 },
                { label: "咨询师", value: 5 },
            ],

            // 查询员工区数据
            empSearchData: {
                name: "",
                gender: "",
                entryDate: ["", ""],
            },

            // 增加员工区数据
            addEmpData: {},

            // 编辑员工区数据
            editEmpData: {
                id: "",
                username: "",
                name: "",
                gender: "",
                image: "",
                job: "",
                entryDate: "",
                deptId: "",
            },

            // 删除员工区数据
            delEmpDataId: -1,
            multiDelTable: [],

            // 显示员工区数据
            showEmpData: [],

            // 显示部门区数据
            showDptData: [],
        };
    },
    methods: {
        // 分页控制区方法
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.loadEmpData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadEmpData();
        },

        // 图像上传区方法
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isPNG = file.type === "image/png";
            const isJPEG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!(isJPG || isPNG || isJPEG)) {
                this.$message.error("上传头像图片只能是 JPG/PNG/JPEG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },

        // 表格控制区方法
        handleSelectionChange(val) {
            this.multiDelTable = val;
        },

        // 查询员工区方法
        searchEmp() {
            let beginDate = "";
            let endDate = "";
            if (this.empSearchData.entryDate != null) {
                beginDate = this.empSearchData.entryDate[0];
                endDate = this.empSearchData.entryDate[1];
            }
            this.currentPage = 1; // 重置当前页数
            axios.get(`http://localhost:8080/emps?name=${this.empSearchData.name}&gender=${this.empSearchData.gender}&begin=${beginDate}&end=${endDate}&currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showEmpData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },

        // 增加员工区方法
        addEmpHandleAvatarSuccess(response) {
            this.addEmpData.image = response.data;
        },
        addEmpDataSubmit() {
            this.$refs.addEmpForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.post("http://localhost:8080/emps", this.addEmpData).then((response) => {
                        if (response.data.code == 1) {
                            this.$message({
                                message: "添加成功",
                                type: "success",
                            });
                            this.$refs.addEmpForm.resetFields(); //清空表单数据
                            this.addEmpDialogVisible = false;
                            this.loadEmpData();
                        } else {
                            this.$message({
                                message: "当前用户名已存在，请重新输入",
                                type: "error",
                            });
                        }
                    });
                }
            });
        },
        closeAddEmpForm() {
            this.$refs.addEmpForm.resetFields();
            this.addEmpDialogVisible = false;
        },
        addEmpHandleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    this.$refs.addEmpForm.resetFields();
                    done();
                })
                .catch(() => {});
        },

        // 编辑员工区方法
        editEmpHandleAvatarSuccess(response) {
            this.editEmpData.image = response.data;
        },
        showEditEmpDialog(id) {
            axios.get(`http://localhost:8080/emps/${id}`).then((response) => {
                const data = response.data.data;
                Object.keys(this.editEmpData).forEach((key) => {
                    if (key in data) {
                        this.editEmpData[key] = data[key];
                    }
                });
            });
            this.editEmpDialogVisible = true;
        },
        editEmpDataSubmit() {
            this.$refs.editEmpForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.put("http://localhost:8080/emps", this.editEmpData).then((response) => {
                        if (response.data.code == 1) {
                            this.$message({
                                message: "修改成功",
                                type: "success",
                            });
                            this.$refs.editEmpForm.resetFields(); //清空表单数据
                            this.editEmpDialogVisible = false;
                            this.loadEmpData();
                        } else {
                            this.$message({
                                message: "当前用户名已存在，请重新输入",
                                type: "error",
                            });
                        }
                    });
                }
            });
        },

        // 删除员工区方法
        showDelEmpDialog(id) {
            this.delEmpDataId = id;
            this.delEmpDialogVisible = true;
        },
        delEmpDataSubmit() {
            // 向数据库中删除数据
            axios.delete(`http://localhost:8080/emps/${this.delEmpDataId}`).then((response) => {
                if (response.data.code == 1) {
                    this.$message({
                        message: "删除成功",
                        type: "success",
                    });
                    this.loadEmpData();
                } else {
                    this.$message({
                        message: "删除失败",
                        type: "error",
                    });
                }
            });
            // 关闭删除对话框
            this.delEmpDialogVisible = false;
        },
        multDelEmpDataSubmit() {
            let ids = [];
            this.multiDelTable.forEach((item) => {
                ids.push(item.id);
            });
            axios.delete(`http://localhost:8080/emps/${ids}`).then((response) => {
                if (response.data.code == 1) {
                    this.$message({
                        message: "批量删除成功",
                        type: "success",
                    });
                    this.loadEmpData();
                } else {
                    this.$message({
                        message: "批量删除失败",
                        type: "error",
                    });
                }
            });
            this.multDelEmpDialogVisible = false;
        },

        // 显示员工区方法
        loadEmpData() {
            // 根据当前页数和每页显示条目数获取数据,无条件查询
            axios.get(`http://localhost:8080/emps?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showEmpData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },
    },
    mounted() {
        this.loadEmpData();
        // 获取部门数据
        axios.get("http://localhost:8080/dpts").then((response) => {
            this.showDptData = response.data.data;
        });
    },
};
</script>

<style>
/* 图像上传样式 */
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
