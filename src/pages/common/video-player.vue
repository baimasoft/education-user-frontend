<template>
  <view class="video-player">
    <video
      id="myVideo"
      :src="videoUrl"
      :title="videoTitle"
      :controls="true"
      :autoplay="true"
      :show-fullscreen-btn="true"
      :show-play-btn="true"
      :show-center-play-btn="true"
      :enable-progress-gesture="true"
      :show-progress="true"
      object-fit="contain"
      @error="handleError"
    ></video>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const videoUrl = ref('');
const videoTitle = ref('');

onLoad((options) => {
  if (options.url) {
    videoUrl.value = decodeURIComponent(options.url);
  }
  if (options.title) {
    videoTitle.value = decodeURIComponent(options.title);
  }
});

const handleError = (err: any) => {
  console.error('视频播放错误:', err);
  uni.showToast({
    title: '视频加载失败',
    icon: 'none'
  });
};

onMounted(() => {
  // 设置导航栏标题
  uni.setNavigationBarTitle({
    title: videoTitle.value || '视频播放'
  });
});
</script>

<style>
.video-player {
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

video {
  width: 100%;
  height: 100%;
}
</style> 