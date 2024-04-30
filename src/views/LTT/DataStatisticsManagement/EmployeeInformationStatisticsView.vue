<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between">
        <div
            id="empSexChart"
            style="width: 600px; height: 400px"></div>
        <div
            id="empJobChart"
            style="width: 600px; height: 400px"></div>
    </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
import { serverURL } from "../../../config/server/serverURL.js";
import { genderOptions } from "../../../config/options/genderOptions.js";
import { jobOptions } from "../../../config/options/jobOptions.js";

export default {
    data() {
        return {
            // 员工性别信息统计图表
            empSexChart: null,
            // 员工性别统计数据
            empSexData: [],

            // 员工职位信息统计图表
            empJobChart: null,
            // 员工职位统计数据
            empJobData: [],
        };
    },
    methods: {
        drawEmpSexChart() {
            this.empSexChart = echarts.init(document.getElementById("empSexChart"));
            let option = {
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    top: "5%",
                    left: "center",
                },
                series: [
                    {
                        name: "性别统计",
                        type: "pie",
                        radius: ["40%", "70%"],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: "bold",
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: this.empSexData,
                    },
                ],
            };
            this.empSexChart.setOption(option);
        },
        drawEmpJobChart() {
            this.empJobChart = echarts.init(document.getElementById("empJobChart"));
            let option = {
                xAxis: {
                    type: "category",
                    data: jobOptions.map((item) => item.label),
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        data: this.empJobData,
                        type: "bar",
                    },
                ],
            };
            this.empJobChart.setOption(option);
        },
    },
    mounted() {
        // 获取员工性别统计数据
        axios.get(`${serverURL}/emps/getGenderCount`).then((response) => {
            if (response.data.code === 1) {
                this.empSexData = genderOptions.map((option) => {
                    let item = response.data.data.find((item) => item.gender === option.value);
                    return item
                        ? {
                              name: option.label,
                              value: item.count,
                          }
                        : {
                              name: option.label,
                              value: 0,
                          };
                });
            }
            // 绘制员工性别信息统计图表
            this.drawEmpSexChart();
        });
        // 获取员工职位统计数据
        axios.get(`${serverURL}/emps/getJobCount`).then((response) => {
            if (response.data.code === 1) {
                this.empJobData = jobOptions.map((option) => {
                    let item = response.data.data.find((item) => item.job === option.value);
                    return item ? item.count : 0;
                });
            }
            // 绘制员工职位信息统计图表
            this.drawEmpJobChart();
        });
    },
};
</script>
