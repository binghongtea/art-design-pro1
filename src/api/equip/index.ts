// 本地写死数据示例：设备空间树与点位操作
// 如需恢复真实接口，将此文件切回原实现或接入环境开关

/** 空间树节点类型 */
interface SpaceNode {
  id: string
  label: string
  parentId?: string
  imgUrl?: string
  children?: SpaceNode[]
}

/** 点位类型 */
interface PointItem {
  id: string // 用于拖拽与命中检测
  pointId: string // 业务主键，删除/更新使用
  spaceId: string
  x: number
  y: number
  pointName: string
  deviceCode: string
  deviceType: string // 取值参考 src/views/point/config/info.ts 中的 equipType
  isSelected?: boolean
}

// -------------------- 本地写死数据 --------------------

const spaceTreeData: SpaceNode[] = [
  {
    id: 'space-1',
    label: '一层大厅',
    imgUrl: '',
    children: [
      { id: 'space-1A', parentId: 'space-1', label: '大厅A', imgUrl: '' },
      { id: 'space-1B', parentId: 'space-1', label: '大厅B', imgUrl: '' }
    ]
  },
  {
    id: 'space-2',
    label: '二层办公区',
    imgUrl: '',
    children: [
      { id: 'space-2A', parentId: 'space-2', label: '部门A', imgUrl: '' }
    ]
  },
  {
    id: 'space-3',
    label: '地下停车场',
    imgUrl: '',
    children: [
      { id: 'space-3A', parentId: 'space-3', label: 'A区', imgUrl: '' },
      { id: 'space-3B', parentId: 'space-3', label: 'B区', imgUrl: '' }
    ]
  }
]

const pointsData: Record<string, PointItem[]> = {
  'space-1': [
    {
      id: 'p1',
      pointId: 'p1',
      spaceId: 'space-1',
      x: 300,
      y: 200,
      pointName: '新风机组-1',
      deviceType: '1029026',
      deviceCode: 'XFJZ-001'
    },
    {
      id: 'p2',
      pointId: 'p2',
      spaceId: 'space-1',
      x: 600,
      y: 250,
      pointName: '空调机组-1',
      deviceType: '1029027',
      deviceCode: 'KTJZ-001'
    },
    {
      id: 'p3',
      pointId: 'p3',
      spaceId: 'space-1',
      x: 800,
      y: 400,
      pointName: '一氧化碳-1',
      deviceType: '1029028',
      deviceCode: 'YYHT-001'
    }
  ],
  'space-2': [
    {
      id: 'p4',
      pointId: 'p4',
      spaceId: 'space-2',
      x: 200,
      y: 350,
      pointName: '送风机-1',
      deviceType: '1029032',
      deviceCode: 'SFJ-001'
    }
  ],
  'space-3': [
    {
      id: 'p5',
      pointId: 'p5',
      spaceId: 'space-3',
      x: 500,
      y: 500,
      pointName: '集水井-1',
      deviceType: '1029033',
      deviceCode: 'JSJ-001'
    },
    {
      id: 'p6',
      pointId: 'p6',
      spaceId: 'space-3',
      x: 700,
      y: 600,
      pointName: '消防水池-1',
      deviceType: '1029035',
      deviceCode: 'XFSC-001'
    }
  ],
  'space-1A': [],
  'space-1B': [],
  'space-2A': [],
  'space-3A': [],
  'space-3B': []
}

// -------------------- 工具函数 --------------------

