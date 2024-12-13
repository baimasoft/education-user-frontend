<template>
  <view class="store-detail" v-if="storeInfo">
    <!-- 轮播图 -->
    <swiper
      class="store-swiper"
      circular
      autoplay
      :interval="3000"
      :duration="500"
      :indicator-dots="true"
      indicator-color="rgba(255, 255, 255, 0.6)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="(image, index) in storeImages" :key="index">
        <image
          :src="image || '/static/images/default-nearby.png'"
          mode="aspectFill"
          class="swiper-image"
          @tap="previewImage(image)"
        />
      </swiper-item>
    </swiper>

    <!-- 基本信息 -->
    <view class="info-section">
      <view class="header">
        <view class="store-name">{{ storeInfo.name }}</view>
        <text
          :class="[
            'store-status',
            storeInfo.status === '营业中' ? 'status-open' : 'status-closed',
          ]"
        >
          {{ storeInfo.status }}
        </text>
      </view>

      <view class="info-box">
        <!-- 评分信息 -->
        <view class="rating-info">
          <view class="rating">
            <text class="star">⭐</text>
            <text class="score">{{ storeInfo.rating }}</text>
          </view>
          <text class="order-count">已接单 {{ storeInfo.orderCount }}</text>
        </view>
        <!-- 价格信息 -->
        <view class="price-section">
          <text class="price-label">价格</text>
          <view class="price-info">
            <text class="price-symbol">¥</text>
            <text class="price">{{ storeInfo.price }}</text>
            <text class="price-unit">/小时</text>
          </view>
        </view>
      </view>

      <!-- 标签信息 -->
      <view class="tags-section">
        <text class="tag city">{{ storeInfo.city }}</text>
        <text
          v-for="(feature, index) in storeInfo.features"
          :key="index"
          class="tag feature"
          >{{ feature }}</text
        >
      </view>

      <!-- 乐器列表 -->
      <view class="instruments-section">
        <view class="section-title">提供乐器</view>
        <view class="instruments-list">
          <text
            v-for="(instrument, index) in storeInfo.instruments"
            :key="index"
            class="tag instrument"
            >{{ instrument }}</text
          >
        </view>
      </view>

      <!-- 营业信息 -->
      <view class="business-info">
        <view class="info-item">
          <view class="info-label">
            <text class="icon">🕒</text>
            <text class="label">营业时间</text>
          </view>
          <text class="value">{{ storeInfo.businessHours }}</text>
        </view>
        <view class="info-item">
          <view class="info-label">
            <text class="icon">📞</text>
            <text class="label">联系电话</text>
          </view>
          <text class="value phone" @tap="makePhoneCall">{{
            storeInfo.phone
          }}</text>
        </view>
        <view class="info-item">
          <view class="info-label">
            <text class="icon">📍</text>
            <text class="label">门店地址</text>
            <text class="value">{{ storeInfo.address }}</text>
          </view>
          <view class="business-address-info">
            <button class="nav-button" @tap="openMap">导航</button>
            <text class="distance">{{ storeInfo.distance }}km</text>
          </view>
        </view>
      </view>

      <!-- 在基本信息后添加教员列表 -->
      <view class="tabs-section">
        <view class="tabs">
          <text
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @tap="activeTab = tab.key"
          >
            {{ tab.name }}
          </text>
        </view>

        <!-- 门店教员 -->
        <view class="tab-content" v-if="activeTab === 'teachers'">
          <view v-if="filteredTeachers.length > 0" class="teacher-list">
            <view
              v-for="coach in filteredTeachers"
              :key="coach.id"
              class="coach-card"
              @tap="handleTeacherClick(coach)"
            >
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

              <view class="coach-footer">
                <view class="price">
                  <text class="currency">¥</text>
                  <text class="amount">{{ coach.price.toFixed(2) }}</text>
                  <text class="unit">起/小时</text>
                </view>
                <button class="book-button" @tap.stop="handleBooking(coach)">
                  立即预约
                </button>
              </view>
            </view>
          </view>
          <view v-else class="empty-state">
            <image
              class="empty-icon"
              src="/static/images/default-teacher.png"
              mode="aspectFit"
            />
            <text class="empty-text">{{ storeInfo.name }}暂无教员</text>
            <text class="empty-subtext">敬请期待</text>
          </view>
        </view>

        <!-- 评论区 -->
        <view class="tab-content" v-if="activeTab === 'comments'">
          <view class="comments-section">
            <view class="section-header">
              <view class="left">
                <text class="title">评价（{{ comments.length }}）</text>
                <view class="sort-options">
                  <text
                    class="sort-item"
                    :class="{ active: sortType === 'time' }"
                    @tap="handleSort('time')"
                    >最新</text
                  >
                  <text
                    class="sort-item"
                    :class="{ active: sortType === 'score' }"
                    @tap="handleSort('score')"
                    >好评</text
                  >
                </view>
              </view>
              <text class="rating">{{ storeInfo.rating }}分</text>
            </view>

            <view class="comments-list">
              <view
                v-for="comment in sortedComments"
                :key="comment.id"
                class="comment-item"
              >
                <view class="comment-header">
                  <image
                    class="avatar"
                    :src="
                      comment.avatar || '/static/icons/default-login-avatar.png'
                    "
                    mode="aspectFill"
                  />
                  <view class="user-info">
                    <text class="username">{{ comment.username }}</text>
                    <text class="date">{{ comment.date }}</text>
                  </view>
                  <text class="score">{{ comment.score }}分</text>
                </view>
                <view class="comment-content">{{ comment.content }}</view>
              </view>
            </view>
          </view>

          <!-- 添加评论按钮 -->
          <view v-if="activeTab === 'comments'">
            <view
              class="add-comment"
              v-if="!showCommentInput && !hasCommented"
              @tap="showCommentInput = true"
            >
              <text class="icon">✍️</text>
              <text>写评价</text>
            </view>

            <view
              class="add-comment disabled"
              v-if="!showCommentInput && hasCommented"
            >
              <text class="icon">✓</text>
              <text>已评价</text>
            </view>
          </view>

          <!-- 评论输入区域 -->
          <view class="comment-input-section" v-if="showCommentInput">
            <view class="section-header">
              <text class="title">发布评价</text>
              <text class="close-btn" @tap="handleCloseComment">×</text>
            </view>
            <view class="rating-input">
              <text class="label">评分</text>
              <view class="stars">
                <text
                  v-for="i in 5"
                  :key="i"
                  class="star"
                  @tap="handleRating(i)"
                  >{{ i <= newComment.score ? "⭐️" : "☆" }}</text
                >
              </view>
              <text class="score-text">{{ newComment.score }}分</text>
            </view>

            <textarea
              v-model="newComment.content"
              class="comment-textarea"
              placeholder="请输入您的评价内容"
              :maxlength="200"
            />

            <view class="comment-footer">
              <text class="char-count"
                >{{ newComment.content.length }}/200</text
              >
              <button class="submit-btn" @tap="handleSubmitComment">
                发布评价
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加预约弹窗组件 -->
    <booking-popup
      v-model:visible="showBooking"
      :coach="selectedCoach"
      @submit="handleBookingSubmit"
    />
  </view>
  <view v-else class="empty-state">
    <image
      class="empty-icon"
      src="/static/images/default-teacher.png"
      mode="aspectFit"
    />
    <text class="empty-text">暂无信息</text>
    <text class="empty-subtext">敬请期待</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStoreStore } from "@/stores/store";
