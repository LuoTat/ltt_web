<template>
  <div>
    <el-container style="height: 700px; border: 1px solid #eee">
      <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)">TLIAS 智能学习辅助系统</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-openeds="['1', '3']">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>信息管理系统</template>
              <el-menu-item index="1-1">部门管理</el-menu-item>
              <el-menu-item index="1-2">员工管理</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="searchForm.gender" placeholder="性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职日期">
              <el-date-picker v-model="searchForm.entrydate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData">
            <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
            <el-table-column prop="image" label="图像" width="180">
              <template slot-scope="scope">
                <img :src="scope.row.image" width="100px" height="70px" />
              </template>
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="140">
              <template slot-scope="scope">
                {{ scope.row.gender == 1 ? "男" : "女" }}
              </template>
            </el-table-column>
            <el-table-column prop="job" label="职位" width="140"> </el-table-column>
            <el-table-column prop="entrydate" label="入职日期" width="180"> </el-table-column>
            <el-table-column prop="updatetime" label="最后操作时间" width="230"> </el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini">编辑</el-button>
              <el-button type="danger" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="sizes,prev,pager,next,jumper,total" :total="1000"> </el-pagination>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      searchForm: {
        name: "",
        gender: "",
        entrydate: [],
      },
    };
  },
  methods: {
    onSubmit: function () {
      console.log(this.searchForm);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
  mounted() {
    axios
      .get("https://mock.apifox.cn/m1/3128855-0-default/emp/list")
      .then((response) => {
        this.tableData = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style></style>
