<template>
  <view class="container">
    <!-- 头部搜索区域 -->
    <view class="location-search">
      <view class="search-wrapper">
        <view class="divider"></view>
        <view class="search-bar">
          <text class="search-icon">🔍</text>
          <input type="text" placeholder="搜索课程" v-model="searchText" />
        </view>
      </view>
    </view>

    <!-- 分类列表 -->
    <view class="category-scroll">
      <view
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        :class="{ active: currentCategory === category.id }"
        @tap="handleCategoryChange(category.id)"
      >
        {{ category.name }}
      </view>
    </view>

    <view v-if="filteredCourses.length === 0" class="empty-state">
      <image
        class="empty-icon"
        src="/static/images/default-course.png"
        mode="aspectFit"
      />
      <text class="empty-text">暂无相关课程</text>
    </view>

    <view class="course-list" v-else>
      <view
        class="course-item"
        v-for="(course, index) in filteredCourses"
        :key="index"
        @tap="handleCourseClick(course)"
      >
        <image
          class="course-image"
          :src="course.image || '/static/images/default-course.png'"
          mode="aspectFill"
        ></image>
        <view class="course-info">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-desc">{{ course.description }}</text>
          <view class="course-tags">
            <text
              v-for="(tag, tagIndex) in course.tags"
              :key="tagIndex"
              class="course-tag"
              >{{ tag }}</text
            >
          </view>
          <view class="course-footer">
            <text class="course-sales">已售 {{ course.sales }}</text>
            <text class="course-price">¥{{ course.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

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

interface Category {
  id: string;
  name: string;
}

const searchText = ref("");
const currentCategory = ref("all");

const categories = ref<Category[]>([
  { id: "all", name: "全部" },
  { id: "piano", name: "钢琴" },
  { id: "guitar", name: "吉他" },
  { id: "violin", name: "小提琴" },
  { id: "drum", name: "架子鼓" },
  { id: "vocal", name: "声乐" },
  { id: "ukulele", name: "尤克里里" },
  { id: "bass", name: "贝斯" },
]);

const courses = ref<Course[]>([
  {
    id: "1",
    name: "钢琴基础课程",
    description: "适合零基础学习者，从基本乐理知识开始",
    price: 299,
    sales: 156,
    image: "",
    categoryId: "piano",
    tags: ["零基础", "一对一", "可试听"],
  },
  {
    id: "2",
    name: "吉他入门课程",
    description: "通过简单曲目快速入门吉他弹唱",
    price: 199,
    sales: 234,
    image: "",
    categoryId: "guitar",
    tags: ["热门", "免费教材", "可试听"],
  },
  {
    id: "3",
    name: "小提琴进阶课程",
    description: "适合有基础的学员，提升演奏技巧",
    price: 399,
    sales: 89,
    image: "",
    categoryId: "violin",
    tags: ["进阶", "一对一", "赠教材"],
  },
  {
    id: "4",
    name: "架子鼓速成班",
    description: "一个月掌握基本节奏型，快速上手",
    price: 499,
    sales: 67,
    image: "",
    categoryId: "drum",
    tags: ["速成班", "包会", "赠鼓棒"],
  },
  {
    id: "5",
    name: "声乐气息训练",
    description: "专业声乐老师指导，科学发声方法",
    price: 299,
    sales: 178,
    image: "",
    categoryId: "vocal",
    tags: ["专业老师", "考级", "可试听"],
  },
  {
    id: "6",
    name: "尤克里里速学班",
    description: "轻松学习夏威夷小吉他，适合初学者",
    price: 159,
    sales: 245,
    image: "",
    categoryId: "ukulele",
    tags: ["热门", "免费乐器", "包会"],
  },
]);

const handleCategoryChange = (categoryId: string) => {
  currentCategory.value = categoryId;
};

const filteredCourses = computed(() => {
  let result = courses.value;

  // 先按分类筛选
  if (currentCategory.value !== "all") {
    result = result.filter(
      (course) => course.categoryId === currentCategory.value
    );
  }

  // 再按搜索关键词筛选
  if (searchText.value.trim()) {
    const keyword = searchText.value.trim().toLowerCase();
    result = result.filter(
      (course) =>
        course.name.toLowerCase().includes(keyword) ||
        course.description.toLowerCase().includes(keyword) ||
        course.price.toString().includes(keyword)
    );
  }

  return result;
});

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
</script>

<style>
.container {
  padding: 20rpx;
  background: #ffffff;
}

.location-search {
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 12rpx 20rpx;
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

.category-scroll {
  display: flex;
  flex-wrap: wrap; /* 允许标签换行 */
  justify-content: flex-start; /* 从左侧开始排列 */
  gap: 10rpx; /* 标签之间的间距 */
  padding: 10rpx 20rpx; /* 添加一些内边距 */
}

.category-item {
  flex: 0 0 auto; /* 不要让标签平均分配宽度 */
  padding: 10rpx 20rpx;
  margin-bottom: 10rpx; /* 为换行的标签添加垂直间距 */
  border-radius: 30rpx;
  font-size: 28rpx;
  background-color: #f4f4f4;
  color: #666;
}

.category-item.active {
  background-color: #007bff;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 20rpx;
}

.course-item {
  display: flex;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.course-info {
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

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin: 10rpx 0;
}

.course-tag {
  font-size: 22rpx;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  border: 1px solid #ffccc7;
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
</style>