import { useTeacherStore } from "@/stores/teacher";
import { onLoad } from "@dcloudio/uni-app";
import BookingPopup from "@/components/booking-popup.vue";

const storeStore = useStoreStore();
const teacherStore = useTeacherStore();

const storeInfo = ref<any>(null);

const coaches = computed(() => teacherStore.teacherList);
// 拨打电话
const makePhoneCall = () => {
  uni.makePhoneCall({
    phoneNumber: storeInfo.value.phone,
    fail: () => {
      uni.showToast({
        title: "拨打电话失败",
        icon: "none",
      });
    },
  });
};

// 修改获取门店详情的方法
const getStoreDetail = async () => {
  const store = await storeStore.getStoreDetail();
  if (store) {
    storeInfo.value = store;
  }
};

// 使用 onLoad 替代 onMounted
onLoad((options) => {
  getStoreDetail();
});

// 根据门店ID筛选教员
const filteredTeachers = computed(() => {
  return coaches.value.filter(
    (coach: any) => coach.storeid === storeInfo.value.id
  );
});

// 处理教员点击
const handleTeacherClick = (teacher: any) => {
  teacherStore.updateTeacher(teacher);
  uni.navigateTo({
    url: `/pages/teacher/teacher-detail?id=${teacher.id}`,
  });
};

