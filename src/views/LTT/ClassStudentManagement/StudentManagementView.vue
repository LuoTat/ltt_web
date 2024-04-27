<template>
    <!-- 右侧主界面 -->
    <el-main>
        学员管理
        <!-- 查询栏 -->
        <el-form :model="stuSearchData">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="学员姓名">
                        <el-input
                            v-model="stuSearchData.name"
                            clearable
                            placeholder="请输入学员名称"
                            style="width: 155px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="学号">
                        <el-input
                            v-model="stuSearchData.studentId"
                            clearable
                            placeholder="请输入学号"
                            style="width: 140px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="最高学历">
                        <el-select
                            v-model="stuSearchData.educationLevel"
                            clearable
                            placeholder="请选择"
                            style="width: 140px">
                            <el-option
                                v-for="item in educationLevelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="所属班级">
                        <el-select
                            v-model="stuSearchData.classId"
                            clearable
                            placeholder="请选择"
                            style="width: 140px">
                            <el-option
                                v-for="item in showClsData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="4"
                    align="right">
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="searchStu"
                            >查 询</el-button
                        >
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增学员按钮 -->
        <div style="margin-top: 10px">
            <el-button
                type="primary"
                @click="addStuDialogVisible = true"
                >+ 新增学员</el-button
            >
            <el-button
                type="primary"
                @click="multdelStuDialogVisible = true"
                >- 批量删除</el-button
            >
        </div>

        <!-- 表格 -->
        <el-table
            ref="multiDelTable"
            :data="showStuData"
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
                prop="studentId"
                label="学号"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="classId"
                label="班级"
                min-width="100px"
                :formatter="classNameFormatter">
            </el-table-column>
            <el-table-column
                prop="gender"
                label="性别"
                min-width="100px"
                :formatter="(row) => genderOptions.find((option) => option.value === row.gender)?.label || ''">
            </el-table-column>
            <el-table-column
                prop="phoneNumber"
                label="手机号"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="educationLevel"
                label="最高学历"
                min-width="100px"
                :formatter="(row) => educationLevelOptions.find((option) => option.value === row.educationLevel)?.label || ''">
            </el-table-column>
            <el-table-column
                prop="infractionNum"
                label="违纪次数"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="infractionPoint"
                label="违纪扣分"
                min-width="100px">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="最后操作时间"
                min-width="140px">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="240px"
                align="right"
                fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑学员按钮 -->
                    <el-button
                        type="primary"
                        @click="showEditStuDialog(scope.row.id)"
                        size="mini"
                        >编 辑</el-button
                    >
                    <!-- 违纪按钮 -->
                    <el-button
                        type="primary"
                        @click="showEditStuInfractionDialog(scope.row.id)"
                        size="mini"
                        >违 纪</el-button
                    >
                    <!-- 删除学员按钮 -->
                    <el-button
                        type="danger"
                        @click="showDelStuDialog(scope.row.id)"
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

        <!-- 新增学员按钮的内容 -->
        <el-dialog
            title="新增学员"
            :visible.sync="addStuDialogVisible"
            :before-close="addStuHandleClose">
            <el-form
                :model="addStuData"
                :rules="stuRules"
                ref="addStuForm">
                <el-form-item
                    label="姓名"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addStuData.name"
                        placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item
                    label="学号"
                    prop="studentId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addStuData.studentId"
                        placeholder="请输入学号">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="性别"
                    prop="gender"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addStuData.gender"
                        placeholder="请选择">
                        <el-option
                            v-for="item in genderOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="手机号"
                    prop="phoneNumber"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="addStuData.phoneNumber"
                        placeholder="请输入手机号">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="最高学历"
                    prop="educationLevel"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addStuData.educationLevel"
                        placeholder="请选择">
                        <el-option
                            v-for="item in educationLevelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="所属班级"
                    prop="classId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-select
                        v-model="addStuData.classId"
                        placeholder="请选择"
                        style="width: 140px">
                        <el-option
                            v-for="item in showClsData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="closeAddStuForm">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addStuDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 编辑学员按钮的内容 -->
        <el-dialog
            title="编辑学员"
            :visible.sync="editStuDialogVisible">
            <el-form
                :model="editStuData"
                :rules="stuRules"
                ref="editStuForm">
                <el-form-item
                    label="姓名"
                    prop="name"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editStuData.name"
                        placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item
                    label="学号"
                    prop="studentId"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editStuData.studentId"
                        placeholder="请输入学号">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="性别"
                    prop="gender"
                    label-position="left"
                    :label-width="formLabelWidth"
                    placeholder="请选择">
                    <el-select v-model="editStuData.gender">
                        <el-option
                            v-for="item in genderOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="手机号"
                    prop="phoneNumber"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editStuData.phoneNumber"
                        placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item
                    label="最高学历"
                    prop="educationLevel"
                    label-position="left"
                    :label-width="formLabelWidth"
                    placeholder="请选择">
                    <el-select v-model="editStuData.educationLevel">
                        <el-option
                            v-for="item in educationLevelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="所属班级"
                    prop="classId"
                    label-position="left"
                    :label-width="formLabelWidth"
                    placeholder="请选择">
                    <el-select v-model="editStuData.classId">
                        <el-option
                            v-for="item in showClsData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editStuDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editStuDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 违纪扣分按钮的内容 -->
        <el-dialog
            title="学员违纪处理"
            :visible.sync="editStuInfractionDialogVisible">
            <el-form
                :model="editStuInfractionData"
                :rules="stuRules"
                ref="editStuInfractionForm">
                <el-form-item
                    label="违纪扣分"
                    prop="infractionPoint"
                    label-position="left"
                    :label-width="formLabelWidth">
                    <el-input
                        v-model="editStuInfractionData.infractionPoint"
                        placeholder="请输入扣分数目"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editStuInfractionDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editStuInfractionDataSubmit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <!-- 批量删除按钮的内容 -->
        <el-dialog
            title="批量删除学员"
            :visible.sync="multdelStuDialogVisible"
            width="30%">
            <span>您确定要删除所选学员吗？</span>
            <span slot="footer">
                <el-button @click="multdelStuDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="multDelStuDataSubmit()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <!-- 删除学员按钮的内容 -->
        <el-dialog
            title="删除学员"
            :visible.sync="delStuDialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>您确定要删除该学员吗？</span>
            <span slot="footer">
                <el-button @click="delStuDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="delStuDataSubmit()"
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
            addStuDialogVisible: false,
            editStuDialogVisible: false,
            editStuInfractionDialogVisible: false,
            delStuDialogVisible: false,
            multdelStuDialogVisible: false,

            // 表单控制区
            formLabelWidth: "100px",

            // 分页控制区
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            totalPage: 0, // 总条目数

            // 表单验证规则区
            stuRules: {
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("姓名只能包含汉字、数字和字母"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                studentId: [
                    { required: true, message: "请输入学号", trigger: "blur" },
                    { min: 10, max: 10, message: "长度为 10 个字符", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[A-Za-z0-9]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("学号只能包含数字和字母"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                gender: [{ required: true, message: "请选择", trigger: "change" }],
                phoneNumber: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    { min: 11, max: 11, message: "手机号码格式错误", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            const reg = /^[0-9]+$/;
                            if (!reg.test(value)) {
                                callback(new Error("手机号只能包含数字"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                classId: [{ required: true, message: "请选择", trigger: "change" }],
            },

            // 性别选择区数据
            genderOptions: [
                { label: "男", value: 1 },
                { label: "女", value: 2 },
            ],

            // 学历选择区数据
            educationLevelOptions: [
                { label: "初中", value: 1 },
                { label: "高中", value: 2 },
                { label: "大专", value: 3 },
                { label: "本科", value: 4 },
                { label: "硕士", value: 5 },
                { label: "博士", value: 6 },
            ],

            // 查询学生区数据
            stuSearchData: {
                name: "",
                studentId: "",
                educationLevel: "",
                classId: "",
            },

            // 新增学生区数据
            addStuData: {},

            // 编辑学生区数据
            editStuData: {
                id: "",
                name: "",
                studentId: "",
                educationLevel: "",
                gender: "",
                phoneNumber: "",
                classId: "",
            },
            editStuInfractionData: {
                id: "",
                infractionPoint: "",
            },

            // 删除学生区数据
            delStuDataId: -1,
            multiDelTable: [],

            // 显示学生区数据
            showStuData: [],

            // 显示班级区数据
            showClsData: [], // 用于存储班级数据
            classNames: {}, // 用于存储班级 ID 和名称的映射
            loadingClassNames: {}, // 用于跟踪哪些班级 ID 的请求正在进行
            // loading: false, // 是否正在加载数据
            // showClsPage: 1, // 当前的页数
            // currentQuery: "", // 当前的查询字符串
        };
    },
    methods: {
        // 分页控制区方法
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.loadStuData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadStuData();
        },

        // 表格控制区方法
        // 根据班级id获取班级名称
        classNameFormatter(row) {
            if (this.classNames[row.classId]) {
                return this.classNames[row.classId];
            } else {
                this.loadClassName(row.classId);
                return "加载中...";
            }
        },
        loadClassName(classId) {
            if (!this.loadingClassNames[classId]) {
                this.loadingClassNames[classId] = true;
                axios.get(`http://localhost:8080/clss/${classId}`).then((response) => {
                    this.$set(this.classNames, classId, response.data.data.name);
                    this.loadingClassNames[classId] = false;
                });
            }
        },
        handleSelectionChange(val) {
            this.multiDelTable = val;
        },

        // 查询学生区方法
        searchStu() {
            this.currentPage = 1; // 重置当前页数
            axios.get(`http://localhost:8080/stus?name=${this.stuSearchData.name}&studentId=${this.stuSearchData.studentId}&educationLevel=${this.stuSearchData.educationLevel}&classId=${this.stuSearchData.classId}&currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showStuData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },

        // 新增学生区方法
        addStuDataSubmit() {
            this.$refs.addStuForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.post("http://localhost:8080/stus", this.addStuData).then((response) => {
                        if (response.data.code == 1) {
                            this.$message({
                                message: "添加成功",
                                type: "success",
                            });
                            this.$refs.addStuForm.resetFields(); //清空表单数据
                            this.addStuDialogVisible = false;
                            this.loadStuData();
                        } else {
                            this.$message({
                                message: "当前学号或手机号已存在，请重新输入",
                                type: "error",
                            });
                        }
                    });
                }
            });
        },
        closeAddStuForm() {
            this.$refs.addStuForm.resetFields();
            this.addStuDialogVisible = false;
        },
        addStuHandleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    this.$refs.addStuForm.resetFields();
                    done();
                })
                .catch(() => {});
        },

        // 编辑学生区方法
        showEditStuDialog(id) {
            axios.get(`http://localhost:8080/stus/${id}`).then((response) => {
                const data = response.data.data;
                Object.keys(this.editStuData).forEach((key) => {
                    if (key in data) {
                        this.editStuData[key] = data[key];
                    }
                });
            });
            this.editStuDialogVisible = true;
        },
        showEditStuInfractionDialog(id) {
            this.editStuInfractionData.id = id;
            this.editStuInfractionDialogVisible = true;
        },
        editStuDataSubmit() {
            this.$refs.editStuForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    console.log(this.editStuData);
                    axios.put("http://localhost:8080/stus", this.editStuData).then((response) => {
                        if (response.data.code == 1) {
                            this.$message({
                                message: "修改成功",
                                type: "success",
                            });
                            this.$refs.editStuForm.resetFields(); //清空表单数据
                            this.editStuDialogVisible = false;
                            this.loadStuData();
                        } else {
                            this.$message({
                                message: "当前用户名已存在，请重新输入",
                                type: "error",
                            });
                        }
                    });
                }
            });
            // 关闭编辑对话框
            this.editStuDialogVisible = false;
        },
        editStuInfractionDataSubmit() {
            this.$refs.editStuInfractionForm.validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //发送数据到数据库
                    axios.put("http://localhost:8080/stus", this.editStuInfractionData).then((response) => {
                        if (response.data.code == 1) {
                            this.$message({
                                message: "修改成功",
                                type: "success",
                            });
                            this.$refs.editStuInfractionForm.resetFields(); //清空表单数据
                            this.editStuInfractionDialogVisible = false;
                            this.loadStuData();
                        } else {
                            this.$message({
                                message: "出现传输错误，请重新输入",
                                type: "error",
                            });
                        }
                    });
                }
            });
            // 关闭编辑对话框
            this.editStuInfractionDialogVisible = false;
        },

        // 删除学生区方法
        showDelStuDialog(id) {
            this.delStuDataId = id;
            this.delStuDialogVisible = true;
        },
        delStuDataSubmit() {
            // 向数据库中删除数据
            axios.delete(`http://localhost:8080/stus/${this.delStuDataId}`).then((response) => {
                if (response.data.code == 1) {
                    this.$message({
                        message: "删除成功",
                        type: "success",
                    });
                    this.loadStuData();
                } else {
                    this.$message({
                        message: "删除失败",
                        type: "error",
                    });
                }
            });
            // 关闭删除对话框
            this.delStuDialogVisible = false;
        },
        multDelStuDataSubmit() {
            let ids = [];
            this.multiDelTable.forEach((item) => {
                ids.push(item.id);
            });
            axios.delete(`http://localhost:8080/stus/${ids}`).then((response) => {
                if (response.data.code == 1) {
                    this.$message({
                        message: "批量删除成功",
                        type: "success",
                    });
                    this.loadStuData();
                } else {
                    this.$message({
                        message: "批量删除失败",
                        type: "error",
                    });
                }
            });
            this.multDelStuDialogVisible = false;
        },

        // 显示学生区方法
        loadStuData() {
            // 根据当前页数和每页显示条目数获取数据,无条件查询
            axios.get(`http://localhost:8080/stus?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then((response) => {
                this.showStuData = response.data.data.rows;
                this.totalPage = response.data.data.total;
            });
        },

        // // 显示班级区方法
        // filterMethod: _.debounce(function (query) {
        //     this.currentQuery = query;
        //     if (query) {
        //         this.page = 1;
        //         this.loadMoreCls(query);
        //     } else {
        //         this.clsData = [];
        //     }
        // }, 500),
        // // 滚动加载
        // loadMoreCls(query) {
        //     this.loading = true;
        //     axios.get(`http://localhost:8080/clss?name=${query}&currentPage=${this.showClsPage}`).then((response) => {
        //         this.showClsData = this.showClsData.concat(response.data.data.rows);
        //         this.loading = false;
        //     });
        // },
        // handleScroll(event) {
        //     // 如果滚动到了底部，并且当前没有正在加载数据
        //     if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight && !this.loading) {
        //         this.showClsPage++;
        //         this.loadMoreCls(this.currentQuery);
        //     }
        // },
        // handleVisibleChange(visible) {
        //     if (visible) {
        //         this.$nextTick(() => {
        //             const dropdown = this.$refs.select.$refs.popper;
        //             dropdown.addEventListener("scroll", this.handleScroll);
        //         });
        //     }
        // },
    },
    mounted() {
        this.loadStuData();
        axios.get("http://localhost:8080/clss?currentPage=1&pageSize=9999").then((response) => {
            this.showClsData = response.data.data.rows;
        });
    },
};
</script>

<style></style>
