<template>
  <view class="about-page">
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="app-name">一对一音乐教育</text>
      <text class="version">版本 1.0.0</text>
    </view>

    <view class="info-section">
      <view
        class="info-item"
        v-for="item in menuItems"
        :key="item.key"
        @tap="handleItemClick(item.key)"
      >
        <text class="item-label">{{ item.label }}</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="contact-section">
      <view class="contact-title">联系我们</view>
      <view class="contact-item">客服电话：400-999-8794</view>
      <view class="contact-item">服务时间：周一至周日 9:00-22:00</view>
      <view class="contact-item">商务合作：baimasoft.com@outlook.com</view>
    </view>

    <view class="copyright">
      <text>Copyright © 2024 一对一音乐教育</text>
      <text>All Rights Reserved</text>
    </view>

    <!-- 协议弹窗 -->
    <agreement-popup
      v-model:visible="showAgreement"
      :title="agreementTitle"
      :content="agreementContent"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { agreements } from "@/data/agreements";
import AgreementPopup from "@/components/agreement-popup.vue";

const showAgreement = ref(false);
const agreementTitle = ref("");
const agreementContent = ref("");

const menuItems = [
  { key: "service", label: "服务协议" },
  { key: "privacy", label: "隐私政策" },
  // { key: "feedback", label: "意见反馈" },
];

const handleItemClick = (key: string) => {
  switch (key) {
    case "service":
      agreementTitle.value = agreements.service.title;
      agreementContent.value = agreements.service.content;
      showAgreement.value = true;
      break;
    case "privacy":
      agreementTitle.value = agreements.privacy.title;
      agreementContent.value = agreements.privacy.content;
      showAgreement.value = true;
      break;
    case "feedback":
      uni.navigateTo({
        url: "/pages/feedback/index",
      });
      break;
  }
};
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 40rpx 30rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.version {
  font-size: 24rpx;
  color: #999;
}

.info-section {
  margin: 40rpx 0;
  border-radius: 12rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 28rpx;
  color: #333;
}

.arrow {
  font-size: 32rpx;
  color: #999;
}

.contact-section {
  margin: 40rpx 0;
  padding: 30rpx;
  border-radius: 12rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.contact-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.contact-item {
  font-size: 28rpx;
  color: #666;
  line-height: 2;
}

.copyright {
  text-align: center;
  padding: 40rpx 0;
}

.copyright text {
  display: block;
  font-size: 24rpx;
  color: #999;
  line-height: 1.6;
}
</style>
