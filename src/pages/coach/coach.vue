<template>
  <view class="coach-page">
    <!-- 头部 -->
    <view class="header">
      <text class="title">教练</text>
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

    <!-- 分类标签 -->
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab"
        class="tab"
        :class="{ active: selectedTab === tab }"
        @tap="setSelectedTab(tab)"
      >
        {{ tab }}
      </view>
    </view>

    <!-- 教练列表 -->
    <view class="coach-list">
      <view v-for="coach in coaches" :key="coach.id" class="coach-card">
        <view class="coach-image">
          <image src="/static/placeholder-coach.jpg" mode="aspectFill"></image>
          <view v-if="coach.available" class="service-badge">可服务</view>
        </view>
        <view class="coach-info">
          <view class="coach-header">
            <text class="coach-name">{{ coach.name }}</text>
            <text class="distance">{{ coach.distance }}km</text>
          </view>
          <view class="coach-details">
            <text>{{ coach.age }}岁 | 已接单{{ coach.orders }}</text>
            <text class="signature">签名：{{ coach.signature }}</text>
          </view>
          <view class="coach-footer">
            <view class="price">
              <text class="currency">¥</text>
              <text class="amount">{{ coach.price.toFixed(2) }}</text>
              <text class="unit">起/小时</text>
            </view>
            <text class="time-tag">最早可约{{ coach.earliestTime }}</text>
            <button class="book-button" @tap="handleBooking(coach)">立即预约</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 预约弹窗 -->
    <view v-if="selectedCoach" class="modal-overlay" @tap="closeModal">
      <view class="modal-content" @tap.stop>
        <button class="close-button" @tap="closeModal">×</button>
        <view class="modal-scroll-content">
          <view class="coach-profile">
            <image 
              :src="selectedCoach.avatar || '/static/placeholder-avatar.png'"
              mode="aspectFill"
              class="coach-avatar"
            ></image>
            <view class="profile-info">
              <text class="coach-name">{{ selectedCoach.name }}</text>
              <text class="rating">{{ selectedCoach.rating }}</text>
            </view>
          </view>

          <view class="service-list">
            <view v-for="service in selectedCoach.services" :key="service.id" class="service-item">
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
                  >−</button>
                  <text class="quantity">{{ quantities[service.id] || 0 }}</text>
                  <button 
                    class="quantity-btn"
                    @tap="handleIncrement(service.id)"
                  >+</button>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="bottom-bar">
          <view class="total">
            合计 <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
          </view>
          <button class="submit-btn" @tap="handleSubmit">确认预约</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Service {
  id: number
  name: string
  duration: string
  price: number
}

interface Coach {
  id: number
  name: string
  age: number
  orders: number
  distance: number
  price: number
  signature: string
  available: boolean
  earliestTime: string
  rating?: string
  services?: Service[]
}

const selectedTab = ref('推荐教练')
const selectedCoach = ref<Coach | null>(null)
const quantities = ref<{ [key: number]: number }>({})

const tabs = ['推荐教练', '按级别', '按接单量', '按评分']

const coaches = ref<Coach[]>([
  {
    id: 1,
    name: '娟娟',
    age: 18,
    orders: 2,
    distance: 26.24,
    price: 399.00,
    signature: '民谣、摇滚都擅长',
    available: true,
    earliestTime: '20:00',
    rating: '5.0分',
    services: [
      {
        id: 1,
        name: '驻唱套餐',
        duration: '60分钟',
        price: 399.00,
      },
      {
        id: 2,
        name: '教学课程',
        duration: '45分钟',
        price: 299.00,
      }
    ]
  },
  {
    id: 2,
    name: '满满',
    age: 18,
    orders: 0,
    distance: 32.20,
    price: 399.00,
    signature: '暂无签名',
    available: true,
    earliestTime: '20:00',
    rating: '4.8分',
    services: [
      {
        id: 1,
        name: '驻唱套餐',
        duration: '60分钟',
        price: 399.00,
      }
    ]
  }
])

const totalPrice = computed(() => {
  if (!selectedCoach.value?.services) return 0
  return selectedCoach.value.services.reduce((sum, service) => {
    return sum + (service.price * (quantities.value[service.id] || 0))
  }, 0)
})

const setSelectedTab = (tab: string) => {
  selectedTab.value = tab
}

const handleBooking = (coach: Coach) => {
  selectedCoach.value = coach
  quantities.value = {}
}

const closeModal = () => {
  selectedCoach.value = null
  quantities.value = {}
}

const handleDecrement = (serviceId: number) => {
  if (quantities.value[serviceId] > 0) {
    quantities.value[serviceId]--
  }
}

const handleIncrement = (serviceId: number) => {
  quantities.value[serviceId] = (quantities.value[serviceId] || 0) + 1
}

const handleSubmit = () => {
  // TODO: 处理提交预约
  uni.showToast({
    title: '预约成功',
    icon: 'success'
  })
  closeModal()
}
</script>

<style>
.coach-page {
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

.tabs {
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  padding: 20rpx 0;
}

.tab {
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab.active {
  color: #ff4d4f;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #ff4d4f;
  border-radius: 4rpx;
}

.coach-list {
  padding: 20rpx;
}

.coach-card {
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  display: flex;
  padding: 20rpx;
}

.coach-image {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin-right: 20rpx;
}

.coach-image image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.service-badge {
  position: absolute;
  top: 10rpx;
  left: 10rpx;
  background: rgba(255, 77, 79, 0.9);
  color: #ffffff;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
}

.coach-info {
  flex: 1;
}

.coach-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.coach-name {
  font-size: 32rpx;
  font-weight: bold;
}

.distance {
  font-size: 24rpx;
  color: #999;
}

.coach-details {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.signature {
  display: block;
  margin-top: 6rpx;
  color: #ffa940;
}

.coach-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.unit {
  font-size: 24rpx;
  color: #999;
  margin-left: 4rpx;
}

.time-tag {
  font-size: 24rpx;
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.book-button {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  border: none;
}

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
  background: #ffffff;
  width: 100%;
  border-radius: 24rpx 24rpx 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-scroll-content {
  padding: 40rpx;
  overflow-y: auto;
}

.close-button {
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
  padding-top: 30rpx;
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

.submit-btn {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  font-size: 28rpx;
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
  border: none;
}
</style>
