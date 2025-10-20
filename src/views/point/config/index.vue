<template>
    <div class="fatherCard">
        <LeftList :clickItem="clickItem" />
        <canvas ref="canvasRef" width="1345" height="782"></canvas>
        <el-button v-if="selSpace" class="addBtn" type="primary" :icon="!isAddPoint ? Plus : Close" @click="addPoint">{{
            !isAddPoint ? '新增设备' : '取消新增' }}</el-button>
        <el-button v-if="selSpace" class="deleteBtn1" type="danger" :icon="!isDeletePoint ? Delete : Close"
            @click="handleDeletePoint">{{ !isDeletePoint ? '删除设备' : '取消删除' }}</el-button>
        <el-button v-if="selSpace" class="deleteBtn2" type="danger" :icon="Delete"
            @click="deleteAllPoint">删除所有</el-button>
        <!-- 新增点位信息详情弹窗 -->
        <!-- <div v-if="showPopup" :style="{ left: popupX + 'px', top: popupY + 'px' }" class="popup">
            <div class="row">
                <div class="round" style="background-color: #999;"></div>
                <span>名称：</span>
                <span style="color: #333;">{{ popupInfo.name }}</span>
            </div>
            <div class="row">
                <div class="round" style="background-color: #3BBD6F;"></div>
                <span>正常：</span>
                <span style="color: #3BBD6F;">{{ popupInfo.sort }}</span>
            </div>
            <div class="row">
                <div class="round" style="background-color: #FF2E2E;"></div>
                <span>异常：</span>
                <span style="color: #FF2E2E;">{{ popupInfo.sort }}</span>
            </div>
            <div class="row">
                <div class="round" style="background-color: #FF6E2E;"></div>
                <span>维修中：</span>
                <span style="color: #FF6E2E;">{{ popupInfo.sort }}</span>
            </div>
        </div> -->
    </div>
    <DetailDialog v-if="isShowDetailDialog" dialogKey="isShowDetailDialog" :skipData="selPoint"
        :refreshList="refreshMap"></DetailDialog>
    <AddPointDialog v-if="isShowAddPointDialog" dialogKey="isShowAddPointDialog" :skipData="skipData"
        :refreshList="refreshMap" />
</template>

<script setup lang="ts">
// @ts-ignore
import AddPointDialog from './component/addPointDialog.vue';
import LeftList from './leftList/index.vue';
import bizhi from '@/assets/img/equip/bizhi.png';
import addPointImg from '@/assets/img/equip/addPoint.png';
import deleteImg from '@/assets/img/equip/delete.png';
import jsj from '@/assets/img/equip/集水井.png';
import ktjz from '@/assets/img/equip/空调机组.png';
import pfjpyj from '@/assets/img/equip/排风兼排烟机.png';
import sx from '@/assets/img/equip/水箱.png';
import sfj from '@/assets/img/equip/送风机.png';
import xfsc from '@/assets/img/equip/消防水池.png';
import xfjz from '@/assets/img/equip/新风机组.png';
import yyht from '@/assets/img/equip/一氧化碳.png';
import DetailDialog from './component/detailDialog.vue';
// @ts-ignore
import { GetAllPointBySpaceId, DeleteAllPointBySpaceId, DeletePoint } from '@/api/equip';
import { ref, onMounted, onUnmounted, onBeforeUnmount, provide } from 'vue';
import { useRoute } from 'vue-router';
import { Plus, Delete, Close } from '@element-plus/icons-vue';

const skipData: any = ref(null)
const selSpace: any = ref()
const clickItem = (item: any) => {
    selSpace.value = item
    image.src = item.imgUrl || bizhi
    GetAllPointBySpaceId(item.id).then((res: any) => {
        pointList.value = res.list
        initCanvas()
        console.log(item)
    })
}

const refreshMap = () => {
    image.src = selSpace.value.imgUrl || bizhi
    GetAllPointBySpaceId(selSpace.value.id).then((res: any) => {
        pointList.value = res.list
        drawImage()
    })
}
const getAllPointBySpaceId = (data: any) => {
    GetAllPointBySpaceId(data.id).then((res: any) => {
        pointList.value = res.data
    })
}
const initCanvas = () => {
    scale.value = 1
    offsetX.value = 0
    offsetY.value = 0
    startX.value = 0
    startY.value = 0
    isDragging.value = false
    isPointDragging.value = false
    draggingPointId.value = null
    endX.value = 0
    endY.value = 0
    drawImage()
}

