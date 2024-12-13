<template>
  <view class="withdraw-page">
    <!-- 提现金额输入 -->
    <view class="amount-section">
      <view class="available-amount">
        <text class="label">可提现金额</text>
        <view class="amount">
          <text class="currency">¥</text>
          <text class="value">{{ availableAmount }}</text>
        </view>
      </view>
      <view class="input-amount">
        <text class="label">提现金额</text>
        <view class="amount-input">
          <text class="currency">¥</text>
          <input
            type="digit"
            v-model="withdrawAmount"
            placeholder="请输入提现金额"
            :maxlength="10"
          />
          <text class="all-amount" @tap="setMaxAmount">全部提现</text>
        </view>
      </view>
    </view>

    <!-- 提现方式选择 -->
    <view class="withdraw-methods">
      <view class="section-title">提现方式</view>
      <radio-group @change="onMethodChange">
        <label
          v-for="method in withdrawMethods"
          :key="method.id"
          class="method-item"
        >
          <radio
            :value="method.id.toString()"
            :checked="selectedMethod === method.id"
            color="#ff4d4f"
          />
          <image class="method-icon" :src="method.icon" mode="aspectFit" />
          <view class="method-info">
            <text class="method-name">{{ method.name }}</text>
            <text class="method-desc">{{ method.description }}</text>
          </view>
        </label>
      </radio-group>
    </view>

    <!-- 提现说明 -->
    <view class="withdraw-notice">
      <view class="notice-title">提现说明</view>
      <view class="notice-items">
        <text class="notice-item">1. 单笔提现金额不得低于1元</text>
        <text class="notice-item">2. 提现申请将在1-3个工作日内处理</text>
        <text class="notice-item">3. 如有疑问请联系客服</text>
      </view>
    </view>

    <!-- 提现按钮 -->
    <button
      class="withdraw-btn"
      :disabled="!canWithdraw"
      :class="{ disabled: !canWithdraw }"
      @tap="handleWithdraw"
    >
      确认提现
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 可提现金额
const availableAmount = ref(4.0);
// 提现金额
const withdrawAmount = ref("");
// 选中的提现方式
const selectedMethod = ref(1);

// 提现方式列表
const withdrawMethods = [
  {
    id: 1,
    name: "微信零钱",
    description: "实时到账",
    icon: "/static/icons/wechat-pay.png",
  },
  {
    id: 2,
    name: "支付宝",
    description: "1-3个工作日到账",
    icon: "/static/icons/alipay.png",
  },
  {
    id: 3,
    name: "银行卡",
    description: "1-3个工作日到账",
    icon: "/static/icons/bank-card.png",
  },
];

// 是否可以提现
const canWithdraw = computed(() => {
  const amount = Number(withdrawAmount.value);
  return amount >= 1 && amount <= availableAmount.value && selectedMethod.value;
});

// 设置最大提现金额
const setMaxAmount = () => {
  withdrawAmount.value = availableAmount.value.toString();
};

// 提现方式改变
const onMethodChange = (e: any) => {
  selectedMethod.value = Number(e.detail.value);
};

// 处理提现
const handleWithdraw = () => {
  if (!canWithdraw.value) return;

  uni.showModal({
    title: "确认提现",
    content: `确认提现 ¥${withdrawAmount.value} 到已选账户？`,
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: "提现中" });
        setTimeout(() => {
          uni.showToast({
            title: "提现申请已提交",
            icon: "success",
          });
          setTimeout(() => {
            uni.hideLoading();
            uni.navigateBack();
          }, 1500);
        }, 1500);
      }
    },
  });
};
</script>

<style scoped>
.withdraw-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.amount-section {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.available-amount {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.amount {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 32rpx;
  color: #333;
  margin-right: 8rpx;
}

.value {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.input-amount {
  position: relative;
}

.amount-input {
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #eee;
  padding: 20rpx 0;
}

.amount-input input {
  flex: 1;
  font-size: 40rpx;
  margin-left: 10rpx;
}

.all-amount {
  font-size: 28rpx;
  color: #ff4d4f;
  padding: 4rpx 12rpx;
}

.withdraw-methods {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.method-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.method-item:last-child {
  border-bottom: none;
}

.method-icon {
  width: 60rpx;
  height: 60rpx;
  margin: 0 20rpx;
}

.method-info {
  flex: 1;
}

.method-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 4rpx;
  display: block;
}

.method-desc {
  font-size: 24rpx;
  color: #999;
}

.withdraw-notice {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 120rpx;
}

.notice-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.notice-items {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.notice-item {
  font-size: 24rpx;
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

.withdraw-btn.disabled {
  background: #cccccc;
}
</style>
