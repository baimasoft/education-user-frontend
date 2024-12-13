<template>
  <view class="video-player">
    <web-view v-if="isEmbedUrl" :src="embedUrl"></web-view>
    <video
      v-else
      id="myVideo"
      class="video"
      :src="videoUrl"
      :controls="true"
      :show-center-play-btn="true"
      :enable-progress-gesture="true"
      :show-fullscreen-btn="true"
      :initial-time="0"
      :direction="90"
      :object-fit="objectFit"
      @error="handleError"
      @play="handlePlay"
    ></video>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const videoUrl = ref('');
const isEmbedUrl = ref(false);
const embedUrl = ref('');
const objectFit = ref('contain');

// 视频平台的正则表达式和嵌入URL模板
const platforms = {
  bilibili: {
    regex: /bilibili\.com\/video\/(BV[\w]+)/,
    embedTemplate: 'https://player.bilibili.com/player.html?bvid={id}&high_quality=1&danmaku=0'
  },
  youku: {
    regex: /v\.youku\.com\/v_show\/id_([a-zA-Z0-9=]+)/,
    embedTemplate: 'https://player.youku.com/embed/{id}'
  },
  qq: {
    regex: /v\.qq\.com\/x\/cover\/\w+\/(\w+)/,
    embedTemplate: 'https://v.qq.com/txp/iframe/player.html?vid={id}'
  },
  ixigua: {
    regex: /ixigua\.com\/(\d+)/,
    embedTemplate: 'https://www.ixigua.com/iframe/{id}'
  }
};

// 解析视频URL
const parseVideoUrl = (url: string) => {
  // 检查是否是直接的视频文件链接
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    videoUrl.value = url;
    isEmbedUrl.value = false;
    return;
  }

  // 检查各平台的链接
  for (const [platform, config] of Object.entries(platforms)) {
    const match = url.match(config.regex);
    if (match) {
      isEmbedUrl.value = true;
      embedUrl.value = config.embedTemplate.replace('{id}', match[1]);
      return;
    }
  }

  // 如果都不匹配，尝试作为普通视频链接处理
  videoUrl.value = url;
  isEmbedUrl.value = false;
};

// 处理播放开始
const handlePlay = () => {
  // 自动进入全屏
  const videoContext = uni.createVideoContext('myVideo');
  setTimeout(() => {
    videoContext.requestFullScreen({
      direction: 90
    });
  }, 100);
};

// 错误处理
const handleError = () => {
  uni.showToast({
    title: '视频加载失败',
    icon: 'none'
  });
};

// 页面加载时获取视频链接
onLoad((options) => {
  if (options?.url) {
    const decodedUrl = decodeURIComponent(options.url);
    parseVideoUrl(decodedUrl);
  }
});
</script>

<style scoped>
.video-player {
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

web-view {
  width: 100%;
  height: 100%;
}

/* 横屏样式 */
@media screen and (orientation: landscape) {
  .video {
    width: 100vw;
    height: 100vh;
  }
}
</style> 