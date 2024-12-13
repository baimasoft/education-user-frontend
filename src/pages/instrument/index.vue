<template>
  <view class="instrument-container">
    <view class="tabs">
      <view
        class="tab"
        :class="{ active: currentTab === 'owned' }"
        @tap="switchTab('owned')"
      >
        自有乐器
      </view>
      <view
        class="tab"
        :class="{ active: currentTab === 'rental' }"
        @tap="switchTab('rental')"
      >
        租赁乐器
      </view>
    </view>

    <!-- 乐器分类 -->
    <view class="instrument-categories">
      <view scroll-x class="category-scroll">
        <view
          v-for="category in instrumentCategories"
          :key="category"
          class="category-item"
          :class="{ active: selectedCategory === category }"
          @tap="selectCategory(category)"
        >
          {{ category }}
        </view>
      </view>
    </view>

    <!-- 乐器列表 -->
    <view class="instrument-list">
      <view
        v-for="instrument in filteredInstruments"
        :key="instrument.id"
        class="instrument-item"
      >
        <image
          :src="instrument.image || '/static/images/default-instrument.png'"
          class="instrument-image"
          mode="aspectFill"
        />
        <view class="instrument-info">
          <view class="instrument-header">
            <text class="instrument-name">{{ instrument.name }}</text>
            <text
              v-if="currentTab === 'rental'"
              class="rental-status"
              :class="getRentalStatusClass(instrument.rentalStatus)"
            >
              {{ getRentalStatusText(instrument.rentalStatus) }}
            </text>
          </view>

          <view class="instrument-details">
            <view v-if="currentTab === 'owned'" class="detail-item">
              <text class="label">购买日期</text>
              <text class="value">{{ instrument.purchaseDate }}</text>
            </view>

            <view v-if="currentTab === 'rental'" class="detail-item">
              <text class="label">租赁期限</text>
              <text class="value">
                {{ instrument.rentalStartDate }}-
                {{ instrument.rentalEndDate }}
              </text>
            </view>

            <view class="detail-item">
              <text class="label">品牌</text>
              <text class="value">{{ instrument.brand }}</text>
            </view>
          </view>
        </view>

        <view class="instrument-actions">
          <button
            v-if="
              currentTab === 'rental' && instrument.rentalStatus === 'active'
            "
            class="return-btn"
            @tap="returnInstrument(instrument.id)"
          >
            归还
          </button>
          <!-- <button
            v-if="currentTab === 'owned'"
            class="sell-btn"
            @tap="sellInstrument(instrument.id)"
          >
            出售
          </button> -->
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredInstruments.length === 0" class="empty-state">
      <image src="/static/images/default-instrument.png" class="empty-icon" />
      <text class="empty-text">
        {{ currentTab === "owned" ? "暂无自有乐器" : "暂无租赁乐器" }}
      </text>
      <button class="add-instrument-btn" @tap="addInstrument">
        {{ currentTab === "owned" ? "购买乐器" : "租赁乐器" }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 乐器接口定义
interface Instrument {
  id: string;
  name: string;
  category: string;
  image: string;
  brand: string;
  purchaseDate?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalStatus?: "active" | "expired" | "pending";
}

// 响应式变量
const currentTab = ref<"owned" | "rental">("owned");
const selectedCategory = ref<string>("全部");

// 乐器分类
const instrumentCategories = [
  "全部",
  "吉他",
  "钢琴",
  "小提琴",
  "架子鼓",
  "电子琴",
  "尤克里里",
  "贝斯",
  "萨克斯",
  "口琴",
];

// 模拟乐器数据
const ownedInstruments = ref<Instrument[]>([
  {
    id: "1",
    name: "雅马哈古典吉他",
    category: "吉他",
    image: "",
    brand: "YAMAHA",
    purchaseDate: "2022-06-15",
  },
  {
    id: "2",
    name: "卡西欧电钢琴",
    category: "钢琴",
    image: "",
    brand: "CASIO",
    purchaseDate: "2023-01-20",
  },
]);

const rentalInstruments = ref<Instrument[]>([
  {
    id: "1",
    name: "ROLAND电子鼓",
    category: "架子鼓",
    image: "",
    brand: "ROLAND",
    rentalStartDate: "2023-11-01",
    rentalEndDate: "2024-04-30",
    rentalStatus: "active",
  },
  {
    id: "2",
    name: "Fender电贝斯",
    category: "贝斯",
    image: "",
    brand: "Fender",
    rentalStartDate: "2023-09-15",
    rentalEndDate: "2024-02-15",
    rentalStatus: "expired",
  },
]);

// 切换标签页
const switchTab = (tab: "owned" | "rental") => {
  currentTab.value = tab;
  selectedCategory.value = "全部";
};

// 选择乐器分类
const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

// 过滤乐器列表
const filteredInstruments = computed(() => {
  const instruments =
    currentTab.value === "owned"
      ? ownedInstruments.value
      : rentalInstruments.value;

  return selectedCategory.value === "全部"
    ? instruments
    : instruments.filter(
        (instrument) => instrument.category === selectedCategory.value
      );
});

// 获取租赁状态类名
const getRentalStatusClass = (status?: string) => {
  const statusMap = {
    active: "status-active",
    expired: "status-expired",
    pending: "status-pending",
  };
  return statusMap[status || "pending"];
};

// 获取租赁状态文本
const getRentalStatusText = (status?: string) => {
  const statusTextMap = {
    active: "使用中",
    expired: "已过期",
    pending: "待确认",
  };
  return statusTextMap[status || "pending"];
};

// 归还乐器
const returnInstrument = (id: string) => {
  uni.showModal({
    title: "归还乐器",
    content: "确定要归还此乐器吗？",
    success: (res) => {
      if (res.confirm) {
        // 实际业务逻辑：调用归还接口
        rentalInstruments.value = rentalInstruments.value.filter(
          (instrument) => instrument.id !== id
        );
        uni.showToast({
          title: "归还成功",
          icon: "success",
        });
      }
    },
  });
};

// 出售乐器
const sellInstrument = (id: string) => {
  uni.showModal({
    title: "出售乐器",
    content: "确定要出售此乐器吗？",
    success: (res) => {
      if (res.confirm) {
        // 实际业务逻辑：调用出售接口
        ownedInstruments.value = ownedInstruments.value.filter(
          (instrument) => instrument.id !== id
        );
        uni.showToast({
          title: "出售成功",
          icon: "success",
        });
      }
    },
  });
};

// 添加乐器
const addInstrument = () => {
  // 根据当前标签跳转到对应页面
  uni.navigateTo({
    url:
      currentTab.value === "owned"
        ? "/pages/instrument/instrument-purchase"
        : "/pages/instrument/instrument-rental",
  });
};
</script>

<style scoped>
.instrument-container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20rpx;
}

