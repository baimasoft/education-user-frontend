<template>
  <view class="select-order-page">
    <!-- 订单搜索 -->
    <view class="search">
      <view class="search-container">
        <view class="divider"></view>
        <view class="search-bar">
          <view class="search-icon">🔍</view>
          <input
            v-model="filterOrders"
            placeholder="搜索订单号/商品名称"
            @input="handleSearch"
          />
        </view>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="orders-list">
      <!-- 空状态 -->
      <view v-if="filteredOrders.length === 0" class="empty-state">
        <image
          class="empty-icon"
          src="/static/images/default-orders.png"
          mode="aspectFit"
        />
        <text class="empty-text">暂无匹配订单</text>
      </view>

      <!-- 订单项目 -->
      <view
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-item"
        @tap="selectOrder(order)"
      >
        <!-- 订单头部 -->
        <view class="order-header">
          <text class="order-number">订单号：{{ order.number }}</text>
          <text
            class="order-status"
            :class="{
              'status-pending': order.status === '待处理',
              'status-completed': order.status === '已完成',
              'status-cancelled': order.status === '已取消',
            }"
          >
            {{ order.status }}
          </text>
        </view>

        <!-- 商品信息 -->
        <view class="order-product">
          <image
            :src="order.productImage || '/static/images/default-orders.png'"
            class="product-image"
            mode="aspectFill"
          />
          <view class="product-info">
            <text class="product-name">{{ order.productName }}</text>
            <text class="product-price"
              >¥{{ order.totalAmount.toFixed(2) }}</text
            >
          </view>
        </view>

        <!-- 订单时间 -->
        <view class="order-time">
          <text>下单时间：{{ formatOrderTime(order.createTime) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 订单接口
interface Order {
  id: string;
  number: string;
  status: string;
  productName: string;
  productImage: string;
  totalAmount: number;
  createTime: string;
}

// 搜索关键词
const filterOrders = ref("");

// 订单数据
const orders = ref<Order[]>([
  {
    id: "1",
    number: "MU20230815001",
    status: "待处理",
    productName: "吉他初级课程",
    productImage: "",
    totalAmount: 199.0,
    createTime: "2023-08-15 10:30:45",
  },
  {
    id: "2",
    number: "MU20230815002",
    status: "已完成",
    productName: "钢琴入门课程",
    productImage: "",
    totalAmount: 299.0,
    createTime: "2023-08-16 14:45:22",
  },
  {
    id: "3",
    number: "MU20230815003",
    status: "已取消",
    productName: "架子鼓进阶课程",
    productImage: "",
    totalAmount: 399.0,
    createTime: "2023-08-17 09:15:33",
  },
]);

// 过滤订单
const filteredOrders = computed(() => {
  const keyword = filterOrders.value.trim().toLowerCase();
  return orders.value.filter(
    (order) =>
      order.number.toLowerCase().includes(keyword) ||
      order.productName.toLowerCase().includes(keyword)
  );
});

// 处理搜索
const handleSearch = () => {
  // 可以在这里添加防抖逻辑
};

// 选择订单
const selectOrder = (order: Order) => {
  // 使用 uni.$emit 发送订单信息
  uni.$emit("selectedOrder", order);

  // 返回上一页
  uni.navigateBack();
};

// 格式化订单时间
const formatOrderTime = (time: string) => {
  return time.slice(0, 16).replace("T", " ");
};
</script>

<style scoped>
.select-order-page {
  background-color: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}

.search {
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
}

.search-container {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 12rpx 20rpx;
}

.search-icon {
  font-size: 28rpx;
  color: #999;
  margin-right: 12rpx;
}
.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
}
.search-bar input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.search-bar input::placeholder {
  color: #999;
}

.orders-list {
  flex: 1;
  overflow-y: auto;
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

.order-item {
  margin: 30rpx 0;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

.order-number {
  font-weight: bold;
}

.order-status {
  font-size: 28rpx;
}

.status-pending {
  color: #ff9900;
}

.status-completed {
  color: #07c160;
}

.status-cancelled {
  color: #ff5050;
}

.order-product {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.product-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
  margin-right: 15rpx;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 32rpx;
  color: #333;
}

.product-price {
  font-size: 28rpx;
  color: #ff5050;
}

.order-time {
  text-align: right;
  font-size: 24rpx;
  color: #999;
}
</style>
