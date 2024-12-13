<template>
  <view class="appointment-container">
    <view class="tabs">
      <view
        class="tab"
        :class="{ active: currentTab === 'teacher' }"
        @tap="switchTab('teacher')"
      >
        教员预约
      </view>
      <view
        class="tab"
        :class="{ active: currentTab === 'room' }"
        @tap="switchTab('room')"
      >
        乐室预约
      </view>
    </view>

    <!-- 教员预约列表 -->
    <view v-if="currentTab === 'teacher'" class="appointment-list">
      <view
        v-for="appointment in teacherAppointments"
        :key="appointment.id"
        class="appointment-item"
      >
        <view class="appointment-header">
          <image
            :src="
              appointment.teacher.avatar ||
              '/static/icons/default-login-avatar.png'
            "
            class="teacher-avatar"
          />
          <text class="teacher-name">{{ appointment.teacher.name }}</text>
          <text class="status" :class="getStatusClass(appointment.status)">
            {{ getStatusText(appointment.status) }}
          </text>
        </view>
        <view class="appointment-details">
          <view class="detail-item">
            <text class="label">课程类型</text>
            <text class="value">{{ appointment.courseType }}</text>
          </view>
          <view class="detail-item">
            <text class="label">预约时间</text>
            <text class="value">{{
              formatDateTime(appointment.datetime)
            }}</text>
          </view>
          <view class="detail-item">
            <text class="label">预约地点</text>
            <text class="value">{{ appointment.location }}</text>
          </view>
        </view>
        <view class="appointment-actions">
          <button
            v-if="appointment.status === 'pending'"
            class="cancel-btn"
            @tap="cancelAppointment(appointment.id)"
          >
            取消预约
          </button>
        </view>
      </view>
    </view>

    <!-- 乐室预约列表 -->
    <view v-else class="appointment-list">
      <view
        v-for="appointment in roomAppointments"
        :key="appointment.id"
        class="appointment-item"
      >
        <view class="appointment-header">
          <image
            :src="appointment.room.image || '/static/images/default-nearby.png'"
            class="room-image"
          />
          <text class="room-name">{{ appointment.room.name }}</text>
          <text class="status" :class="getStatusClass(appointment.status)">
            {{ getStatusText(appointment.status) }}
          </text>
        </view>
        <view class="appointment-details">
          <view class="detail-item">
            <text class="label">预约日期</text>
            <text class="value">{{ formatDate(appointment.date) }}</text>
          </view>
          <view class="detail-item">
            <text class="label">预约时间</text>
            <text class="value">{{ appointment.time }}</text>
          </view>
          <view class="detail-item">
            <text class="label">使用时长</text>
            <text class="value">{{ appointment.duration }}</text>
          </view>
          <view class="detail-item">
            <text class="label">总价</text>
            <text class="value">¥{{ appointment.totalPrice }}</text>
          </view>
        </view>
        <view class="appointment-actions">
          <button
            v-if="appointment.status === 'pending'"
            class="cancel-btn"
            @tap="cancelRoomAppointment(appointment.id)"
          >
            取消预约
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view
      v-if="
        (currentTab === 'teacher' && teacherAppointments.length === 0) ||
        (currentTab === 'room' && roomAppointments.length === 0)
      "
      class="empty-state"
    >
      <image src="/static/images/default-orders.png" class="empty-icon" />
      <text class="empty-text">暂无预约记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 定义预约接口
interface TeacherAppointment {
  id: string;
  teacher: {
    name: string;
    avatar: string;
  };
  courseType: string;
  datetime: string;
  location: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface RoomAppointment {
  id: string;
  room: {
    name: string;
    image: string;
  };
  date: string;
  time: string;
  duration: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
}

// 响应式变量
const currentTab = ref<"teacher" | "room">("teacher");
const teacherAppointments = ref<TeacherAppointment[]>([]);
const roomAppointments = ref<RoomAppointment[]>([]);

// 切换标签页
const switchTab = (tab: "teacher" | "room") => {
  currentTab.value = tab;
};

// 获取状态类名
const getStatusClass = (status: string) => {
  const statusMap = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    cancelled: "status-cancelled",
  };
  return statusMap[status] || "";
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusTextMap = {
    pending: "待确认",
    confirmed: "已确认",
    cancelled: "已取消",
  };
  return statusTextMap[status] || "";
};

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  return datetime; // 根据实际需求格式化
};

const formatDate = (date: string) => {
  return date; // 根据实际需求格式化
};

// 取消教员预约
const cancelAppointment = (id: string) => {
  uni.showModal({
    title: "取消预约",
    content: "确定要取消此预约吗？",
    success: (res) => {
      if (res.confirm) {
        // 实际业务逻辑：调用取消预约接口
        teacherAppointments.value = teacherAppointments.value.filter(
          (appointment) => appointment.id !== id
        );
        uni.showToast({
          title: "取消成功",
          icon: "success",
        });
      }
    },
  });
};

// 取消乐室预约
const cancelRoomAppointment = (id: string) => {
  uni.showModal({
    title: "取消预约",
    content: "确定要取消此乐室预约吗？",
    success: (res) => {
      if (res.confirm) {
        // 实际业务逻辑：调用取消预约接口
        roomAppointments.value = roomAppointments.value.filter(
          (appointment) => appointment.id !== id
        );
        uni.showToast({
          title: "取消成功",
          icon: "success",
        });
      }
    },
  });
};

// 页面加载时获取预约数据
onMounted(() => {
  // 模拟数据，实际应从后端获取
  teacherAppointments.value = [
    {
      id: "1",
      teacher: {
        name: "张老师",
        avatar: "",
      },
      courseType: "吉他入门课",
      datetime: "2023-12-15 14:00",
      location: "音乐工作室A",
      status: "pending",
    },
  ];

  roomAppointments.value = [
    {
      id: "1",
      room: {
        name: "音乐工作室A",
        image: "",
      },
      date: "2023-12-20",
      time: "15:00",
      duration: "2小时",
      totalPrice: 200,
      status: "pending",
    },
  ];
});
</script>
<style scoped>
.appointment-container {
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

.appointment-list {
  background-color: #ffffff;
  border-radius: 10rpx;
}

.appointment-item {
  padding: 20rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.appointment-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.teacher-avatar,
.room-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.teacher-name,
.room-name {
  flex: 1;
  font-size: 32rpx;
  color: #333;
}

.status {
  font-size: 24rpx;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
}

.status-pending {
  background-color: #f0ad4e;
  color: #ffffff;
}

.status-confirmed {
  background-color: #5cb85c;
  color: #ffffff;
}

.status-cancelled {
  background-color: #d9534f;
  color: #ffffff;
}

.appointment-details {
  margin-bottom: 20rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.label {
  width: 200rpx;
  color: #666;
  font-size: 24rpx;
}

.value {
  color: #333;
  font-size: 28rpx;
}

.appointment-actions {
}

.cancel-btn {
  background-color: #007bff;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 6rpx;
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
}
</style>
