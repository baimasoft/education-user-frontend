<template>
  <view class="home">
    <!-- 轮播图模块 -->
    <swiper
      class="banner"
      circular
      autoplay
      :interval="3000"
      :duration="500"
      :indicator-dots="true"
      indicator-color="rgba(255, 255, 255, 0.6)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="(item, index) in banners" :key="index">
        <view class="swiper-item">
          <image
            :src="item.image"
            mode="aspectFill"
            class="banner-image"
          ></image>
        </view>
      </swiper-item>
    </swiper>

    <!-- 服务承诺模块 -->
    <view class="service-promises">
      <view class="promise-item">
        <text class="promise-icon">💯</text>
        <text class="promise-text">爽约包赔</text>
      </view>
      <view class="promise-item">
        <text class="promise-icon">⏰</text>
        <text class="promise-text">超时秒退</text>
      </view>
      <view class="promise-item">
        <text class="promise-icon">👨‍🏫</text>
        <text class="promise-text">专业教员</text>
      </view>
    </view>
    <!-- 分类卡片 -->
    <view class="category-cards">
      <view
        class="category-card nearby-teacher"
        @tap="handleCategoryCardClick('nearby')"
      >
        <view class="card-content">
          <view class="card-title">附近教员</view>
          <view class="card-subtitle">百名教员在线挑选</view>
          <view class="card-button">立即预约</view>
        </view>
      </view>
      <view
        class="category-card hot-course"
        @tap="handleCategoryCardClick('course')"
      >
        <view class="card-content">
          <view class="card-title">热门课程</view>
          <view class="card-subtitle">购买课程更划算~</view>
          <view class="card-button">立即购买</view>
        </view>
      </view>
    </view>
    <!-- 功能卡片 -->
    <view class="feature-grid">
      <view
        v-for="(feature, index) in features"
        :key="index"
        class="feature-item"
        @tap="handleFeatureClick(feature)"
      >
        <image
          class="feature-icon"
          :src="feature.icon"
          mode="aspectFit"
        ></image>
        <text class="feature-label">{{ feature.text }}</text>
      </view>
    </view>

    <!-- 推荐门店 -->
    <view class="section">
      <view class="recommend-header">
        <view class="tab-group">
          <text
            class="tab-item"
            :class="{ active: activeTab === 'stores' }"
            @tap="activeTab = 'stores'"
            >热门门店</text
          >
          <text
            class="tab-item"
            :class="{ active: activeTab === 'courses' }"
            @tap="activeTab = 'courses'"
            >热门课程</text
          >
        </view>
        <text class="more-link" @tap="handleMoreClick">更多</text>
      </view>

      <view class="store-list" v-if="activeTab === 'stores'">
        <view
          class="store-item"
          v-for="(store, index) in sortedStores"
          :key="index"
          @tap="handleStoreClick(store)"
        >
          <view class="store-left">
            <image
              class="store-image"
              :src="store.image || '/static/images/default-nearby.png'"
              mode="aspectFill"
            ></image>
          </view>
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
            </view>
            <view class="store-address">
              <text class="address-icon">📍</text>
              <text>{{ store.address }}</text>
            </view>
            <view class="store-tags">
              <text class="tag city">{{ store.city }}</text>
              <text
                class="tag free-service"
                v-for="(feature, index) in store.features"
                :key="index"
                >{{ feature }}</text
              >
              <text
                class="tag duration"
                v-for="(instrument, index) in store.instruments"
                :key="index"
                >{{ instrument }}</text
              >
            </view>
            <view class="store-bottom">
              <view class="price-box">
                <text class="price-symbol">¥</text>
                <text class="price">{{ store.price }}</text>
                <text class="unit">/小时</text>
              </view>
              <view class="rating">
                <text class="star">⭐</text>
                <text>{{ store.rating }}</text>
              </view>
              <view class="distance">
                <text class="location-icon">📍</text>
                <text>{{ store.distance }}km</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- TODO: 添加课程列表 -->
      <view class="course-list" v-else>
        <view
          class="course-item"
          v-for="(course, index) in courses"
          :key="index"
          @tap="handleCourseClick(course)"
        >
          <view class="course-left">
            <image
              class="course-image"
              :src="course.image || '/static/images/default-course.png'"
              mode="aspectFill"
            ></image>
          </view>
          <view class="course-right">
            <text class="course-name">{{ course.name }}</text>
            <text class="course-desc">{{ course.description }}</text>
            <view class="store-tags">
              <text
                v-for="(tag, tagIndex) in course.tags"
                :key="tagIndex"
                class="tag free-service"
                >{{ tag }}</text
              >
            </view>
            <view class="course-footer">
              <text class="course-price">¥{{ course.price }}</text>
              <text class="course-sales">已售 {{ course.sales }}</text>
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="
          (activeTab === 'stores' && stores.length === 0) ||
          (activeTab === 'courses' && courses.length === 0)
        "
        class="empty-state"
      >
        <image
          class="empty-icon"
          :src="
            activeTab === 'stores'
              ? '/static/images/default-nearby.png'
              : '/static/images/default-course.png'
          "
          mode="aspectFit"
        />
        <text class="empty-text">暂无内容</text>
        <text class="empty-subtext">敬请期待</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStoreStore } from "@/stores/store";