// 添加预约相关状态
const showBooking = ref(false);
const selectedCoach = ref<Coach | null>(null);

// 修改预约处理函数
const handleBooking = (coach: any) => {
  if (!coach.available) {
    uni.showToast({
      title: "该教员暂不供服务",
      icon: "none",
    });
    return;
  }
  selectedCoach.value = coach;
  showBooking.value = true;
};

// 添加预约提交处理函数
const handleBookingSubmit = () => {
  uni.showToast({
    title: "预约成功",
    icon: "success",
  });
  showBooking.value = false;
};

// 在 script setup 部分的开头附近添加
const sortType = ref<"time" | "score">("time");

// 添加标签页数据
const tabs = [
  { key: "teachers", name: "门店教员" },
  { key: "comments", name: "评论" },
];

const activeTab = ref("teachers");

// 添加评论相关数据和函数
interface Comment {
  id: number;
  username: string;
  userid: number;
  avatar: string;
  date: string;
  score: number;
  content: string;
}

const comments = ref<Comment[]>([
  {
    id: 1,
    username: "张同学",
    userid: 0,
    avatar: "",
    date: "2024-01-15",
    score: 5.0,
    content: "环境很好，老师很专业，设备齐全",
  },
  {
    id: 2,
    username: "李同学",
    userid: 1,
    avatar: "",
    date: "2024-01-10",
    score: 4.9,
    content: "设备齐全，体验很好，服务态度也很好",
  },
]);

// 新评论数据
const newComment = ref({
  score: 5,
  content: "",
});

// 处理评分
const handleRating = (score: number) => {
  newComment.value.score = score;
};

const showCommentInput = ref(false);

// 关闭评论输入
const handleCloseComment = () => {
  showCommentInput.value = false;
  // 重置表单
  newComment.value.score = 5;
  newComment.value.content = "";
};

// 添加已评价状态
const hasCommented = computed(() => {
  return comments.value.some((comment) => comment.username === "我");
});

