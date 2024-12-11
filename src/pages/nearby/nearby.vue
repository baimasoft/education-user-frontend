<template>
  <view class="nearby-page">
    <!-- 头部搜索区域 -->
    <view class="location-search">
      <view class="search-wrapper">
        <view class="location" @tap="showCityPicker = true">
          <text class="location-icon">📍</text>
          <text class="city">{{
            cityStore.currentCity?.name || "选择城市"
          }}</text>
          <text class="dropdown-icon">▼</text>
        </view>
        <view class="divider"></view>
        <view class="search-bar">
          <text class="search-icon">🔍</text>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索门店名称/地址/乐器"
            @input="performSearch"
          />
        </view>
      </view>
    </view>

    <!-- 添加排序选项 -->
    <view class="sort-bar">
      <text
        class="sort-item"
        :class="{ active: sortType === 'distance' }"
        @tap="handleSort('distance')"
        >距离最近</text
      >
      <text
        class="sort-item"
        :class="{ active: sortType === 'rating' }"
        @tap="handleSort('rating')"
        >评分最高</text
      >
    </view>

    <!-- 门店列表 -->
    <view class="store-list">
      <template v-if="filteredStores.length > 0">
        <view
          v-for="store in sortedStores"
          :key="store.id"
          class="store-item"
          @tap="handleStoreSelect(store)"
        >
          <image
            class="store-image"
            :src="store.image || '/static/images/default-nearby.png'"
            mode="aspectFill"
          />
          <view class="store-info">
            <view class="store-header">
              <text class="store-name">{{ store.name }}</text>
              <text
                :class="[
                  'store-status',
                  store.status === '营业中' ? 'status-open' : 'status-closed',
                ]"
              >
                {{ store.status }}
              </text>
              <text class="distance">{{ store.distance }}km</text>
            </view>
            <view class="store-address">
              <text class="address-icon">📍</text>
              <text>{{ store.address }}</text>
            </view>
            <view class="store-features">
              <text
                v-for="(feature, index) in store.features"
                :key="index"
                class="store-tag feature-tag"
                >{{ feature }}</text
              >
              <text
                v-for="(instrument, index) in store.instruments"
                :key="index"
                class="store-tag instrument-tag"
                >{{ instrument }}</text
              >
            </view>
            <view class="store-footer">
              <view class="rating">
                <text class="star">⭐</text>
                <text>{{ store.rating }}</text>
              </view>
              <text class="order-count">已接单 {{ store.orderCount }}</text>
              <view class="price-box">
                <view class="price-symbol">¥</view>
                <view class="price">{{ store.price }}</view>
                <view class="unit">/小时</view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <view v-else class="empty-state">
        <image
          class="empty-icon"
          src="/static/images/default-nearby.png"
          mode="aspectFit"
        />
        <text class="empty-text"
          >{{ cityStore.currentCity?.name || "该地区" }}暂无门店</text
        >
        <text class="empty-subtext">敬请期待</text>
      </view>
    </view>
    <!-- 城市选择器 -->
    <CityPicker v-model:visible="showCityPicker" @select="handleCityChange" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCityStore } from "@/stores/city";
import CityPicker from "@/components/CityPicker.vue";
import { useStoreStore } from "@/stores/store";

const cityStore = useCityStore();
const storeStore = useStoreStore();

interface Store {
  id: number;
  name: string;
  status: string;
  price: string;
  distance: number;
  address: string;
  features: string[];
  rating: string;
  orderCount: number;
  image?: string;
  city: string;
  instruments: string[];
  businessHours: string;
  phone: string;
}

const showCityPicker = ref(false);
// 搜索关键词
const searchQuery = ref("");

const stores = ref<Store[]>([
  {
    id: 0,
    name: "雀巢音乐东尚城门店",
    status: "营业中",
    price: "189",
    distance: 1.2,
    address: "天河路123号音乐大厦3楼",
    features: ["免服务费", "可预约"],
    rating: "4.8",
    image: "",
    orderCount: 1560,
    city: "广州市",
    instruments: ["吉他", "钢琴", "架子鼓"],
    businessHours: "10:00-23:00",
    phone: "0571-88888888",
  },
  {
    id: 1,
    name: "音乐空间(天河店)",
    status: "营业中",
    price: "109",
    distance: 0.8,
    address: "天河路123号音乐大厦3楼",
    features: ["免费WiFi", "停车场", "休息区"],
    rating: "4.9",
    orderCount: 2890,
    city: "广州市",
    instruments: ["小提琴", "古筝", "电子琴"],
    businessHours: "10:00-23:00",
    phone: "0571-88888888",
  },
  {
    id: 2,
    name: "乐器中心(珠江新城店)",
    status: "休息中",
    price: "199",
    distance: 1.2,
    address: "珠江新城华夏路456号",
    features: ["免费WiFi", "器材租赁", "休息区"],
    rating: "5.0",
    orderCount: 1560,
    city: "广州市",
    instruments: ["架子鼓", "贝斯", "电吉他"],
    businessHours: "10:00-23:00",
    phone: "0571-88888888",
  },
]);