function deepFindNodeById(list: SpaceNode[], id: string): SpaceNode | null {
  for (const node of list) {
    if (node.id === id) return node
    if (node.children && node.children.length) {
      const found = deepFindNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

function deepRemoveNodeById(list: SpaceNode[], id: string): boolean {
  const index = list.findIndex((n) => n.id === id)
  if (index !== -1) {
    list.splice(index, 1)
    return true
  }
  for (const node of list) {
    if (node.children && node.children.length) {
      const removed = deepRemoveNodeById(node.children, id)
      if (removed) return true
    }
  }
  return false
}

function genSpaceId(): string {
  return `space-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function genPointId(): string {
  return `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// -------------------- 对外导出函数（保持原函数名与签名） --------------------

// 获取树
export function GetSpaceTree() {
  return Promise.resolve({ list: spaceTreeData })
}

// 新增单个节点
export function AddTreePoint(data: any) {
  const newNode: SpaceNode = {
    id: genSpaceId(),
    label: data?.label ?? '新节点',
    parentId: data?.parentId || '',
    imgUrl: data?.imgUrl || ''
  }
  if (newNode.parentId) {
    const parent = deepFindNodeById(spaceTreeData, newNode.parentId)
    if (!parent) return Promise.resolve({ code: 404, msg: '父节点不存在' })
    parent.children = parent.children || []
    parent.children.push(newNode)
  } else {
    spaceTreeData.push(newNode)
  }
  // 初始化该空间的点位列表
  pointsData[newNode.id] = pointsData[newNode.id] || []
  return Promise.resolve({ code: 200 })
}

// 修改单个节点
export function UpdateTreePoint(data: any) {
  const node = deepFindNodeById(spaceTreeData, data?.id)
  if (!node) return Promise.resolve({ code: 404, msg: '节点不存在' })
  node.label = data?.label ?? node.label
  node.imgUrl = data?.imgUrl ?? node.imgUrl
  return Promise.resolve({ code: 200 })
}

// 删除单个节点
export function DeleteTreePoint(id: any) {
  // 删除空间树节点
  const removed = deepRemoveNodeById(spaceTreeData, String(id))
  // 清理对应空间点位
  if (removed && pointsData[String(id)]) {
    delete pointsData[String(id)]
  }
  return Promise.resolve({ code: removed ? 200 : 404 })
}

// 得到所有点
export function GetAllPointBySpaceId(spaceId: any) {
  const list = pointsData[String(spaceId)] || []
  // 返回副本，避免直接修改源
  return Promise.resolve({ list: list.map((p) => ({ ...p })) })
}

// 删除所有点
export function DeleteAllPointBySpaceId(spaceId: any) {
  pointsData[String(spaceId)] = []
  return Promise.resolve({ code: 200 })
}

// 新增单个点
export function AddPoint(data: any) {
  const spaceId = String(data?.spaceId)
  const newId = genPointId()
  const item: PointItem = {
    id: newId,
    pointId: newId,
    spaceId,
    x: Number(data?.x) || 0,
    y: Number(data?.y) || 0,
    pointName: data?.pointName || '新设备',
    deviceCode: data?.deviceCode || 'UNKNOWN',
    deviceType: data?.deviceType || '1029033',
    isSelected: false
  }
  pointsData[spaceId] = pointsData[spaceId] || []
  pointsData[spaceId].push(item)
  return Promise.resolve({ code: 200 })
}

// 删除单个点
export function DeletePoint(id: any) {
  const pid = String(id)
  let removed = false
  for (const key of Object.keys(pointsData)) {
    const arr = pointsData[key]
    const idx = arr.findIndex((p) => p.pointId === pid || p.id === pid)
    if (idx !== -1) {
      arr.splice(idx, 1)
      removed = true
      break
    }
  }
  return Promise.resolve({ code: removed ? 200 : 404 })
}

// 修改单个点
export function UpdatePoint(data: any) {
  const pid = String(data?.pointId)
  let updated = false
  for (const key of Object.keys(pointsData)) {
    const arr = pointsData[key]
    const p = arr.find((x) => x.pointId === pid || x.id === pid)
    if (p) {
      p.pointName = data?.pointName ?? p.pointName
      p.deviceCode = data?.deviceCode ?? p.deviceCode
      p.deviceType = data?.deviceType ?? p.deviceType
      if (typeof data?.x !== 'undefined') p.x = Number(data.x)
      if (typeof data?.y !== 'undefined') p.y = Number(data.y)
      updated = true
      break
    }
  }
  return Promise.resolve({ code: updated ? 200 : 404 })
}