// 初始化画布
const pointList = ref(
    []
)
// 选中点位
const selPoint: any = ref({
})
const canvasRef = ref<HTMLCanvasElement | null>(null);
const scale = ref(1);
const MIN_SCALE = 0.05;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.1;
// 绘制画布
const image = new Image();
image.src = bizhi;
// 添加点位图片
const addPointImgP = new Image();
addPointImgP.src = addPointImg;
// 删除点位按钮图片
const deleteImgP = new Image();
deleteImgP.src = deleteImg;
const deleteWidth = 14;
const deleteHeight = 14;
// 不同状态的点位图片
const iconWidth = 20;
const iconHeight = 20;
const jsjP = new Image();
const ktjzP = new Image();
const pfjpyjP = new Image();
const sxP = new Image();
const sfjP = new Image();
const xfscP = new Image();
const xfjzP = new Image();
const yyhtP = new Image();
jsjP.src = jsj;
ktjzP.src = ktjz;
pfjpyjP.src = pfjpyj;
sxP.src = sx;
sfjP.src = sfj;
xfscP.src = xfsc;
xfjzP.src = xfjz;
yyhtP.src = yyht;

// 新增变量用于记录图片的偏移量
const offsetX = ref(0);
const offsetY = ref(0);
// 记录鼠标按下时的位置
const startX = ref(0);
const startY = ref(0);
// 记录鼠标是否按下
const isDragging = ref(false);
// 记录点是否被拖动
const isPointDragging = ref(false);
// 记录当前拖动点的 id
const draggingPointId = ref<number | null>(null);
// 记录结束点位置
const endX: any = ref(0);
const endY: any = ref(0);
// 记录最新鼠标位置（基于原始图片坐标系）
const lastMouseX = ref<number | null>(null);
const lastMouseY = ref<number | null>(null);
// 定义要绘制的点的数组，每个点包含 id、maplat、maplon 坐标、半径和是否选中
const points: any = ref([]);
// 换算点位位置
const getPx = (px: any) => {
    return Math.ceil(px)
}
const drawImage = () => {
    const canvas = canvasRef.value;
    // 绘制轨迹
    if (canvas) {
        if (selSpace.value) {
            points.value = pointList.value
            const ctx = canvas.getContext('2d');
            // 获取图片的尺寸,并等比例缩放,高度固定，宽度自适应
            const imageHeight = 782;
            const imageWidth = imageHeight / image.height * image.width;
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.scale(scale.value, scale.value);
                ctx.translate(offsetX.value / scale.value, offsetY.value / scale.value);
                ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
                // 绘制所有点
                points.value.forEach((point: any, _index: any) => {
                    // 判断点图片
                    let currentImage: any = '';
                    // 如果有选中变化，就打开
                    // if (point.isSelected) {
                    //     currentImage = selP;
                    // }

                    // 根据设备类型选择对应图标（使用 IIFE 返回正确的图片）
                    currentImage = (() => {
                        switch (point.deviceType) {
                            case '1029033':
                                return jsjP;
                            case '1029027':
                                return ktjzP;
                            case '1029029':
                                return pfjpyjP;
                            case '1029031':
                                return pfjpyjP;
                            case '1029034':
                                return sxP;
                            case '1029036':
                                return sxP;
                            case '1029030':
                                return sfjP;
                            case '1029032':
                                return sfjP;
                            case '1029035':
                                return xfscP;
                            case '1029026':
                                return xfjzP;
                            case '1029028':
                                return yyhtP;
                            default:
                                return jsjP; // 默认图标，避免未返回导致绘制失败
                        }
                    })();
                    // 保存当前画布状态
                    ctx.save();
                    // 恢复到默认缩放比例
                    ctx.setTransform(1, 0, 0, 1, 0, 0);

                    // 计算点在画布上的实际位置
                    const actualX = getPx(point.x) * scale.value + offsetX.value;
                    const actualY = getPx(point.y) * scale.value + offsetY.value;

                    ctx.beginPath();
                    // 修改图片绘制尺寸为 26x33,蓝点要小一点
                    if (point.isSelected) {
                        ctx.drawImage(currentImage, actualX - 10, actualY - 14, 20, 28);
                    } else {
                        ctx.drawImage(currentImage, actualX - iconWidth / 2, actualY - iconHeight / 2, iconWidth, iconHeight);
                        // 获取文本宽度
                        const metrics = ctx.measureText(point.pointName);
                        ctx.fillText(point.pointName, actualX - metrics.width / 2, actualY + 22);
                        if (isDeletePoint.value) {
                            ctx.drawImage(deleteImgP, actualX + iconWidth / 2, actualY - iconHeight, deleteWidth, deleteHeight);
                        }
                    }

                    ctx.fill();

                    // if (point.isSelected) {
                    //     // 绘制选中框
                    //     const boxWidth = point.pointName.length * 15;
                    //     const boxHeight = 20;
                    //     const boxX = actualX - boxWidth / 2;
                    //     const boxY = actualY - 16.5 - boxHeight - 5;
                    //     ctx.fillStyle = 'rgba(13, 15, 19,0.8)';
                    //     ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

                    //     // 绘制名字
                    //     ctx.fillStyle = 'white';
                    //     ctx.font = '14px Arial';
                    //     ctx.fillText(point.pointName, boxX + 5, boxY + 15);
                    // }

                    // 恢复之前的画布状态
                    ctx.restore();
                });

                ctx.restore();

                // 叠加显示当前鼠标坐标（画布坐标系，未缩放）
                console.log(lastMouseX.value, lastMouseY.value)
                if (isAddPoint.value && (lastMouseX.value !== null && lastMouseY.value !== null) && (imageWidth - lastMouseX.value >= 0 && imageHeight - lastMouseY.value >= 0 && lastMouseX.value >= 0 && lastMouseY.value >= 0)) {
                    // 将图片坐标转换为屏幕坐标，考虑缩放与偏移
                    const actualX = lastMouseX.value * scale.value + offsetX.value;
                    const actualY = lastMouseY.value * scale.value + offsetY.value;
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.drawImage(addPointImgP, actualX - iconWidth / 2, actualY - iconHeight / 2, iconWidth, iconHeight);
                    ctx.restore();
                }
            }
        } else {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.save();
                // 设置更大的字体并居中对齐
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                ctx.fillStyle = '#333';
                ctx.fillText('请选择空间', centerX, centerY);
                ctx.restore();
            }
        }
    }
};

