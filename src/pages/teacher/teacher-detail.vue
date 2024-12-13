<template>
  <view class="teacher-detail" v-if="teacherInfo">
    <!-- 轮播图 -->
    <swiper
      class="teacher-swiper"
      circular
      autoplay
      :interval="3000"
      :duration="500"
      :indicator-dots="true"
      indicator-color="rgba(255, 255, 255, 0.6)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="(image, index) in teacherImages" :key="index">
        <image
          :src="image || '/static/images/default-teacher.png'"
          mode="aspectFill"
          class="swiper-image"
          @tap="previewImage(image)"
        />
      </swiper-item>
    </swiper>
    <!-- 认证条约 -->
    <view class="cert-tags">
      <view class="cert-title">保障</view>
      <view class="cert-tag">
        💯
        <text>实名认证</text>
      </view>
      <view class="cert-tag">
        ⏰
        <text>买约包赔</text>
      </view>
      <view class="cert-tag">
        👨‍🏫
        <text>资质认证</text>
      </view>
    </view>
    <!-- 基本信息 -->
    <view class="info-section">
      <view class="header">
        <view class="teacher-info">
          <text class="teacher-name">{{ teacherInfo?.name }}</text>
          <text v-if="teacherInfo.available || false" class="service-badge"
            >可预约</text
          >
          <text v-else class="service-no">休息中</text>
        </view>
        <view class="price-box">
          <text class="price-label">价格</text>
          <text class="price-symbol">¥</text>
          <text class="price">{{ teacherInfo.price }}</text>
          <text class="price-unit">/时</text>
        </view>
      </view>

      <!-- 认证信息 -->
      <view class="cert-info">
        <view class="cert-item">
          <text class="cert-icon">✓</text>
          <text>实名认证</text>
        </view>
        <view class="cert-item">
          <text class="cert-icon">✓</text>
          <text>资格认证</text>
        </view>
      </view>

      <!-- 评分信息 -->
      <view class="rating-info">
        <text class="rating-label">综合评分</text>
        <text class="rating">{{ teacherInfo.rating }}</text>
        <text class="order-count">已完成 {{ teacherInfo.orders }} 单</text>
      </view>

      <!-- 在认证条约下方添加基本信息 -->
      <view class="coach-details">
        <text
          >{{ teacherInfo.age }}岁 | 已接单{{ teacherInfo.orders }} | 擅长：{{
            teacherInfo.instruments ? teacherInfo.instruments.join("、") : ""
          }}</text
        >
        <text class="signature">签名：{{ teacherInfo.signature }}</text>
        <view class="address">
          <view>地址：{{ teacherInfo.address }}</view>
          <view class="nav-button-box">
            <button class="nav-button" @tap="openMap">导航</button>
            <view>📍{{ teacherInfo.distance }}km</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 在基本信息下方添加评论区 -->
    <view class="tabs-section">
      <view class="tabs">
        <text
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @tap="activeTab = tab.key"
        >
          {{ tab?.name }}
        </text>
      </view>

      <!-- 个人介绍 -->
      <view class="tab-content" v-if="activeTab === 'intro'">
        <view class="intro-content">
          <text class="intro-text">{{ teacherInfo.introduction }}</text>
          <view v-if="!teacherInfo.introduction" class="empty-works">
            暂无个人介绍
          </view>
        </view>
      </view>

      <!-- 教员作品 -->
      <view class="tab-content" v-if="activeTab === 'works'">
        <view class="works-list">
          <view v-if="works.length > 0" class="works-grid">
            <view
              v-for="work in works"
              :key="work.id"
              class="work-item"
              @tap="previewWork(work)"
            >
              <image :src="work.cover" mode="aspectFill" class="work-image" />
              <text class="work-title">{{ work.title }}</text>
            </view>
          </view>
          <view v-else class="empty-works"> 暂无作品展示 </view>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="tab-content" v-if="activeTab === 'comments'">
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
          <text class="rating">{{ teacherInfo.rating }}分</text>
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
    </view>

    <!-- 修改评论按钮，添加条件判断 -->
    <view v-if="activeTab === 'comments'">
      <view
        class="add-comment"
        v-if="!showCommentInput && !hasCommented"
        @tap="showCommentInput = true"
      >
        <text class="icon">✍️</text>
        <text>写评价</text>
      </view>

      <!-- 已评价提示 -->
      <view
        class="add-comment disabled"
        v-if="!showCommentInput && hasCommented"
      >
        <text class="icon">✓</text>
        <text>已评价</text>
      </view>
    </view>

    <!-- 评论输入区域添加条件渲染 -->
    <view class="comment-input-section" v-if="showCommentInput">
      <view class="section-header">
        <text class="title">发布评价</text>
        <text class="close-btn" @tap="handleCloseComment">×</text>
      </view>
      <view class="rating-input">
        <text class="label">评分</text>
        <view class="stars">
          <text v-for="i in 5" :key="i" class="star" @tap="handleRating(i)">{{
            i <= newComment.score ? "⭐️" : "☆"
          }}</text>
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
        <text class="char-count">{{ newComment.content.length }}/200</text>
        <button class="submit-btn" @tap="handleSubmitComment">发布评价</button>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-buttons">
        <view class="collect" @tap="handleCollect">
          <text class="icon">{{ isCollected ? "❤️" : "🤍" }}</text>
          <text>{{ isCollected ? "已收藏" : "收藏" }}</text>
        </view>
        <button class="action-btn book" @tap="handleBooking">立即预约</button>
      </view>
    </view>

    <!-- 添加预约弹窗组件 -->
    <booking-popup
      v-model:visible="showBooking"
      :coach="teacherInfo"
      @submit="handleBookingSubmit"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useTeacherStore, type Teacher } from "@/stores/teacher";
