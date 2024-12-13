<template>
  <view class="agreement-popup" v-if="visible">
    <view class="popup-mask" @tap="handleClose"></view>
    <view class="popup-content">
      <view class="popup-header">
        <text class="popup-title">{{ title }}</text>
        <text class="close-btn" @tap="handleClose">×</text>
      </view>
      <scroll-view class="body" scroll-y style="width: 100%; overflow-y: auto">
        <rich-text :nodes="content"></rich-text>
      </scroll-view>
      <view class="popup-footer">
        <button class="confirm-btn" @tap="handleConfirm">我知道了</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
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

const handleConfirm = () => {
  emit("confirm");
  handleClose();
};

const handleClose = () => {
  emit("update:visible", false);
};
</script>

<style scoped>
.agreement-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.popup-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.popup-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 30rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.popup-body {
  flex: 1;
  max-height: 60vh;
}

.agreement-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
}

.popup-footer {
  padding-top: 20rpx;
}

.confirm-btn {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  border: none;
}
</style>
