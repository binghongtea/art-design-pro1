<template>
    <div class="fatherCard">
        <LeftList :list="leftList" :clickItem="clickItem" />
        <canvas ref="canvasRef" width="1345" height="782"></canvas>
        <!-- 新增点位信息详情弹窗 -->
        <div v-if="showPopup" :style="{ left: popupX + 'px', top: popupY + 'px' }" class="popup">
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
        </div>
        <!-- -->
    </div>
    <DetailDialog v-if="isShowDetailDialog" dialogKey="isShowDetailDialog" :skipData="selPoint"></DetailDialog>
</template>

<script lang="ts" setup>
// @ts-ignore
import LeftList from '@/components/equip/leftList.vue';
import bizhi from '@/assets/img/equip/bizhi.png';
import sel from '@/assets/img/equip/sel.png'
import green from '@/assets/img/equip/green.png'
import orange from '@/assets/img/equip/orange.png'
import red from '@/assets/img/equip/red.png'
import DetailDialog from './component/detailDialog.vue';
import { ref, onMounted } from 'vue';

// 左侧列表
const leftList: any = ref([
    {
        id: '1',
        label: '一层'
    },
    {
        id: '2',
        label: '二层'
    },
])

const clickItem = (item: any) => {

    console.log(item)
}

// 初始化画布
const pointList = ref(
    [{
        name: '4号宿舍楼',
        maplat: '20',
        maplon: '20',
        status: '1',
        time: '09:12:25',
        isSelected: false,
        sort: '1'
    }, {
        name: '3号宿舍楼',
        maplat: '30',
        maplon: '50',
        status: '1',
        time: '09:12:25',
        isSelected: false,
        sort: '2'
    }, {
        name: '2号宿舍楼',
        maplat: '60',
        maplon: '70',
        status: '2',
        time: '09:12:25',
        isSelected: false,
        sort: '3'
    }, {
        name: '1号宿舍楼',
        maplat: '50',
        maplon: '100',
        status: '3',
        time: '09:12:25',
        isSelected: false,
        sort: '4'
    }, {
        name: '食堂',
        maplat: '600',
        maplon: '200',
        status: '3',
        time: '09:12:25',
        isSelected: false,
        sort: '5'
    }, {
        name: '体育馆',
        maplat: '300',
        maplon: '170',
        status: '3',
        time: '09:12:25',
        isSelected: false,
        sort: '6'
    }, {
        name: '400米标准田径运动场',
        maplat: '600',
        maplon: '290',
        status: '3',
        time: '09:12:25',
        isSelected: false,
        sort: '7'
    }]
)
// 选中点位
const selPoint: any = ref({
        name: '4号宿舍楼',
        maplat: '525',
        maplon: '490',
        status: '1',
        time: '09:12:25',
        isSelected: false,
        sort: '1'
    })
