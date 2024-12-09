<template>
  <view class="city-select">
    <!-- 顶部操作栏 -->
    <view class="header">
      <text class="cancel" @tap="handleCancel">取消</text>
      <text class="confirm" @tap="handleConfirm">确定</text>
    </view>

    <!-- 城市列表 -->
    <scroll-view scroll-y class="city-list">
      <!-- 全部城市列表 -->
      <view class="all-cities">
        <!-- 热门城市列表 -->
        <view class="province-section">
          <view class="province-name">热门城市</view>
          <view class="city-grid">
            <view
              v-for="city in hotCities"
              :key="city.id"
              class="city-item"
              :class="{ active: selectedCity?.code === city.code }"
              @tap="selectCity(city)"
              >{{ city.name }}</view
            >
          </view>
        </view>
        <view
          v-for="province in provinces"
          :key="province.code"
          class="province-section"
        >
          <view class="province-name">{{ province.name }}</view>
          <view class="city-grid">
            <view
              v-for="city in province.cities"
              :key="city.code"
              class="city-item"
              :class="{ active: selectedCity?.code === city.code }"
              @tap="selectCity(city)"
            >
              {{ city.name }}
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import cityData from "@/data/china-cities.json";

interface City {
  code: string;
  name: string;
}

interface Province {
  code: string;
  name: string;
  cities: City[];
}

const selectedCity = ref<City | null>(null);

// 使用导入的城市数据
const provinces = cityData.provinces;
const hotCities = cityData.hotCities;
// 选择城市
const selectCity = (city: City) => {
  selectedCity.value = city;
};

// 取消选择
const handleCancel = () => {
  uni.navigateBack();
};

// 确认选择
const handleConfirm = () => {
  if (selectedCity.value) {
    // 使用事件总线传递选中的城市数据
    uni.$emit("citySelected", selectedCity.value);
    uni.navigateBack();
  } else {
    uni.showToast({
      title: "请选择城市",
      icon: "none",
    });
  }
};
</script>

<style scoped>
.city-select {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  padding: 70rpx 30rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.cancel,
.confirm {
  font-size: 32rpx;
  padding: 10rpx 20rpx;
}

.cancel {
  color: #666;
}

.confirm {
  color: #333;
  font-weight: bold;
}

.city-list {
  flex: 1;
  height: calc(100vh - 100rpx);
}

.all-cities {
  padding: 20rpx;
}

.province-section {
  margin-bottom: 40rpx;
}

.province-name {
  font-size: 28rpx;
  color: #999;
  padding: 20rpx 0;
}

.city-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.city-item {
  width: calc(33.33% - 20rpx);
  height: 80rpx;
  margin: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
}

.city-item.active {
  background-color: #f0f9ff;
  color: #007aff;
  font-weight: bold;
}
</style>
