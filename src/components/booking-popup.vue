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
                  :disabled="!quantities[service.id]"
                  @tap="handleDecrement(service.id)"
                >
                  −
                </button>
                <text class="quantity">{{ quantities[service.id] || 0 }}</text>
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

const quantities = ref<{ [key: number]: number }>({});

const totalPrice = computed(() => {
  if (!props.coach?.services) return 0;
  return props.coach.services.reduce((sum, service) => {
    return sum + service.price * (quantities.value[service.id] || 0);
  }, 0);
});

const handleClose = () => {
  emit("update:visible", false);
  quantities.value = {};
};

const handleDecrement = (serviceId: number) => {
  if (quantities.value[serviceId] > 0) {
    quantities.value[serviceId]--;
  }
};

const handleIncrement = (serviceId: number) => {
  quantities.value[serviceId] = (quantities.value[serviceId] || 0) + 1;
};

const handleSubmit = () => {
  emit("submit");
  handleClose();
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
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  line-height: 1.5;
  margin-right: 0;
}
.coach-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 10rpx;
}
</style>
