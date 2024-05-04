<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between">
        <div
            id="stuSexChart"
            style="width: 600px; height: 400px"></div>
        <div
            id="stuEducationLevelChart"
            style="width: 600px; height: 400px"></div>
    </div>
</template>

<script>
import axios from "axios";
import { serverURL } from "../../../config/server/serverURL.js";
import { genderOptions } from "../../../config/options/genderOptions.js";
import { educationLevelOptions } from "../../../config/options/educationLevelOptions.js";

import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
echarts.use([GridComponent, BarChart]);
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);

export default {
    data() {
        return {
            // 员工性别信息统计图表
            stuSexChart: null,
            // 员工性别统计数据
            stuSexData: [],

            // 员工职位信息统计图表
            stuEducationLevelChart: null,
            // 员工职位统计数据
            stuEducationLevelData: [],
        };
    },
    methods: {
        drawStuSexChart() {
            this.stuSexChart = echarts.init(document.getElementById("stuSexChart"));
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
                        data: this.stuSexData,
                    },
                ],
            };
            this.stuSexChart.setOption(option);
        },
        drawStuEducationLevelChart() {
            this.stuEducationLevelChart = echarts.init(document.getElementById("stuEducationLevelChart"));
            let option = {
                xAxis: {
                    type: "category",
                    data: educationLevelOptions.map((item) => item.label),
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        data: this.stuEducationLevelData,
                        type: "bar",
                    },
                ],
            };
            this.stuEducationLevelChart.setOption(option);
        },
    },
    mounted() {
        // 获取学员性别统计数据
        axios.get(`${serverURL}/stus/getGenderCount`).then((response) => {
            if (response.data.code === 1) {
                this.stuSexData = genderOptions.map((option) => {
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
            // 绘制学员性别信息统计图表
            this.drawStuSexChart();
        });
        // 获取学员学历统计数据
        axios.get(`${serverURL}/stus/getEducationLevelCount`).then((response) => {
            if (response.data.code === 1) {
                this.stuEducationLevelData = educationLevelOptions.map((option) => {
                    let item = response.data.data.find((item) => item.educationLevel === option.value);
                    return item ? item.count : 0;
                });
            }
            // 绘制员工职位信息统计图表
            this.drawStuEducationLevelChart();
        });
    },
};
</script>
