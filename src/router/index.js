import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/LayOutView.vue"),
        children: [
            {
                path: "/",
                name: "home",
                component: () => import("../views/HomeView.vue"),
            },
            //班级学员管理
            {
                path: "/ClassStudentManagement/ClassManagement",
                name: "ClassManagement",
                component: () => import("../views/LTT/ClassStudentManagement/ClassManagementView.vue"),
            },
            {
                path: "/ClassStudentManagement/StudentManagement",
                name: "StudentManagement",
                component: () => import("../views/LTT/ClassStudentManagement/StudentManagementView.vue"),
            },
            //系统信息管理
            {
                path: "/SystemInformationManagement/DepartmentManagement",
                name: "DepartmentManagement",
                component: () => import("../views/LTT/SystemInformationManagement/DepartmentManagementView.vue"),
            },
            {
                path: "/SystemInformationManagement/EmployeeManagement",
                name: "EmployeeManagement",
                component: () => import("../views/LTT/SystemInformationManagement/EmployeeManagementView.vue"),
            },
            //数据统计管理
            {
                path: "/DataStatisticsManagement/EmployeeInformationStatistics",
                name: "EmployeeInformationStatistics",
                component: () => import("../views/LTT/DataStatisticsManagement/EmployeeInformationStatisticsView.vue"),
            },
        ],
    },
];

const router = new VueRouter({
    routes,
});

export default router;
