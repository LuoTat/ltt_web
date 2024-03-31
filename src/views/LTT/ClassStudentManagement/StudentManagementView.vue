<template>
    <!-- 右侧主界面 -->
    <el-main>
        学员管理
        <!-- 查询栏 -->
        <el-form :model="studentSearchData">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="学员姓名">
                        <el-input v-model="studentSearchData.studentName" placeholder="请输入班级名称" style="width: 140px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="学号">
                        <el-input v-model="studentSearchData.studentID" placeholder="请输入学号" style="width: 140px"> </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="最高学历">
                        <el-select v-model="studentSearchData.highestEducationLevel" placeholder="请选择" style="width: 140px">
                            <el-option label="大学" value="大学"></el-option>
                            <el-option label="小学" value="小学"></el-option>
                            <el-option label="文盲" value="文盲"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="所属班级">
                        <el-select v-model="studentSearchData.className" placeholder="请选择" style="width: 140px">
                            <el-option label="班级1" value="班级1"></el-option>
                            <el-option label="班级3" value="班级3"></el-option>
                            <el-option label="班级2" value="班级2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3" align="right">
                    <el-form-item>
                        <el-button type="primary" @click="searchStudent()">查 询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增学员按钮 -->
        <el-button type="primary" @click="addStudentDialogVisible = true">+ 新增学员</el-button>
        <el-button type="primary" @click="multDelStudentDialogVisible = true">- 批量删除</el-button>

        <!-- 表格 -->
        <el-table ref="multiDelTable" :data="showData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" min-width="50px" align="left" fixed="left"> </el-table-column>
            <el-table-column prop="studentName" label="姓名" min-width="100px"> </el-table-column>
            <el-table-column prop="studentID" label="学号" min-width="100px"> </el-table-column>
            <el-table-column prop="className" label="班级" min-width="100px"> </el-table-column>
            <el-table-column prop="gender" label="性别" min-width="100px"> </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" min-width="100px"> </el-table-column>
            <el-table-column prop="highestEducationLevel" label="最高学历" min-width="100px"> </el-table-column>
            <el-table-column prop="numberOfInfractions" label="违纪次数" min-width="100px"> </el-table-column>
            <el-table-column prop="pointsForDisciplinary" label="违纪扣分" min-width="100px"> </el-table-column>
            <el-table-column prop="lastOperationTime" label="最后操作时间" min-width="120px"> </el-table-column>
            <el-table-column label="操作" min-width="240px" align="right" fixed="right">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-button type="primary" @click="showEditStudentDialog(scope.$index)" size="mini">编 辑</el-button>
                    <!-- 违纪按钮 -->
                    <el-button type="primary" @click="showEditStudentDialog()" size="mini">违 纪</el-button>
                    <!-- 删除按钮 -->
                    <el-button type="danger" @click="delStudentDialogVisible = true" size="mini">删 除</el-button>
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

        <!-- 新增学员按钮的内容 -->
        <el-dialog title="新增学员" :visible.sync="addStudentDialogVisible" :before-close="handleClose">
            <el-form :model="addStudentData" :rules="studentRules" ref="addStudentForm">
                <el-form-item label="姓名" prop="studentName" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addStudentData.studentName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="学号" prop="studentID" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addStudentData.studentID" placeholder="请输入学号"> </el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addStudentData.gender" placeholder="请选择">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumber" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addStudentData.phoneNumber" placeholder="请输入手机号"> </el-input>
                </el-form-item>
                <el-form-item label="最高学历" prop="highestEducationLevel" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addStudentData.highestEducationLevel" placeholder="请选择">
                        <el-option label="大学" value="大学"></el-option>
                        <el-option label="高中" value="高中"></el-option>
                        <el-option label="文盲" value="文盲"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属班级" prop="className" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addStudentData.className" placeholder="请选择">
                        <el-option label="班级1" value="班级1"></el-option>
                        <el-option label="班级2" value="班级2"></el-option>
                        <el-option label="班级3" value="班级3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetAddStudentForm('addStudentForm')">取 消</el-button>
                <el-button type="primary" @click="addStudentDataSubmit('addStudentForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 批量删除按钮的内容 -->
        <el-dialog title="批量删除学员" :visible.sync="multDelStudentDialogVisible" width="30%" :before-close="handleClose">
            <span>您确定要删除所选班级吗？</span>
            <span slot="footer">
                <el-button @click="multDelStudentDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="multDelStudentDataSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑学员按钮的内容 -->
        <el-dialog title="编辑学员" :visible.sync="editStudentDialogVisible" :before-close="handleClose">
            <el-form :model="editStudentData" :rules="studentRules" ref="editStudentForm">
                <el-form-item label="姓名" prop="studentName" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editStudentData.studentName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="学号" prop="studentID" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editStudentData.studentID" placeholder="请输入学号"> </el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" label-position="left" :label-width="formLabelWidth" placeholder="请选择">
                    <el-select v-model="editStudentData.gender">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumber" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editStudentData.phoneNumber" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="最高学历" prop="highestEducationLevel" label-position="left" :label-width="formLabelWidth" placeholder="请选择">
                    <el-select v-model="editStudentData.highestEducationLevel">
                        <el-option label="大学" value="大学"></el-option>
                        <el-option label="小学" value="小学"></el-option>
                        <el-option label="文盲" value="文盲"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属班级" prop="className" label-position="left" :label-width="formLabelWidth" placeholder="请选择">
                    <el-select v-model="editStudentData.className">
                        <el-option label="教室01" value="教室01"></el-option>
                        <el-option label="教室02" value="教室02"></el-option>
                        <el-option label="教室03" value="教室03"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="editStudentDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editStudentDataSubmit('editStudentForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 删除班级按钮的内容 -->
        <el-dialog title="删除班级" :visible.sync="delStudentDialogVisible" width="30%" :before-close="handleClose">
            <span>您确定要删除该班级吗？</span>
            <span slot="footer">
                <el-button @click="delStudentDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delStudentDataSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
