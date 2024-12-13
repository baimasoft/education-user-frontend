<template>
  <view class="favorite-page" v-if="teachers">
    <!-- 教员列表 -->
    <view class="teacher-list" v-if="teachers.length > 0">
      <view
        class="teacher-item"
        v-for="teacher in teachers"
        :key="teacher.id"
        @tap="handleTeacherClick(teacher)"
      >
        <view class="teacher-left">
          <image
            class="teacher-avatar"
            :src="teacher.avatar || '/static/icons/default-avatar.png'"
            mode="aspectFill"
          />
          <view class="teacher-tag" v-if="teacher.isOnline">在线</view>
        </view>
        <view class="teacher-info">
          <view class="teacher-header">
            <text class="teacher-name">{{ teacher.name }}</text>
            <text class="teacher-title">{{ teacher.title }}</text>
          </view>
          <view class="teacher-stats">
            <text class="stat-item">课时费：¥{{ teacher.price }}/小时</text>
            <text class="stat-item">评分：{{ teacher.rating }}</text>
          </view>
          <view class="teacher-signature">签名：{{ teacher.signature }}</view>
          <view class="teacher-tags">
            <text
              class="tag-item"
              v-for="(tag, index) in teacher.instruments"
              :key="index"
              >{{ tag }}</text
            >
          </view>
          <view class="teacher-desc">{{ teacher.description }}</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <image
        class="empty-icon"
        src="/static/images/default-empty.png"
        mode="aspectFit"
      />
      <text class="empty-text">暂无收藏</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTeacherStore, Teacher } from "@/stores/teacher";

const teacherStore = useTeacherStore();

// 收藏的教员列表
const teachers = computed(() => teacherStore.teacherList);

// 点击教员跳转到详情
const handleTeacherClick = (teacher: Teacher) => {
  uni.navigateTo({
    url: `/pages/teacher/teacher-detail?id=${teacher.id}`,
  });
};
</script>

<style scoped>
.favorite-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 20rpx;
}

.teacher-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.teacher-item {
  display: flex;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.teacher-left {
  position: relative;
  margin-right: 20rpx;
}

.teacher-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
}

.teacher-tag {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #52c41a;
  color: #ffffff;
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
}

.teacher-info {
  flex: 1;
}

.teacher-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 12rpx;
}

.teacher-title {
  font-size: 24rpx;
  color: #666;
}

.teacher-stats {
  display: flex;
  gap: 20rpx;
  margin-bottom: 12rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #ff4d4f;
}
.teacher-signature {
  color: #ffa940;
}
.teacher-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.tag-item {
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.teacher-desc {
  font-size: 24rpx;
  color: #999;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
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
</style>
