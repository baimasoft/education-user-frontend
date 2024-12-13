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
        @tap="handleOrderClick(order)"
      >
        <view class="order-header">
          <view class="teacher-info">
            <image
              class="teacher-avatar"
              :src="order.teacherAvatar || '/static/images/default-teacher.png'"
              mode="aspectFill"
            />
            <view class="teacher-detail">
              <text class="teacher-name">{{ order.teacherName }}</text>
              <text class="teacher-title">{{ order.teacherTitle }}</text>
            </view>
          </view>
          <text class="order-status" :class="order.status">{{
            getStatusText(order.status)
          }}</text>
        </view>

        <view class="order-content">
          <view class="service-summary">
            <view class="service-list">
              <text
                v-for="(service, index) in sortedServices(order).slice(0, 2)"
                :key="service.id"
                class="service-item"
              >
                {{ service.name }} x{{ service.quantity }}
                <text v-if="order.status === 'confirmed'" class="remaining">
                  (剩余{{ service.remainingQuantity }}次)
                </text>
              </text>
              <text v-if="order.services.length > 2" class="more-services">
                等{{ order.services.length }}个服务
              </text>
            </view>
            <view class="booking-info">
              <text class="booking-time"
                >预约时间：{{ order.bookingTime }}</text
              >
              <text class="address">地址：{{ order.address }}</text>
            </view>
          </view>
        </view>

        <view class="order-footer">
          <view class="total">
            合计 <text class="total-price">¥{{ order.amount.toFixed(2) }}</text>
          </view>
          <view class="action-buttons">
            <button
              v-for="action in getOrderActions(order)"
              :key="action.type"
              class="action-button"
              :class="action.type"
              @tap.stop="handleOrderAction(action.type, order)"
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
import { ref, computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useOrderStore, type Order } from "@/stores/order";

const orderStore = useOrderStore();
const orders = ref<Order[]>([]);

// 获取订单列表
const getOrderList = () => {
  // 获取所有本地存储的订单
  const storage = uni.getStorageInfoSync();
  const orderKeys = storage.keys.filter((key) => key.startsWith("order_"));

  if (orderKeys.length > 0) {
    // 从本地存储获取订单数据
    const localOrders = orderKeys.map((key) => {
      const orderData = uni.getStorageSync(key);
      return JSON.parse(orderData);
    });

    // 按创建时间倒序排序
    orders.value = localOrders.sort((a, b) => {
      // 将日期时间格式转换为 iOS 支持的格式
      const formatDateTime = (dateTimeStr: string) => {
        // 将 "yyyy-MM-dd HH:mm" 转换为 "yyyy-MM-ddTHH:mm:00"
        return dateTimeStr.replace(" ", "T") + ":00";
      };

      return (
        new Date(formatDateTime(b.createTime)).getTime() -
        new Date(formatDateTime(a.createTime)).getTime()
      );
    });
  } else {
    // 如果本地没有数据，从 store 获取
    orders.value = orderStore.getOrdersByStatus();

    // 将订单数据存入本地
    orders.value.forEach((order: Order) => {
      uni.setStorageSync(`order_${order.id}`, JSON.stringify(order));
    });
  }
};

interface Tab {
  label: string;
  value: string;
}

interface OrderAction {
  type: string;
  text: string;
}

const tabs: Tab[] = [
  { label: "全部", value: "all" },
  { label: "待付款", value: "pending" },
  { label: "待使用", value: "confirmed" },
  { label: "已完成", value: "completed" },
  { label: "已取消", value: "cancelled" },
  { label: "已退款", value: "refunded" },
  // { label: "教员", value: "teacher" },
  // { label: "课程", value: "course" },
  // { label: "乐器租赁", value: "instrument_rental" },
  // { label: "乐器购买", value: "instrument_purchase" },
  // { label: "乐室预约", value: "music_room_reservation" },
];

const currentTab = ref("all");

