<template>
  <view class="commission-page">
    <!-- 收入总览 -->
    <view class="income-overview">
      <view class="total-amount">
        <text class="label">总收入</text>
        <view class="amount">
          <text class="currency">¥</text>
          <text class="value">{{ incomeInfo.totalAmount }}</text>
        </view>
      </view>
      <view class="amount-details">
        <view class="detail-item">
          <text class="label">本月收入</text>
          <text class="value">¥{{ incomeInfo.monthlyAmount }}</text>
        </view>
        <view class="detail-item">
          <text class="label">待结算</text>
          <text class="value">¥{{ incomeInfo.pendingAmount }}</text>
        </view>
      </view>
    </view>

    <!-- 收入记录 -->
    <view class="income-records">
      <view class="section-header">
        <text class="section-title">收入明细</text>
        <view class="filter-tabs">
          <text
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab-item', { active: currentTab === tab.value }]"
            @tap="currentTab = tab.value"
          >
            {{ tab.label }}
          </text>
        </view>
      </view>

      <template v-if="records.length > 0">
        <view
          v-for="record in filteredRecords"
          :key="record.id"
          class="record-item"
        >
          <view class="record-info">
            <view class="record-main">
              <text class="record-type">{{ record.type }}</text>
              <text class="record-time">{{ record.time }}</text>
            </view>
            <view class="record-desc">{{ record.description }}</view>
            <view class="record-status" :class="record.status">
              {{ record.statusText }}
            </view>
          </view>
          <view class="record-amount"> +¥{{ record.amount }} </view>
        </view>
      </template>
      <view v-else class="empty-state">
        <image
          class="empty-icon"
          src="/static/images/default-instrument.png"
          mode="aspectFit"
        />
        <text class="empty-text">暂无收入记录</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <button class="withdraw-btn" @tap="handleWithdraw">去提现</button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface IncomeInfo {
  totalAmount: number;
  monthlyAmount: number;
  pendingAmount: number;
}

interface IncomeRecord {
  id: number;
  type: string;
  time: string;
  description: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  statusText: string;
}

// 收入信息
const incomeInfo = ref<IncomeInfo>({
  totalAmount: 0.0,
  monthlyAmount: 0.0,
  pendingAmount: 0.0,
});

// 标签页
const tabs = [
  { label: "全部", value: "all" },
  { label: "已结算", value: "completed" },
  { label: "待结算", value: "pending" },
];

const currentTab = ref("all");

// 收入记录
const records = ref<IncomeRecord[]>([
  {
    id: 0,
    type: "上门服务",
    time: "2024-01-01",
    description: "教员收入",
    amount: 100,
    status: "pending",
    statusText: "待结算",
  },
  {
    id: 1,
    type: "上门服务",
    time: "2024-01-02",
    description: "教员收入",
    amount: 100,
    status: "completed",
    statusText: "已结算",
  },
]);

// 根据标签筛选记录
const filteredRecords = computed(() => {
  if (currentTab.value === "all") return records.value;
  return records.value.filter((record) => record.status === currentTab.value);
});

// 处理提现
const handleWithdraw = () => {
  uni.navigateTo({
    url: "/pages/income/withdraw",
  });
};
</script>

<style scoped>
.commission-page {
  min-height: 100vh;
  padding: 20rpx;
  background: #f5f5f5;
}

.income-overview {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  border-radius: 12rpx;
  padding: 30rpx;
  color: #ffffff;
  margin-bottom: 20rpx;
}

.total-amount {
  text-align: center;
  margin-bottom: 30rpx;
}

.total-amount .label {
  font-size: 28rpx;
  opacity: 0.9;
}

.amount {
  margin-top: 10rpx;
}

.currency {
  font-size: 36rpx;
}

.amount .value {
  font-size: 60rpx;
  font-weight: bold;
}

.amount-details {
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
  padding-top: 20rpx;
}

.detail-item {
  text-align: center;
}

.detail-item .label {
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 8rpx;
}

.detail-item .value {
  font-size: 32rpx;
  font-weight: bold;
}

.income-records {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 120rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.filter-tabs {
  display: flex;
  gap: 20rpx;
}

.tab-item {
  font-size: 28rpx;
  color: #666;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.tab-item.active {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.record-info {
  flex: 1;
}

.record-main {
  margin-bottom: 8rpx;
}

.record-type {
  font-size: 32rpx;
  color: #333;
  margin-right: 12rpx;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.record-status {
  font-size: 24rpx;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
  width: fit-content;
}

.record-status.pending {
  color: #faad14;
  background: rgba(250, 173, 20, 0.1);
}

.record-status.completed {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.record-status.failed {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.record-amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
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

.withdraw-btn {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background: #ff4d4f;
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
}
</style>
