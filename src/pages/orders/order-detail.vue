<template>
  <view class="order-detail">
    <!-- 订单状态 -->
    <view class="status-section">
      <text class="status-text">{{ orderStatus }}</text>
      <text class="status-desc">{{ statusDescription }}</text>
    </view>

    <!-- 教员信息 -->
    <view class="teacher-section">
      <image
        class="teacher-avatar"
        :src="orderInfo.teacherAvatar || '/static/images/default-teacher.png'"
        mode="aspectFill"
      />
      <view class="teacher-info">
        <text class="teacher-name">{{ orderInfo.teacherName }}</text>
        <text class="teacher-title">{{ orderInfo.teacherTitle }}</text>
      </view>
    </view>

    <!-- 预约信息 -->
    <view class="booking-info">
      <view class="info-item">
        <text class="label">预约时间</text>
        <picker
          mode="multiSelector"
          :range="[dateList, timeList]"
          :value="[dateIndex, timeIndex]"
          @change="onDateTimeChange"
          @columnchange="onColumnChange"
          :disabled="
            orderInfo.status === 'completed' ||
            orderInfo.status === 'cancelled' ||
            orderInfo.status === 'refunded'
          "
        >
          <view
            class="picker"
            :class="{
              'picker-disabled':
                orderInfo.status === 'completed' ||
                orderInfo.status === 'cancelled' ||
                orderInfo.status === 'refunded',
            }"
          >
            {{ selectedDateTime || "请选择预约时间" }}
          </view>
        </picker>
      </view>

      <view class="info-item">
        <text class="label">预定地址</text>
        <input
          type="text"
          v-model="orderInfo.address"
          placeholder="请输入预定地址"
          class="address-input"
          :disabled="orderInfo.status !== 'pending'"
        />
      </view>

      <view class="info-item">
        <text class="label">联系电话</text>
        <input
          type="number"
          v-model="orderInfo.phone"
          placeholder="请输入联系电话"
          maxlength="11"
          :disabled="orderInfo.status !== 'pending'"
        />
      </view>

      <view class="info-item notes-item">
        <text class="label">备注信息</text>
        <textarea
          v-model="orderInfo.notes"
          placeholder="请输入备注信息（选填）"
          class="notes-input"
          :maxlength="200"
          :disabled="orderInfo.status !== 'pending'"
        />
      </view>

      <view class="info-item">
        <text class="label">订单金额</text>
        <text class="value price">¥{{ orderInfo.amount }}</text>
      </view>
    </view>

    <!-- 订单��息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="label">订单编号</text>
        <text class="value">{{ orderInfo.orderNo }}</text>
      </view>
      <view class="info-item">
        <text class="label">下单时间</text>
        <text class="value">{{ orderInfo.createTime }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付方式</text>
        <text class="value">{{ orderInfo.paymentMethod }}</text>
      </view>
    </view>

    <!-- 服务明细 -->
    <view class="service-details">
      <view class="section-title">服务明细</view>
      <view
        v-for="service in orderInfo.services"
        :key="service.id"
        class="service-item"
      >
        <view class="service-info">
          <text class="service-name">{{ service.name }}</text>
          <text class="service-duration">{{ service.duration }}</text>
          <text class="remaining-count" v-if="orderInfo.status === 'confirmed'">
            剩余{{ service.remainingQuantity }}次
          </text>
        </view>
        <view class="service-price">
          <text class="price">¥{{ service.price }}</text>
          <text class="quantity">x{{ service.quantity }}</text>
          <button
            v-if="
              orderInfo.status === 'confirmed' && service.remainingQuantity > 0
            "
            class="use-btn"
            @tap.stop="handleUseService(service)"
          >
            记录使用
          </button>
        </view>
      </view>
      <view class="total-amount">
        <text>总计</text>
        <text class="amount">¥{{ orderInfo.amount }}</text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <block v-if="orderInfo.status === 'pending'">
        <button class="action-btn cancel" @tap="handleCancel">取消预约</button>
        <button class="action-btn primary" @tap="handlePay">立即支付</button>
      </block>
      <block v-else-if="orderInfo.status === 'confirmed'">
        <button class="action-btn" @tap="handleContact">联系教员</button>
        <button class="action-btn primary" @tap="handleRefund">申请退款</button>
      </block>
      <block v-else-if="orderInfo.status === 'completed'">
        <button class="action-btn" @tap="handleRebook">再次预约</button>
        <button
          class="action-btn primary"
          @tap="handleComment"
          v-if="!orderInfo.hasComment"
        >
          评价
        </button>
      </block>
    </view>

    <!-- 自定义使用记���弹窗 -->
    <view v-if="showUsePopup" class="modal-overlay" @tap="closeUsePopup">
      <view class="modal-content" @tap.stop>
        <view class="popup-body">
          <text class="close-btn" @tap="closeUsePopup">×</text>
          <view class="popup-title">记录服务使用</view>
          <view class="service-name">{{ selectedService?.name }}</view>
          <view class="use-count">
            <view class="count-control">
              <button
                class="count-btn"
                :disabled="useCount <= 1"
                @tap="useCount--"
              >
                -
              </button>
              <text class="count">{{ useCount }}</text>
              <button
                class="count-btn"
                :disabled="
                  useCount >= (selectedService?.remainingQuantity || 0)
                "
                @tap="useCount++"
              >
                +
              </button>
            </view>
          </view>
          <view class="popup-actions">
            <button class="confirm-btn" @tap="confirmUseService">
              确认使用
            </button>
            <button class="cancel-btn" @tap="closeUsePopup">取消</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useOrderStore, type Order } from "@/stores/order";

