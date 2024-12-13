<template>
  <view v-if="visible" class="modal-overlay" @tap="handleClose">
    <view class="modal-content" @tap.stop>
      <view class="close-button" @tap="handleClose">×</view>
      <view class="modal-scroll-content">
        <view class="coach-profile">
          <image
            :src="coach?.avatar || '/static/images/default-teacher.png'"
            mode="aspectFill"
            class="coach-avatar"
          />
          <view class="profile-info">
            <text class="coach-name">{{ coach?.name }}</text>
            <!-- <text class="rating">{{ coach?.rating }}分</text> -->
            <text>{{ coach?.rating }}分</text>
          </view>
        </view>

        <view class="service-list">
          <view
            v-for="service in coach?.services"
            :key="service.id"
            class="service-item"
          >
            <view class="service-info">
              <text class="service-name">{{ service.name }}</text>
              <text class="service-duration">{{ service.duration }}</text>
            </view>
            <view class="price-section">
              <view class="price">
                <text class="currency">¥</text>
                <text class="amount">{{ service.price.toFixed(2) }}</text>
              </view>
              <view class="quantity-control">
                <button
                  class="quantity-btn"
                  :disabled="!getServiceQuantity(service.id)"
                  @tap="handleDecrement(service.id)"
                >
                  −
                </button>
                <text class="quantity">{{
                  getServiceQuantity(service.id)
                }}</text>
                <button class="quantity-btn" @tap="handleIncrement(service.id)">
                  +
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-bar">
        <view class="total">
          合计 <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
        </view>
        <button class="book-button" @tap="handleSubmit">确认预约</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useOrderStore, type OrderService } from "@/stores/order";

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
}

interface Coach {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  services?: Service[];
}

const props = defineProps<{
  visible: boolean;
  coach: Coach | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit"): void;
}>();

const selectedServices = ref<OrderService[]>([]);

const totalPrice = computed(() => {
  return selectedServices.value.reduce((sum, service) => {
    return sum + service.price * service.quantity;
  }, 0);
});

const orderStore = useOrderStore();

const handleClose = () => {
  emit("update:visible", false);
  selectedServices.value = [];
};

const handleDecrement = (serviceId: number) => {
  const index = selectedServices.value.findIndex(
    (item) => item.id === serviceId
  );
  if (index > -1) {
    if (selectedServices.value[index].quantity > 1) {
      selectedServices.value[index].quantity--;
      selectedServices.value[index].remainingQuantity =
        selectedServices.value[index].quantity;
    } else {
      selectedServices.value.splice(index, 1);
    }
  }
};

const handleIncrement = (serviceId: number) => {
  const service = props.coach?.services?.find((s) => s.id === serviceId);
  if (!service) return;

  const index = selectedServices.value.findIndex(
    (item: any) => item.id === serviceId
  );
  if (index > -1) {
    selectedServices.value[index].quantity++;
    selectedServices.value[index].remainingQuantity =
      selectedServices.value[index].quantity;
  } else {
    selectedServices.value.push({
      id: service.id,
      name: service.name,
      duration: service.duration,
      price: service.price,
      quantity: 1,
      remainingQuantity: 1,
    });
  }
};

const handleSubmit = () => {
  if (selectedServices.value.length === 0) {
    uni.showToast({
      title: "请选择预约课程",
      icon: "none",
    });
    return;
  }

  // 创建订单
  const order = orderStore.createOrder({
    teacherName: props.coach?.name,
    teacherAvatar: props.coach?.avatar,
    teacherTitle: "上门授课",
    amount: totalPrice.value,
    services: selectedServices.value,
    teacherId: props.coach?.id || 0,
    teacherPhone: props.coach?.phone || "",
  });

  // 先关闭弹窗
  handleClose();

  // 发出提交事件
  emit("submit");

  // 跳转到订单详情页
  uni.navigateTo({
    url: `/pages/orders/order-detail?id=${order.id}`,
    // success: () => {
    //   uni.showToast({
    //     title: "预约成功",
    //     icon: "success",
    //   });
    // },
  });
};

// 获取服务数量的辅助函数
const getServiceQuantity = (serviceId: number) => {
  const service = selectedServices.value.find((item) => item.id === serviceId);
  return service?.quantity || 0;
};
</script>

<style scoped>
/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.modal-content {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 50vh;
  max-height: 80vh;
  overflow-y: auto;
  background: #ffffff;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.modal-scroll-content {
  padding: 40rpx;
  overflow-y: auto;
}

.close-button {
  display: block;
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  background: none;
  border: none;
  font-size: 48rpx;
  color: #666;
  padding: 20rpx;
  line-height: 1;
}

.coach-profile {
  display: flex;
  align-items: center;
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.coach-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
}

.service-list {
  border-top: 16rpx solid #f5f5f5;
  margin-bottom: 40rpx;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.service-duration {
  font-size: 24rpx;
  color: #666;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.quantity-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 24rpx;
  border: 2rpx solid #ff4d4f;
  background: #ffffff;
  color: #ff4d4f;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.quantity-btn:disabled {
  border-color: #ccc;
  color: #ccc;
}

.quantity {
  font-size: 32rpx;
  min-width: 40rpx;
  text-align: center;
}

.bottom-bar {
  flex-shrink: 0;
  padding: 20rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2rpx solid #f0f0f0;
}

.total {
  font-size: 28rpx;
}

.total-price {
  color: #ff4d4f;
  font-size: 36rpx;
  font-weight: bold;
}
.price {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 24rpx;
  color: #ff4d4f;
}

.amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
}
.book-button {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  font-size: 24rpx;
  padding: 15rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  line-height: 24rpx;
  margin-right: 0;
}
.coach-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 10rpx;
}
</style>
