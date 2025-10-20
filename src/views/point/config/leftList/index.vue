<template>
  <div class="leftList">
    <el-button type="primary" class="blue-btn" @click="addPoint('rootAdd')" :icon="Plus">
      新增根节点
    </el-button>
    <el-tree :data="spaceTree" :default-expanded-keys="expandId" :default-expanded-all="true" node-key="id"
      @node-click="clickItem1">
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
          <div class="btn-group">
            <el-icon @click="addPoint('add', data)">
              <Plus />
            </el-icon>
            <el-icon @click="addPoint('edit', data)">
              <Edit />
            </el-icon>
            <el-icon @click="handleDelete(data)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
  <AddPointDialog v-if="showAddPointDialog" dialogKey="showAddPointDialog" :skipData="skipData" :type="showType"
    :refreshList="getSpaceTree" />
</template>

<script lang="ts" setup>
import AddPointDialog from './addPointDialog.vue'
import { GetSpaceTree, AddPoint, DeleteTreePoint } from '@/api/equip';
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ref, onMounted, provide } from 'vue';
const props = defineProps({
  clickItem: {
    type: Function,
    default: () => { }
  }
})
const skipData:any = ref()
// 点击事件
const selectedItem = ref({});
const clickItem1 = (item: any) => {
  selectedItem.value = item.id;
  props.clickItem(item)
}

// 获取空间树
const expandId = ref([]);
const spaceTree = ref([]);
const getSpaceTree = async () => {
  const res: any = await GetSpaceTree();
  spaceTree.value = res.list
  expandId.value = res.list.map((item: any) => item.id)
}

// 新增根节点
const showType = ref('');

const addPoint = (type: string, row: any = null) => {
  skipData.value = row
  console.log(row)
  showType.value = type
  showAddPointDialog.value = true
}
// 操作按钮
const handleDelete = (data: any) => { 
  ElMessageBox.confirm('确定要删除该节点吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    DeleteTreePoint(data.id).then((res: any) => {
        getSpaceTree()
    })
  })
}

onMounted(() => {
  getSpaceTree()
})

const showAddPointDialog = ref(false)
provide('showAddPointDialog', showAddPointDialog)
</script>

<style scoped lang="scss">
.leftList {
  .blue-btn {
    width: 100px;
    height: 32px !important;
    line-height: 32px;
  }
  .el-tree{
    margin-top: 10px;
    .custom-tree-node {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .btn-group {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-right: 5px;
      }
    }
  }
}
</style>
