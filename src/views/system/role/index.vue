<template>
  <div class="contentBox">
  </div>
</template>

<script setup lang="ts">
 import {GetUserList} from '@/api/system'
 
 onMounted(() => {
  GetUserList({
  }).then(res => {
    console.log(res)
  })
})
</script>

<style lang="scss" scoped>
</style>
