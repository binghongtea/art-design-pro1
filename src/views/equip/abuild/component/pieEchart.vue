<template>
    <div ref="mainLinS" id="mainPie"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';
const mainLinS = ref();
let myChart: echarts.ECharts | null = null;

// type EChartsOption = echarts.EChartsOption;
const propData: any = defineProps(['skipData'])
const getOption = (showData: any) => {
    const option: any = {
        tooltip: {
            trigger: 'item',
            formatter: "{b}({d}%)",
        },
        legend: {
            show: false
        },
        grid: {
            right: '10%',
            bottom: '10%'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['55%', '75%'], // 图表向左移动，留出空间给图例
                center: ['50%', '50%'],
                // avoidLabelOverlap: false,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,

                    formatter: function (params: any) {
                        return params.name + '\n' + '(' + params.percent + '%)';
                    },
                },
                labelLine: {
                    show: true
                },
                data: showData.data

            }
        ],
        graphic: [
            {
                type: 'text',
                top: '40%',  // 垂直偏上
                left: '42%',
                style: {
                    text: showData.total,
                    fontSize: 24,
                    fontWeight: 'bold',
                    fill: '#333',
                    // align: 'center',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                },
                anchor: 'center'
            },
            {
                type: 'text',
                top: '44%',  // 垂直偏上
                left: '52%',
                style: {
                    text: '个',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fill: '#333',
                    // align: 'center',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                },
                anchor: 'center'
            },
            {
                type: 'text',
                left: "center", // 水平居中
                top: '57%',  // 垂直偏下
                style: {
                    text: '点位总数',
                    fontSize: 14,
                    fill: '#999',
                    align: 'center',
                    verticalAlign: 'middle'
                },
                anchor: 'center'
            }
        ]
    };
    if (mainLinS.value) {
        myChart = echarts.init(mainLinS.value);
        myChart.setOption(option);
        resizeHandler.observe(mainLinS.value);
    }
}



const resizeHandler = new ResizeObserver(() => {
    if (myChart) {
        myChart.resize();
    }
});

onMounted(() => {
    getOption(propData.skipData)
    // 备选方案：监听窗口大小变化
    window.addEventListener('resize', () => {
        if (myChart) {
            myChart.resize();
        }
    });
});

onBeforeUnmount(() => {
    if (mainLinS.value) {
        resizeHandler.unobserve(mainLinS.value);
    }
    // 移除窗口大小变化监听器
    window.removeEventListener('resize', () => {
        if (myChart) {
            myChart.resize();
        }
    });
});

watch(() => propData.skipData, () => {
    getOption(propData.skipData)

}, { deep: true })
</script>

<style lang="scss" scoped>
#mainPie {
    width: 260px;
    height: 200px;
}
</style>