const filteredOrders = computed(() => {
  if (currentTab.value === "all") {
    return [...orders.value].sort((a, b) => {
      // 待使用的订单优先显示剩余次数多的
      if (a.status === "confirmed" && b.status === "confirmed") {
        const aRemaining = getTotalRemaining(a);
        const bRemaining = getTotalRemaining(b);
        return bRemaining - aRemaining;
      }
      // 其他情况按时间排序
      return (
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
    });
  }
  return orders.value
    .filter(
      (order: Order) =>
        order.status === currentTab.value || order.category === currentTab.value
    )
    .sort((a, b) => {
      // 在"待使用"标签页下按剩余次数排序
      if (currentTab.value === "confirmed") {
        const aRemaining = getTotalRemaining(a);
        const bRemaining = getTotalRemaining(b);
        return bRemaining - aRemaining;
      }
      // 其他标签页按时间排序
      return (
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
    });
});

const handleTabChange = (tab: string) => {
  currentTab.value = tab;
};

const getOrderActions = (order: Order): OrderAction[] => {
  const actions: OrderAction[] = [];
  switch (order.status) {
    case "pending":
      actions.push({ type: "primary", text: "立即付款" });
      actions.push({ type: "default", text: "取消订单" });
      break;
    case "confirmed":
      actions.push({ type: "primary", text: "查看详情" });
      actions.push({ type: "default", text: "申请退款" });
      break;
    case "completed":
      actions.push({ type: "primary", text: "再次预约" });
      actions.push({ type: "default", text: "删除订单" });
      break;
    case "cancelled":
    case "refunded":
      actions.push({ type: "default", text: "删除订单" });
      break;
  }
  return actions;
};

const handleOrderAction = (actionType: string, order: Order) => {
  switch (actionType) {
    case "primary":
      if (order.status === "confirmed") {
        // 查看详情
        uni.redirectTo({
          url: `/pages/orders/order-detail?id=${order.id}`,
        });
      } else if (order.status === "pending") {
        // 立即付款
        uni.redirectTo({
          url: `/pages/orders/order-detail?id=${order.id}`,
        });
      } else if (order.status === "completed") {
        // 再次预约
        uni.navigateTo({
          url: `/pages/teacher/teacher-detail?id=${order.teacherId}`,
        });
      }
      break;
    case "default":
      if (order.status === "confirmed") {
        // 申请退款
        uni.showModal({
          title: "申请退款",
          content: "确定要申请退款吗？",
          success: (res) => {
            if (res.confirm) {
              orderStore.refundOrder(order.id);
              // 更新本地存储
              uni.setStorageSync(
                `order_${order.id}`,
                JSON.stringify({
                  ...order,
                  status: "refunded",
                })
              );
              // 刷新订单列表
              getOrderList();
              uni.showToast({
                title: "退款申请已提交",
                icon: "success",
              });
            }
          },
        });
      } else if (order.status === "pending") {
        // 取消订单
        uni.showModal({
          title: "取消订单",
          content: "确定要取消订单吗？",
          success: (res) => {
            if (res.confirm) {
              orderStore.cancelOrder(order.id);
              // 更新本地存储
              uni.setStorageSync(
                `order_${order.id}`,
                JSON.stringify({
                  ...order,
                  status: "cancelled",
                })
              );
              // 刷新订单列表
              getOrderList();
              uni.showToast({
                title: "订单已取消",
                icon: "success",
              });
            }
          },
        });
      } else {
        uni.showModal({
          title: "删除订单",
          content: "确定要删除订单吗？",
          success: (res) => {
            if (res.confirm) {
              // 删除本地存储
              uni.removeStorageSync(`order_${order.id}`);
              // 刷新订单列表
              getOrderList();
              uni.showToast({
                title: "订单已删除",
                icon: "success",
              });
            }
          },
        });
      }
      break;
  }
};

const handleOrderClick = (order: Order) => {
  // 点击整个订单也跳转到详情页
  uni.navigateTo({
    url: `/pages/orders/order-detail?id=${order.id}`,
  });
};

// 页面显示时刷新订单列表
onShow(() => {
  getOrderList();
  const category = uni.getStorageSync("orderCategory");
  if (category) {
    currentTab.value = category;
    uni.removeStorageSync("orderCategory");
  }
});

// 获取状态文本
const getStatusText = (status: Order["status"]) => {
  const statusMap = {
    pending: "待支付",
    confirmed: "待使用",
    completed: "已完成",
    cancelled: "已取消",
    refunded: "已退款",
  };
  return statusMap[status];
};

// 计算订单总数量
const getTotalQuantity = (order: Order) => {
  return order.services.reduce((sum, service) => sum + service.quantity, 0);
};

// 添加计算订单服务总剩余次数的函数
const getTotalRemaining = (order: Order) => {
  return order.services.reduce(
    (sum, service) => sum + (service.remainingQuantity || 0),
    0
  );
};

// 对订单内的服务按剩余数量排序
const sortedServices = (order: Order) => {
  if (order.status !== "confirmed") {
    return order.services;
  }
  return [...order.services].sort((a, b) => {
    return (b.remainingQuantity || 0) - (a.remainingQuantity || 0);
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

.teacher-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.teacher-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
}

.teacher-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.teacher-title {
  font-size: 24rpx;
  color: #666;
}

.order-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.order-status.pending {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.order-status.confirmed {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.order-status.completed {
  color: #666;
  background: #f5f5f5;
}

.order-status.cancelled,
.order-status.refunded {
  color: #999;
  background: #f5f5f5;
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
  padding: 15rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  line-height: 24rpx;
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
  /* border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1); */
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
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

.booking-time {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.teacher-detail {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.order-content {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}

.service-summary {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.service-item {
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-services {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.remaining {
  font-size: 24rpx;
  color: #52c41a;
  margin-left: 8rpx;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 12rpx;
}

.booking-time,
.address {
  font-size: 24rpx;
  color: #666;
}
</style>
