<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image 
          class="avatar" 
          :src="userInfo.avatar || '/static/default-avatar.png'"
          mode="aspectFill"
        />
        <view class="user-details">
          <view class="name-row">
            <text class="username">{{ userInfo.nickname || '未登录' }}</text>
            <text class="user-level">Lv.{{ userInfo.level }}</text>
          </view>
          <view class="user-id">ID: {{ userInfo.id }}</view>
        </view>
      </view>
      <view class="edit-profile" @tap="handleEditProfile">
        <text>编辑资料</text>
        <text class="arrow">></text>
      </view>
    </view>

    <!-- 用户数据概览 -->
    <view class="user-stats">
      <view class="stat-item" v-for="stat in stats" :key="stat.label">
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="feature-groups">
      <view class="feature-group" v-for="group in featureGroups" :key="group.title">
        <view class="group-title">{{ group.title }}</view>
        <view class="feature-list">
          <view 
            class="feature-item"
            v-for="feature in group.features"
            :key="feature.id"
            @tap="handleFeatureClick(feature)"
          >
            <view class="feature-icon">{{ feature.icon }}</view>
            <text class="feature-name">{{ feature.name }}</text>
            <view class="feature-right">
              <text v-if="feature.badge" class="badge">{{ feature.badge }}</text>
              <text class="arrow">></text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <button class="logout-button" @tap="handleLogout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface UserInfo {
  id: string
  nickname: string
  avatar?: string
  level: number
}

interface Stat {
  label: string
  value: number | string
}

interface Feature {
  id: number
  name: string
  icon: string
  badge?: string
  action: string
}

interface FeatureGroup {
  title: string
  features: Feature[]
}

const userInfo = ref<UserInfo>({
  id: '88888888',
  nickname: '音乐爱好者',
  level: 3
})

const stats: Stat[] = [
  { label: '优惠券', value: 8 },
  { label: '收藏', value: 12 },
  { label: '积分', value: 1280 }
]

const featureGroups: FeatureGroup[] = [
  {
    title: '我的服务',
    features: [
      { id: 1, name: '我的预约', icon: '📅', badge: '2', action: 'appointments' },
      { id: 2, name: '我的收藏', icon: '❤️', action: 'favorites' },
      { id: 3, name: '历史记录', icon: '⏱️', action: 'history' }
    ]
  },
  {
    title: '其他服务',
    features: [
      { id: 4, name: '帮助中心', icon: '❓', action: 'help' },
      { id: 5, name: '联系客服', icon: '💬', action: 'contact' },
      { id: 6, name: '设置', icon: '⚙️', action: 'settings' }
    ]
  }
]

const handleEditProfile = () => {
  uni.showToast({
    title: '编辑资料',
    icon: 'none'
  })
}

const handleFeatureClick = (feature: Feature) => {
  uni.showToast({
    title: `点击了${feature.name}`,
    icon: 'none'
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 处理退出登录逻辑
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.user-card {
  background: #ffffff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 30rpx;
}

.user-details {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 10rpx;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
}

.user-level {
  font-size: 24rpx;
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.user-id {
  font-size: 24rpx;
  color: #999;
}

.edit-profile {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 28rpx;
  color: #666;
}

.arrow {
  margin-left: 10rpx;
  color: #999;
}

.user-stats {
  background: #ffffff;
  display: flex;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2rpx;
  height: 40%;
  background: #f0f0f0;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.feature-groups {
  margin-bottom: 40rpx;
}

.feature-group {
  background: #ffffff;
  margin-bottom: 20rpx;
}

.group-title {
  font-size: 28rpx;
  color: #999;
  padding: 20rpx 30rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.feature-name {
  flex: 1;
  font-size: 28rpx;
}

.feature-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.badge {
  background: #ff4d4f;
  color: #ffffff;
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
}

.logout-button {
  width: 90%;
  margin: 0 auto;
  background: #ffffff;
  color: #ff4d4f;
  font-size: 32rpx;
  padding: 20rpx 0;
  border-radius: 44rpx;
  border: none;
}

.logout-button:active {
  opacity: 0.8;
}
</style>