const filteredStores = computed(() => {
  let result = stores.value;
  // 按城市筛选
  if (cityStore.currentCity) {
    result = result.filter(
      (store) => store.city === cityStore.currentCity?.name
    );
  }
  // 按搜索关键词筛选
  const keyword = searchQuery.value.trim().toLowerCase();
  if (keyword) {
    result = result.filter(
      (store) =>
        store.name.toLowerCase().includes(keyword) ||
        store.address.toLowerCase().includes(keyword) ||
        store.instruments.some((instrument) =>
          instrument.toLowerCase().includes(keyword)
        )
    );
  }

  return result;
});

const handleSearch = () => {
  // 搜索已通过计算属性实现
};

const handleStoreSelect = (store: Store) => {
  storeStore.updateStore(store);
  uni.navigateTo({
    url: `/pages/nearby/store-detail?id=${store.id}`,
  });
};

const handleCityChange = (cityCode: string) => {
  cityStore.setCurrentCity(cityCode);
  showCityPicker.value = false;
};

// 添加排序类型
const sortType = ref<"distance" | "rating">("distance");

// 处理排序
const handleSort = (type: "distance" | "rating") => {
  sortType.value = type;
};

// 排序后的门店列表
const sortedStores = computed(() => {
  const sorted = [...stores.value];
  if (sortType.value === "distance") {
    // 按距离排序（近到远）
    return sorted.sort((a, b) => Number(a.distance) - Number(b.distance));
  } else {
    // 按评分排序（高到低）
    return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
  }
});

onMounted(() => {
  cityStore.initCurrentCity();
});
</script>

<style>
.nearby-page {
  min-height: 100vh;
  padding: 20rpx;
  background: #ffffff;
}

.location-search {
  padding: 20rpx;
  border-radius: 12rpx;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 12rpx 20rpx;
}

.location {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-right: 16rpx;
}

.location-icon {
  font-size: 32rpx;
}

.city {
  font-size: 28rpx;
  color: #333;
}

.dropdown-icon {
  font-size: 24rpx;
  color: #999;
}

.divider {
  width: 2rpx;
  height: 32rpx;
  background: #ddd;
  margin: 0 16rpx;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  font-size: 28rpx;
  color: #999;
  margin-right: 12rpx;
}

.search-bar input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.search-bar input::placeholder {
  color: #999;
}

.store-list {
  padding: 20rpx;
}

.store-item {
  margin-bottom: 20rpx;
  display: flex;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.store-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.store-info {
  flex: 1;
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10rpx;
}
.store-status-price {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.store-status {
  font-size: 22rpx;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
}
.store-status.status-open {
  background-color: #e6f7ff;
  color: #1890ff;
}

.store-status.status-closed {
  background-color: #fff1f0;
  color: #f5222d;
}
.price-box {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
}
.price-symbol {
  font-size: 24rpx;
  color: #ff4d4f;
  font-weight: bold;
}
.price {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: bold;
}
.unit {
  font-size: 24rpx;
  color: #999;
  margin-left: 4rpx;
}
.store-name {
  font-size: 32rpx;
  font-weight: bold;
  width: 280rpx;
}

.distance {
  font-size: 24rpx;
  color: #999;
}

.store-address {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.address-icon {
  font-size: 24rpx;
}

.store-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 10rpx;
}
.store-tag {
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
}
.feature-tag {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}
.instrument-tag {
  color: #007bff;
  background: rgba(0, 123, 255, 0.1);
}

.store-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.star {
  color: #ffd700;
}

.order-count {
  font-size: 24rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 200rpx;
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.empty-subtext {
  font-size: 28rpx;
  color: #999;
}

/* 排序栏样式 */
.sort-bar {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.sort-item {
  font-size: 28rpx;
  color: #666;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  background: #f4f4f4;
}

.sort-item.active {
  color: #ffffff;
  background: #007bff;
}
</style>
