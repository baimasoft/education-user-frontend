<template>
  <view class="invite-page">
    <!-- 邀请卡片 -->
    <view class="invite-card">
      <!-- <image
        class="invite-bg"
        src="/static/images/invite-bg.png"
        mode="aspectFill"
      /> -->
      <view class="card-content">
        <view class="reward-info">
          <text class="reward-title">邀请好友</text>
          <text class="reward-desc">邀请好友注册使用，双方都可获得奖励</text>
        </view>
        <view class="invite-code">
          <text class="code-label">我的邀请码</text>
          <view class="code-value">
            <text>{{ inviteCode }}</text>
            <text class="copy-btn" @tap="handleCopy">复制</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 邀请规则 -->
    <view class="rules-section">
      <view class="section-title">活动规则</view>
      <view class="rules-list">
        <view class="rule-item">
          <text class="dot">1.</text>
          <text class="text">邀请新用户注册并完成实名认证</text>
        </view>
        <view class="rule-item">
          <text class="dot">2.</text>
          <text class="text">新用户首次下单完成支付</text>
        </view>
        <view class="rule-item">
          <text class="dot">3.</text>
          <text class="text">双方各获得50元课程抵用券</text>
        </view>
        <view class="rule-item">
          <text class="dot">4.</text>
          <text class="text">抵用券可用于任意课程支付</text>
        </view>
      </view>
    </view>

    <!-- 邀请记录 -->
    <view class="records-section">
      <view class="section-title">
        <text>邀请记录</text>
        <text class="total-count">共{{ inviteRecords.length }}人</text>
      </view>
      <view class="records-list" v-if="inviteRecords.length > 0">
        <view
          class="record-item"
          v-for="record in inviteRecords"
          :key="record.id"
        >
          <view class="user-info">
            <image
              class="avatar"
              :src="record.avatar || '/static/icons/default-login-avatar.png'"
              mode="aspectFill"
            />
            <view class="info">
              <text class="nickname">{{ record.nickname }}</text>
              <text class="time">{{ record.time }}</text>
            </view>
          </view>
          <view class="status" :class="record.status">
            {{ record.status === "completed" ? "已完成" : "进行中" }}
          </view>
        </view>
      </view>
      <view class="empty-state" v-else>
        <image
          class="empty-icon"
          src="/static/images/empty-invite.png"
          mode="aspectFit"
        />
        <text>暂无邀请记录</text>
      </view>
    </view>

    <!-- 分享按钮组 -->
    <view class="share-buttons">
      <button class="share-btn" open-type="share">
        <text class="share-icon"> 🎁 </text>
        立即邀请
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const inviteCode = ref("");

interface InviteRecord {
  id: string;
  nickname: string;
  avatar: string;
  time: string;
  status: "pending" | "completed";
}

// 模拟邀请记录数据
const inviteRecords = ref<InviteRecord[]>([
  {
    id: "1",
    nickname: "用户A",
    avatar: "",
    time: "2024-01-20 14:30",
    status: "completed",
  },
  {
    id: "2",
    nickname: "用户B",
    avatar: "",
    time: "2024-01-19 15:20",
    status: "pending",
  },
]);

// 生成邀请码
const generateInviteCode = () => {
  // 这里可以调用后端接口获取邀请码
  // 临时模拟一个6位数字邀请码
  inviteCode.value = Math.random().toString().slice(2, 8);
};

// 复制邀请码
const handleCopy = () => {
  uni.setClipboardData({
    data: inviteCode.value,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
  });
};

onMounted(() => {
  generateInviteCode();
});
</script>

<style scoped>
.invite-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.invite-card {
  position: relative;
  height: 320rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  background: linear-gradient(to right, #ff4d4f, #ff7875);
}

.invite-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 40rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #ffffff;
}

.reward-info {
  display: flex;
  flex-direction: column;
}

.reward-title {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.reward-desc {
  font-size: 28rpx;
  opacity: 0.9;
}

.rules-section,
.records-section {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.total-count {
  font-size: 24rpx;
  color: #999;
  font-weight: normal;
}

.rules-list {
  padding: 10rpx 0;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.dot {
  color: #ff4d4f;
  margin-right: 10rpx;
}

.text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.records-list {
  margin-top: 20rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.status.completed {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status.pending {
  color: #faad14;
  background: rgba(250, 173, 20, 0.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-state text {
  font-size: 28rpx;
  color: #999;
}

.share-buttons {
  position: fixed;
  bottom: 40rpx;
  left: 40rpx;
  right: 40rpx;
}

.share-btn {
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon {
  font-size: 36rpx;
  margin-right: 8rpx;
}

.invite-code {
  background: rgba(255, 255, 255, 0.1);
  padding: 16rpx 24rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.code-label {
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 8rpx;
}

.code-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 36rpx;
  font-weight: bold;
}

.copy-btn {
  font-size: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  cursor: pointer;
}
</style>
