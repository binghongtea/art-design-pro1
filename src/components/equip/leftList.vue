<template>
  <div class="leftList">
    <div :class="{'selected': item.id === selectedItem, 'item': true}" v-for="item in list" :key="item.key" @click="clickItem1(item)">
      {{ item.label }}
    </div>
    <!-- -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps({
  list: {
    type: Array<any>,
    default: () => []
  },
  clickItem: {
    type: Function,
    default: () => {}
  }
})

const selectedItem = ref({});
const clickItem1 = (item:any) => {
  selectedItem.value = item.id;
  props.clickItem(item)
}
</script>
