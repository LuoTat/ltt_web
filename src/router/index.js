import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import { serverURL } from "../config/server/serverURL.js";

Vue.use(VueRouter);

const routes = [
    // 重定向
    {
        path: "/",
        redirect: "/login",
    },
    // 登录界面
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/LoginView.vue"),
    },
    // 主界面
    {
        path: "/main",
        name: "Main",
        component: () => import("../views/LayOutView.vue"),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: "/home",
                name: "Home",
                component: () => import("../views/HomeView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            // 课程安排管理
            {
                path: "/crs",
                name: "CourseManagement",
                component: () => import("../views/LTT/CourseScheduleManagement/CourseManagementView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: "/sch",
                name: "ScheduleManagement",
                component: () => import("../views/LTT/CourseScheduleManagement/ScheduleManagementView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            // 班级学员管理
            {
                path: "/cls",
                name: "ClassManagement",
                component: () => import("../views/LTT/ClassStudentManagement/ClassManagementView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: "/stu",
                name: "StudentManagement",
                component: () => import("../views/LTT/ClassStudentManagement/StudentManagementView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            // 系统信息管理
            {
                path: "/dpt",
                name: "DepartmentManagement",
                component: () => import("../views/LTT/SystemInformationManagement/DepartmentManagementView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: "/emp",
                name: "EmployeeManagement",
                component: () => import("../views/LTT/SystemInformationManagement/EmployeeManagementView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            // 数据统计管理
            {
                path: "/empanal",
                name: "EmployeeInformationStatistics",
                component: () => import("../views/LTT/DataStatisticsManagement/EmployeeInformationStatisticsView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: "/stuanal",
                name: "StudentInformationStatistics",
                component: () => import("../views/LTT/DataStatisticsManagement/StudentInformationStatisticsView.vue"),
                meta: {
                    requiresAuth: true,
                },
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

router.beforeEach((to, from, next) => {
    // 检查路由元信息是否需要认证
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // 发送请求到后端验证JWTtoken
        axios
            .post(`${serverURL}/verifyToken`)
            .then((response) => {
                if (response.data.code == 1) {
                    // 如果 JWT token 有效，进行路由跳转
                    next();
                } else {
                    // 如果 JWT token 无效，重定向到登录页面
                    next({
                        name: "Login",
                    });
                }
            })
            .catch((error) => {
                // 如果请求失败，重定向到登录页面
                console.error(error);
                next({
                    name: "Login",
                });
            });
    } else {
        next(); // 确保一定要调用 next()
    }
});

export default router;
