import { AppRouteRecord } from '@/types/router'
import { router } from '@/router'
import { useSettingStore } from '@/store/modules/setting'

// 打开外部链接
export const openExternalLink = (link: string) => {
  window.open(link, '_blank')
}

/**
 * 菜单跳转
 * @param item 菜单项
 * @param jumpToFirst 是否跳转到第一个子菜单
 * @returns
 */
export const handleMenuJump = (item: AppRouteRecord, jumpToFirst: boolean = false) => {
  console.log(item,jumpToFirst,'sdfsdfsdfsdf')
  // 处理外部链接
  const { link, isIframe } = item.meta
  if (link && !isIframe) {
    return openExternalLink(link)
  }

  // 如果不需要跳转到第一个子菜单，或者没有子菜单，直接跳转当前路径
  if (!jumpToFirst || !item.children?.length) {
    console.log(item.path,'item.path')
    const settingStore = useSettingStore()
    return router.push(item.path).then(() => {
      if(item.path.includes('/equip')){
        // 路由跳转完成后触发一次顶部刷新
        settingStore.reload()
      }
    })
  }

  // 递归查找第一个可见的叶子节点菜单
  const findFirstLeafMenu = (items: AppRouteRecord[]): AppRouteRecord => {
    for (const child of items) {
      if (!child.meta.isHide) {
        return child.children?.length ? findFirstLeafMenu(child.children) : child
      }
    }
    return items[0]
  }

  const firstChild = findFirstLeafMenu(item.children)
  // 如果第一个子菜单是外部链接则打开新窗口
  if (firstChild.meta?.link) {
    return openExternalLink(firstChild.meta.link)
  }
  const settingStore = useSettingStore()
  return router.push(firstChild.path).then(() => {
    // 路由跳转完成后触发一次顶部刷新
    settingStore.reload()
  })
}