// 然后再定义 orderInfo
const orderInfo = ref<Order>({
  id: "",
  status: "pending",
  teacherName: "",
  teacherAvatar: "",
  teacherTitle: "",
  amount: 0,
  services: [],
  orderNo: "",
  createTime: "",
  paymentMethod: "",
  hasComment: false,
  bookingTime: "",
  phone: "",
  address: "",
  notes: "",
});

// 订单状态文案
const orderStatus = computed(() => {
  const statusMap = {
    pending: "待支付",
    confirmed: "已确认",
    completed: "已完成",
    cancelled: "已取消",
    refunded: "已退款",
  };
  return statusMap[orderInfo.value.status];
});

// 状态描述文案
const statusDescription = computed(() => {
  const descMap = {
    pending: "请在15分钟内完成支付",
    confirmed: "平台已确认预约",
    completed: "课程已完成",
    cancelled: "预约已取消",
    refunded: "退款已完成",
  };
  return descMap[orderInfo.value.status];
});

// 在 script setup 中添加
const orderStore = useOrderStore();

// 取消预约
const handleCancel = () => {
  uni.showModal({
    title: "提示",
    content: "确定��取消预约吗？",
    success: (res) => {
      if (res.confirm) {
        // 更新订单状态
        orderStore.cancelOrder(orderInfo.value.id);

        // 更新当前页面的订单信息
        orderInfo.value = {
          ...orderInfo.value,
          status: "cancelled",
        };

        // 更新本地存储
        uni.setStorageSync(
          `order_${orderInfo.value.id}`,
          JSON.stringify(orderInfo.value)
        );

        uni.showToast({
          title: "已取消预约",
          icon: "success",
          success: () => {
            // 短暂延迟后返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
      }
    },
  });
};

// 日期和时间选择相关
const dateList = ref<string[]>([]);
const timeList = ref<string[]>([]);
const dateIndex = ref(0);
const timeIndex = ref(0);

// 生成日期列表（未来30天）
const generateDateList = () => {
  const list = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    list.push(dateStr);
  }
  dateList.value = list;
};

// 生成时间列表（9:00-22:00，每半小时一个时间段）
const generateTimeList = () => {
  const list = [];
  for (let hour = 9; hour <= 22; hour++) {
    list.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 22) {
      list.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  timeList.value = list;
};

// 修改计算选中的日期时间
const selectedDateTime = computed(() => {
  // 如果有订单信息，优先显示订单的预约时间
  if (orderInfo.value.bookingTime) {
    return orderInfo.value.bookingTime;
  }
  // 否则显示选择器的时间
  if (dateList.value.length === 0 || timeList.value.length === 0) return "";
  return `${dateList.value[dateIndex.value]} ${
    timeList.value[timeIndex.value]
  }`;
});

// 处理日期时间选择
const onDateTimeChange = (e: any) => {
  const [newDateIndex, newTimeIndex] = e.detail.value;
  dateIndex.value = newDateIndex;
  timeIndex.value = newTimeIndex;

  // 更新订单信息，合并日期和时间
  const selectedDate = dateList.value[dateIndex.value];
  const selectedTime = timeList.value[timeIndex.value];
  orderInfo.value.bookingTime = `${selectedDate} ${selectedTime}`;
};

// 修改列变化处理
const onColumnChange = (e: any) => {
  const { column, value } = e.detail;
  if (column === 0) {
    dateIndex.value = value;
  } else {
    timeIndex.value = value;
  }
  // 更新订���时间
  orderInfo.value.bookingTime = `${dateList.value[dateIndex.value]} ${
    timeList.value[timeIndex.value]
  }`;
};

// 修改立即支付处理
const handlePay = () => {
  console.log(orderInfo.value);

  // 表单验证
  if (
    !orderInfo.value.bookingTime ||
    !orderInfo.value.phone ||
    !orderInfo.value.address
  ) {
    uni.showToast({
      title: "请填写完整预约信息",
      icon: "none",
    });
    return;
  }

  if (!/^1\d{10}$/.test(orderInfo.value.phone)) {
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
    });
    return;
  }

  uni.showLoading({ title: "正在支付" });
  setTimeout(() => {
    uni.hideLoading();

    // 更新订单状态
    orderStore.confirmOrder(orderInfo.value.id);

    // 更新当前页面的订单信息
    orderInfo.value = {
      ...orderInfo.value,
      status: "confirmed",
    };

    // 更新本地存储
    uni.setStorageSync(
      `order_${orderInfo.value.id}`,
      JSON.stringify(orderInfo.value)
    );

    uni.showToast({
      title: "支付成功",
      icon: "success",
      success: () => {
        // 短暂延迟后返回上一页，确保 toast 显示完成
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      },
    });
  }, 1500);
};

// 联系教员
const handleContact = () => {
  uni.makePhoneCall({
    phoneNumber: orderInfo.value.teacherPhone,
    fail: () => {
      uni.showToast({
        title: "拨打电话失败",
        icon: "none",
      });
    },
  });
};

// 申请退款
const handleRefund = () => {
  uni.showModal({
    title: "申请退款",
    content: "确定要申请退款吗？",
    success: (res) => {
      if (res.confirm) {
        // 更新订单状态
        orderStore.refundOrder(orderInfo.value.id);

        // 更新当前页面的订单信息
        orderInfo.value = {
          ...orderInfo.value,
          status: "refunded",
        };

        // 更新本地存储
        uni.setStorageSync(
          `order_${orderInfo.value.id}`,
          JSON.stringify(orderInfo.value)
        );

        uni.showToast({
          title: "退款申请已提交",
          icon: "success",
          success: () => {
            // 短暂延迟后返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
      }
    },
  });
};

// 再次预约
const handleRebook = () => {
  uni.navigateTo({
    url: `/pages/teacher/teacher-detail?id=${orderInfo.value.id}`,
  });
};

// 评价
const handleComment = () => {
  uni.navigateTo({
    url: `/pages/orders/comment?orderId=${orderInfo.value.id}`,
    success: () => {
      // 更新评价状态
      orderInfo.value.hasComment = true;
      // 更新本地存储
      uni.setStorageSync(
        `order_${orderInfo.value.id}`,
        JSON.stringify(orderInfo.value)
      );
    },
  });
};

// 获取订单详情
const getOrderDetail = (orderId: string) => {
  // 先从本地存储获取
  const localOrder = uni.getStorageSync(`order_${orderId}`);
  if (localOrder) {
    orderInfo.value = JSON.parse(localOrder);
    return;
  }

  // 如果本地没有，从 store 获��
  const order = orderStore.getOrderById(orderId);
  if (order) {
    orderInfo.value = order;
    // 存入本地
    uni.setStorageSync(`order_${orderId}`, JSON.stringify(order));
  }
};

// 修改初始化逻辑
onLoad((options) => {
  generateDateList();
  generateTimeList();

  if (options?.id) {
    getOrderDetail(options.id);
    // 获取订单后，设置选择器的初始索引
    if (orderInfo.value.bookingTime) {
      const [date, time] = orderInfo.value.bookingTime.split(" ");
      dateIndex.value = dateList.value.findIndex((d) => d === date) || 0;
      timeIndex.value = timeList.value.findIndex((t) => t === time) || 0;
    }
  } else {
    // 新订单，使用默认时间
    const defaultDateTime = getDefaultDateTime();
    orderInfo.value.bookingTime = defaultDateTime;

    // 设置选择器的默认索引
    const [defaultDate, defaultTime] = defaultDateTime.split(" ");
    dateIndex.value =
      dateList.value.findIndex((date) => date === defaultDate) || 0;
    timeIndex.value =
      timeList.value.findIndex((time) => time === defaultTime) || 0;
  }

  // 确保选择器有有效索引
  if (dateIndex.value === -1) dateIndex.value = 0;
  if (timeIndex.value === -1) timeIndex.value = 0;
});

// 修改状态管理
const showUsePopup = ref(false);
const selectedService = ref<OrderService | null>(null);
const useCount = ref(1);

// 修改处理服务使用记录
const handleUseService = (service: OrderService) => {
  selectedService.value = service;
  useCount.value = 1;
  showUsePopup.value = true;
};

// 修改关闭弹窗
const closeUsePopup = () => {
  showUsePopup.value = false;
  selectedService.value = null;
  useCount.value = 1;
};

// 确认服务使用
const confirmUseService = () => {
  if (!selectedService.value) return;

  // 更新剩余次数
  selectedService.value.remainingQuantity -= useCount.value;

  // 检查是否所有服务都已使用完
  const allServicesUsed = orderInfo.value.services.every(
    (service) => service.remainingQuantity === 0
  );

  // 如果所有服务都已使用完，将订单状态改为已完成
  if (allServicesUsed) {
    orderInfo.value.status = "completed";
    orderStore.completeOrder(orderInfo.value.id);
  }

  // 更新本地存储
  uni.setStorageSync(
    `order_${orderInfo.value.id}`,
    JSON.stringify(orderInfo.value)
  );

  // 关闭弹窗并提示
  closeUsePopup();
  uni.showToast({
    title: allServicesUsed ? "所有课程已完成" : "记录成功",
    icon: "success",
  });

  // 如果所有服务都已使用完，延迟返回上一页
  if (allServicesUsed) {
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
};
</script>

<style scoped>
.order-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.status-section {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #ffffff;
  padding: 40rpx 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.status-text {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
  display: block;
}

.status-desc {
  font-size: 24rpx;
  opacity: 0.9;
}

.teacher-section {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.teacher-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  margin-right: 20rpx;
}

.teacher-info {
  flex: 1;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.teacher-title {
  font-size: 24rpx;
  color: #666;
}

.booking-info,
.order-info {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.value.price {
  color: #ff4d4f;
  font-weight: bold;
}

.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  padding: 20rpx;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.action-btn {
  min-width: 180rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  margin: 0;
}

.action-btn.primary {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
}

.action-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.service-details {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.service-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
}

.service-duration {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.remaining-count {
  font-size: 24rpx;
  color: #52c41a;
  font-weight: 500;
}

.service-price {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.price {
  font-size: 28rpx;
  color: #ff4d4f;
}

.quantity {
  font-size: 24rpx;
  color: #999;
}

.total-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  margin-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.picker {
  font-size: 28rpx;
  color: #333;
  text-align: right;
}

.picker-disabled {
  color: #999;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  cursor: not-allowed;
}

input {
  text-align: right;
  font-size: 28rpx;
  width: 400rpx;
}

.address-input {
  text-align: right;
  font-size: 28rpx;
  width: 400rpx;
}

.notes-item {
  flex-direction: column;
  align-items: flex-start;
  gap: 12rpx;
}

.notes-input {
  width: 100%;
  height: 120rpx;
  padding: 16rpx;
  font-size: 28rpx;
  color: #333;
  background: #f8f8f8;
  border-radius: 8rpx;
  box-sizing: border-box;
}

input:disabled,
textarea:disabled,
.picker:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.info-item input:disabled,
.info-item textarea:disabled {
  color: #999;
  background-color: #f5f5f5;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
}

.use-btn {
  font-size: 24rpx;
  color: #52c41a;
  border: 1rpx solid #52c41a;
  background: #fff;
  padding: 4rpx 12rpx;
  border-radius: 24rpx;
  margin-left: 12rpx;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  animation: modal-in 0.3s ease-out;
  position: relative;
}

@keyframes modal-in {
  from {
    transform: translateY(50rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-body {
  padding: 40rpx;
  text-align: center;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.service-name {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 40rpx;
}

.use-count {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40rpx;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.count-btn {
  width: 50rpx;
  height: 50rpx;
  line-height: 43rpx;
  text-align: center;
  margin: 0 3rpx;
  border: 2rpx solid #eee;
  border-radius: 40rpx;
  background: #fff;
  font-size: 36rpx;
  color: #333;
  padding: 0;
}

.count-btn:disabled {
  opacity: 0.5;
  background: #f5f5f5;
  color: #999;
}

.count {
  font-size: 40rpx;
  min-width: 80rpx;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.popup-actions {
  display: flex;
  gap: 20rpx;
}

.cancel-btn,
.confirm-btn {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  text-align: center;
  margin: 0;
}

.confirm-btn {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #fff;
  border: none;
}

.cancel-btn {
  background: #fff;
  color: #666;
  border: none;
}
</style>
