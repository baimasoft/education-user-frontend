<template>
  <view class="profile">
    <view class="user-card">
      <view class="user-info" @tap="handleUserClick">
        <image
          class="avatar"
          :src="userInfo?.avatar || '/static/icons/default-login-avatar.png'"
          mode="aspectFill"
        ></image>
        <view class="info">
          <text class="nickname" v-if="isLoggedIn">{{
            userInfo.nickname
          }}</text>
          <text class="login-tip" v-else>点击登录</text>
        </view>
        <text class="arrow">›</text>
      </view>

      <view class="user-stats">
        <!-- <view class="stat-item">
          <text class="stat-value">{{ balance }}</text>
          <text class="stat-label">账户余额</text>
        </view> -->
        <view class="stat-item" @tap="handleCouponClick">
          <text class="stat-value">{{ couponCount }}</text>
          <text class="stat-label">优惠券</text>
        </view>
        <view class="stat-item" @tap="handleFavoriteClick">
          <text class="stat-value">{{ favoriteCount }}</text>
          <text class="stat-label">我的收藏</text>
        </view>
      </view>
    </view>

    <view class="feature-grid">
      <!-- <view class="feature-item" @tap="handleServiceClick('appointment')"> -->
      <view class="feature-item" @tap="handleServiceClick('appointment')">
        <image
          class="feature-icon"
          src="/static/icons/appointment.png"
          mode="aspectFit"
        ></image>
        <text class="feature-label">我的预约</text>
      </view>
      <view class="feature-item" @tap="handleServiceClick('course')">
        <image
          class="feature-icon"
          src="/static/icons/course.png"
          mode="aspectFit"
        ></image>
        <text class="feature-label">我的课程</text>
      </view>
      <view class="feature-item" @tap="handleServiceClick('instrument')">
        <image
          class="feature-icon"
          src="/static/icons/instrument.png"
          mode="aspectFit"
        ></image>
        <text class="feature-label">我的乐器</text>
      </view>
    </view>

    <view class="my-services-card">
      <view class="section-title">我的收入</view>
      <view class="services-grid">
        <view class="service-item" @tap="handleTeamClick">
          <view class="stat-number">
            <text class="stat-value">0</text>人>
          </view>
          <view class="stat-label">团队成员</view>
        </view>
        <view class="service-item" @tap="handleIncomeClick">
          <view class="stat-number">
            <text class="stat-value">0.00</text>元 >
          </view>
          <view class="stat-label">收入佣金</view>
        </view>
        <view class="service-item" @tap="handleWithdrawClick">
          <view class="stat-number">
            <text class="stat-value">0.00</text>元 >
          </view>
          <view class="stat-label">可提现</view>
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
        <view class="feature-item" @tap="handleMoreFeatureClick('about')">
          <image
            class="feature-icon"
            src="/static/icons/about.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">关于我们</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('address')">
          <image
            class="feature-icon"
            src="/static/icons/location.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">地址管理</text>
        </view>
        <view class="feature-item" @tap="handleMoreFeatureClick('voucher')">
          <image
            class="feature-icon"
            src="/static/icons/voucher.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">领取优惠券</text>
        </view>
        <view class="feature-item" @tap="handleFeatureClick('coupon')">
          <image
            class="feature-icon"
            src="/static/icons/coupon.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">课程兑换码</text>
        </view>
        <view class="feature-item" @tap="handleFeatureClick('invitationcode')">
          <image
            class="feature-icon"
            src="/static/icons/invite.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">填写邀请码</text>
        </view>
        <!-- <view class="feature-item" @tap="handleMoreFeatureClick('comment')">
          <image
            class="feature-icon"
            src="/static/icons/comment.png"
            mode="aspectFit"
          ></image>
          <text class="feature-label">评论管理</text>
        </view> -->
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
          <text class="modal-title">{{ showCodeModalTitle }}</text>
          <view class="close-button" @tap="showCouponCodeModal = false">×</view>
        </view>
        <view class="modal-body">
          <input
            v-model="couponCode"
            type="text"
            :placeholder="
              showCodeModalTitle === '课程兑换'
                ? '请输入课程兑换码'
                : '请输入邀请码'
            "
            :disabled="
              showCodeModalTitle === '填写邀请码' && couponCode.length > 0
            "
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
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const showLogoutModal = ref(false);
const showCouponCodeModal = ref(false);
const showCodeModalTitle = ref<string>("");
const couponCode = ref("");
const invitationCode = ref<boolean>(false);
// 用户信息
const userInfo = computed(() => userStore.userInfo);
const isLoggedIn = computed(() => userStore.userInfo.isLoggedIn);

