<template>
    <el-dialog v-model="showDialog" ref="tableDialog" :title="propData.skipData.name" style="width: 648px;">
        <div class="pieBox">
            <PieEchart :skipData="pieDetail"></PieEchart>
            <div class="statusBox">
                <div class="row">
                    <div class="round" style="background-color: #3BBD6F;"></div>
                    <span>正常：</span>
                    <span style="color: #3BBD6F;">20个 75%</span>
                </div>
                <div class="row">
                    <div class="round" style="background-color: #FF2E2E;"></div>
                    <span>异常：</span>
                    <span style="color: #FF2E2E;">2个 10%</span>
                </div>
                <div class="row">
                    <div class="round" style="background-color: #FF6E2E;"></div>
                    <span>维修中：</span>
                    <span style="color: #FF6E2E;">3个 15%</span>
                </div>
            </div>
        </div>
        <el-table :data="tableData" :header-cell-style="{ backgroundColor: '#F2F2F2', borderColor: '#E6E6E6' }" border>
            <el-table-column label="点位名称" prop="one" align="center"></el-table-column>
            <el-table-column label="所在楼层" prop="two" align="center"></el-table-column>
            <el-table-column label="当前状态" prop="sortOrder" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.sortOrder == 1" type="success">正常</el-tag>
                    <el-tag v-if="scope.row.sortOrder == 2" type="danger">异常</el-tag>
                    <el-tag v-if="scope.row.sortOrder == 3" type="warning">维修中</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="最近巡检时间" prop="jobNo" align="center"></el-table-column>
            <el-table-column label="巡检人" prop="campusName" align="center"></el-table-column>
        </el-table>

        <div class="groupBtn">
            <el-button type="primary" @click="closeDialog()">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import PieEchart from './pieEchart.vue';
import { h, inject, reactive, ref } from 'vue'
// 
const tableDialog = ref()
//此参数必须写
const propData = defineProps(['dialogKey', 'skipData'])
const showDialog: any = inject(`${propData.dialogKey}`)
// 饼图
const pieDetail = ref({
    data: [{ value: 20, name: 'PC端：2200个', itemStyle: { color: '#3cbc6e' } },
    { value: 2, name: '移动端：1052个', itemStyle: { color: '#ff2524' } },
    { value: 3, name: '双端：8个', itemStyle: { color: '#fc6f2d' } }],
    total: '25'
})
// 表值
const tableData = ref([
    {
        jobNo: '2025-01-01',
        campusName: '张三',
        campusAddress: '巡检一组', // 改为总层数
        sortOrder: '1', // 起始楼层
        one: '2号教学楼', // 排序
        two: '1F', // 坐标
        three: '备注信息', // 坐标
    },
    {
        jobNo: '2025-01-01',
        campusName: '张三',
        campusAddress: '巡检一组', // 改为总层数
        sortOrder: '2', // 起始楼层
        one: '2号教学楼', // 排序
        two: '1F', // 坐标
        three: '备注信息', // 坐标
    },
    {
        jobNo: '2025-01-01',
        campusName: '张三',
        campusAddress: '巡检一组', // 改为总层数
        sortOrder: '3', // 起始楼层
        one: '2号教学楼', // 排序
        two: '1F', // 坐标
        three: '备注信息', // 坐标
    },
    {
        jobNo: '2025-01-01',
        campusName: '张三',
        campusAddress: '巡检一组', // 改为总层数
        sortOrder: '3', // 起始楼层
        one: '2号教学楼', // 排序
        two: '1F', // 坐标
        three: '备注信息', // 坐标
    }
])
// 关闭
const closeDialog = () => {
    showDialog.value = false
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
    display: flex !important;
    flex-direction: column;

}

.pieBox {
    display: flex;
    align-items: center;

    .statusBox {
        background-color: #f7f7f7;
        color: #333;
        padding: 25px 20px;
        box-sizing: border-box;
        border-radius: 10px;
        flex: 1;
        height: 152px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .row {
            font-size: 14px;
            display: flex;
            align-items: center;
        }

        .round {
            width: 14px;
            height: 14px;
            margin: 0 15px 0 10px;
        }
    }
}

.el-tag {
    width: 50px;
}

.groupBtn {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>