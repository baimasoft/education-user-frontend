<template>
  <view class="orders-page">
    <!-- 订单状态标签页 -->
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab"
        :class="{ active: currentTab === tab.value }"
        @tap="handleTabChange(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="order-item"
      >
        <view class="order-header">
          <view class="store-info">
            <text class="store-name">{{ order.storeName }}</text>
            <text class="arrow">></text>
          </view>
          <text class="order-status" :class="order.status">{{ order.statusText }}</text>
        </view>

        <view class="order-content">
          <image 
            class="service-image" 
            :src="order.image || '/static/default-service.png'"
            mode="aspectFill"
          />
          <view class="service-info">
            <view class="service-name">{{ order.serviceName }}</view>
            <view class="service-time">{{ order.serviceTime }}</view>
            <view class="price-info">
              <text class="price">¥{{ order.price.toFixed(2) }}</text>
              <text class="count">x{{ order.count }}</text>
            </view>
          </view>
        </view>

        <view class="order-footer">
          <view class="total">
            共{{ order.count }}件 合计
            <text class="total-price">¥{{ (order.price * order.count).toFixed(2) }}</text>
          </view>
          <view class="action-buttons">
            <button 
              v-for="action in getOrderActions(order)" 
              :key="action.type"
              class="action-button"
              :class="action.type"
              @tap="handleOrderAction(action.type, order)"
            >
              {{ action.text }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredOrders.length === 0" class="empty-state">
      <image src="/static/empty-orders.png" mode="aspectFit" class="empty-image"/>
      <text class="empty-text">暂无相关订单</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Tab {
  label: string
  value: string
}

interface Order {
  id: number
  storeName: string
  status: string
  statusText: string
  serviceName: string
  serviceTime: string
  price: number
  count: number
  image?: string
}

interface OrderAction {
  type: string
  text: string
}

const tabs: Tab[] = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'unpaid' },
  { label: '待使用', value: 'unused' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

const currentTab = ref('all')

const orders = ref<Order[]>([
  {
    id: 1,
    storeName: '音乐空间(天河店)',
    status: 'unused',
    statusText: '待使用',
    serviceName: '吉他教学课程',
    serviceTime: '2024-01-20 14:00-15:00',
    price: 299.00,
    count: 1
  },
  {
    id: 2,
    storeName: '乐器中心(珠江新城店)',
    status: 'completed',
    statusText: '已完成',
    serviceName: '钢琴教学课程',
    serviceTime: '2024-01-18 10:00-11:00',
    price: 399.00,
    count: 2
  }
])

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentTab.value)
})

const handleTabChange = (tab: string) => {
  currentTab.value = tab
}

const getOrderActions = (order: Order): OrderAction[] => {
  const actions: OrderAction[] = []
  
  switch (order.status) {
    case 'unpaid':
      actions.push({ type: 'primary', text: '立即付款' })
      actions.push({ type: 'default', text: '取消订单' })
      break
    case 'unused':
      actions.push({ type: 'primary', text: '查看详情' })
      actions.push({ type: 'default', text: '申请退款' })
      break
    case 'completed':
      actions.push({ type: 'primary', text: '再次预约' })
      actions.push({ type: 'default', text: '评价' })
      break
    case 'cancelled':
      actions.push({ type: 'primary', text: '删除订单' })
      break
  }
  
  return actions
}

const handleOrderAction = (actionType: string, order: Order) => {
  // TODO: 处理订单操作
  uni.showToast({
    title: `${actionType} 订单${order.id}`,
    icon: 'none'
  })
}
</script>

<style>
.orders-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.tabs {
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tab {
  font-size: 28rpx;
  color: #666;
  position: relative;
  padding: 0 20rpx;
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

.order-list {
  padding: 20rpx;
}

.order-item {
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.store-info {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.store-name {
  font-size: 28rpx;
  font-weight: bold;
}

.arrow {
  color: #999;
  font-size: 24rpx;
}

.order-status {
  font-size: 24rpx;
}

.order-status.unpaid {
  color: #ff4d4f;
}

.order-status.unused {
  color: #52c41a;
}

.order-status.completed {
  color: #999;
}

.order-status.cancelled {
  color: #999;
}

.order-content {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}

.service-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.service-time {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.count {
  font-size: 24rpx;
  color: #999;
}

.order-footer {
  padding-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-size: 24rpx;
  color: #666;
}

.total-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}

.action-button {
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  background: #ffffff;
}

.action-button.primary {
  color: #ff4d4f;
  border: 2rpx solid #ff4d4f;
}

.action-button.default {
  color: #666;
  border: 2rpx solid #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
