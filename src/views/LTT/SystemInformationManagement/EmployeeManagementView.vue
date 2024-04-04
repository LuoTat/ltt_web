<template>
    <!-- 右侧主界面 -->
    <el-main>
        员工管理
        <!-- 查询栏 -->
        <el-form :model="empSearchData">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="姓名">
                        <el-input v-model="empSearchData.empName" placeholder="请输入员工姓名" style="width: 140px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="性别">
                        <el-select v-model="empSearchData.gender" placeholder="请选择" style="width: 140px">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="入职时间">
                        <el-date-picker v-model="empSearchData.hireTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="3" align="right">
                    <el-form-item>
                        <el-button type="primary" @click="searchEmp()">查 询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增员工按钮 -->
        <el-button type="primary" @click="addEmpDialogVisible = true">+ 新增员工</el-button>
        <el-button type="primary" @click="multDelEmpDialogVisible = true">- 批量删除</el-button>

        <!-- 表格 -->
        <el-table ref="multiDelTable" :data="showData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" min-width="50px" align="left" fixed="left"> </el-table-column>
            <el-table-column prop="empName" label="姓名" min-width="100px"> </el-table-column>
            <el-table-column prop="empImg" label="图像" width="180">
                <template slot-scope="scope">
                    <img :src="scope.row.empImg" width="100px" height="70px" />
                </template>
            </el-table-column>
            <el-table-column prop="gender" label="性别" min-width="100px"> </el-table-column>
            <el-table-column prop="hireTime" label="入职时间" min-width="120px"> </el-table-column>
            <el-table-column prop="lastOperationTime" label="最后操作时间" min-width="120px"> </el-table-column>
            <el-table-column label="操作" min-width="240px" align="right" fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-button type="primary" @click="showEditempDialog(scope.$index)" size="mini">编 辑</el-button>
                    <!-- 删除按钮 -->
                    <el-button type="danger" @click="delEmpDialogVisible = true" size="mini">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 表格导航栏 -->
        <el-row>
            <el-col :span="4">
                <div style="text-align: left">
                    <el-pagination @size-change="handleSizeChange" :current-page="currentPage" :page-size="pageSize" :total="totalPage" layout="sizes"> </el-pagination>
                </div>
            </el-col>
            <el-col :span="16">
                <div style="text-align: center">
                    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="totalPage" background layout="prev,pager,next,jumper"> </el-pagination>
                </div>
            </el-col>
            <el-col :span="4">
                <div style="text-align: right">
                    <el-pagination :total="totalPage" layout="total"> </el-pagination>
                </div>
            </el-col>
        </el-row>

        <!-- 下面是当前页面所有的对话框 -->

        <!-- 新增员工按钮的内容 -->
        <el-dialog title="新增员工" :visible.sync="addEmpDialogVisible" :before-close="handleClose">
            <el-form :model="addEmpData" :rules="empRules" ref="addEmpForm">
                <el-form-item label="用户名" prop="empID" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addEmpData.empID" placeholder="请输入用户名，2-20字符，不可重复"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" prop="empName" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addEmpData.empName" placeholder="请输入员工姓名，2-10个字"> </el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addEmpData.gender" placeholder="请选择">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 上传图像 -->
                <!--  -->
                <!--  -->
                <el-form-item label="职位" prop="position" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addEmpData.position" placeholder="请选择">
                        <el-option label="CEO" value="CEO"></el-option>
                        <el-option label="牛马" value="牛马"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="入职时间" prop="hireTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="addEmpData.hireTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择入职时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="归属部门" prop="department" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addEmpData.department" placeholder="请选择">
                        <el-option label="部门1" value="部门1"></el-option>
                        <el-option label="部门2" value="部门2"></el-option>
                        <el-option label="部门3" value="部门3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetAddEmpForm('addEmpForm')">取 消</el-button>
                <el-button type="primary" @click="addEmpDataSubmit('addEmpForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 批量删除按钮的内容 -->
        <el-dialog title="批量删除员工" :visible.sync="multDelEmpDialogVisible" width="30%" :before-close="handleClose">
            <span>您确定要删除所选员工吗？</span>
            <span slot="footer">
                <el-button @click="multDelEmpDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="multDelEmpDataSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑员工按钮的内容 -->
        <el-dialog title="编辑员工" :visible.sync="editEmpDialogVisible" :before-close="handleClose">
            <el-form :model="editEmpData" :rules="empRules" ref="editEmpForm">
                <el-form-item label="用户名" prop="empID" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editEmpData.empID" placeholder="请输入用户名，2-20字符，不可重复"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" prop="empName" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editEmpData.empName" placeholder="请输入员工姓名，2-10个字"> </el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="editEmpData.gender" placeholder="请选择">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 上传图像 -->
                <!--  -->
                <!--  -->
                <el-form-item label="职位" prop="position" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="editEmpData.position" placeholder="请选择">
                        <el-option label="CEO" value="CEO"></el-option>
                        <el-option label="牛马" value="牛马"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="入职时间" prop="hireTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="editEmpData.hireTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择入职时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="归属部门" prop="department" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="editEmpData.department" placeholder="请选择">
                        <el-option label="部门1" value="部门1"></el-option>
                        <el-option label="部门2" value="部门2"></el-option>
                        <el-option label="部门3" value="部门3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editEmpDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editEmpDataSubmit('editEmpForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 删除员工按钮的内容 -->
        <el-dialog title="删除员工" :visible.sync="delEmpDialogVisible" width="30%" :before-close="handleClose">
            <span>您确定要删除该员工吗？</span>
            <span slot="footer">
                <el-button @click="delEmpDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delEmpDataSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