const storeStore = useStoreStore();

interface Banner {
  image: string;
}

interface Feature {
  icon: string;
  text: string;
  path: string;
}
interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  sales: number;
  image: string;
  categoryId: string;
  tags: string[];
}

const activeTab = ref<"stores" | "courses">("stores");

const banners = ref<Banner[]>([
  {
    image:
      "https://media.istockphoto.com/id/1347685599/zh/%E7%85%A7%E7%89%87/young-asian-man-with-eyes-closed-enjoying-music-over-headphones-while-relaxing-on-the-sofa-at.jpg?s=2048x2048&w=is&k=20&c=kE7QiJFSFPKLUc7kkYErm3-hk532rJaojzkSTWauqjQ=",
  },
  {
    image:
      "https://media.istockphoto.com/id/161838634/zh/%E7%85%A7%E7%89%87/rock-concert.jpg?s=2048x2048&w=is&k=20&c=uwX-5wpbsUJtk_ddlVqXj9tmKp7q_PEg0ao69DFfLWA=",
  },
  {
    image:
      "https://media.istockphoto.com/id/1488536685/zh/%E7%85%A7%E7%89%87/grandfather-enjoy-singing-and-playing-music-with-family-in-the-living-room-at-home.jpg?s=2048x2048&w=is&k=20&c=tkYO3nBJGoxwH4-p2wefJLTqzHca3tmhSBOKx32Oy2A=",
  }
]);

const features = ref<Feature[]>([
  // {
  //   icon: "/static/images/music1.png",
  //   text: "乐器租赁",
  //   path: "/pages/instrument/instrument-rental",
  // },
  // {
  //   icon: "/static/images/music2.png",
  //   text: "乐器购买",
  //   path: "/pages/instrument/instrument-purchase",
  // },
  // {
  //   icon: "/static/images/music3.png",
  //   text: "乐室预约",
  //   path: "/pages/room/room-reservation",
  // },
  // {
  //   icon: "/static/images/music4.png",
  //   text: "课程购买",
  //   path: "/pages/course/index",
  // },
  {
    icon: "/static/icons/teacher-recruit.png",
    text: "教员招募",
    path: "/pages/teacher/teacher-recruit",
  },
  {
    icon: "/static/icons/nearby.png",
    text: "门店入驻",
    path: "/pages/nearby/store-register",
  },
  {
    icon: "/static/icons/invite.png",
    text: "邀请好友",
    path: "",
  },
  {
    icon: "/static/icons/voucher.png",
    text: "领券下单",
    path: "/pages/voucher/index",
  },
]);

