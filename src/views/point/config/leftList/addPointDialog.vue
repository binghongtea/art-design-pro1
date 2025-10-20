<template>
    <el-dialog :title="props.type === 'rootAdd' ? '新增根节点' : (props.type === 'add' ? '新增节点' : (props.type === 'edit' ? '编辑节点' : ''))" v-model="showDialog" width="600px">
        <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
            <el-form-item label="节点名称" prop="label">
                <el-input v-model="formData.label" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="props.type === 'edit'" label="图片" prop="imgUrl">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :auto-upload="false"
                    :on-change="handleAvatarChange" accept=".png, .jpg, .jpeg">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 180px; height: 180px;" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="handleOk">确定</el-button>
        </template>

    </el-dialog>
</template>

<script setup lang="ts">
import { AddTreePoint,UpdateTreePoint } from '@/api/equip';
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { uploadFileService } from '@/api/system/util/index';
import { inject, defineProps, onMounted } from 'vue';

const props = withDefaults(
    defineProps<{
        dialogKey: string,
        skipData: any,
        type: string,
        refreshList: Function
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
    label: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
})


const closeDialog = () => {
    showDialog.value = false
}
// 按钮

const handleOk = () => {
    formRef.value.validate((valid: boolean) => {
        if (valid) {
            if (props.type === 'rootAdd' || props.type === 'add') {
                AddTreePoint(formData.value).then((res: any) => {
                    props.refreshList()
                    closeDialog()
                    ElMessage.success('新增成功')
                })
            } else {
                UpdateTreePoint(formData.value).then((res: any) => {
                    props.refreshList()
                    closeDialog()
                    ElMessage.success('编辑成功')
                })
            }
        }
    })
};
// 上传头像
const imageUrl = ref('');

const handleAvatarChange = (file: any) => {
    console.log(file, 'file')
    uploadFileService(file).then((res: any) => {
        imageUrl.value = res.url
        formData.value.imgUrl = res.url
    })
};


onMounted(() => {
    if (props.type === 'rootAdd') {
        formData.value = {
            parentId: '',
            label: ''
        }
    } else if (props.type === 'add') {
        formData.value = {
            parentId: props.skipData.id,
            label: ''
        }
    } else {
        formData.value = {
            parentId: props.skipData.parentId,
            imgUrl: props.skipData.imgUrl,
            id: props.skipData.id,
            label: props.skipData.label,
        }
        imageUrl.value = formData.value.imgUrl
    }
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