// 检查登录状态
const checkLoginStatus = () => {
  const token = uni.getStorageSync("token");
  if (token && !isLoggedIn.value) {
    // 如果有token但未登录，说明是刷新或重新打开应用
    // 这里可以调用后端接口验证token
    // 暂时模拟自动登录
    userStore.login({
      token,
      userInfo: {
        isLoggedIn: true,
        nickname: "用户" + Math.floor(Math.random() * 1000),
        avatar: "",
        balance: 0,
        couponCount: 0,
        favoriteCount: 0,
      },
    });
  }
};

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});

// 处理用户点击
const handleUserClick = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });
    return;
  }
  // 已登录时显示退出登录确认框
  showLogoutModal.value = true;
  handleLogout();
};

// 处理退出登录
const handleLogout = () => {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        // 清除token和用户信息
        userStore.logout();
        uni.showToast({
          title: "已退出登录",
          icon: "success",
        });
      }
    },
  });
  showLogoutModal.value = false;
};

// 用户统计数据
const balance = computed(() => userInfo.value.balance);
const couponCount = computed(() => userInfo.value.couponCount);
const favoriteCount = computed(() => userInfo.value.favoriteCount);

// 其他功能点击处理
const handleServiceClick = (type: string) => {
  if (!isLoggedIn.value) {
    const token = uni.getStorageSync("token");
    if (token) {
      checkLoginStatus();
      return;
    }
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }

  const routes: Record<string, string> = {
    // appointment: "/pages/appointment/appointment",
    appointment: "/pages/orders/orders",
    instrument: "/pages/instrument/index",
    course: "/pages/course/index",
  };

  const route = routes[type];
  if (route) {
    if (type !== "appointment") {
      uni.navigateTo({
        url: route,
        fail: () => {
          uni.showToast({
            title: "功能开发中",
            icon: "none",
          });
        },
      });
    } else {
      uni.switchTab({
        url: route,
        fail: () => {
          uni.showToast({
            title: "功能开发中",
            icon: "none",
          });
        },
      });
    }
  }
};

// 更多功能点击处理
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

  if ((type === "address" || type === "voucher") && !isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }
  uni.navigateTo({
    url: route,
    fail: () => {
      uni.showToast({
        title: "功能开发中",
        icon: "none",
      });
    },
  });
};

// 处理功能点击
const handleFeatureClick = (type: string) => {
  if (!isLoggedIn.value) {
    // 检查是否有token
    const token = uni.getStorageSync("token");
    if (token) {
      checkLoginStatus();
      return;
    }
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }
  if (type === "coupon" || type === "invitationcode") {
    showCouponCodeModal.value = true;
    showCodeModalTitle.value = type === "coupon" ? "课程兑换" : "填写邀请码";
    couponCode.value = type === "coupon" ? "" : "GSDKJDFY";
    invitationCode.value = couponCode.value ? true : false;
    return;
  }
  const routes: Record<string, string> = {
    teaching: "/pages/orders/orders",
    course: "/pages/orders/orders",
  };

  const route = routes[type];
  if (route) {
    uni.navigateTo({
      url: route,
      fail: () => {
        uni.showToast({
          title: "功能开发中",
          icon: "none",
        });
      },
    });
  }
};
const handleCouponCodeSubmit = () => {
  if (invitationCode.value) {
    uni.showToast({
      title: "已使用过邀请码",
      icon: "none",
    });
    return;
  }
  uni.showToast({
    title: "兑换成功",
    icon: "success",
  });
};
const handleTeamClick = () => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/team/team",
  });
};

const handleIncomeClick = () => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/income/commission",
  });
};

const handleWithdrawClick = () => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/income/withdraw",
  });
};

// 在 script setup 中添加优惠券点击处理
const handleCouponClick = () => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/voucher/voucher",
  });
};

// 在 script setup 中添加收藏点击处理
const handleFavoriteClick = () => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/favorite/favorite",
  });
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
  padding-right: 40rpx;
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
.stat-number {
  margin-bottom: 10rpx;
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

.login-tip {
  font-size: 32rpx;
  color: #999999;
}

.arrow {
  font-size: 36rpx;
  color: #999999;
  margin-left: auto;
}
</style>