const stores = computed(() => storeStore.storeList);
const courses = ref<Course[]>([
  // {
  //   id: "1",
  //   name: "钢琴基础课程",
  //   description: "适合零基础学习者，从基本乐理知识开始",
  //   price: 299,
  //   sales: 156,
  //   image: "",
  //   categoryId: "piano",
  //   tags: ["零基础", "一对一", "可试听"],
  // },
  // {
  //   id: "2",
  //   name: "吉他入门课程",
  //   description: "通过简单曲目快速入门吉他弹唱",
  //   price: 199,
  //   sales: 234,
  //   image: "",
  //   categoryId: "guitar",
  //   tags: ["热门", "免费教材", "可试听"],
  // },
]);
const handleCategoryCardClick = (type: "nearby" | "course") => {
  if (type === "nearby") {
    // 跳转到教员页面
    uni.switchTab({
      url: "/pages/teacher/teacher",
    });
  } else if (type === "course") {
    // 跳转到课程页面
    uni.navigateTo({
      url: "/pages/course/index",
    });
  }
};
const handleFeatureClick = (feature: Feature): void => {
  // 如果路径为空显示开发中提示
  if (!feature.path) {
    uni.showToast({
      title: "功能开发中",
      icon: "none",
    });
    return;
  }

  // tabbar页面列表
  const tabbarPages = [
    "/pages/teacher/teacher",
    "/pages/nearby/nearby",
    "/pages/orders/orders",
    "/pages/profile/profile",
  ];

  // 判断是否是tabbar页面
  if (tabbarPages.includes(feature.path)) {
    uni.switchTab({
      url: feature.path,
      fail: () => {
        uni.showToast({
          title: "功能开发中",
          icon: "none",
        });
      },
    });
  } else {
    uni.navigateTo({
      url: feature.path,
      fail: () => {
        uni.showToast({
          title: "功能开发中",
          icon: "none",
        });
      },
    });
  }
};
const handleCourseClick = (course: Course) => {
  uni.navigateTo({
    url: `/pages/course/detail?id=${course.id}`,
    fail: () => {
      uni.showToast({
        title: "功能开发中",
        icon: "none",
      });
    },
  });
};

const handleMoreClick = () => {
  if (activeTab.value === "stores") {
    uni.switchTab({
      url: "/pages/nearby/nearby",
    });
  } else {
    uni.navigateTo({
      url: "/pages/course/index",
      fail: () => {
        uni.showToast({
          title: "功能开发中",
          icon: "none",
        });
      },
    });
  }
};

const handleStoreClick = (store: Store) => {
  storeStore.updateStore(store);
  uni.navigateTo({
    url: `/pages/nearby/store-detail?id=${store.id}`,
  });
};

// 添加地理位置相关函数
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // 地球半径，单位km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // 返回1位小数
};

// 获取当前位置
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    // 先检查权限状态
    uni.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.userLocation"]) {
          // 如果未授权，直接请求权限
          uni.authorize({
            scope: "scope.userLocation",
            success: () => {
              // 授权成功后获取位置
              getLocation(resolve, reject);
            },
            fail: () => {
              // 用户拒绝授权，提示打开设置
              showLocationSettingDialog(resolve, reject);
            },
          });
        } else {
          // 已授权，直接获取位置
          getLocation(resolve, reject);
        }
      },
      fail: (err) => {
        console.error("获取设置失败:", err);
        reject(err);
      },
    });
  });
};

// 修改获取位置的实现
const getLocation = (resolve: Function, reject: Function) => {
  // 使用 uni.getLocation 的 type 为 wgs84，更稳定
  uni.getLocation({
    type: "wgs84", // 使用 wgs84 类型
    isHighAccuracy: true, // 开启高精度定位
    highAccuracyExpireTime: 3000, // 超时时间，单位 ms
    success: (res) => {
      resolve({
        latitude: res.latitude,
        longitude: res.longitude,
      });
    },
    fail: (err) => {
      console.error("获取位置失败:", err);
      // 失败时返回默认位置（可以设置为城市中心点）
      resolve({
        latitude: 23.03504, // 默认纬度
        longitude: 113.726245, // 默认经度
      });
    },
  });
};

// 显示打开设置的对话框
const showLocationSettingDialog = (resolve: Function, reject: Function) => {
  uni.showModal({
    title: "需要位置权限",
    content: "需要获取您的地理位��才能计算距离，是否去设置打开？",
    success: (res) => {
      if (res.confirm) {
        // 打开设置页面
        uni.openSetting({
          success: (settingRes) => {
            if (settingRes.authSetting["scope.userLocation"]) {
              // 用户在设置页面打开了权限
              getLocation(resolve, reject);
            } else {
              reject(new Error("用户未授权位置权限"));
            }
          },
        });
      } else {
        reject(new Error("用户取消授权"));
      }
    },
  });
};

// 更新所有门店的距离
const updateStoresDistance = async () => {
  try {
    const currentLocation = (await new Promise((resolve, reject) => {
      getLocation(resolve, reject);
    })) as {
      latitude: number;
      longitude: number;
    };

    // 更新每个门店的距离
    const updatedStores = stores.value.map((store) => {
      if (store.latitude && store.longitude) {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          store.latitude,
          store.longitude
        );
        return {
          ...store,
          distance: Number(distance),
        };
      }
      return {
        ...store,
        distance: 999, // 如果没有经纬度信息，设置一个较大的距离值
      };
    });

    // 更新 store 中的数据
    storeStore.$patch({
      storeList: updatedStores
    });
  } catch (error) {
    console.error("更新距离失败:", error);
    // 失败时使用默认距离
    const defaultStores = stores.value.map((store) => ({
      ...store,
      distance: store.distance || 999,
    }));
    
    // 更新 store 中的数据
    storeStore.$patch({
      storeList: defaultStores
    });
  }
};