// 排序后的评论列表
const sortedComments = computed(() => {
  const sorted = [...comments.value];
  if (sortType.value === "time") {
    // 按时间排序（新到旧）
    return sorted.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else {
    // 按评分排序（高到低）
    return sorted.sort((a, b) => b.score - a.score);
  }
});

// 处理排序
const handleSort = (type: "time" | "score") => {
  sortType.value = type;
};

// 提交评论
const handleSubmitComment = () => {
  if (hasCommented.value) {
    uni.showToast({
      title: "您已经评价过了",
      icon: "none",
    });
    return;
  }

  if (!newComment.value.content.trim()) {
    uni.showToast({
      title: "请输入评价内容",
      icon: "none",
    });
    return;
  }

  // 添加评论
  comments.value.unshift({
    id: Date.now(),
    username: "我",
    userid: 0,
    avatar: "",
    date: new Date().toISOString().split("T")[0],
    score: newComment.value.score,
    content: newComment.value.content.trim(),
  });

  // 提交成功后关闭评论区
  handleCloseComment();

  uni.showToast({
    title: "评价成功",
    icon: "success",
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

// 修改获取位置的实现
const getLocation = (resolve: Function, reject: Function) => {
  // 使用 wgs84 类型，更稳定
  uni.getLocation({
    type: "wgs84",
    isHighAccuracy: true,
    highAccuracyExpireTime: 3000,
    success: (res) => {
      resolve({
        latitude: res.latitude,
        longitude: res.longitude,
      });
    },
    fail: (err) => {
      console.error("获取位置失败:", err);
      // 失败时返回门店的位置作为默认值
      if (storeInfo.value?.latitude && storeInfo.value?.longitude) {
        resolve({
          latitude: storeInfo.value.latitude,
          longitude: storeInfo.value.longitude,
        });
      } else {
        // 如果门店也没有位置���息，返回一个默认位置
        resolve({
          latitude: 23.03504,
          longitude: 113.726245,
        });
      }
    },
  });
};

// 更新距离信息
const updateDistance = async () => {
  try {
    // 检查门店是否有经纬度信息
    if (!storeInfo.value?.latitude || !storeInfo.value?.longitude) {
      console.warn("门店缺少经纬度信息");
      return;
    }

    const currentLocation = (await new Promise((resolve, reject) => {
      getLocation(resolve, reject);
    })) as {
      latitude: number;
      longitude: number;
    };

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      storeInfo.value.latitude,
      storeInfo.value.longitude
    );

    if (storeInfo.value) {
      storeInfo.value.distance = Number(distance);
    }
  } catch (error) {
    console.error("更新距离失败:", error);
    // 如果获取位置失败，使用一个默认距离
    if (storeInfo.value) {
      storeInfo.value.distance = storeInfo.value.distance || 0;
    }
  }
};

// 修改页面加载时的处理
onLoad(() => {
  getStoreDetail().then(() => {
    // 延迟执行位置更新
    setTimeout(() => {
      updateDistance().catch((err) => {
        console.error("距离更新失败:", err);
      });
    }, 1000);
  });
});

// 打开地图前检查经纬度
const openMap = () => {
  if (!storeInfo.value?.latitude || !storeInfo.value?.longitude) {
    uni.showToast({
      title: "暂无位置信息",
      icon: "none",
    });
    return;
  }

  uni.openLocation({
    latitude: storeInfo.value.latitude,
    longitude: storeInfo.value.longitude,
    name: storeInfo.value?.name || "",
    address: storeInfo.value?.address || "",
    fail: () => {
      uni.showToast({
        title: "打开地图失败",
        icon: "none",
      });
    },
  });
};

// 添加门店图片数组的计算属性
const storeImages = computed(() => {
  const defaultImages = ["/static/images/default-nearby.png"];

  if (!storeInfo.value) return defaultImages;

  const images = [];

  // 如果有主图，添加到数组
  if (storeInfo.value.image) {
    images.push(storeInfo.value.image);
  }

  // 如果有其他图片，添加到数组
  if (storeInfo.value.images && Array.isArray(storeInfo.value.images)) {
    images.push(...storeInfo.value.images);
  }

  // 如果没有任何图片，返回默认图片
  return images.length > 0 ? images : defaultImages;
});

// 添加图片预览功能
const previewImage = (current: string) => {
  uni.previewImage({
    urls: storeImages.value,
    current,
  });
};
</script>

<style scoped>
.store-detail {
  min-height: 100vh;
  background: #ffffff;
}

.store-swiper {
  width: 100%;
  height: 450rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.store-image {
  display: none;
}

.info-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.store-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 30rpx;
}

.price-label {
  font-size: 24rpx;
  color: #666;
  margin-right: 10rpx;
}

.price-symbol {
  font-size: 28rpx;
  color: #ff4d4f;
}

.price {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.price-unit {
  font-size: 24rpx;
  color: #999;
  margin-left: 4rpx;
}

.business-info {
  margin-top: 30rpx;
  border-radius: 12rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.info-item:not(:last-child) {
  border-bottom: 2rpx solid #eee;
}

.info-item .value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  text-align: right;
}

.info-item .phone {
  color: #007bff;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-width: 160rpx;
}

.info-label .icon {
  font-size: 28rpx;
}

.info-label .label {
  font-size: 26rpx;
  color: #666;
}

.address-info {
  flex: 1;
  text-align: right;
}

.address-info .value {
  margin-bottom: 4rpx;
}

.address-info .distance {
  font-size: 24rpx;
  color: #999;
  margin-left: 12rpx;
}

.info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rating-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.star {
  color: #ffd700;
  font-size: 32rpx;
}

.score {
  font-size: 24rpx;
  color: #ff4d4f;
}

.order-count {
  font-size: 26rpx;
  color: #666;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin: 20rpx 0;
}

.tag {
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.tag.city {
  background: #e6f7ff;
  color: #1890ff;
}

.tag.feature {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

.tag.instrument {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.instruments-section {
  margin: 30rpx 0;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.instruments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.store-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}

.status-open {
  background: #e6f7ff;
  color: #1890ff;
}

.status-closed {
  background: #fff1f0;
  color: #f5222d;
}

.business-address-info {
  display: flex;
  gap: 4rpx;
  align-items: center;
}
.nav-button {
  background: #007bff;
  color: #ffffff;
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
  line-height: 24rpx;
  margin: 0 10rpx;
}

.distance {
  font-size: 24rpx;
  color: #999;
}

.price-section {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price-info {
  margin-top: 12rpx;
  display: flex;
  align-items: flex-end;
}

/* 教员列表样式 */
.teachers-section {
  margin-top: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.teacher-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 复用 teacher.vue 中的教员卡片样式 */
.coach-card {
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
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
  padding: 15rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  line-height: 24rpx;
  margin-right: 0;
}
/* ... 其他教员卡片相关样式保持不变 ... */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
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

.tabs-section {
  margin-top: 20rpx;
}

.tabs {
  display: flex;
  border-bottom: 2rpx solid #f5f5f5;
  padding: 0 30rpx;
}

.tab-item {
  position: relative;
  padding: 20rpx 0;
  margin-right: 40rpx;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #333;
  font-weight: bold;
}
.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: #007bff;
  border-radius: 2rpx;
}
.tab-content {
  margin-top: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.sort-item {
  font-size: 24rpx;
  color: #666;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  background: #f4f4f4;
}

.sort-item.active {
  color: #ffffff;
  background: #007bff;
}

.rating {
  font-size: 24rpx;
  color: #ff4d4f;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.comment-item {
  border-bottom: 2rpx solid #f5f5f5;
  padding-bottom: 30rpx;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
}

.date {
  font-size: 20rpx;
  color: #999;
}

.score {
  font-size: 24rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-left: 12rpx;
}

.comment-content {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}

.comment-input-section {
  margin-top: 16rpx;
}

/* 评论区样式 */
.comments-section {
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-header .title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-header .rating {
  font-size: 28rpx;
  color: #ff4d4f;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.comment-item {
  border-bottom: 2rpx solid #f5f5f5;
  padding-bottom: 30rpx;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  margin-right: 16rpx;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
  display: block;
}

.date {
  font-size: 24rpx;
  color: #999;
}

.score {
  font-size: 28rpx;
  color: #ff4d4f;
}

.comment-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

/* 评论按钮样式 */
.add-comment {
  position: fixed;
  right: 30rpx;
  bottom: 130rpx;
  background: #fff;
  padding: 16rpx 30rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.add-comment .icon {
  font-size: 32rpx;
}

.add-comment.disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.disabled .icon {
  color: #52c41a;
}

/* 评论输入区域样式 */
.comment-input-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 30rpx;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.close-btn {
  font-size: 48rpx;
  color: #999;
  padding: 10rpx;
}

.rating-input {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.rating-input .label {
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}

.stars {
  display: flex;
  gap: 10rpx;
}

.star {
  font-size: 40rpx;
  color: #ffd700;
}

.score-text {
  font-size: 28rpx;
  color: #ff4d4f;
  margin-left: 20rpx;
}

.comment-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 24rpx;
  color: #999;
  width: 200rpx;
  text-align: center;
}

.submit-btn {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
  border: none;
  width: 85%;
}
</style>
