<template>
  <view class="home">
    <!-- 头部 -->
    <view class="header">
      <text class="title">用户中心</text>
      <view class="header-icons">
        <text class="icon">⋯</text>
        <text class="icon">⊙</text>
      </view>
    </view>

    <!-- 位置搜索 -->
    <view class="location-search">
      <view class="location">
        <text class="location-icon">📍</text>
        <text class="city">广州市</text>
        <text class="dropdown-icon">▼</text>
      </view>
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input type="text" placeholder="输入关键词搜索" />
      </view>
    </view>

    <!-- 功能卡片 -->
    <view class="feature-grid">
      <view class="feature-item" v-for="(feature, index) in features" :key="index">
        <text class="feature-icon">{{ feature.icon }}</text>
        <text class="feature-text">{{ feature.text }}</text>
      </view>
    </view>

    <!-- 推荐门店 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐门店</text>
        <text class="more">更多 ></text>
      </view>
      <scroll-view class="store-list" scroll-x>
        <view class="store-card" v-for="(store, index) in stores" :key="index">
          <image class="store-image" :src="store.image" mode="aspectFill"></image>
          <text class="store-name">{{ store.name }}</text>
          <text class="store-distance">{{ store.distance }}km</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const features = ref([
  { icon: '🎵', text: '音乐课程' },
  { icon: '🎸', text: '乐器租赁' },
  { icon: '🎼', text: '乐谱购买' },
  { icon: '🎹', text: '琴房预约' },
  { icon: '👥', text: '教练预约' },
  { icon: '🏪', text: '门店查询' },
  { icon: '📋', text: '我的订单' },
  { icon: '👤', text: '个人中心' }
])

const stores = ref([
  {
    name: '天河音乐中心',
    distance: '0.8',
    image: '/static/store1.jpg'
  },
  {
    name: '海珠区音乐教室',
    distance: '1.2',
    image: '/static/store2.jpg'
  },
  {
    name: '越秀区琴行',
    distance: '2.5',
    image: '/static/store3.jpg'
  }
])
</script>

<style>
.home {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #ffffff;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.header-icons {
  display: flex;
  gap: 30rpx;
}

.icon {
  font-size: 40rpx;
  color: #666;
}

.location-search {
  background: #ffffff;
  padding: 20rpx 30rpx;
}

.location {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.location-icon {
  font-size: 32rpx;
}

.city {
  font-size: 28rpx;
}

.dropdown-icon {
  font-size: 24rpx;
  color: #999;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 15rpx 30rpx;
}

.search-icon {
  margin-right: 20rpx;
  color: #999;
}

.search-bar input {
  flex: 1;
  font-size: 28rpx;
}

.feature-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 30rpx;
  background: #ffffff;
  margin-top: 20rpx;
}

.feature-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.feature-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.feature-text {
  font-size: 24rpx;
  color: #333;
}

.section {
  margin-top: 20rpx;
  background: #ffffff;
  padding: 30rpx;
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
}

.more {
  font-size: 24rpx;
  color: #999;
}

.store-list {
  white-space: nowrap;
}

.store-card {
  display: inline-block;
  width: 280rpx;
  margin-right: 20rpx;
}

.store-image {
  width: 100%;
  height: 180rpx;
  border-radius: 12rpx;
}

.store-name {
  font-size: 28rpx;
  margin: 10rpx 0;
  display: block;
}

.store-distance {
  font-size: 24rpx;
  color: #999;
}
</style>