// 尺寸变化时重绘
const handleResize = (_e: Event) => {
    drawImage();
};

const zoomIn = () => {
    if (scale.value <= MAX_SCALE) {
        scale.value += ZOOM_STEP;
        drawImage();
    }
};

const zoomOut = () => {
    if (scale.value >= MIN_SCALE) {
        scale.value -= ZOOM_STEP;
        drawImage();
    }
};

const handleWheel = (event: WheelEvent) => {
    if (!selSpace.value) {
        return
    }
    event.preventDefault();
    const canvas = canvasRef.value;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const newScale = scale.value + delta;
        if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
            const oldScale = scale.value;
            scale.value = newScale;

            // 计算鼠标在缩放前后的相对位置
            const mouseXRelative = (mouseX - offsetX.value) / oldScale;
            const mouseYRelative = (mouseY - offsetY.value) / oldScale;

            // 根据相对位置调整偏移量
            offsetX.value = mouseX - mouseXRelative * scale.value;
            offsetY.value = mouseY - mouseYRelative * scale.value;
            drawImage();
        }
    }
};

// 处理鼠标按下事件
const handleMouseDown = (event: MouseEvent) => {
    if (!selSpace.value) {
        return
    }
    const canvas = canvasRef.value;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = (event.clientX - rect.left - offsetX.value) / scale.value;
        const clickY = (event.clientY - rect.top - offsetY.value) / scale.value;
        let isPointClicked = false;
        points.value.forEach((point: any) => {
            const imageX = getPx(point.x);
            const imageY = getPx(point.y);
            // 根据缩放比例调整图片的宽度和高度
            const imageWidth = iconWidth / 2 / scale.value;
            const imageHeight = iconHeight / 2 / scale.value;

            if (
                clickX >= imageX - imageWidth &&
                clickX <= imageX + imageWidth &&
                clickY >= imageY - imageHeight &&
                clickY <= imageY + imageHeight
            ) {
                // 不能拖动
                // isPointDragging.value = true;
                draggingPointId.value = point.id;
                startX.value = clickX;
                startY.value = clickY;
                isPointClicked = true;
            }
        });

        if (!isPointClicked) {
            // 取消所有点的选中状态
            // points.value.forEach((p: any) => p.isSelected = false);
            isDragging.value = true;
            startX.value = event.offsetX;
            startY.value = event.offsetY;
        }

        drawImage();
    }
};

