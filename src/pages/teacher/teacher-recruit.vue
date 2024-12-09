<template>
  <view class="recruit-page">
    <!-- 顶部横幅图片 -->
    <image
      class="banner-image"
      src="/static/images/recruit-banner.png"
      mode="aspectFill"
    />

    <!-- 标题 -->
    <view class="title">加入我们</view>
    <view class="subtitle">请如实填写信息</view>

    <!-- 表单区域 -->
    <view class="form-container">
      <!-- 头像上传 -->
      <view class="form-item avatar-upload">
        <text class="form-label">头像</text>
        <view class="avatar-box" @tap="chooseImage">
          <image
            v-if="formData.avatar"
            :src="formData.avatar"
            class="avatar-preview"
            mode="aspectFill"
          />
          <text v-else class="plus-icon">+</text>
        </view>
      </view>

      <!-- 姓名输入 -->
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input
          type="text"
          v-model="formData.name"
          placeholder="请输入姓名"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 性别选择 -->
      <view class="form-item gender-select">
        <text class="form-label">性别</text>
        <radio-group @change="handleGenderChange">
          <label class="radio-label">
            <radio value="male" :checked="formData.gender === 'male'" />
            <text>男</text>
          </label>
          <label class="radio-label">
            <radio value="female" :checked="formData.gender === 'female'" />
            <text>女</text>
          </label>
        </radio-group>
      </view>

      <!-- 年龄输入 -->
      <view class="form-item">
        <text class="form-label">年龄</text>
        <input
          type="number"
          v-model="formData.age"
          placeholder="请输入年龄"
          placeholder-class="placeholder"
        />
      </view>

      <!-- 手机号输入 -->
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input
          type="number"
          v-model="formData.phone"
          placeholder="请输入联系方式"
          placeholder-class="placeholder"
          maxlength="11"
        />
      </view>

      <!-- 城市选择 -->
      <view class="form-item city-select" @tap="showCitySelector">
        <text class="form-label">意向合作城市</text>
        <text class="city-placeholder">
          {{ formData.city || "全国城市" }}
          <text class="arrow">></text>
        </text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-container">
      <button class="submit-button" @tap="handleSubmit">立即提交</button>
    </view>

    <!-- 协议同意 -->
    <view class="agreement">
      <checkbox-group @change="handleAgreementChange">
        <checkbox
          value="agreed"
          :checked="isAgreed"
          style="transform: scale(0.7)"
        />
      </checkbox-group>
      <text>我已阅读并同意</text>
      <text class="link" @tap="showAgreement">《教员入驻协议》</text>
    </view>
    <!-- 添加协议弹窗组件 -->
    <AgreementPopup
      v-model:visible="agreementVisible"
      :title="agreements.teacher.title"
      :content="agreements.teacher.content"
      @confirm="handleAgreementConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import AgreementPopup from "@/components/agreement-popup.vue";
import { agreements } from "@/data/agreements";

const agreementVisible = ref(false);

const formData = reactive({
  avatar: "",
  name: "",
  gender: "",
  age: "",
  phone: "",
  city: "",
});

// 选择头像
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      formData.avatar = res.tempFilePaths[0];
    },
  });
};

// 性别选择
const handleGenderChange = (e: any) => {
  formData.gender = e.detail.value;
};

// 显示城市选择器
const showCitySelector = () => {
  uni.navigateTo({
    url: "/pages/city/city-select",
  });
};

// 显示协议
const showAgreement = () => {
  agreementVisible.value = true;
};
// 添加确认协议的处理函数
const handleAgreementConfirm = () => {
  isAgreed.value = true;
};
const isAgreed = ref(false);

// 处理协议同意状态
const handleAgreementChange = (e: any) => {
  isAgreed.value = e.detail.value.length > 0;
};
// 提交表单
const handleSubmit = () => {
  // 表单验证
  if (!formData.avatar) {
    uni.showToast({ title: "请上传头像", icon: "none" });
    return;
  }
  if (!formData.name) {
    uni.showToast({ title: "请输入姓名", icon: "none" });
    return;
  }
  if (!formData.gender) {
    uni.showToast({ title: "请选择性别", icon: "none" });
    return;
  }
  if (!formData.age) {
    uni.showToast({ title: "请输入年龄", icon: "none" });
    return;
  }
  if (!formData.phone) {
    uni.showToast({ title: "请输入手机号", icon: "none" });
    return;
  }
  if (!formData.city) {
    uni.showToast({ title: "请选择意向城市", icon: "none" });
    return;
  }
  if (!isAgreed.value) {
    uni.showToast({ title: "请先同意协议", icon: "none" });
    return;
  }
  // TODO: 提交表单数据到服务器
  //   console.log("提交表单:", formData);
  uni.showToast({
    title: "功能开发中",
    icon: "none",
  });
};

// 监听城市选择
onMounted(() => {
  uni.$on("citySelected", (city: any) => {
    formData.city = city.name;
  });
});

onUnmounted(() => {
  uni.$off("citySelected");
});
</script>

<style scoped>
.recruit-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 20rpx;
}

.banner-image {
  width: 100%;
  height: 300rpx;
  border-radius: 12rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  padding: 30rpx 40rpx 10rpx;
  color: #333;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
  padding: 0 40rpx 30rpx;
}

.form-container {
  padding: 0 40rpx;
}

.form-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-label {
  width: 200rpx;
}

.avatar-box {
  width: 120rpx;
  height: 120rpx;
  border: 2rpx dashed #ff6b6b;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.plus-icon {
  font-size: 60rpx;
  color: #ff6b6b;
}

.gender-select {
  padding: 20rpx;
}

.radio-label {
  margin-right: 60rpx;
}

input {
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
}

.placeholder {
  color: #999;
}

.city-select {
  height: 80rpx;
}

.city-placeholder {
  color: #999;
  font-size: 28rpx;
}

.arrow {
  color: #999;
}

.submit-container {
  padding: 40rpx;
}

.submit-button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: linear-gradient(to right, #ff9a9e, #ff6b6b);
  color: #fff;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.agreement .link {
  color: #007aff;
}
</style>