.tabs {
  display: flex;
  margin-bottom: 20rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  color: #666;
  font-size: 28rpx;
}

.tab.active {
  color: #007bff;
  font-weight: bold;
  position: relative;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #007bff;
}

.instrument-categories {
  padding: 10rpx 0;
}

.category-scroll {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10rpx;
  padding: 10rpx 20rpx;
}

.category-item {
  flex: 0 0 auto;
  padding: 10rpx 20rpx;
  margin-bottom: 10rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  background-color: #f4f4f4;
  color: #666;
}

.category-item.active {
  background-color: #007bff;
  color: #ffffff;
}

.instrument-list {
  border-radius: 10rpx;
}

.instrument-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.instrument-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.instrument-info {
  flex: 1;
}

.instrument-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.instrument-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.rental-status {
  font-size: 24rpx;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  margin-left: 10rpx;
}

.status-active {
  background-color: #5cb85c;
  color: #ffffff;
}

.status-expired {
  background-color: #d9534f;
  color: #ffffff;
}

.status-pending {
  background-color: #f0ad4e;
  color: #ffffff;
}

.instrument-details {
  margin-bottom: 10rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 6rpx;
}

.label {
  width: 100rpx;
  color: #666;
  font-size: 24rpx;
}

.value {
  color: #333;
  font-size: 28rpx;
}

.instrument-actions {
  display: flex;
  flex-direction: column;
}

.return-btn,
.sell-btn {
  background-color: #007bff;
  color: #ffffff;
  font-size: 24rpx;
  border-radius: 6rpx;
  margin-bottom: 10rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  /* border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1); */
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.add-instrument-btn {
  background-color: #007bff;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 6rpx;
}
</style>
