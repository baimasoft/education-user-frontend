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
      <view v-for="order in filteredOrders" :key="order.id" class="order-item">
        <view class="order-header">
          <view class="store-info">
            <text class="store-name">{{ order.storeName }}</text>
            <text class="arrow">></text>
          </view>
          <text class="order-status" :class="order.status">{{
            order.statusText
          }}</text>
        </view>

        <view class="order-content">
          <image
            class="service-image"
            :src="order.image || '/static/images/default-orders.png'"
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
            <text class="total-price"
              >¥{{ (order.price * order.count).toFixed(2) }}</text
            >
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
      <image
        class="empty-icon"
        src="/static/images/default-orders.png"
        mode="aspectFit"
      />
      <text class="empty-text">暂无相关订单</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";

onShow(() => {
  const category = uni.getStorageSync("orderCategory");
  if (category) {
    currentTab.value = category;
    // 清除存储的分类，避免重复设置
    uni.removeStorageSync("orderCategory");
  }
});
interface Tab {
  label: string;
  value: string;
}

interface Order {
  id: number;
  storeName: string;
  status: string;
  statusText: string;
  serviceName: string;
  serviceTime: string;
  price: number;
  count: number;
  image?: string;
  category: string;
  categoryText: string;
}

interface OrderAction {
  type: string;
  text: string;
}

const tabs: Tab[] = [
  { label: "全部", value: "all" },
  { label: "待付款", value: "unpaid" },
  { label: "待使用", value: "unused" },
  { label: "门店", value: "store" },
  { label: "教员", value: "teacher" },
  { label: "课程", value: "course" },
  { label: "乐器租赁", value: "instrument_rental" },
  { label: "乐器购买", value: "instrument_purchase" },
  { label: "乐室预约", value: "music_room_reservation" },
];

const currentTab = ref("all");

const orders = ref<Order[]>([
  {
    id: 1,
    storeName: "音乐空间(天河店)",
    status: "unused",
    statusText: "待使用",
    serviceName: "吉他教学课程",
    serviceTime: "2024-01-20 14:00-15:00",
    price: 299.0,
    count: 1,
    category: "course",
    categoryText: "课程",
  },
  {
    id: 2,
    storeName: "乐器中心(珠江新城店)",
    status: "completed",
    statusText: "已完成",
    serviceName: "钢琴教学课程",
    serviceTime: "2024-01-18 10:00-11:00",
    price: 399.0,
    count: 2,
    category: "teacher",
    categoryText: "教员",
  },
  {
    id: 3,
    storeName: "音乐工作室",
    status: "unpaid",
    statusText: "待付款",
    serviceName: "乐器租赁 - 小提琴",
    serviceTime: "2024-02-01 至 2024-02-28",
    price: 500.0,
    count: 1,
    category: "instrument_rental",
    categoryText: "乐器租赁",
  },
  {
    id: 4,
    storeName: "乐器商城",
    status: "completed",
    statusText: "已完成",
    serviceName: "电吉他",
    serviceTime: "2024-01-15",
    price: 3999.0,
    count: 1,
    category: "instrument_purchase",
    categoryText: "乐器购买",
  },
  {
    id: 5,
    storeName: "音乐中心",
    status: "unused",
    statusText: "待使用",
    serviceName: "乐室预约 - 录音室",
    serviceTime: "2024-02-10 10:00-14:00",
    price: 200.0,
    count: 1,
    category: "music_room_reservation",
    categoryText: "乐室预约",
  },
  {
    id: 6,
    storeName: "音乐培训学校",
    status: "unused",
    statusText: "待使用",
    serviceName: "架子鼓培训课程",
    serviceTime: "2024-02-05 16:00-17:00",
    price: 350.0,
    count: 1,
    category: "store",
    categoryText: "门店",
  },
]);

const filteredOrders = computed(() => {
  if (currentTab.value === "all") {
    return orders.value;
  }
  return orders.value.filter(
    (order) =>
      order.status === currentTab.value || order.category === currentTab.value
  );
});

const handleTabChange = (tab: string) => {
  currentTab.value = tab;
};

const getOrderActions = (order: Order): OrderAction[] => {
  const actions: OrderAction[] = [];

  switch (order.status) {
    case "unpaid":
      actions.push({ type: "primary", text: "立即付款" });
      actions.push({ type: "default", text: "取消订单" });
      break;
    case "unused":
      actions.push({ type: "primary", text: "查看详情" });
      actions.push({ type: "default", text: "申请退款" });
      break;
    case "completed":
      actions.push({ type: "primary", text: "再次预约" });
      actions.push({ type: "default", text: "评价" });
      break;
    case "cancelled":
      actions.push({ type: "primary", text: "删除订单" });
      break;
  }

  return actions;
};

const handleOrderAction = (actionType: string, order: Order) => {
  // TODO: 处理订单操作
  uni.showToast({
    title: `${actionType} 订单${order.id}`,
    icon: "none",
  });
};
</script>

<style>
.orders-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 20rpx;
}

.tabs {
  display: flex;
  flex-wrap: wrap; /* 允许标签换行 */
  justify-content: flex-start; /* 从左侧开始排列 */
  gap: 10rpx; /* 标签之间的间距 */
  padding: 10rpx 20rpx; /* 添加一些内边距 */
}

.tab {
  flex: 0 0 auto; /* 不要让标签平均分配宽度 */
  padding: 10rpx 20rpx;
  margin-bottom: 10rpx; /* 为换行的标签添加垂直间距 */
  border-radius: 30rpx;
  font-size: 28rpx;
  background-color: #f4f4f4;
  color: #666;
}

.tab.active {
  background-color: #007bff;
  color: white;
}

.order-list {
  padding: 20rpx;
}

.order-item {
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
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
  gap: 10rpx;
}

.action-button {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  line-height: 1.4;
  margin-right: 0;
}

.action-button.primary {
  color: #ffffff;
  /* border: 2rpx solid #ff4d4f; */
}

.action-button.default {
  color: #ffffff;
  /* border: 2rpx solid #666; */
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 200rpx;
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.empty-subtext {
  font-size: 28rpx;
  color: #999;
}
</style>
