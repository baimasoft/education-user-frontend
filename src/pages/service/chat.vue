<template>
  <view class="chat-page">
    <!-- 头部 -->
    <view class="chat-header">
      <view class="header-content">
        <view class="service-info">
          <image
            :src="currentService?.avatar || defaultAvatar"
            class="service-avatar"
          />
          <view class="service-text">
            <text class="service-name">{{
              currentService?.name || "客服"
            }}</text>
            <text class="service-status">{{ serviceStatus }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      class="message-list"
      scroll-y
      :scroll-top="scrollTop"
      @scrolltoupper="loadMoreMessages"
      scroll-with-animation
      enable-back-to-top
    >
      <view
        v-for="(msg, index) in messages"
        :key="index"
        class="message-item"
        :class="msg.type + '-message'"
      >
        <!-- 头像 -->
        <image :src="getMessageAvatar(msg)" class="message-avatar" />
        <!-- 消息内容 -->
        <view class="message-content">
          <!-- 普通文本消息 -->
          <text v-if="msg.type !== 'order'" class="text-message">
            {{ msg.content }}
          </text>

          <!-- 订单消息 -->
          <view
            v-if="msg.type === 'order'"
            class="order-message"
            @tap="viewOrderDetail(msg.orderId)"
          >
            <text class="order-title">订单详情</text>
            <text class="order-number">订单号：{{ msg.orderNumber }}</text>
          </view>

          <!-- 消息时间 -->
          <text class="message-time">{{ msg.time }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-container">
      <view class="input-wrapper">
        <input
          class="chat-input"
          v-model="inputMessage"
          placeholder="请输入消息"
          confirm-type="send"
          @confirm="sendMessage"
        />
        <view class="action-buttons">
          <image
            src="/static/icons/more.png"
            class="action-icon"
            mode="scaleToFill"
            v-if="inputMessage.length === 0"
            @tap="toggleMoreActions"
          />
          <button class="send-btn" @tap="sendMessage" v-else>发送</button>
        </view>
      </view>
    </view>
    <!-- 遮罩层 -->
    <view
      v-if="showMoreActionsPanel"
      class="mask"
      @tap="toggleMoreActions"
    ></view>
    <!-- 底部弹窗 -->
    <view class="more-actions-panel" :class="{ show: showMoreActionsPanel }">
      <view class="more-actions-container">
        <view class="more-actions-grid">
          <view class="action-item" @tap="selectOrder">
            <image src="/static/icons/order.png" class="action-icon" />
            <text>选择订单</text>
          </view>
          <!-- <view class="action-item" @tap="selectGoods">
            <image src="/static/icons/goods.png" class="action-icon" />
            <text>选择商品</text>
          </view>
          <view class="action-item" @tap="fileComplaint">
            <image src="/static/icons/complaint.png" class="action-icon" />
            <text>投诉</text>
          </view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useServiceStore } from "@/stores/service";

// 默认头像
const defaultAvatar = "/static/icons/default-avatar.png";
const defaultUserAvatar = "/static/icons/default-login-avatar.png";

// 状态管理
const serviceStore = useServiceStore();
const currentService = ref(serviceStore.currentService);

// 消息接口
interface Message {
  type: "user" | "service" | "order";
  content?: string;
  time: string;
  orderId?: string;
  orderNumber?: string;
}

// 状态和数据
const messages = ref<Message[]>([]);
const inputMessage = ref("");
const scrollTop = ref(0);

// 计算属性
const serviceStatus = computed(() => {
  const statusMap = {
    online: "在线",
    offline: "离线",
    busy: "繁忙",
  };
  return currentService.value ? statusMap[currentService.value.status] : "未知";
});

// 生命周期
onMounted(() => {
  // 如果没有选择客服，返回客服列表
  if (!currentService.value) {
    uni.redirectTo({ url: "/pages/service/index" });
    return;
  }
  // 初始化欢迎消息
  initWelcomeMessage();
});

// 获取消息头像
const getMessageAvatar = (msg: Message) => {
  switch (msg.type) {
    case "user":
      return defaultUserAvatar;
    case "service":
      return currentService.value?.avatar || defaultAvatar;
    default:
      return defaultAvatar;
  }
};

// 初始化欢迎消息
const initWelcomeMessage = () => {
  if (!currentService.value) return;

  const welcomeMsg: Message = {
    type: "service",
    content: `您好，我是${currentService.value.name}，很高兴为您服务。`,
    time: formatTime(new Date()),
  };
  messages.value.push(welcomeMsg);
};

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  const userMsg: Message = {
    type: "user",
    content: inputMessage.value,
    time: formatTime(new Date()),
  };
  messages.value.push(userMsg);
  // 清空输入框
  inputMessage.value = "";
  // 确保滚动到底部
  scrollToBottom();
  // 额外的滚动确认
  setTimeout(scrollToBottom, 50);
  setTimeout(scrollToBottom, 100);
  // 模拟客服回复
  simulateServiceReply();
};