// 新增变量用于控制弹窗显示
const showPopup = ref(false);
const popupInfo: any = ref({});
const popupX = ref(0);
const popupY = ref(0);

// 处理鼠标移动事件
const handleMouseMove = (event: MouseEvent) => {
    if (!selSpace.value) {
        return
    }
    const canvas = canvasRef.value;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left - offsetX.value) / scale.value;
        const mouseY = (event.clientY - rect.top - offsetY.value) / scale.value;
        // 记录鼠标位置用于在画布上显示
        lastMouseX.value = mouseX;
        lastMouseY.value = mouseY;
        console.log(mouseX, mouseY);
        let isOverPoint = false;
        points.value.forEach((point: any) => {
            const imageX = getPx(point.x);
            const imageY = getPx(point.y);
            // 根据缩放比例调整图片的宽度和高度
            const imageWidth = iconWidth / 2 / scale.value;
            const imageHeight = iconHeight / 2 / scale.value;

            if (
                mouseX >= imageX - imageWidth &&
                mouseX <= imageX + imageWidth &&
                mouseY >= imageY - imageHeight &&
                mouseY <= imageY + imageHeight
            ) {
                isOverPoint = true;
                // 要显示弹窗就改为true
                showPopup.value = false;
                popupInfo.value = point;
                const actualX = getPx(point.x) * scale.value + offsetX.value;
                const actualY = getPx(point.y) * scale.value + offsetY.value;
                popupX.value = actualX + 12 + 280;
                popupY.value = actualY + 40;
            }
        });

        if (!isOverPoint) {
            showPopup.value = false;
        }

        if (isOverPoint && !isAddPoint.value) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }

        if (isPointDragging.value) {
            const dx = mouseX - startX.value;
            const dy = mouseY - startY.value;

            const currentPoint = points.value.find((point: any) => point.id === draggingPointId.value);
            if (currentPoint) {
                // 计算新的点位置
                let newMaplon = getPx(currentPoint.x) + dx;
                let newMaplat = getPx(currentPoint.y) + dy;

                // 限制点的位置在图片范围内
                newMaplon = Math.max(iconWidth / 2, Math.min(newMaplon, image.width - iconWidth / 2));
                newMaplat = Math.max(iconHeight / 2, Math.min(newMaplat, image.height - iconHeight / 2));

                currentPoint.x = newMaplon;
                currentPoint.y = newMaplat;

                startX.value = mouseX;
                startY.value = mouseY;
                endX.value = newMaplon;
                endY.value = newMaplat;
                drawImage();
            }
        } else if (isDragging.value) {
            const dx = event.offsetX - startX.value;
            const dy = event.offsetY - startY.value;
            offsetX.value += dx;
            offsetY.value += dy;
            startX.value = event.offsetX;
            startY.value = event.offsetY;
            drawImage();
        }


        // 非拖动状态也需要刷新以更新坐标显示
        if (!isPointDragging.value && !isDragging.value) {
            drawImage();
        }
    }
};

// 处理鼠标松开事件
const handleMouseUp = () => {
    isDragging.value = false;
    isPointDragging.value = false;
    draggingPointId.value = null;
};

