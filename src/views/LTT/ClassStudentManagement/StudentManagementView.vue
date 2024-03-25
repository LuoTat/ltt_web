<template>
    <!-- 右侧主界面 -->
    <el-main>
        学员管理
        <!-- 查询栏 -->
        <el-form :inline="true" :model="studentSearchForm" class="demo-form-inline">
            <el-form-item label="学员姓名">
                <el-input v-model="studentSearchForm.studentName" placeholder="请输入班级名称"></el-input>
            </el-form-item>
            <el-form-item label="学号">
                <el-date-picker v-model="studentSearchForm.studentID" placeholder="请输入学号"> </el-date-picker>
            </el-form-item>
            <el-form-item label="最高学历">
                <el-select v-model="studentSearchForm.highestEducationLevel" placeholder="请选择">
                    <el-option label="大学" value="大学"></el-option>
                    <el-option label="小学" value="小学"></el-option>
                    <el-option label="文盲" value="文盲"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属班级">
                <el-select v-model="studentSearchForm.highestEducationLevel" placeholder="请选择">
                    <el-option label="班1" value="班1"></el-option>
                    <el-option label="班2" value="班2"></el-option>
                    <el-option label="班3" value="班3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchClass">查询</el-button>
            </el-form-item>
        </el-form>

        <!-- 新增班级按钮 -->
        <el-button type="primary" @click="addClassDialogVisible = true">+新增学员</el-button>
        <el-button type="primary" @click="addClassDialogVisible = true">-批量删除</el-button>

        <!-- 表格 -->
        <el-table ref="multipleTable" :data="showData">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="studentName" label="姓名" width="100"> </el-table-column>
            <el-table-column prop="studentID" label="学号" width="100"> </el-table-column>
            <el-table-column prop="className" label="班级" width="180"> </el-table-column>
            <el-table-column prop="gender" label="性别" width="180"> </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号" width="180"> </el-table-column>
            <el-table-column prop="highestEducationLevel" label="最高学历" width="100"> </el-table-column>
            <el-table-column prop="numberOfInfractions" label="违纪次数" width="100"> </el-table-column>
            <el-table-column prop="pointsForDisciplinary" label="违纪扣分" width="100"> </el-table-column>
            <el-table-column prop="lastOperationTime" label="最后操作时间" width="140"> </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-button type="primary" @click="showEditClassDialog(scope.row.index)" size="mini">编辑</el-button>
                    <!-- 违纪按钮 -->
                    <el-button type="primary" @click="showEditClassDialog(scope.row.index)" size="mini">违纪</el-button>

                    <!-- 删除按钮 -->
                    <el-button type="danger" @click="delClassDialogVisible = true" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 表格导航栏 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total" background layout="sizes,prev,pager,next,jumper,total"> </el-pagination>

        <!-- 下面是当前页面所有的对话框 -->

        <!-- 新增学员按钮的内容 -->
        <el-dialog title="新增班级" :visible.sync="addClassDialogVisible">
            <el-form :model="addClassForm" :rules="rules" ref="ruleForm">
                <el-form-item label="班级名称" prop="className" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addClassForm.className" placeholder="请输入班级名称"></el-input>
                </el-form-item>
                <el-form-item label="班级教室" prop="classRoom" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="addClassForm.classRoom" placeholder="请填写班级教室"> </el-input>
                </el-form-item>
                <el-form-item label="开课时间" prop="openTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="addClassForm.openTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择开课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="结课时间" prop="closeTime" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="addClassForm.closeTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="班主任" prop="classTeacher" label-position="left" :label-width="formLabelWidth">
                    <el-select v-model="addClassForm.classTeacher" placeholder="请选择">
                        <el-option label="班主任1" value="班主任1"></el-option>
                        <el-option label="班主任2" value="班主任2"></el-option>
                        <el-option label="班主任3" value="班主任3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addClassDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addClassDataUpdate()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑班级按钮的内容 -->
        <el-dialog title="编辑班级" :visible.sync="editClassDialogVisible">
            <el-form :model="editClassForm">
                <el-form-item label="班级名称" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editClassForm.className" placeholder="请输入班级名称"></el-input>
                </el-form-item>
                <el-form-item label="班级教室" label-position="left" :label-width="formLabelWidth">
                    <el-input v-model="editClassForm.classRoom" placeholder="请填写班级教室"> </el-input>
                </el-form-item>
                <el-form-item label="开课时间" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="editClassForm.openTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择开课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="结课时间" label-position="left" :label-width="formLabelWidth">
                    <el-date-picker v-model="editClassForm.closeTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结课时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="班主任" label-position="left" :label-width="formLabelWidth" placeholder="请选择">
                    <el-select v-model="editClassForm.classTeacher">
                        <el-option label="班主任1" value="班主任1"></el-option>
                        <el-option label="班主任2" value="班主任2"></el-option>
                        <el-option label="班主任3" value="班主任3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editClassDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editClassDataUpdate()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 删除班级按钮的内容 -->
        <el-dialog title="删除班级" :visible.sync="delClassDialogVisible" width="30%" :before-close="handleClose">
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
            studentSearchForm: {
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
            rules: {
                className: [
                    { required: true, message: "请输入班级名称", trigger: "blur" },
                    { min: 4, max: 30, message: "长度在 4 到 30 个字符", trigger: "blur" },
                ],
                classRoom: [
                    { required: false, message: "请填写班级教室", trigger: "blur" },
                    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
                ],
                openTime: [{ type: "date", required: true, message: "请选择开课时间", trigger: "change" }],
                closeTime: [{ type: "date", required: true, message: "请选择结课时间", trigger: "change" }],
                classTeacher: [{ required: true, message: "请选择", trigger: "change" }],
            },
            //用来绑定表单数据
            addClassForm: {
                className: "", //班级名称
                classRoom: "",
                openTime: "",
                closeTime: "",
                classTeacher: "",
            },
            editClassForm: {
                className: "",
                classRoom: "",
                openTime: "",
                closeTime: "",
                classTeacher: "",
            },
            delClassForm: {
                index: -1,
            },
            showData: [],
            classData: [],
            SQLData: [
                { studentName: "学员1", studentID: "00001", className: "教室1", gender: "男", phoneNumber: "100-0001", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员2", studentID: "00002", className: "教室2", gender: "女", phoneNumber: "100-0002", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员3", studentID: "00003", className: "教室3", gender: "男", phoneNumber: "100-0003", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员4", studentID: "00004", className: "教室4", gender: "女", phoneNumber: "100-0004", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员5", studentID: "00005", className: "教室5", gender: "男", phoneNumber: "100-0005", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员6", studentID: "00006", className: "教室6", gender: "女", phoneNumber: "100-0006", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员7", studentID: "00007", className: "教室7", gender: "男", phoneNumber: "100-0007", highestEducationLevel: "大学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员8", studentID: "00008", className: "教室8", gender: "女", phoneNumber: "100-0008", highestEducationLevel: "小学", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
                { studentName: "学员9", studentID: "00009", className: "教室9", gender: "男", phoneNumber: "100-0009", highestEducationLevel: "文盲", numberOfInfractions: 0, pointsForDisciplinary: 0, lastOperationTime: "2023-03-25" },
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
            ],
        };
    },
    methods: {
        searchClass() {
            // 待实现查询代码
            console.log(this.studentSearchForm);
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
        showEditClassDialog(index) {
            // 将选中行的数据赋值给编辑表单
            this.editClassForm = { ...this.classData[index - 1] };
            this.editClassDialogVisible = true;
        },
        addClassDataUpdate() {
            this.addClassForm.index = this.SQLData.length + 1;
            this.SQLData.push({ ...this.addClassForm }); //模拟更新数据库
            this.classData.push({ ...this.addClassForm }); //更新表格数据
            this.loadData(); // 刷新表格
            // 关闭编辑对话框
            this.addClassDialogVisible = false;
        },
        editClassDataUpdate() {
            //使用班级名称作为唯一标识，找到对应的数据
            let index = -1;
            this.SQLData[index - 1] = { ...this.editClassForm }; //模拟更新数据库
            this.classData[index - 1] = { ...this.editClassForm }; //更新表格数据
            this.loadData(); // 刷新表格
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
