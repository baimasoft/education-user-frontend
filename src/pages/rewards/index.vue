<template>
  <view class="rewards-page">
    <!-- 举报说明 -->
    <view class="info-section">
      <view class="section-title">举报说明</view>
      <view class="info-content">
        <view class="info-item">
          <text class="dot">•</text>
          <text class="text">为维护良好的教学环境，欢迎举报违规行为</text>
        </view>
        <view class="info-item">
          <text class="dot">•</text>
          <text class="text">经核实属实的举报将获得相应奖励</text>
        </view>
        <view class="info-item">
          <text class="dot">•</text>
          <text class="text">恶意举报将被追究责任</text>
        </view>
      </view>
    </view>

    <!-- 举报表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label">举报对象</text>
        <input
          class="input"
          v-model="formData.target"
          placeholder="请输入被举报人姓名/昵称"
          type="text"
        />
      </view>

      <view class="form-item">
        <text class="label">违规类型</text>
        <picker
          mode="selector"
          :range="violationTypes"
          :value="typeIndex"
          @change="handleTypeChange"
        >
          <view class="picker">
            {{ typeIndex > -1 ? violationTypes[typeIndex] : "请选择违规类型" }}
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">违规描述</text>
        <textarea
          class="textarea"
          v-model="formData.description"
          placeholder="请详细描述违规行为（至少10字）"
          :maxlength="500"
        />
        <text class="word-count">{{ formData.description.length }}/500</text>
      </view>

      <!-- 图片上传 -->
      <view class="form-item">
        <text class="label">证据上传</text>
        <view class="upload-section">
          <view
            class="image-item"
            v-for="(image, index) in formData.images"
            :key="index"
          >
            <image :src="image" mode="aspectFill" />
            <text class="delete-btn" @tap="handleDeleteImage(index)">×</text>
          </view>
          <view
            class="upload-btn"
            v-if="formData.images.length < 3"
            @tap="handleUploadImage"
          >
            <text class="plus">+</text>
            <text class="upload-text">上传图片</text>
          </view>
        </view>
        <text class="upload-tip">最多上传3张图片，每张不超过5MB</text>
      </view>

      <view class="form-item">
        <text class="label">联系方式</text>
        <input
          class="input"
          v-model="formData.contact"
          placeholder="请输入您的手机号"
          type="number"
          maxlength="11"
        />
      </view>
    </view>

    <!-- 提交按钮 -->
    <button class="submit-btn" @tap="handleSubmit">提交举报</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface FormData {
  target: string;
  type: string;
  description: string;
  images: string[];
  contact: string;
}

const violationTypes = [
  "虚假宣传",
  "恶意欺诈",
  "服务违约",
  "人身攻击",
  "其他违规",
];

const typeIndex = ref(-1);
const formData = ref<FormData>({
  target: "",
  type: "",
  description: "",
  images: [],
  contact: "",
});

// 处理违规类型选择
const handleTypeChange = (e: any) => {
  typeIndex.value = e.detail.value;
  formData.value.type = violationTypes[typeIndex.value];
};

// 处理图片上传
const handleUploadImage = () => {
  uni.chooseImage({
    count: 3 - formData.value.images.length,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      formData.value.images.push(...res.tempFilePaths);
    },
  });
};

// 处理删除图片
const handleDeleteImage = (index: number) => {
  formData.value.images.splice(index, 1);
};

// 处理提交
const handleSubmit = () => {
  // 表单验证
  if (!formData.value.target) {
    uni.showToast({ title: "请输入举报对象", icon: "none" });
    return;
  }
  if (!formData.value.type) {
    uni.showToast({ title: "请选择违规类型", icon: "none" });
    return;
  }
  if (formData.value.description.length < 10) {
    uni.showToast({ title: "违规描述至少10个字", icon: "none" });
    return;
  }
  if (!formData.value.contact) {
    uni.showToast({ title: "请输入联系方式", icon: "none" });
    return;
  }
  if (!/^1\d{10}$/.test(formData.value.contact)) {
    uni.showToast({ title: "请输入正确的手机号", icon: "none" });
    return;
  }

  // TODO: 提交举报信息到服务器
  uni.showLoading({ title: "提交中..." });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: "举报提交成功",
      icon: "success",
      success: () => {
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      },
    });
  }, 1500);
};
</script>

<style scoped>
.rewards-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.info-section {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.info-content {
  padding: 10rpx 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.dot {
  color: #ff4d4f;
  margin-right: 10rpx;
}

.text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.form-section {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.picker {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  color: #333;
}

.textarea {
  width: 100%;
  height: 240rpx;
  border: 2rpx solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.word-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 8rpx;
}

.upload-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  position: relative;
}

.image-item image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.delete-btn {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  width: 40rpx;
  height: 40rpx;
  line-height: 36rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  font-size: 32rpx;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.plus {
  font-size: 48rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
}

.submit-btn:active {
  opacity: 0.8;
}
</style> 