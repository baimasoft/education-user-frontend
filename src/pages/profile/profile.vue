<template>
  <view class="profile">
    <view class="user-card">
      <view class="user-info" @tap="handleLogin">
        <image
          class="avatar"
          src="/static/icons/default-login-avatar.png"
          mode="aspectFill"
        ></image>
        <view class="info">
          <text class="nickname">昵称</text>
          <text class="uid">UID: 123456</text>
        </view>
        <view class="settings-btn" @tap="handleMenuClick('settings')">
          <image
            class="settings-icon"
            src="/static/icons/settings.png"
            mode="aspectFit"
          ></image>
          <text>设置</text>
        </view>
      </view>

      <view class="user-stats">
        <view class="stat-item">
          <text class="stat-value">{{ balance }}</text>
          <text class="stat-label">账户余额</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ couponCount }}</text>
          <text class="stat-label">优惠券</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ favoriteCount }}</text>
          <text class="stat-label">我的收藏</text>
        </view>
      </view>
    </view>

    <view class="feature-grid">
      <view class="feature-item" @tap="handleFeatureClick('teaching')">
        <image
          class="feature-icon"
          src="/static/icons/teaching.png"
          mode="aspectFit"
        ></image>
        <text class="feature-label">教员订单</text>
      </view>
      <view class="feature-item" @tap="handleFeatureClick('course')">
        <image
          class="feature-icon"
          src="/static/icons/course.png"
          mode="aspectFit"
        ></image>
        <text class="feature-label">课程订单</text>
      </view>
      <view class="feature-item" @tap="handleFeatureClick('coupon')">
        <image
          class="feature-icon"
          src="/static/icons/coupon.png"
          mode="aspectFit"
        ></image>
        <text class="feature-label">课程兑换码</text>
      </view>
    </view>

    <view class="my-services-card">
      <view class="section-title">我的服务</view>
      <view class="services-grid">
        <view class="service-item" @tap="handleServiceClick('appointment')">
          <view class="service-icon-wrapper">
            <image
              class="service-icon"
              src="/static/icons/appointment.png"
              mode="aspectFit"
            ></image>
            <text class="service-count" v-if="appointmentCount !== 0">{{
              appointmentCount
            }}</text>
          </view>
          <text class="service-label">我的预约</text>
        </view>
        <view class="service-item" @tap="handleServiceClick('instrument')">
          <view class="service-icon-wrapper">
            <image
              class="service-icon"
              src="/static/icons/instrument.png"
              mode="aspectFit"
            ></image>
            <text class="service-count" v-if="instrumentCount !== 0">{{
              instrumentCount
            }}</text>
          </view>
          <text class="service-label">我的乐器</text>
        </view>
        <view class="service-item" @tap="handleServiceClick('course')">
          <view class="service-icon-wrapper">
            <image
              class="service-icon"
              src="/static/icons/course.png"
              mode="aspectFit"
            ></image>
            <text class="service-count" v-if="courseCount !== 0">{{
              courseCount
            }}</text>
          </view>
          <text class="service-label">我的课程</text>
        </view>
      </view>
    </view>

    <view class="more-features-card">
      <view class="section-title">更多功能</view>
      <view class="feature-grid more-features">
        <view class="feature-item" @tap="handleMoreFeatureClick('invite')">
          <image
            class="feature-icon"
            src="/static/icons/invite.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">邀请有礼</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('service')">
          <image
            class="feature-icon"
            src="/static/icons/customer-service.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">联系客服</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('rewards')">
          <image
            class="feature-icon"
            src="/static/icons/rewards.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">举报有奖</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('address')">
          <image
            class="feature-icon"
            src="/static/icons/location.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">地址管理</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('about')">
          <image
            class="feature-icon"
            src="/static/icons/about.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">关于我们</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('voucher')">
          <image
            class="feature-icon"
            src="/static/icons/voucher.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">领取优惠券</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('comment')">
          <image
            class="feature-icon"
            src="/static/icons/comment.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">评论管理</text>
        </view>
      </view>
    </view>
    <!-- 课程兑换码弹窗 -->
    <view
      v-if="showCouponCodeModal"
      class="modal-overlay"
      @tap="showCouponCodeModal = false"
    >
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">课程兑换</text>
          <view class="close-button" @tap="showCouponCodeModal = false">×</view>
        </view>
        <view class="modal-body">
          <input
            v-model="couponCode"
            type="text"
            placeholder="请输入课程兑换码"
            class="coupon-input"
          />
        </view>
        <view class="modal-footer">
          <button class="submit-btn" @tap="handleCouponCodeSubmit">
            立即兑换
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Mock data for demonstration
const appointmentCount = ref(2);
const courseCount = ref(1);
const balance = ref("0.00");
const couponCount = ref(0);
const favoriteCount = ref(0);
const instrumentCount = ref(0);
const showCouponCodeModal = ref(false);
const couponCode = ref("");

