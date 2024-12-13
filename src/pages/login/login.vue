<template>
  <view class="login-container">
    <!-- 顶部图片区域 -->
    <view class="header">
      <image
        class="login-image"
        src="/static/images/login-banner.png"
        mode="aspectFill"
      />
      <view class="title">一对一服务音乐小程序</view>
      <view class="subtitle"
        >本平台为教育类服务平台，为用户提供音乐教育平台服务，一对一音乐教学</view
      >
    </view>

    <!-- 登录按钮 -->
    <view class="login-section">
      <button class="login-btn" @tap="handleLogin">一键登录</button>
      <button class="back-btn" @tap="handleBack">返回</button>
      <!-- 协议勾选 -->
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox
              :checked="isAgreed"
              color="#ff4d4f"
              style="transform: scale(0.7)"
            />
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @tap="showAgreement('service')"
                >《服务协议》</text
              >
              和
              <text class="link" @tap="showAgreement('privacy')"
                >《隐私政策》</text
              >
            </text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <!-- 添加协议弹窗组件 -->
    <agreement-popup
      v-model:visible="showAgreementPopup"
      :title="
        agreementType === 'service'
          ? agreements.service.title
          : agreements.privacy.title
      "
      :content="
        agreementType === 'service'
          ? agreements.service.content
          : agreements.privacy.content
      "
      @confirm="handleAgreementConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import AgreementPopup from "@/components/agreement-popup.vue";
import { agreements } from "@/data/agreements";

const userStore = useUserStore();
const isAgreed = ref(false);
const showAgreementPopup = ref(false);
const agreementType = ref<"service" | "privacy">("service");

// 处理协议勾选
const handleAgreementChange = (e: any) => {
  isAgreed.value = e.detail.value.length > 0;
};

// 处理协议弹窗确认
const handleAgreementConfirm = () => {
  isAgreed.value = true;
};

// 处理登录
const handleLogin = () => {
  if (!isAgreed.value) {
    uni.showToast({
      title: "请先同意服务协议和隐私政策",
      icon: "none",
    });
    return;
  }

  // 调用登录接口
  uni.login({
    provider: "weixin",
    success: (loginRes) => {
      console.log(loginRes.code);
      // 模拟登录成功
      // 模拟后端返回的 token
      const mockToken = "mock_token_" + Date.now();
      
      // 保存 token 到本地
      uni.setStorageSync("token", mockToken);
      
      // 更新用户状态
      userStore.login({
        token: mockToken,
        userInfo: {
          isLoggedIn: true,
          nickname: "用户" + Math.floor(Math.random() * 1000),
          avatar: "",
          balance: 0,
          couponCount: 0,
          favoriteCount: 0,
        },
      });

      uni.showToast({
        title: "登录成功",
        icon: "success",
      });

      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
          fail: () => {
            uni.switchTab({
              url: "/pages/index/index",
            });
          },
        });
      }, 1500);
    },
  });
};

// 处理返回
const handleBack = () => {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  });
};

// 显示协议
const showAgreement = (type: "service" | "privacy") => {
  agreementType.value = type;
  showAgreementPopup.value = true;
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
}

.login-image {
  width: 100%;
  height: 55vh;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.5;
  padding: 0 40rpx;
  margin-bottom: 40rpx;
}

.login-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.login-btn {
  background: #000000;
  color: #ffffff;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  margin-bottom: 15rpx;
  width: 70%;
  border: none;
}

.back-btn {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  margin-bottom: 15rpx;
  width: 70%;
  border: none;
}

.agreement {
  text-align: center;
  margin: 50rpx 0;
}

.agreement-label {
  display: flex;
  align-items: center;
  justify-content: center;
}

.agreement-text {
  font-size: 24rpx;
  color: #999999;
}

.link {
  color: #576b95;
}
</style>
