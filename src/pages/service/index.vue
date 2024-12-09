<template>
  <view class="customer-service-container">
    <!-- 在线客服 -->
    <view class="service-section online-service">
      <view class="section-header">
        <text class="section-title">在线客服</text>
      </view>
      <view class="online-contact-list">
        <view
          v-for="service in onlineServices"
          :key="service.id"
          class="contact-item"
          @tap="startOnlineChat(service)"
        >
          <image
            :src="service.avatar || '/static/icons/default-avatar.png'"
            class="service-avatar"
          />
          <view class="service-info">
            <text class="service-name">{{ service.name }}</text>
            <text class="service-status" :class="service.status">
              {{ getStatusText(service.status) }}
            </text>
          </view>
          <view class="chat-icon">
            <text class="iconfont icon-chat"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="service-section contact-methods">
      <view class="section-header">
        <text class="section-title">联系方式</text>
      </view>
      <view class="contact-list">
        <view
          v-for="method in contactMethods"
          :key="method.type"
          class="contact-method-item"
          @tap="handleContactMethod(method)"
        >
          <view class="method-icon">
            <text :class="method.icon"></text>
          </view>
          <view class="method-info">
            <text class="method-name">{{ method.name }}</text>
            <text class="method-detail">{{ method.value }}</text>
          </view>
          <view class="method-action-icon">
            <text class="iconfont icon-copy"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 常见问题 -->
    <view class="service-section common-questions">
      <view class="section-header">
        <text class="section-title">常见问题</text>
      </view>
      <view class="question-list">
        <view
          v-for="(question, index) in commonQuestions"
          :key="index"
          class="question-item"
          @tap="showQuestionDetail(question)"
        >
          <text class="question-text">{{ question.title }}</text>
          <text class="iconfont icon-right"></text>
        </view>
      </view>
    </view>

    <!-- 问题详情弹窗 -->
    <view
      v-if="showQuestionModal"
      class="question-modal-mask"
      @tap.self="closeQuestionModal"
    >
      <view class="question-modal-container">
        <view class="question-modal-header">
          <text class="question-modal-title">{{ currentQuestion.title }}</text>
          <text class="question-modal-close" @tap="closeQuestionModal">
            ✕
          </text>
        </view>
        <view class="question-modal-content">
          <text>{{ currentQuestion.content }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 脚本部分保持不变
import { ref } from "vue";
import { useServiceStore } from "@/stores/service";

// 在线客服接口
interface OnlineService {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy";
}

// 联系方式接口
interface ContactMethod {
  type: string;
  name: string;
  value: string;
  icon: string;
}

// 常见问题接口
interface CommonQuestion {
  title: string;
  content: string;
}

// 在线客服数据
const onlineServices = ref<OnlineService[]>([
  {
    id: "1",
    name: "小美",
    avatar: "",
    status: "online",
  },
  {
    id: "2",
    name: "小王",
    avatar: "",
    status: "busy",
  },
]);

// 联系方式数据
const contactMethods = ref<ContactMethod[]>([
  {
    type: "phone",
    name: "客服热线",
    value: "400-888-8888",
    icon: "iconfont icon-phone",
  },
  {
    type: "wechat",
    name: "微信客服",
    value: "MusicEduService",
    icon: "iconfont icon-wechat",
  },
  {
    type: "email",
    name: "邮箱",
    value: "service@musicedu.com",
    icon: "iconfont icon-email",
  },
]);

// 常见问题数据
const commonQuestions = ref<CommonQuestion[]>([
  {
    title: "如何预约课程？",
    content:
      "您可以在首页选择心仪的课程，点击预约按钮，填写相关信息即可完成预约。",
  },
  {
    title: "课程可以退款吗？",
    content: "课程支持7天内无条件退款，超过7天需要根据具体情况进行协商。",
  },
  {
    title: "如何租赁乐器？",
    content:
      "在乐器租赁页面选择心仪的乐器，填写租赁信息，支付租金即可完成租赁。",
  },
]);

// 状态文本映射
const getStatusText = (status: string) => {
  const statusMap = {
    online: "在线",
    offline: "离线",
    busy: "繁忙",
  };
  return statusMap[status] || "未知";
};

// 开始在线聊天
const startOnlineChat = (service: OnlineService) => {
  const serviceStore = useServiceStore();

  // 检查客服是否在线
  if (service.status === "online") {
    // 将选中的客服信息存储到状态管理中
    serviceStore.setCurrentService(service);

    // 跳转到聊天页面
    uni.navigateTo({
      url: `/pages/service/chat`,
      fail: () => {
        uni.showToast({
          title: "功能开发中",
          icon: "none",
          duration: 2000,
        });
      },
    });
  } else {
    // 如果客服不在线，显示提示
    uni.showToast({
      title: `${service.name}暂不在线，请稍后再试`,
      icon: "none",
      duration: 2000,
    });
  }
};

// 处理联系方式
const handleContactMethod = (method: ContactMethod) => {
  uni.setClipboardData({
    data: method.value,
    success: () => {
      uni.showToast({
        title: `已复制${method.name}`,
        icon: "none",
      });
    },
  });
};

// 问题详情相关
const showQuestionModal = ref(false);
const currentQuestion = ref<CommonQuestion>({
  title: "",
  content: "",
});

// 显示问题详情
const showQuestionDetail = (question: CommonQuestion) => {
  currentQuestion.value = question;
  showQuestionModal.value = true;
};

// 关闭问题详情弹窗
const closeQuestionModal = () => {
  showQuestionModal.value = false;
};
</script>

<style scoped>
.customer-service-container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20rpx;
}

.service-section {
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  margin: 20rpx 0;
}

.section-header {
  border-bottom: 1rpx solid #f0f0f0;
  padding-bottom: 15rpx;
  margin-bottom: 15rpx;
}

.section-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.online-contact-list .contact-item {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.online-contact-list .service-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.online-contact-list .service-info {
  flex: 1;
}

.online-contact-list .service-name {
  font-size: 28rpx;
  color: #333;
}

.online-contact-list .service-status {
  font-size: 24rpx;
  margin-top: 5rpx;
}

.online-contact-list .service-status.online {
  color: #5cb85c;
}

.online-contact-list .service-status.offline {
  color: #999;
}

.online-contact-list .service-status.busy {
  color: #f0ad4e;
}

.online-contact-list .chat-icon {
  color: #007bff;
  font-size: 36rpx;
}

.contact-list .contact-method-item {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.contact-list .method-icon {
  margin-right: 20rpx;
  font-size: 40rpx;
  color: #007bff;
}

.contact-list .method-info {
  flex: 1;
}

.contact-list .method-name {
  font-size: 28rpx;
  color: #333;
  margin-right: 10rpx;
}

.contact-list .method-detail {
  font-size: 24rpx;
  color: #666;
  margin-top: 5rpx;
}

.contact-list .method-action-icon {
  color: #999;
  font-size: 32rpx;
}

.common-questions .question-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.common-questions .question-text {
  font-size: 28rpx;
  color: #333;
}

.question-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.question-modal-container {
  width: 80%;
  background-color: #ffffff;
  border-radius: 10rpx;
  max-height: 70%;
  overflow: auto;
}

.question-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.question-modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.question-modal-close {
  color: #999;
  font-size: 36rpx;
}

.question-modal-content {
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
</style>