// 处理点击事件
const handleClick = (event: MouseEvent) => {
    if (!selSpace.value) {
        return
    }
    console.log('点击事件');
    const canvas = canvasRef.value;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = (event.clientX - rect.left - offsetX.value) / scale.value;
        const clickY = (event.clientY - rect.top - offsetY.value) / scale.value;
        if (isAddPoint.value) {
            confirmAddPoint(clickX, clickY);
            return
        }

        points.value.forEach((point: any) => {
            const imageX = getPx(point.x);
            const imageY = getPx(point.y);
            // 根据缩放比例调整图片的宽度和高度
            const imageWidth = iconWidth / 2 / scale.value;
            const imageHeight = iconHeight / 2 / scale.value;
            // 将删除按钮在屏幕上的位置，转换为基于图片坐标系的命中区域
            const iconHalfWidthImg = iconWidth / 2 / scale.value; // 主图标半宽（图片坐标系）
            const iconFullHeightImg = iconHeight / scale.value;   // 主图标全高（图片坐标系）
            const deleteFullWidthImg = deleteWidth / scale.value; // 删除按钮宽（图片坐标系）
            const deleteFullHeightImg = deleteHeight / scale.value;// 删除按钮高（图片坐标系）
            // 删除按钮绘制于屏幕: (actualX + iconWidth/2, actualY - iconHeight)
            // 转换到图片坐标系后的左上角/右下角边界：
            const deleteLeftImg = imageX + iconHalfWidthImg;
            const deleteRightImg = deleteLeftImg + deleteFullWidthImg;
            const deleteTopImg = imageY - iconFullHeightImg;
            const deleteBottomImg = deleteTopImg + deleteFullHeightImg;

            if (isDeletePoint.value) {
                // 命中删除按钮（基于图片坐标系的精确命中区域）
                if (
                    clickX >= deleteLeftImg &&
                    clickX <= deleteRightImg &&
                    clickY >= deleteTopImg &&
                    clickY <= deleteBottomImg
                ) {
                    // 取消所有点的选中状态
                    points.value.forEach((p: any) => p.isSelected = false);
                    // 选中点
                    // point.isSelected = true;
                    selPoint.value = point;
                    deletePoint();
                }
                return
            }

            if (
                clickX >= imageX - imageWidth &&
                clickX <= imageX + imageWidth &&
                clickY >= imageY - imageHeight &&
                clickY <= imageY + imageHeight
            ) {
                // 取消所有点的选中状态

                points.value.forEach((p: any) => p.isSelected = false);

                // 选中点
                // point.isSelected = true;
                selPoint.value = point;
                isShowDetailDialog.value = true
                drawImage();
            }
        });
    }
};

// 设备操作按钮
const isAddPoint = ref(false)
const addPoint = () => {
    isDeletePoint.value = false
    isAddPoint.value = !isAddPoint.value
}

const isDeletePoint = ref(false)
const handleDeletePoint = () => {
    isAddPoint.value = false
    isDeletePoint.value = !isDeletePoint.value
    drawImage()
}

const deletePoint = () => {
    if (selPoint.value) {
        ElMessageBox.confirm('确定删除此设备吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            DeletePoint(selPoint.value.pointId).then((res: any) => {
                refreshMap()
                ElMessage.success('删除成功')
            })
        })
    }
}
const deleteAllPoint = () => {
    ElMessageBox.confirm('确定删除所有设备吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        DeleteAllPointBySpaceId(selSpace.value.id).then((res: any) => {
            refreshMap()
            ElMessage.success('删除成功')
        })
    })
}

const confirmAddPoint = (x: any, y: any) => {
    ElMessageBox.confirm('确定在此添加设备吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        skipData.value = { ...selSpace.value, x: x, y: y }
        console.log(skipData.value, 'skipData')
        isAddPoint.value = false
        isShowAddPointDialog.value = true
    })
}

onMounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
        canvas.addEventListener('wheel', handleWheel);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);
        if (image.complete) {
            // 如果图片已缓存完成，直接绘制
            drawImage();
        } else {
            image.onload = () => {
                drawImage();
            };
        }
    }
})

onUnmounted(() => {

    const canvas = canvasRef.value;
    if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('click', handleClick);
        window.removeEventListener('resize', handleResize);
    }
})



const isShowDetailDialog = ref(false)
const isShowAddPointDialog = ref(false)
provide('isShowDetailDialog', isShowDetailDialog)
provide('isShowAddPointDialog', isShowAddPointDialog)
</script>
<style scoped lang="scss">
/* 固定 canvas 的显示尺寸，避免随父容器拉伸而变化 */
.fatherCard {
    align-items: flex-start;
    position: relative;

    /* 取消默认的 stretch，避免子项高度拉伸 */
    .addBtn {
        position: absolute;
        top: 30px;
        right: 30px;
    }

    .deleteBtn1 {
        position: absolute;
        top: 70px;
        right: 30px;
    }

    .deleteBtn2 {
        position: absolute;
        top: 110px;
        right: 30px;
    }
}

canvas {
    width: 1345px;
    /* 与 canvas 属性 width 保持一致 */
    height: 782px;
    /* 与 canvas 属性 height 保持一致 */
    flex: none;
    /* 防止作为 flex 子项参与拉伸 */
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