import BookingPopup from "@/components/booking-popup.vue";

const teacherStore = useTeacherStore();
const teacherInfo = ref<Teacher | null>(null);
const showBooking = ref(false);

onLoad(async (options) => {
  if (options.id) {
    const teacherId = parseInt(options.id);
    // 从状态库获取教员列表中的指定教员
    const teacher = teacherStore.teacherList.find(t => t.id === teacherId);
    if (teacher) {
      teacherInfo.value = teacher;
    } else {
      // 如果在列表中找不到，可能需要单独获取
      teacherStore.getTeacherDetail(teacherId).then(teacher => {
        teacherInfo.value = teacher;
      });
    }
  }
    // 更新所有作品的封面
    for (const work of works.value) {
    work.cover = await getVideoCover(work.url);
  }
});

const isCollected = ref(false);

// 替换咨询为收藏处理函数
const handleCollect = () => {
  isCollected.value = !isCollected.value;
  uni.showToast({
    title: isCollected.value ? "收藏成功" : "已取消收藏",
    icon: "success",
    duration: 1500,
  });
};

// 修改立即预约处理函数
const handleBooking = () => {
  if (!teacherInfo.value.available) {
    uni.showToast({
      title: "该教员暂不提供服务",
      icon: "none",
    });
    return;
  }
  showBooking.value = true;
};

// 添加预约提交处理函数
const handleBookingSubmit = () => {
  uni.showToast({
    title: "预约成功",
    icon: "success",
  });
};

// 评论数据
const comments = ref<Comment[]>([
  {
    id: 1,
    username: "张同学",
    userid: 0,
    avatar: "",
    date: "2024-01-15",
    score: 5.0,
    content: "老师很专业，讲课很细心，孩子很喜欢上课",
  },
  {
    id: 2,
    username: "李同学",
    userid: 1,
    avatar: "",
    date: "2024-01-10",
    score: 4.9,
    content: "教学经验丰富，课程安排合理，进步很快",
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

// 修改提交评论函数
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

  // 添加新评论
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

// 添加排序类型
const sortType = ref<"time" | "score">("time");

// 处理排序
const handleSort = (type: "time" | "score") => {
  sortType.value = type;
};

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

// 添加标签页数据
const tabs = [
  { key: "intro", name: "个人介绍" },
  { key: "works", name: "教员作品" },
  { key: "comments", name: "评论" },
];

const activeTab = ref("intro");

// 修改获取视频封面的函数
const getVideoCover = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    // B站视频
    const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/);
    if (bilibiliMatch) {
      // 先获取视频信息
      uni.request({
        url: `https://api.bilibili.com/x/web-interface/view?bvid=${bilibiliMatch[1]}`,
        success: (res: any) => {
          if (res.data?.data?.pic) {
            resolve(res.data.data.pic);
          } else {
            resolve("/static/images/default-course.png");
          }
        },
        fail: () => resolve("/static/images/default-course.png"),
      });
      return;
    }

    // 腾讯视频
    const qqMatch = url.match(/v\.qq\.com\/x\/cover\/(\w+)\/(\w+)/);
    if (qqMatch) {
      // 先获取视频信息
      uni.request({
        url: `https://vv.video.qq.com/getinfo?vids=${qqMatch[2]}&platform=101001&charge=0&otype=json`,
        success: (res: any) => {
          try {
            const data = JSON.parse(
              res.data.replace(/QZOutputJson=/, "").slice(0, -1)
            );
            if (data?.vl?.vi?.[0]?.vid) {
              resolve(
                `https://puui.qpic.cn/vpic_cover/${data.vl.vi[0].vid}/${data.vl.vi[0].vid}_hz.jpg`
              );
            } else {
              resolve("/static/images/default-course.png");
            }
          } catch {
            resolve("/static/images/default-course.png");
          }
        },
        fail: () => resolve("/static/images/default-course.png"),
      });
      return;
    }

    // 酷视频
    const youkuMatch = url.match(/id_([\w=]+)/);
    if (youkuMatch) {
      // 先获取视频信息
      uni.request({
        url: `https://openapi.youku.com/v2/videos/show.json?video_id=${youkuMatch[1]}`,
        success: (res: any) => {
          if (res.data?.thumbnail_url) {
            resolve(res.data.thumbnail_url);
          } else {
            resolve("/static/images/default-course.png");
          }
        },
        fail: () => resolve("/static/images/default-course.png"),
      });
      return;
    }

    // 默认封面
    resolve("/static/images/default-course.png");
  });
};