//import axios from "axios";

export default {
    data() {
        return {
            addEmpDialogVisible: false,
            multDelEmpDialogVisible: false,
            editEmpDialogVisible: false,
            delEmpDialogVisible: false,
            formLabelWidth: "100px",
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            totalPage: 0, // 总条目数
            empSearchData: {
                empName: "",
                gender: "",
                hireTime: "",
            },
            empRules: {
                empID: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
                ],
                empName: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
                ],
                gender: [{ required: true, message: "请选择", trigger: "change" }],
            },
            //用来绑定表单数据
            addEmpData: {
                empID: "",
                empName: "",
                gender: "",
                empImg: "",
                position: "",
                hireTime: "",
                department: "",
            },
            editEmpData: {
                empID: "",
                empName: "",
                gender: "",
                empImg: "",
                position: "",
                hireTime: "",
                department: "",
            },
            multiDelTable: [],
            delEmpForm: {
                index: -1,
            },
            showData: [],
            empData: [],
            SQLData: [
                { empID: "00001", empName: "学员01", gender: "男", empImg: "100-0001", position: "牛马", hireTime: "2023-03-25", department: "部门01", lastOperationTime: "2023-03-25" },
                { empID: "00002", empName: "学员02", gender: "女", empImg: "100-0002", position: "牛马", hireTime: "2023-03-25", department: "部门02", lastOperationTime: "2023-03-25" },
                { empID: "00003", empName: "学员03", gender: "男", empImg: "100-0003", position: "牛马", hireTime: "2023-03-25", department: "部门03", lastOperationTime: "2023-03-25" },
                { empID: "00004", empName: "学员04", gender: "女", empImg: "100-0004", position: "牛马", hireTime: "2023-03-25", department: "部门04", lastOperationTime: "2023-03-25" },
                { empID: "00005", empName: "学员05", gender: "男", empImg: "100-0005", position: "牛马", hireTime: "2023-03-25", department: "部门05", lastOperationTime: "2023-03-25" },
                { empID: "00006", empName: "学员06", gender: "女", empImg: "100-0006", position: "牛马", hireTime: "2023-03-25", department: "部门06", lastOperationTime: "2023-03-25" },
                { empID: "00007", empName: "学员07", gender: "男", empImg: "100-0007", position: "牛马", hireTime: "2023-03-25", department: "部门07", lastOperationTime: "2023-03-25" },
                { empID: "00008", empName: "学员08", gender: "女", empImg: "100-0008", position: "牛马", hireTime: "2023-03-25", department: "部门08", lastOperationTime: "2023-03-25" },
                { empID: "00009", empName: "学员09", gender: "男", empImg: "100-0009", position: "牛马", hireTime: "2023-03-25", department: "部门09", lastOperationTime: "2023-03-25" },
                { empID: "00010", empName: "学员10", gender: "女", empImg: "100-0010", position: "牛马", hireTime: "2023-03-25", department: "部门10", lastOperationTime: "2023-03-25" },
                { empID: "00011", empName: "学员11", gender: "男", empImg: "100-0011", position: "牛马", hireTime: "2023-03-25", department: "部门11", lastOperationTime: "2023-03-25" },
                { empID: "00012", empName: "学员12", gender: "女", empImg: "100-0012", position: "牛马", hireTime: "2023-03-25", department: "部门12", lastOperationTime: "2023-03-25" },
                { empID: "00013", empName: "学员13", gender: "男", empImg: "100-0013", position: "牛马", hireTime: "2023-03-25", department: "部门13", lastOperationTime: "2023-03-25" },
                { empID: "00014", empName: "学员14", gender: "女", empImg: "100-0014", position: "牛马", hireTime: "2023-03-25", department: "部门14", lastOperationTime: "2023-03-25" },
                { empID: "00015", empName: "学员15", gender: "男", empImg: "100-0015", position: "牛马", hireTime: "2023-03-25", department: "部门15", lastOperationTime: "2023-03-25" },
                { empID: "00016", empName: "学员16", gender: "女", empImg: "100-0016", position: "牛马", hireTime: "2023-03-25", department: "部门16", lastOperationTime: "2023-03-25" },
                { empID: "00017", empName: "学员17", gender: "男", empImg: "100-0017", position: "牛马", hireTime: "2023-03-25", department: "部门17", lastOperationTime: "2023-03-25" },
                { empID: "00018", empName: "学员18", gender: "女", empImg: "100-0018", position: "牛马", hireTime: "2023-03-25", department: "部门18", lastOperationTime: "2023-03-25" },
                { empID: "00019", empName: "学员19", gender: "男", empImg: "100-0019", position: "牛马", hireTime: "2023-03-25", department: "部门19", lastOperationTime: "2023-03-25" },
                { empID: "00020", empName: "学员20", gender: "女", empImg: "100-0020", position: "牛马", hireTime: "2023-03-25", department: "部门20", lastOperationTime: "2023-03-25" },
            ],
        };
    },
    methods: {
        searchEmp() {
            // 待实现查询代码
            console.log(this.empSearchData);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.loadData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData();
        },
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
        handleSelectionChange(val) {
            this.multiDelTable = val;
        },
        loadData() {
            // 根据当前页数和每页显示条目数获取数据，这里是示例数据，您需要根据实际情况调整
            this.showData = this.empData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
            this.totalPage = this.empData.length;
        },
        indexMethod() {
            return (this.currentPage - 1) * this.pageSize + 1;
        },
        addEmpDataSubmit(addEmpForm) {
            this.$refs[addEmpForm].validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    alert("Success!");
                    //判断是否有重复数据
                    //新建一个对话框，提示是否添加成功
                }
            });
        },
        resetAddEmpForm(addEmpForm) {
            this.$refs[addEmpForm].resetFields();
            this.addempDialogVisible = false;
        },
        showEditEmpDialog(index) {
            // 将选中行的数据赋值给编辑表单
            let _index = index + (this.currentPage - 1) * this.pageSize;
            this.editEmpData = { ...this.empData[_index] };
            this.editEmpDialogVisible = true;
        },
        handleEditEmpClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    //清空表单数据
                    done();
                })
                .catch(() => {});
        },
        editEmpDataSubmit(editEmpForm) {
            this.$refs[editEmpForm].validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //判断是否有重复数据
                    //新建一个对话框，提示是否编辑成功
                }
            });
            // 关闭编辑对话框
            this.editEmpDialogVisible = false;
        },
        multDelEmpDataSubmit() {
            // 向数据库中删除数据
            // 关闭删除对话框
            console.log(this.multiDelTable);
            this.multDelEmpDialogVisible = false;
        },
        delEmpDataUpdate() {
            // 向数据库中删除数据
            // 关闭删除对话框
            this.delEmpDialogVisible = false;
        },
    },
    mounted() {
        this.empData = this.SQLData.slice(); // 模拟从数据库中获取数据
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
