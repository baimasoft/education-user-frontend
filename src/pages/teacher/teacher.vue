<template>
  <view class="coach-page">
    <!-- 位置搜索 -->
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
            placeholder="搜索老师名字/擅长乐器"
            @input="performSearch"
          />
        </view>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ active: selectedTab === tab }"
        @tap="setSelectedTab(tab)"
      >
        {{ tab }}
      </view>
    </view>

    <!-- 教员列表 -->
    <view class="coach-list">
      <template v-if="filteredCoaches.length > 0">
        <view
          v-for="coach in filteredCoaches"
          :key="coach.id"
          class="coach-card"
        >
          <view @tap="handleTeacherClick(coach)">
            <view class="coach-card-content">
              <view class="coach-image">
                <image
                  :src="coach.avatar || '/static/images/default-teacher.png'"
                  mode="aspectFill"
                  class="avatar-image"
                />
              </view>
              <view class="coach-header">
                <view class="name-wrapper">
                  <text class="coach-name">{{ coach.name }}</text>
                  <text v-if="coach.available" class="service-badge"
                    >可预约</text
                  >
                  <text v-else class="service-no">休息中</text>
                </view>
                <text class="distance">{{ coach.distance }}km</text>
              </view>
            </view>

            <view class="coach-info">
              <view class="coach-details">
                <text
                  >{{ coach.age }}岁 | 已接单{{ coach.orders }} | 擅长：{{
                    coach.instruments.join("、")
                  }}</text
                >
                <text class="signature">签名：{{ coach.signature }}</text>
              </view>
              <view class="time-tag">最早可约{{ coach.earliestTime }}</view>
            </view>
          </view>
          <view class="coach-footer">
            <view class="price">
              <text class="currency">¥</text>
              <text class="amount">{{ coach.price.toFixed(2) }}</text>
              <text class="unit">起/小时</text>
            </view>
            <button class="book-button" @tap="handleBooking(coach)">
              立即预约
            </button>
          </view>
        </view>
      </template>
      <view v-else class="empty-state">
        <image
          class="empty-icon"
          src="/static/images/default-teacher.png"
          mode="aspectFit"
        />
        <text class="empty-text"
          >{{ cityStore.currentCity?.name || "该地区" }}暂无教员</text
        >
        <text class="empty-subtext">敬请期待</text>
      </view>
    </view>

    <!-- 使用预约弹窗组件 -->
    <booking-popup
      v-model:visible="showBooking"
      :coach="selectedCoach"
      @submit="handleBookingSubmit"
    />

    <!-- 城市选择器 -->
    <CityPicker v-model:visible="showCityPicker" @select="handleCityChange" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCityStore } from "@/stores/city";
import CityPicker from "@/components/CityPicker.vue";
import { useTeacherStore } from "@/stores/teacher";
import BookingPopup from "@/components/booking-popup.vue";

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
}

interface Coach {
  id: number;
  name: string;
  age: number;
  avatar?: string;
  available: boolean;
  distance: string;
  orders: number;
  rating: number;
  signature?: string;
  price: number;
  services?: Service[];
  city: string;
  earliestTime: string;
  instruments: string[];
  address: string;
  introduction: string;
  storeid?: number;
}

const cityStore = useCityStore();
const teacherStore = useTeacherStore();

const selectedTab = ref("推荐教员");
const selectedCoach = ref<Coach | null>(null);
const quantities = ref<{ [key: number]: number }>({});

const tabs = [
  "推荐教员",
  "钢琴",
  "小提琴",
  "古筝",
  "吉他",
  "架子鼓",
  "贝斯",
  "声乐",
  "尤克里里",
];

