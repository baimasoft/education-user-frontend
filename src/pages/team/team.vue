<template>
  <view class="team-page">
    <!-- 团队数据概览 -->
    <view class="team-overview">
      <view class="overview-item">
        <text class="value">{{ teamInfo.memberCount }}</text>
        <text class="label">团队成员</text>
      </view>
      <view class="overview-item">
        <text class="value">¥{{ teamInfo.totalIncome }}</text>
        <text class="label">团队总收入</text>
      </view>
      <view class="overview-item">
        <text class="value">{{ teamInfo.orderCount }}</text>
        <text class="label">总订单数</text>
      </view>
    </view>

    <!-- 成员列表 -->
    <view class="member-list">
      <view class="section-title">团队成员</view>
      <template v-if="members.length > 0">
        <view v-for="member in members" :key="member.id" class="member-item">
          <image
            class="member-avatar"
            :src="member.avatar || '/static/images/default-teacher.png'"
            mode="aspectFill"
          />
          <view class="member-info">
            <view class="member-header">
              <text class="member-name">{{ member.name }}</text>
              <text class="member-role">{{ member.role }}</text>
            </view>
            <view class="member-stats">
              <text class="stat-item">接单：{{ member.orderCount }}</text>
              <text class="stat-item">收入：¥{{ member.income }}</text>
            </view>
            <view class="member-time">
              <text>加入时间：{{ member.joinTime }}</text>
            </view>
          </view>
        </view>
      </template>
      <view v-else class="empty-state">
        <image
          class="empty-icon"
          src="/static/images/default-teacher.png"
          mode="aspectFit"
        />
        <text class="empty-text">暂无团队成员</text>
        <text class="empty-subtext">快去邀请新成员加入吧</text>
      </view>
    </view>

    <!-- 邀请按钮 -->
    <!-- <button class="invite-btn" @tap="handleInvite">邀请新成员</button> -->
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";


interface TeamInfo {
  memberCount: number;
  totalIncome: number;
  orderCount: number;
}

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  role: string;
  orderCount: number;
  income: number;
  joinTime: string;
}

// 团队信息
const teamInfo = ref<TeamInfo>({
  memberCount: 0,
  totalIncome: 0,
  orderCount: 0,
});

// 成员列表
const members = ref<TeamMember[]>([
  {
    id: 0,
    name: "张三",
    avatar: "",
    role: "老师",
    orderCount: 0,
    income: 0,
    joinTime: "2024-01-01",
  },
  {
    id: 1,
    name: "李四",
    avatar: "",
    role: "老师",
    orderCount: 0,
    income: 0,
    joinTime: "2024-01-01",
  },
]);

// 处理邀请
// const handleInvite = () => {
//   uni.navigateTo({
//     url: "/pages/team/invite",
//   });
// };
</script>

<style scoped>
.team-page {
  min-height: 100vh;
  padding: 20rpx;
  background: #f5f5f5;
}

.team-overview {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.overview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.label {
  font-size: 24rpx;
  color: #999;
}

.member-list {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.member-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.member-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.member-info {
  flex: 1;
}

.member-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.member-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 12rpx;
}

.member-role {
  font-size: 24rpx;
  color: #007bff;
  background: rgba(0, 123, 255, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.member-stats {
  display: flex;
  gap: 20rpx;
  margin-bottom: 8rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #666;
}

.member-time {
  font-size: 24rpx;
  color: #999;
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
  font-size: 32rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.empty-subtext {
  font-size: 28rpx;
  color: #999;
}

.invite-btn {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background: #007bff;
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
}
</style>