//import axios from "axios";

export default {
    data() {
        return {
            addStudentDialogVisible: false,
            multDelStudentDialogVisible: false,
            editStudentDialogVisible: false,
            delStudentDialogVisible: false,
            formLabelWidth: "100px",
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            totalPage: 0, // 总条目数
            studentSearchData: {
                studentName: "",
                studentID: "",
                className: "",
                gender: "",
                phoneNumber: "",
                highestEducationLevel: "",
                numberOfInfractions: -1,
                pointsForDisciplinary: -1,
                lastOperationTime: "",
            },
            studentRules: {
                studentName: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
                ],
                studentID: [
                    { required: true, message: "请输入学号", trigger: "blur" },
                    { min: 10, max: 10, message: "长度为 10 个字符", trigger: "blur" },
                ],
                gender: [{ required: true, message: "请选择", trigger: "change" }],
                phoneNumber: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    { min: 11, max: 11, message: "手机号码格式错误", trigger: "blur" },
                ],
                className: [{ required: true, message: "请选择", trigger: "change" }],
            },
            //用来绑定表单数据
            addStudentData: {
                studentName: "",
                studentID: "",
                className: "",
                gender: "",
                phoneNumber: "",
                highestEducationLevel: "",
            },
            editStudentData: {
                studentName: "",
                studentID: "",
                className: "",
                gender: "",
                phoneNumber: "",
                highestEducationLevel: "",
            },
            multiDelTable: [],
            delStudentForm: {
                index: -1,
            },
            showData: [],
            studentData: [],
            SQLData: [
                { studentName: "学员01", studentID: "00001", className: "教室01", gender: "男", phoneNumber: "100-0001", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员02", studentID: "00002", className: "教室02", gender: "女", phoneNumber: "100-0002", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员03", studentID: "00003", className: "教室03", gender: "男", phoneNumber: "100-0003", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员04", studentID: "00004", className: "教室04", gender: "女", phoneNumber: "100-0004", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员05", studentID: "00005", className: "教室05", gender: "男", phoneNumber: "100-0005", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员06", studentID: "00006", className: "教室06", gender: "女", phoneNumber: "100-0006", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员07", studentID: "00007", className: "教室07", gender: "男", phoneNumber: "100-0007", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员08", studentID: "00008", className: "教室08", gender: "女", phoneNumber: "100-0008", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员09", studentID: "00009", className: "教室09", gender: "男", phoneNumber: "100-0009", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员10", studentID: "00010", className: "教室10", gender: "女", phoneNumber: "100-0010", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员11", studentID: "00011", className: "教室11", gender: "男", phoneNumber: "100-0011", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员12", studentID: "00012", className: "教室12", gender: "女", phoneNumber: "100-0012", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员13", studentID: "00013", className: "教室13", gender: "男", phoneNumber: "100-0013", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员14", studentID: "00014", className: "教室14", gender: "女", phoneNumber: "100-0014", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员15", studentID: "00015", className: "教室15", gender: "男", phoneNumber: "100-0015", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员16", studentID: "00016", className: "教室16", gender: "女", phoneNumber: "100-0016", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员17", studentID: "00017", className: "教室17", gender: "男", phoneNumber: "100-0017", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员18", studentID: "00018", className: "教室18", gender: "女", phoneNumber: "100-0018", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员19", studentID: "00019", className: "教室19", gender: "男", phoneNumber: "100-0019", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员20", studentID: "00020", className: "教室20", gender: "女", phoneNumber: "100-0020", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
            ],
        };
    },
    methods: {
        searchStudent() {
            // 待实现查询代码
            console.log(this.studentSearchData);
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
            this.showData = this.studentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
            this.totalPage = this.studentData.length;
        },
        indexMethod() {
            return (this.currentPage - 1) * this.pageSize + 1;
        },
        addStudentDataSubmit(addStudentForm) {
            this.$refs[addStudentForm].validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    alert("Success!");
                    //判断是否有重复数据
                    //新建一个对话框，提示是否添加成功
                }
            });
        },
        resetAddStudentForm(addStudentForm) {
            this.$refs[addStudentForm].resetFields();
            this.addStudentDialogVisible = false;
        },
        showEditStudentDialog(index) {
            // 将选中行的数据赋值给编辑表单
            let _index = index + (this.currentPage - 1) * this.pageSize;
            this.editStudentData = { ...this.studentData[_index] };
            this.editStudentDialogVisible = true;
        },
        handleEditStudentClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    //清空表单数据
                    done();
                })
                .catch(() => {});
        },
        editStudentDataSubmit(editStudentForm) {
            this.$refs[editStudentForm].validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    //判断是否有重复数据
                    //新建一个对话框，提示是否编辑成功
                }
            });
            // 关闭编辑对话框
            this.editStudentDialogVisible = false;
        },
        multDelStudentDataSubmit() {
            // 向数据库中删除数据
            // 关闭删除对话框
            console.log(this.multiDelTable);
            this.multDelStudentDialogVisible = false;
        },
        delStudentDataUpdate() {
            // 向数据库中删除数据
            // 关闭删除对话框
            this.delStudentDialogVisible = false;
        },
    },
    mounted() {
        this.studentData = this.SQLData.slice(); // 模拟从数据库中获取数据
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
