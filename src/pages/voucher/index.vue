<template>
  <view class="voucher">
    <view class="empty-state" v-if="!vouchers.length">
      <text>暂无可用优惠券</text>
    </view>
    <view class="voucher-list" v-else>
      <view 
        class="voucher-item"
        v-for="(voucher, index) in vouchers" 
        :key="index"
        @tap="handleVoucherClick(voucher)"
      >
        <view class="voucher-left">
          <text class="voucher-amount">¥{{ voucher.amount }}</text>
          <text class="voucher-condition">满{{ voucher.condition }}可用</text>
        </view>
        <view class="voucher-right">
          <text class="voucher-name">{{ voucher.name }}</text>
          <text class="voucher-date">有效期至：{{ voucher.expireDate }}</text>
          <text class="voucher-btn">立即领取</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Voucher {
  id: string;
  name: string;
  amount: number;
  condition: number;
  expireDate: string;
}

const vouchers = ref<Voucher[]>([
  {
    id: '1',
    name: '新人专享券',
    amount: 50,
    condition: 200,
    expireDate: '2024-12-31'
  },
  {
    id: '2',
    name: '课程优惠券',
    amount: 100,
    condition: 500,
    expireDate: '2024-12-31'
  }
]);

const handleVoucherClick = (voucher: Voucher) => {
  uni.showToast({
    title: '领取成功',
    icon: 'success'
  });
};
</script>

<style scoped>
.voucher {
  min-height: 100vh;
  background: #ffffff;
  padding: 20rpx;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: #999;
}

.voucher-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.voucher-item {
  display: flex;
  height: 180rpx;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.voucher-left {
  width: 240rpx;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
}

.voucher-amount {
  font-size: 48rpx;
  font-weight: bold;
}

.voucher-condition {
  font-size: 24rpx;
  margin-top: 10rpx;
}

.voucher-right {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.voucher-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.voucher-date {
  font-size: 24rpx;
  color: #999;
}

.voucher-btn {
  align-self: flex-end;
  padding: 10rpx 30rpx;
  background: #ff4d4f;
  color: #ffffff;
  border-radius: 30rpx;
  font-size: 24rpx;
}
</style>