const coaches = ref<Coach[]>([
  {
    id: 1,
    name: "刘老师",
    age: 28,
    available: true,
    distance: "1.2",
    orders: 128,
    rating: 4.9,
    signature: "专注钢琴教学10年",
    price: 280,
    city: "广州市",
    earliestTime: "明天",
    instruments: ["钢琴"],
    avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
    services: [
      { id: 1, name: "钢琴体验课", duration: "45分钟", price: 99 },
      { id: 2, name: "钢琴正式课", duration: "60分钟", price: 280 },
    ],
    address: "广东省广州市天河路",
    introduction: "",
  },
  {
    id: 2,
    name: "李老师",
    age: 32,
    available: true,
    distance: "2.5",
    orders: 256,
    rating: 4.8,
    signature: "专注小提琴教学12年",
    price: 320,
    city: "深圳市",
    earliestTime: "明天",
    instruments: ["小提琴"],
    avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
    services: [
      { id: 3, name: "小提琴体验课", duration: "45分钟", price: 129 },
      { id: 4, name: "小提琴正式课", duration: "60分钟", price: 320 },
    ],
    address: "广东省深圳市南山区",
    introduction: "",
  },
  {
    id: 3,
    name: "张老师",
    age: 35,
    available: false,
    distance: "0.8",
    orders: 312,
    rating: 4.95,
    signature: "专注古筝教学15年",
    price: 300,
    city: "广州市",
    earliestTime: "明天",
    instruments: ["古筝", "小提琴", "钢琴"],
    avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
    services: [
      { id: 5, name: "古筝体验课", duration: "45分钟", price: 119 },
      { id: 6, name: "古筝正式课", duration: "60分钟", price: 300 },
    ],
    address: "广东省广州市白云区",
    introduction: "",
  },
  {
    id: 4,
    name: "陈老师",
    age: 30,
    available: true,
    distance: "1.5",
    orders: 200,
    rating: 4.85,
    signature: "吉他教学8年经验",
    price: 260,
    city: "广州市",
    earliestTime: "明天",
    instruments: ["吉他", "古筝"],
    avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
    services: [
      { id: 7, name: "吉他体验课", duration: "45分钟", price: 89 },
      { id: 8, name: "吉他正式课", duration: "60分钟", price: 260 },
    ],
    address: "广东省广州市白云区",
    introduction: "",
  },
  {
    id: 5,
    name: "林老师",
    age: 28,
    available: true,
    distance: "3.0",
    orders: 150,
    rating: 4.75,
    signature: "架子鼓教学5年经验",
    price: 350,
    city: "广州市",
    earliestTime: "明天",
    instruments: ["架子鼓"],
    services: [
      { id: 9, name: "架子鼓体验课", duration: "45分钟", price: 139 },
      { id: 10, name: "架子鼓正式课", duration: "60分钟", price: 350 },
    ],
    address: "广东省广州市南沙区",
    introduction:
      "2017级星海音乐学院现代音乐与戏剧学院电子键盘专业学生;\n" +
      "入选星海音乐学院\n" +
      "优秀人才培养计划\n" +
      "亚太电子键盘协会会员\n" +
      "2017年考入星海音乐学院，跟随谢及老师和王稔仪老师进行更专业化的学习\n" +
      "具备良好的音乐理论基础，在编曲和作曲方面有较深入的学习和积累，有扎实的理论基础和良好的执行能力\n" +
      "2021年加入到玖月音乐教育进行执教活动\n" +
      "主要奖项:\n" +
      "2017年荣获星海音乐学院" +
      "笃学奖\n",
  },
]);

// 根据当前城市和分类筛选教员
const filteredCoaches = computed(() => {
  let filtered = coaches.value;
  // 先按城市筛选
  if (cityStore.currentCity?.name) {
    filtered = filtered.filter(
      (coach) => coach.city === cityStore.currentCity?.name
    );
  }
  // 按搜索关键词筛选
  const keyword = searchQuery.value.trim().toLowerCase();
  if (keyword) {
    filtered = filtered.filter(
      (coach) =>
        coach.name.toLowerCase().includes(keyword) ||
        coach.instruments.some((instrument) =>
          instrument.toLowerCase().includes(keyword)
        )
    );
  }

  // 如果是推荐教员，按评分排序
  if (selectedTab.value === "推荐教员") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else {
    // 再按分类筛选
    filtered = filtered.filter((coach) =>
      coach.instruments.includes(selectedTab.value)
    );
  }

  return filtered;
});

