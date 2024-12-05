<template>
  <view class="nearby-page">
    <!-- 头部搜索区域 -->
    <view class="search-header">
      <view class="location">
        <text class="location-icon">📍</text>
        <text class="location-text">广州市</text>
        <text class="location-arrow">▼</text>
      </view>
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          type="text" 
          placeholder="搜索门店" 
          v-model="searchText"
          @input="handleSearch"
        />
      </view>
    </view>

    <!-- 地图区域 -->
    <view class="map-container">
      <map
        class="map"
        :latitude="23.099994"
        :longitude="113.324520"
        :markers="markers"
        :scale="14"
        show-location
      ></map>
    </view>

    <!-- 门店列表 -->
    <view class="store-list">
      <view 
        v-for="store in stores" 
        :key="store.id" 
        class="store-item"
        @tap="handleStoreSelect(store)"
      >
        <image 
          class="store-image" 
          :src="store.image || '/static/default-store.png'" 
          mode="aspectFill"
        />
        <view class="store-info">
          <view class="store-header">
            <text class="store-name">{{ store.name }}</text>
            <text class="distance">{{ store.distance }}km</text>
          </view>
          <view class="store-address">
            <text class="address-icon">📍</text>
            <text>{{ store.address }}</text>
          </view>
          <view class="store-features">
            <text 
              v-for="(feature, index) in store.features" 
              :key="index" 
              class="feature-tag"
            >{{ feature }}</text>
          </view>
          <view class="store-footer">
            <view class="rating">
              <text class="star">⭐</text>
              <text>{{ store.rating }}</text>
            </view>
            <text class="order-count">已接单 {{ store.orderCount }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Store {
  id: number
  name: string
  distance: number
  address: string
  features: string[]
  rating: string
  orderCount: number
  image?: string
  latitude: number
  longitude: number
}

const searchText = ref('')
const stores = ref<Store[]>([
  {
    id: 1,
    name: '音乐空间(天河店)',
    distance: 0.8,
    address: '天河路123号音乐大厦3楼',
    features: ['免费WiFi', '停车场', '休息区'],
    rating: '4.9',
    orderCount: 2890,
    latitude: 23.099994,
    longitude: 113.324520
  },
  {
    id: 2,
    name: '乐器中心(珠江新城店)',
    distance: 1.2,
    address: '珠江新城华夏路456号',
    features: ['免费WiFi', '器材租赁', '休息区'],
    rating: '4.8',
    orderCount: 1560,
    latitude: 23.119994,
    longitude: 113.321520
  }
])

const markers = computed(() => {
  return stores.value.map(store => ({
    id: store.id,
    latitude: store.latitude,
    longitude: store.longitude,
    title: store.name,
    iconPath: '/static/marker.png', // 需要添加地图标记图标
    width: 32,
    height: 32
  }))
})

const handleSearch = () => {
  // TODO: 实现搜索逻辑
}

const handleStoreSelect = (store: Store) => {
  // TODO: 处理门店选择
  uni.showToast({
    title: `已选择${store.name}`,
    icon: 'success'
  })
}
</script>

<style>
.nearby-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-header {
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

.location-text {
  font-size: 28rpx;
  font-weight: bold;
}

.location-arrow {
  font-size: 24rpx;
  color: #999;
}

.search-box {
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

.search-box input {
  flex: 1;
  font-size: 28rpx;
}

.map-container {
  width: 100%;
  height: 400rpx;
}

.map {
  width: 100%;
  height: 100%;
}

.store-list {
  padding: 20rpx;
}

.store-item {
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  display: flex;
  padding: 20rpx;
}

.store-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.store-info {
  flex: 1;
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.store-name {
  font-size: 32rpx;
  font-weight: bold;
}

.distance {
  font-size: 24rpx;
  color: #999;
}

.store-address {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.address-icon {
  font-size: 24rpx;
}

.store-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 10rpx;
}

.feature-tag {
  font-size: 20rpx;
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.store-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.star {
  color: #ffd700;
}

.order-count {
  font-size: 24rpx;
  color: #999;
}
</style>