const handleCouponCodeSubmit = () => {
  if (!couponCode.value) {
    uni.showToast({
      title: "请输入兑换码",
      icon: "none",
    });
    return;
  }
  uni.showToast({
    title: "功能开发中",
    icon: "none",
  });
};
const handleLogin = () => {
  uni.showToast({
    title: "登录功能开发中",
    icon: "none",
  });
};

const handleFeatureClick = (type: string) => {
  const routes: Record<string, string> = {
    teaching: "/pages/orders/orders",
    course: "/pages/orders/orders",
    coupon: "/pages/coupon/list",
  };

  const route = routes[type];
  if (route) {
    try {
      if (type === "teaching") {
        // 对于教员订单，存储教员分类
        uni.setStorageSync("orderCategory", "teacher");
        uni.switchTab({ url: route });
      } else if (type === "course") {
        // 对于课程订单，存储课程分类
        uni.setStorageSync("orderCategory", "course");
        uni.switchTab({ url: route });
      } else if (type === "coupon") {
        // 对于课程兑换码，弹出输入框
        showCouponCodeModal.value = true;
      }
    } catch {
      uni.showToast({
        title: "功能开发中",
        icon: "none",
      });
    }
  }
};

const handleMoreFeatureClick = (type: string) => {
  const routes: Record<string, string> = {
    invite: "/pages/invite/index",
    service: "/pages/service/index",
    rewards: "/pages/rewards/index",
    address: "/pages/address/address-manage",
    about: "/pages/about/index",
    voucher: "/pages/voucher/index",
    comment: "/pages/comment/index",
  };

  const route = routes[type];
  if (route) {
    try {
      uni.navigateTo({
        url: route,
        fail: () => {
          uni.showToast({
            title: "功能开发中",
            icon: "none",
          });
        },
      });
    } catch {
      uni.showToast({
        title: "功能开发中",
        icon: "none",
      });
    }
  }
};

const handleServiceClick = (type: string) => {
  const routes: Record<string, string> = {
    appointment: "/pages/appointment/appointment",
    instrument: "/pages/instrument/index",
    course: "/pages/course/index",
  };

  const route = routes[type];
  if (route) {
    try {
      uni.navigateTo({
        url: route,
        fail: () => {
          uni.showToast({
            title: "功能开发中",
            icon: "none",
          });
        },
      });
    } catch {
      uni.showToast({
        title: "功能开发中",
        icon: "none",
      });
    }
  }
};
</script>

<style scoped>
.profile {
  min-height: 100vh;
  padding: 20rpx;
  background-color: #ffffff;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  width: 80%;
  border-radius: 16rpx;
  padding: 30rpx;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
}

.close-button {
  font-size: 40rpx;
  color: #999;
}

.coupon-input {
  width: 92%;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.submit-btn {
  width: 100%;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
}
.user-card {
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  position: relative;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  padding: 32rpx;
  padding-right: 120rpx;
  border-bottom: 1rpx solid #f5f5f5;
  position: relative;
}

.settings-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 32rpx;
  z-index: 1;
  font-size: 28rpx;
  color: #666;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 24rpx;
}

.nickname {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.uid {
  font-size: 24rpx;
  color: #999;
}

.user-stats {
  display: flex;
  padding: 24rpx 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1rpx;
  height: 50%;
  background-color: #f0f0f0;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.feature-icon {
  background: linear-gradient(-30deg, #a1c4fd 0%, #c2e9fb 100%);
  border-radius: 50rpx;
  padding: 16rpx;
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 12rpx;
}

.feature-label {
  font-size: 28rpx;
  color: #333;
}

.balance {
  font-size: 28rpx;
  color: #ff4d4f;
  margin-right: 16rpx;
}

.settings-icon {
  width: 32rpx;
  height: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin: 0 0 20rpx;
  padding: 0;
}

.more-features-card {
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  padding: 24rpx;
  margin: 40rpx 0;
}

.more-features {
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  padding: 0;
}

.more-features .feature-item {
  padding: 16rpx 10rpx;
  box-shadow: none;
}

.more-features .feature-icon {
  background: linear-gradient(-30deg, #a1c4fd 0%, #c2e9fb 100%);
  width: 60rpx;
  height: 60rpx;
  padding: 16rpx;
}

.more-features .feature-label {
  font-size: 24rpx;
  margin-top: 8rpx;
}

.my-services-card {
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 12rpx;
}

.service-icon-wrapper {
  position: relative;
}

.service-icon {
  background: linear-gradient(-30deg, #a1c4fd 0%, #c2e9fb 100%);
  border-radius: 50rpx;
  padding: 16rpx;
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 12rpx;
}

.service-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff4d4f;
  color: #ffffff;
  border-radius: 50%;
  font-size: 24rpx;
  width: 35rpx;
  height: 35rpx;
  line-height: 35rpx;
  text-align: center;
}

.service-label {
  font-size: 28rpx;
  color: #333;
}
</style>