const totalPrice = computed(() => {
  if (!selectedCoach.value?.services) return 0;
  return selectedCoach.value.services.reduce((sum, service) => {
    return sum + service.price * (quantities.value[service.id] || 0);
  }, 0);
});

const setSelectedTab = (tab: string) => {
  selectedTab.value = tab;
};

const showBooking = ref(false);

const handleBooking = (coach: Coach) => {
  if (!coach.available) {
    uni.showToast({
      title: "该教员暂不提供服务",
      icon: "none",
    });
    return;
  }
  selectedCoach.value = coach;
  showBooking.value = true;
};

const handleBookingSubmit = () => {
  uni.showToast({
    title: "预约成功",
    icon: "success",
  });
};

// 城市选择相关
const showCityPicker = ref(false);

const handleCityChange = (cityCode: string) => {
  cityStore.setCurrentCity(cityCode);
  showCityPicker.value = false;
  // 可以添加切换城市后的提示
  uni.showToast({
    title: `已切换到${cityStore.currentCity?.name}`,
    icon: "none",
  });
};
// 搜索关键词
const searchQuery = ref("");
// 搜索处理
const performSearch = () => {
  // 可以添加防抖逻辑
};
onMounted(() => {
  cityStore.initCurrentCity();
});

// 处理教员点击
const handleTeacherClick = (teacher: Coach) => {
  teacherStore.updateTeacher(teacher);
  uni.navigateTo({
    url: `/pages/teacher/teacher-detail?id=${teacher.id}`,
  });
};
</script>

<style>
.coach-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 20rpx;
}

/* 删除头部相关样式 */
.header,
.header-icons,
.title,
.icon {
  display: none;
}

.location-search {
  border-radius: 16rpx;
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
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  margin-right: 12rpx;
  color: #999;
  font-size: 28rpx;
}

.search-bar input {
  flex: 1;
  font-size: 28rpx;
  background: transparent;
  border: none;
}

.tabs {
  display: flex;
  flex-wrap: wrap; /* 允许标签换行 */
  justify-content: flex-start; /* 从左侧开始排列 */
  gap: 10rpx; /* 标签之间的间距 */
  padding: 10rpx 20rpx; /* 添加一些内边距 */
}

.tab {
  flex: 0 0 auto; /* 不要让标签平均分配宽度 */
  padding: 10rpx 20rpx;
  margin-bottom: 10rpx; /* 为换行的标签添加垂直间距 */
  border-radius: 30rpx;
  font-size: 28rpx;
  background-color: #f4f4f4;
  color: #666;
}

.tab.active {
  background-color: #007bff;
  color: white;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #ff4d4f;
  border-radius: 4rpx;
}

.coach-list {
  padding: 20rpx;
}

.coach-card {
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  display: flex;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  display: block;
}
.coach-card-content {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.coach-image {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
  border-radius: 60rpx;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 60rpx;
}

.coach-info {
  flex: 1;
}

.coach-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
  width: 80%;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.coach-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

.service-badge {
  font-size: 20rpx;
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}
.service-no {
  font-size: 20rpx;
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.distance {
  font-size: 24rpx;
  color: #999;
}

.coach-details {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.signature {
  display: block;
  margin-top: 4rpx;
  color: #ffa940;
}

.time-tag {
  font-size: 24rpx;
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  width: fit-content;
  margin-top: 4rpx;
}

.coach-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
}

.price {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 24rpx;
  color: #ff4d4f;
}

.amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.unit {
  font-size: 24rpx;
  color: #999;
  margin-left: 4rpx;
}

.book-button {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  line-height: 1.5;
  margin-right: 0;
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
