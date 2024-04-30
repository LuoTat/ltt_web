import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    // 重定向
    {
        path: "/",
        redirect: "/Login",
    },
    // 登录界面
    {
        path: "/Login",
        name: "Login",
        component: () => import("../views/LoginView.vue"),
    },
    // 主界面
    {
        path: "/Main",
        name: "Main",
        component: () => import("../views/LayOutView.vue"),
        children: [
            {
                path: "/Home",
                name: "Home",
                component: () => import("../views/HomeView.vue"),
            },
            //班级学员管理
            {
                path: "/cls",
                name: "ClassManagement",
                component: () => import("../views/LTT/ClassStudentManagement/ClassManagementView.vue"),
            },
            {
                path: "/stu",
                name: "StudentManagement",
                component: () => import("../views/LTT/ClassStudentManagement/StudentManagementView.vue"),
            },
            //系统信息管理
            {
                path: "/dpt",
                name: "DepartmentManagement",
                component: () => import("../views/LTT/SystemInformationManagement/DepartmentManagementView.vue"),
            },
            {
                path: "/emp",
                name: "EmployeeManagement",
                component: () => import("../views/LTT/SystemInformationManagement/EmployeeManagementView.vue"),
            },
            //数据统计管理
            {
                path: "/empanal",
                name: "EmployeeInformationStatistics",
                component: () => import("../views/LTT/DataStatisticsManagement/EmployeeInformationStatisticsView.vue"),
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

export default router;