const canvasRef = ref<HTMLCanvasElement | null>(null);
const scale = ref(1);
const MIN_SCALE = 0.05;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.1;
// 绘制画布
const image = new Image();
image.src = bizhi;
// 不同状态的点位图片
const greenP = new Image();
const orangeP = new Image();
const redP = new Image();
const selP = new Image();
greenP.src = green;
orangeP.src = orange;
redP.src = red;
selP.src = sel;

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
        points.value = pointList.value
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(scale.value, scale.value);
            ctx.translate(offsetX.value / scale.value, offsetY.value / scale.value);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            // 绘制所有点
            points.value.forEach((point: any, _index: any) => {
                // 判断点图片
                let currentImage: any = '';

                if (point.isSelected) {
                    currentImage = selP;
                } else if (point.status == '1') {
                    currentImage = greenP
                } else if (point.status == '2') {
                    currentImage = orangeP
                } else if (point.status == '3') {
                    currentImage = redP
                }
                // 保存当前画布状态
                ctx.save();
                // 恢复到默认缩放比例
                ctx.setTransform(1, 0, 0, 1, 0, 0);

                // 计算点在画布上的实际位置
                const actualX = getPx(point.maplon) * scale.value + offsetX.value;
                const actualY = getPx(point.maplat) * scale.value + offsetY.value;

                ctx.beginPath();
                // 修改图片绘制尺寸为 26x33,蓝点要小一点
                if (point.isSelected) {
                    ctx.drawImage(currentImage, actualX - 10, actualY - 14, 20, 28);
                } else {
                    ctx.drawImage(currentImage, actualX - 12, actualY - 17, 24, 34);
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
        }
    }
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
    const canvas = canvasRef.value;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = (event.clientX - rect.left - offsetX.value) / scale.value;
        const clickY = (event.clientY - rect.top - offsetY.value) / scale.value;
        let isPointClicked = false;
        points.value.forEach((point: any) => {
            const imageX = getPx(point.maplon) - 12;
            const imageY = getPx(point.maplat) - 17;
            // 根据缩放比例调整图片的宽度和高度
            const imageWidth = 12 / scale.value;
            const imageHeight = 17 / scale.value;

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
    const canvas = canvasRef.value;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left - offsetX.value) / scale.value;
        const mouseY = (event.clientY - rect.top - offsetY.value) / scale.value;

        let isOverPoint = false;
        points.value.forEach((point: any) => {
            const imageX = getPx(point.maplon);
            const imageY = getPx(point.maplat);
            // 根据缩放比例调整图片的宽度和高度
            const imageWidth = 12 / scale.value;
            const imageHeight = 17 / scale.value;

            if (
                mouseX >= imageX - imageWidth &&
                mouseX <= imageX + imageWidth &&
                mouseY >= imageY - imageHeight &&
                mouseY <= imageY + imageHeight
            ) {
                isOverPoint = true;
                showPopup.value = true;
                popupInfo.value = point;
                const actualX = getPx(point.maplon) * scale.value + offsetX.value;
                const actualY = getPx(point.maplat) * scale.value + offsetY.value;
                popupX.value = actualX + 12 + 280;
                popupY.value = actualY + 40;
            }
        });

        if (!isOverPoint) {
            showPopup.value = false;
        }

        if (isOverPoint) {
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
                let newMaplon = getPx(currentPoint.maplon) + dx;
                let newMaplat = getPx(currentPoint.maplat) + dy;

                // 限制点的位置在图片范围内
                newMaplon = Math.max(12, Math.min(newMaplon, image.width - 12));
                newMaplat = Math.max(17, Math.min(newMaplat, image.height - 17));

                currentPoint.maplon = newMaplon;
                currentPoint.maplat = newMaplat;

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
    const canvas = canvasRef.value;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = (event.clientX - rect.left - offsetX.value) / scale.value;
        const clickY = (event.clientY - rect.top - offsetY.value) / scale.value;


        points.value.forEach((point: any) => {
            const imageX = getPx(point.maplon) - 12;
            const imageY = getPx(point.maplat) - 17;
            // 根据缩放比例调整图片的宽度和高度
            const imageWidth = 12 / scale.value;
            const imageHeight = 17 / scale.value;

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

onMounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
        canvas.addEventListener('wheel', handleWheel);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('click', handleClick);
        window.addEventListener('resize', (e) => {
            console.log(e, 'sss');
            drawImage();
        });
        image.onload = () => {
            drawImage();
        };
    }
})

const isShowDetailDialog = ref(false)
provide('isShowDetailDialog', isShowDetailDialog)
</script>
<style scoped>
/* 固定 canvas 的显示尺寸，避免随父容器拉伸而变化 */
.fatherCard {
    align-items: flex-start;
    /* 取消默认的 stretch，避免子项高度拉伸 */
}

canvas {
    width: 1345px;
    /* 与 canvas 属性 width 保持一致 */
    height: 782px;
    /* 与 canvas 属性 height 保持一致 */
    flex: none;
    /* 防止作为 flex 子项参与拉伸 */
}
</style>
