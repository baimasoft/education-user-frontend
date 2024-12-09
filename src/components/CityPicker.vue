`<template>
  <view class="city-picker" v-if="visible">
    <view class="mask" @tap="handleClose"></view>
    <view class="content">
      <view class="header">
        <text class="title">选择城市</text>
        <text class="close" @tap="handleClose">×</text>
      </view>
      
      <!-- 当前城市 -->
      <view class="section">
        <view class="section-title">当前城市</view>
        <view class="city-tag current" @tap="handleSelect(currentCity.code)" v-if="currentCity">
          {{ currentCity.name }}
        </view>
        <view class="city-tag current" v-else>定位中...</view>
      </view>

      <!-- 已开通城市 -->
      <view class="section">
        <view class="section-title">已开通城市</view>
        <view class="city-list">
          <view 
            class="city-tag"
            v-for="city in activeCities" 
            :key="city.code"
            @tap="handleSelect(city.code)"
          >
            {{ city.name }}
          </view>
        </view>
      </view>

      <!-- 即将开通 -->
      <view class="section" v-if="comingCities.length">
        <view class="section-title">即将开通</view>
        <view class="city-list">
          <view 
            class="city-tag disabled"
            v-for="city in comingCities" 
            :key="city.code"
          >
            {{ city.name }}
            <text class="coming-soon">即将开通</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useCityStore } from '@/stores/city'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'select'])

const cityStore = useCityStore()

const currentCity = computed(() => cityStore.currentCity)
const activeCities = computed(() => cityStore.activeCities)
const comingCities = computed(() => cityStore.comingCities)

const handleClose = () => {
  emit('update:visible', false)
}

const handleSelect = (cityCode) => {
  emit('select', cityCode)
}
</script>

<style scoped>
.city-picker {
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
  background: rgba(0, 0, 0, 0.5);
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 30rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.city-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.city-tag {
  padding: 16rpx 30rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
}

.city-tag.current {
  background: #e6f7ff;
  color: #1890ff;
}

.city-tag.disabled {
  background: #f5f5f5;
  color: #999;
  position: relative;
}

.coming-soon {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  transform: scale(0.8);
}
</style>`