// 修改排序逻辑
const sortedStores = computed(() => {
  if (!stores.value || stores.value.length === 0) return [];
  
  return [...stores.value].sort((a, b) => {
    // 确保有距离信息的排在前面
    if (a.distance && !b.distance) return -1;
    if (!a.distance && b.distance) return 1;
    return a.distance - b.distance;
  });
});

// 修改页面加载时的处理
onMounted(() => {
  // 延迟执行位置更新
  setTimeout(() => {
    updateStoresDistance().catch((err) => {
      console.error("距离更新失败:", err);
    });
  }, 1000);
});
</script>

<style>
/* 轮播图样式 */
.banner {
  width: 100%;
  height: 300rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.swiper-item {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  display: block;
}

/* swiper item样式 */
:deep(.uni-swiper-slide-frame) {
  width: 100%;
  height: 100%;
}

:deep(.uni-swiper-dot) {
  width: 8rpx;
  height: 8rpx;
  border-radius: 4rpx;
  margin: 0 6rpx;
}

:deep(.uni-swiper-dot-active) {
  width: 16rpx;
}

/* 添加服务承诺模块样式 */
.service-promises {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20rpx 30rpx;
  margin: 20rpx;
  border-radius: 12rpx;
}

.promise-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.promise-icon {
  font-size: 36rpx;
}

.promise-text {
  font-size: 24rpx;
  color: #333;
}

.home {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 20rpx;
}

/* 分类卡片样式 */
.category-cards {
  display: flex;
  padding: 0 20rpx;
}

.category-card {
  flex: 1;
  height: 180rpx;
  padding: 20rpx;
  position: relative;
  overflow: hidden;
}

.nearby-teacher {
  background: url("/static/images/screen_item1.png") no-repeat center center;
  background-size: contain;
}

.hot-course {
  background: url("/static/images/screen_item2.png") no-repeat center center;
  background-size: contain;
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 30rpx;
}

.card-title {
  font-size: 38rpx;
  font-weight: bold;
  color: #333;
}

.card-subtitle {
  font-size: 24rpx;
  color: #d49b7c;
  margin-top: 8rpx;
}

.card-button {
  width: auto;
  text-align: center;
  padding: 15rpx 24rpx;
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #ffffff;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-top: 16rpx;
}

.feature-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 10rpx;
}

.feature-item {
  width: 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 12rpx;
  padding: 16rpx;
  border-radius: 50rpx;
  background: linear-gradient(-30deg, #a1c4fd 0%, #c2e9fb 100%);
}

.feature-label {
  font-size: 24rpx;
  color: #333;
}

.section {
  padding: 24rpx;
}
.section-header {
  padding: 0 0 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-link {
  font-size: 28rpx;
  color: #666;
}

.store-list {
  margin-top: 20rpx;
}

.store-item {
  display: flex;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.store-item:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.store-left {
  flex-shrink: 0;
  margin-right: 10rpx;
}

.store-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}

.store-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.store-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 10rpx;
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
.store-address {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}
.status-rest {
  color: #999;
}

.store-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin: 12rpx 0;
}

.tag {
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.tag.city {
  background-color: #e6f7ff;
  color: #1890ff;
  margin-right: 10rpx;
}

.free-service {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

.duration {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.store-bottom {
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

.price-box {
  display: flex;
  align-items: baseline;
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

.distance {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  color: #999;
}

.location-icon {
  font-size: 24rpx;
}

.location-bar,
.city-name,
.icon-arrow-down {
  display: none;
}
.recommend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.tab-group {
  display: flex;
  gap: 30rpx;
}

.tab-item {
  font-size: 32rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #333;
  font-weight: bold;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: -6rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #ff4d4f;
  border-radius: 2rpx;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.course-item {
  display: flex;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.course-left {
  margin-right: 20rpx;
}

.course-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}

.course-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.course-desc {
  font-size: 28rpx;
  color: #666;
  margin: 10rpx 0;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-price {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.course-sales {
  font-size: 24rpx;
  color: #999;
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
  font-size: 32rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.empty-subtext {
  font-size: 28rpx;
  color: #999;
}
</style>
