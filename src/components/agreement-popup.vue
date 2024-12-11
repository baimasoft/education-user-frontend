<template>
  <view class="agreement-popup" v-if="visible">
    <view class="mask" @tap="handleClose"></view>
    <view class="content">
      <view class="header">
        <text class="title">{{ title }}</text>
        <text class="close" @tap="handleClose">×</text>
      </view>
      <scroll-view class="body" scroll-y style="width: 92%">
        <rich-text :nodes="content"></rich-text>
      </scroll-view>
      <view class="footer">
        <button class="confirm-btn" @tap="handleConfirm">我已阅读并同意</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:visible", "confirm"]);

const handleClose = () => {
  emit("update:visible", false);
};

const handleConfirm = () => {
  emit("confirm");
  handleClose();
};
</script>

<style>
.agreement-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.header {
  position: relative;
  padding: 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.close {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40rpx;
  color: #999;
}

.body {
  padding: 30rpx;
  max-height: 60vh;
}

.footer {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #eee;
}

.confirm-btn {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.confirm-btn:active {
  opacity: 0.8;
}
</style>
