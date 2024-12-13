<template>
  <view class="voucher-page">
    <!-- 顶部标签页 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @tap="currentTab = tab.value"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 优惠券列表 -->
    <view class="voucher-list" v-if="filteredVouchers.length > 0">
      <view
        v-for="voucher in filteredVouchers"
        :key="voucher.id"
        class="voucher-item"
        :class="{ disabled: voucher.status === 'used' || voucher.status === 'expired' }"
      >
        <view class="voucher-left">
          <view class="amount">
            <text class="currency">¥</text>
            <text class="value">{{ voucher.amount }}</text>
          </view>
          <text class="condition">满{{ voucher.minAmount }}元可用</text>
        </view>
        <view class="voucher-right">
          <view class="voucher-info">
            <text class="title">{{ voucher.title }}</text>
            <text class="desc">{{ voucher.description }}</text>
            <text class="time">{{ voucher.validTime }}</text>
          </view>
          <view class="status-tag" :class="voucher.status">
            {{ statusText[voucher.status] }}
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <image
        class="empty-icon"
        src="/static/images/default-course.png"
        mode="aspectFit"
      />
      <text class="empty-text">暂无{{ statusText[currentTab] }}优惠券</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Voucher {
  id: number;
  title: string;
  description: string;
  amount: number;
  minAmount: number;
  validTime: string;
  status: 'unused' | 'used' | 'expired';
}

// 标签页配置
const tabs = [
  { label: '未使用', value: 'unused' },
  { label: '已使用', value: 'used' },
  { label: '已过期', value: 'expired' }
];

const statusText = {
  unused: '未使用',
  used: '已使用',
  expired: '已过期'
};

// 当前选中的标签
const currentTab = ref('unused');

// 优惠券列表
const vouchers = ref<Voucher[]>([
  {
    id: 1,
    title: '新人专享券',
    description: '仅限首次预约使用',
    amount: 50,
    minAmount: 100,
    validTime: '2024-12-31前有效',
    status: 'unused'
  },
  {
    id: 2,
    title: '课程优惠券',
    description: '限定课程可用',
    amount: 100,
    minAmount: 500,
    validTime: '2024-06-30前有效',
    status: 'used'
  }
]);

// 根据标签筛选优惠券
const filteredVouchers = computed(() => {
  return vouchers.value.filter(voucher => voucher.status === currentTab.value);
});
</script>

<style scoped>
.voucher-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20rpx;
}

.tab-bar {
  display: flex;
  background: #ffffff;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 16rpx 0;
  position: relative;
}

.tab-item.active {
  color: #ff4d4f;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #ff4d4f;
  border-radius: 2rpx;
}

.voucher-list {
  padding: 0 20rpx;
}

.voucher-item {
  display: flex;
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  position: relative;
  overflow: hidden;
}

.voucher-item::before {
  content: '';
  position: absolute;
  left: -10rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 20rpx;
  height: 20rpx;
  background: #f5f5f5;
  border-radius: 50%;
}

.voucher-item::after {
  content: '';
  position: absolute;
  right: -10rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 20rpx;
  height: 20rpx;
  background: #f5f5f5;
  border-radius: 50%;
}

.voucher-left {
  width: 200rpx;
  background: #ff4d4f;
  color: #ffffff;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.amount {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 32rpx;
}

.value {
  font-size: 60rpx;
  font-weight: bold;
}

.condition {
  font-size: 24rpx;
  margin-top: 8rpx;
}

.voucher-right {
  flex: 1;
  padding: 20rpx;
  position: relative;
}

.voucher-info {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.status-tag {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.status-tag.unused {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.status-tag.used {
  color: #999;
  background: rgba(153, 153, 153, 0.1);
}

.status-tag.expired {
  color: #999;
  background: rgba(153, 153, 153, 0.1);
}

.voucher-item.disabled {
  opacity: 0.6;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style> 