// 模拟客服回复
const simulateServiceReply = (order?: any) => {
  setTimeout(() => {
    const replyMsg: Message = {
      type: "service",
      content: order
        ? `我已收到您的订单${order.number}，我们将尽快为您处理`
        : "我们正在处理您的问题，请稍等",
      time: formatTime(new Date()),
    };
    messages.value.push(replyMsg);
    // 多次确认滚动到底部
    scrollToBottom();
    setTimeout(scrollToBottom, 50);
    setTimeout(scrollToBottom, 100);
  }, 1000);
};

// 加载更多消息（历史消息）
const loadMoreMessages = () => {
  // TODO: 实现历史消息加载逻辑
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messages.value.length > 5) {
      const totalHeight = messages.value.length * 100; // 估算每条消息的大致高度
      scrollTop.value = totalHeight;
    }
  });
};

// 格式化时间
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 控制更多操作面板显示
const showMoreActionsPanel = ref(false);

// 切换更多操作面板
const toggleMoreActions = () => {
  showMoreActionsPanel.value = !showMoreActionsPanel.value;
};

// 选择订单
const selectOrder = () => {
  // 提前注册事件监听器
  uni.$on("selectedOrder", (order: any) => {
    const orderMsg: Message = {
      type: "order",
      content: `订单号：${order.number}，${order.productName}`,
      time: formatTime(new Date()),
      orderId: order.id,
      orderNumber: order.number,
    };
    messages.value.push(orderMsg);
    scrollToBottom();
    simulateServiceReply(order);
    // 取消事件监听，防止重复监听
    uni.$off("selectedOrder");
  });
  // 导航到选择订单页面
  uni.navigateTo({
    url: "/pages/orders/select-order",
  });
  toggleMoreActions();
};

// 选择商品
const selectGoods = () => {
  //   uni.navigateTo({
  //     url: "/pages/goods/select-goods",
  //   });
  //   toggleMoreActions();
};

// 投诉
const fileComplaint = () => {
  //   uni.navigateTo({
  //     url: "/pages/service/complaint",
  //   });
  //   toggleMoreActions();
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.chat-header {
  background-color: #ffffff;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-header .header-content {
  display: flex;
  align-items: center;
}

.chat-header .service-info {
  display: flex;
  align-items: center;
}

.chat-header .service-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-header .service-text {
  display: flex;
  flex-direction: column;
}

.chat-header .service-name {
  font-weight: bold;
  font-size: 16px;
}

.chat-header .service-status {
  color: #888;
  font-size: 12px;
}

.message-list {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

.message-item {
  display: flex;
  margin-bottom: 15px;
}

.message-item .message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-item .message-content {
  max-width: 70%;
}

.message-item .text-message {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
}

.message-item .order-message {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
  margin-top: 5px;
}

.message-item .message-time {
  display: block;
  color: #888;
  font-size: 12px;
  margin-top: 5px;
}

.input-container {
  background-color: #ffffff;
  padding: 10px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.input-container .input-wrapper {
  display: flex;
  align-items: center;
}

.input-container .chat-input {
  flex: 1;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
}

.input-container .action-buttons {
  display: flex;
}
.action-icon {
  width: 50rpx;
  height: 50rpx;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.more-actions-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -500rpx;
  background-color: transparent;
  z-index: 100;
  transition: bottom 0.3s ease;
}

.more-actions-panel.show {
  bottom: 0;
}

.more-actions-container {
  background-color: #ffffff;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.more-actions-grid {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  margin: 16rpx;
  padding: 20rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.action-item .action-icon {
  margin-bottom: 10rpx;
}

.action-item text {
  font-size: 28rpx;
  color: #666;
}

.input-container .send-btn {
  background-color: #007bff;
  color: #ffffff;
  border-radius: 5px;
  font-size: 24rpx;
  margin-left: 5px;
}
</style>
