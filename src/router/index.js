import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  //班级学员管理
  {
    path: "/ClassStudentManagement/ClassManagement",
    name: "ClassManagement",
    component: () => import("../views/LTT/ClassStudentManagement/ClassManagementView.vue"), //对应的vue组件
  },
  {
    path: "/ClassStudentManagement/StudentManagement",
    name: "StudentManagement",
    component: () => import("../views/LTT/ClassStudentManagement/StudentManagementView.vue"), //对应的vue组件
  },
  //系统信息管理
  {
    path: "/SystemInformationManagement/DepartmentManagement",
    name: "DepartmentManagement",
    component: () => import("../views/LTT/SystemInformationManagement/DepartmentManagementView.vue"), //对应的vue组件
  },
  {
    path: "/SystemInformationManagement/EmployeeManagement",
    name: "EmployeeManagement",
    component: () => import("../views/LTT/SystemInformationManagement/EmployeeManagementView.vue"), //对应的vue组件
  },
  //数据统计管理
  {
    path: "/DataStatisticsManagement/EmployeeInformationStatistics",
    name: "EmployeeInformationStatistics",
    component: () => import("../views/LTT/DataStatisticsManagement/EmployeeInformationStatisticsView.vue"), //对应的vue组件
  },
  //首页
  {
    path: "/",
    redirect: "/ClassStudentManagement/ClassManagement",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
