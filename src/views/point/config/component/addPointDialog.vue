<template>
    <el-dialog title="新增设备" v-model="showDialog" width="600px">
        <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
            <el-form-item label="设备名称" prop="pointName">
                <el-input v-model="formData.pointName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="formData.deviceType" placeholder="请选择">
                    <el-option v-for="item in equipType" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备" prop="deviceCode">
                <el-input v-model="formData.deviceCode" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="handleOk">确定</el-button>
        </template>

    </el-dialog>
</template>

<script setup lang="ts">
import { AddPoint } from '@/api/equip';
import { equipType } from '../info';
import { ref } from 'vue';
import { inject, defineProps, onMounted } from 'vue';

const props = withDefaults(
    defineProps<{
        dialogKey: string,
        skipData?: any,
        type?: string,
        refreshList: any
    }>(),
    {
        dialogKey: '',
        skipData: () => ({}),
        type: '',
        refreshList: () => { }
    }

);


// defineProps({
//     dialogKey: String,
//     skipData: Object,
//     type: String,
//     refreshList: Function
// });

const formRef: any = ref(null);

const showDialog: any = inject(`${props.dialogKey}`)

const formData: any = ref({
});

const rules = ref({
    pointName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
    deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
})


const closeDialog = () => {
    showDialog.value = false
}
// 按钮

const handleOk = () => {
    formRef.value.validate((valid: boolean) => {
        if (valid) {
            AddPoint(formData.value).then((res: any) => {
                props.refreshList()
                closeDialog()
                ElMessage.success('新增成功')
            })
        }
    })
};


onMounted(() => {
    formData.value = {
        spaceId: props.skipData.id,
        x: props.skipData.x,
        y: props.skipData.y,
        pointName: '',
        deviceCode: '',
        deviceType: '',
    }
    console.log(props.skipData,'00000')
});


</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    text-align: center;
}
</style>
