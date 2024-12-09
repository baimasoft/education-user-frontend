<template>
  <view class="instrument-purchase-page">
    <!-- 搜索栏 -->
    <view class="search">
      <view class="search-container">
        <view class="divider"></view>
        <view class="search-bar">
          <view class="search-icon">🔍</view>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索乐器"
            @confirm="performSearch"
          />
        </view>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <view
        v-for="category in categories"
        :key="category.value"
        class="category-tab"
        :class="{ active: currentCategory === category.value }"
        @tap="selectCategory(category.value)"
      >
        {{ category.label }}
      </view>
    </view>

    <!-- 乐器列表 -->
    <view class="instrument-list" v-if="filteredInstruments.length > 0">
      <view
        v-for="instrument in filteredInstruments"
        :key="instrument.id"
        class="instrument-item"
        @tap="showInstrumentDetail(instrument)"
      >
        <image
          :src="instrument.image || '/static/images/default-instrument.png'"
          class="instrument-image"
          mode="aspectFill"
        ></image>
        <view class="instrument-info">
          <view class="instrument-name">{{ instrument.name }}</view>
          <view class="instrument-price">
            ¥{{ instrument.price.toFixed(2) }}
            <view class="instrument-sales">销量 {{ instrument.sales }}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="filteredInstruments.length === 0" class="empty-state">
      <image
        class="empty-icon"
        src="/static/images/default-instrument.png"
        mode="aspectFit"
      />
      <text class="empty-text">暂无相关乐器可租赁</text>
      <text class="empty-subtext">敬请期待</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Instrument {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sales: number; // 新增销量字段
}

const searchQuery = ref("");
const currentCategory = ref("all");

const categories = [
  { label: "全部", value: "all" },
  { label: "吉他", value: "guitar" },
  { label: "钢琴", value: "piano" },
  { label: "架子鼓", value: "drums" },
  { label: "小提琴", value: "violin" },
  { label: "电子乐器", value: "electronic" },
  { label: "贝斯", value: "bass" },
];

const instruments = ref<Instrument[]>([
  {
    id: 1,
    name: "初学者吉他套装",
    price: 1299,
    image: "", // 使用默认图片
    category: "guitar",
    sales: 256,
  },
  {
    id: 2,
    name: "电子钢琴",
    price: 3999,
    image: "",
    category: "piano",
    sales: 189,
  },
  {
    id: 3,
    name: "架子鼓套装",
    price: 4599,
    image: "",
    category: "drums",
    sales: 134,
  },
  {
    id: 4,
    name: "电子小提琴",
    price: 2599,
    image: "",
    category: "violin",
    sales: 87,
  },
  {
    id: 5,
    name: "电子鼓",
    price: 5999,
    image: "",
    category: "electronic",
    sales: 45,
  },
]);

const filteredInstruments = computed(() => {
  return instruments.value.filter((instrument) => {
    const matchCategory =
      currentCategory.value === "all" ||
      instrument.category === currentCategory.value;

    const matchSearch =
      searchQuery.value === "" || instrument.name.includes(searchQuery.value);

    return matchCategory && matchSearch;
  });
});

const selectCategory = (category: string) => {
  currentCategory.value = category;
};

const performSearch = () => {
  // 触发搜索逻辑
};

const showInstrumentDetail = (instrument: Instrument) => {
  uni.navigateTo({
    url: `/pages/instrument/instrument-detail?id=${instrument.id}`,
  });
};
</script>

<style scoped>
.instrument-purchase-page {
  padding: 20rpx;
  background-color: #ffffff;
}
.search {
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
}

.search-container {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 12rpx 20rpx;
}

.search-icon {
  font-size: 28rpx;
  color: #999;
  margin-right: 12rpx;
}
.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
}
.search-bar input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.search-bar input::placeholder {
  color: #999;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap; /* 允许标签换行 */
  justify-content: flex-start; /* 从左侧开始排列 */
  gap: 10rpx; /* 标签之间的间距 */
  padding: 10rpx 20rpx; /* 添加一些内边距 */
}

.category-tab {
  flex: 0 0 auto; /* 不要让标签平均分配宽度 */
  padding: 10rpx 20rpx;
  margin-bottom: 10rpx; /* 为换行的标签添加垂直间距 */
  border-radius: 30rpx;
  font-size: 28rpx;
  background-color: #f4f4f4;
  color: #666;
}

.category-tab.active {
  background-color: #007bff;
  color: #ffffff;
}

.instrument-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
  padding: 20rpx;
}

.instrument-item {
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.instrument-image {
  width: 100%;
  height: 300rpx;
}

.instrument-info {
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.instrument-details {
  display: flex;
  flex-direction: column;
}

.instrument-name {
  font-size: 32rpx;
}

.instrument-sales {
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

.instrument-price {
  color: #ff4d4f;
  font-weight: bold;
  text-align: end;
  font-size: 30rpx;
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
</style>