// 修改作品数据
const works = ref<Works[]>([
  {
    id: 1,
    title: "学生演奏视频",
    type: "video",
    url: "https://v.qq.com/x/cover/mzc002007sqbpce/y4100blirg2.html?url_from=share",
    cover: "/static/images/default-course.png",
  },
  {
    id: 2,
    title: "顶级品质试听",
    type: "video",
    url: "https://www.bilibili.com/video/BV1gN411U7kN/",
    cover: "/static/images/default-course.png",
  },
  {
    id: 3,
    title: "古筝演奏《青花瓷》",
    type: "video",
    url: "https://v.youku.com/v_show/id_XNjQ1MTY0NzgzMg==.html?spm=a2hja.14919748_WEBHOME_NEW.drawer17.d_zj1_3&playMode=pugv&scm=20140719.manual.5497.video_XNjQ1MTY0NzgzMg==",
    cover: "/static/images/default-course.png",
  },
]);

// 修改教员图片数组的计算属性
const teacherImages = computed(() => {
  const defaultImages = ["/static/images/default-teacher.png"];

  if (!teacherInfo.value) return defaultImages;

  if (teacherInfo.value.avatar) {
    // 如果有头像，将头像作为第一张图片
    const images = [teacherInfo.value.avatar];
    // 检查并添加其他图片
    if (teacherInfo.value.images && Array.isArray(teacherInfo.value.images)) {
      images.push(...teacherInfo.value.images);
    }
    return images;
  }

  // 如果没有头像但有其他图片
  if (
    teacherInfo.value.images &&
    Array.isArray(teacherInfo.value.images) &&
    teacherInfo.value.images.length > 0
  ) {
    const images = [defaultImages];
    images.push(...teacherInfo.value.images);
    return images;
  }

  // 如果没有任何图片，返回默认图片
  return defaultImages;
});

// 添加图片预览功能
const previewImage = (current: string) => {
  uni.previewImage({
    urls: teacherImages.value,
    current,
  });
};

// 修改预览作品函数
const previewWork = (work: any) => {
  if (work.type === "video") {
    // 播放视频
    uni.navigateTo({
      url: `/pages/common/video-player?url=${encodeURIComponent(
        work.url
      )}&title=${encodeURIComponent(work.title)}`,
      fail: () => {
        // 如果视频播放页面不存在，则使用内置播放器
        uni.createVideoContext("video").requestFullScreen();
      },
    });
  } else {
    // 预览图片
    uni.previewImage({
      urls: [work.cover],
    });
  }
};
// 打开地图前检查经纬度
const openMap = () => {
  if (!teacherInfo.value?.latitude || !teacherInfo.value?.longitude) {
    uni.showToast({
      title: "暂无位置信息",
      icon: "none",
    });
    return;
  }

  uni.openLocation({
    latitude: teacherInfo.value.latitude,
    longitude: teacherInfo.value.longitude,
    name: teacherInfo.value?.name || "",
    address: teacherInfo.value?.address || "",
    fail: () => {
      uni.showToast({
        title: "打开地图失败",
        icon: "none",
      });
    },
  });
};
</script>

<style scoped>
.teacher-detail {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 120rpx;
}

.teacher-swiper {
  width: 100%;
  height: 450rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.teacher-image {
  display: none;
}

.info-section {
  margin: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30rpx;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.teacher-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
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

.price-box {
  display: flex;
  align-items: baseline;
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

.cert-info {
  display: flex;
  gap: 20rpx;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.cert-icon {
  color: #52c41a;
}

.rating-info {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.rating {
  color: #ff4d4f;
}

.rating-label {
  font-size: 24rpx;
  color: #666;
}

.order-count {
  font-size: 24rpx;
  color: #999;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.collect {
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200rpx;
}

.collect .icon {
  margin-right: 8rpx;
  font-size: 32rpx;
}

.book {
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #fff;
}

.cert-tags {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 20rpx 0;
  background: #f5f5f5;
}
.cert-title {
  font-size: 36rpx;
  color: #666;
  font-weight: bold;
}

.cert-tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.cert-icon {
  width: 32rpx;
  height: 32rpx;
}

.cert-tag text {
  font-size: 24rpx;
  color: #666;
}
.coach-details {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: flex;
  flex-direction: column;
}

.signature {
  display: block;
  margin-top: 4rpx;
  color: #ffa940;
}
.address {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-button-box {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  gap: 10rpx;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
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

/* 添加评论按钮样式 */
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
  color: #666;
}

.add-comment .icon {
  font-size: 32rpx;
}

/* 添加已评价按钮样式 */
.add-comment.disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.disabled .icon {
  color: #52c41a;
}

.section-header .left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.sort-options {
  display: flex;
  gap: 16rpx;
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

/* 标签页样式 */
.tabs-section {
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
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
  padding: 30rpx;
}

/* 个人介绍样式 */
.intro-content {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 作品展示样式 */
.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.work-item {
  aspect-ratio: 1;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.work-image {
  width: 100%;
  height: 100%;
}

.work-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8rpx 12rpx;
  font-size: 24rpx;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.3;
}

.empty-works {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
