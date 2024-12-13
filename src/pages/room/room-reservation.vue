<template>
  <view class="room-reservation-page">
    <!-- 头部搜索区域 -->
    <view class="location-search">
      <view class="search-wrapper">
        <view class="location" @tap="showCityPicker = true">
          <text class="location-icon">📍</text>
          <text class="city">{{ currentCity || "选择城市" }}</text>
          <text class="dropdown-icon">▼</text>
        </view>
        <view class="divider"></view>
        <view class="search-bar">
          <text class="search-icon">🔍</text>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索乐室"
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

    <!-- 乐室列表 -->
    <view class="room-list">
      <template v-if="filteredRooms.length > 0">
        <view
          v-for="room in filteredRooms"
          :key="room.id"
          class="room-item"
          @tap="showRoomDetail(room)"
        >
          <image
            :src="room.image || '/static/images/default-nearby.png'"
            class="room-image"
            mode="aspectFill"
          />
          <view class="room-info">
            <view class="room-header">
              <text class="room-name">{{ room.name }}</text>
            </view>
            <view class="room-address">
              <text class="address-icon">📍</text>
              <text class="address-text">
                {{ room.address }}
              </text>
            </view>
            <view class="room-features">
              <text
                v-for="(feature, index) in room.features"
                :key="index"
                class="feature-tag"
              >
                {{ feature }}
              </text>
            </view>
          </view>
          <view class="room-actions">
            <view class="room-distance">{{ room.distance || 0 }}km </view>
            <view class="price-box">
              <view class="price-symbol">¥</view>
              <view class="price">{{ room.price }}</view>
              <view class="unit">/小时</view>
            </view>
            <button
              class="reservation-btn"
              @tap.stop="openReservationModal(room)"
            >
              预约
            </button>
          </view>
        </view>
      </template>
      <view v-else class="empty-state">
        <image
          class="empty-icon"
          src="/static/images/default-nearby.png"
          mode="aspectFit"
        />
        <text class="empty-text">{{ currentCity || "该地区" }}暂无乐室</text>
        <text class="empty-subtext">敬请期待</text>
      </view>
    </view>

    <!-- 城市选择器 -->
    <CityPicker v-model:visible="showCityPicker" @select="handleCityChange" />

    <!-- 预约弹窗 -->
    <view
      v-if="showReservationModal"
      class="modal-mask"
      @tap="closeReservationModal"
    >
      <view
        class="modal-container"
        :class="{ 'modal-show': showReservationModal }"
      >
        <view class="reservation-modal" @tap.stop>
          <view class="modal-header">
            <text class="modal-title">预约房间</text>
            <text class="modal-close" @tap="closeReservationModal">×</text>
          </view>

          <view class="room-preview">
            <image
              :src="currentRoom?.image || '/static/images/default-nearby.png'"
              class="room-preview-image"
              mode="aspectFill"
            />
            <view class="room-info">
              <text class="room-name">{{ currentRoom?.name }}</text>
              <text class="room-price">
                <text class="price-symbol">¥</text>
                <text class="price">{{ currentRoom?.price }}</text>
                <text class="unit">/小时</text>
              </text>
            </view>
          </view>

          <view class="reservation-form">
            <view class="form-item">
              <text class="form-label">预约日期</text>
              <picker
                mode="date"
                :value="selectedDate"
                :start="today"
                :end="maxDate"
                @change="onDateChange"
              >
                <view class="picker">{{ selectedDate || "请选择日期" }}</view>
              </picker>
            </view>

            <view class="form-item">
              <text class="form-label">预约时间</text>
              <picker
                mode="time"
                :value="selectedTime"
                start="09:00"
                end="22:00"
                @change="onTimeChange"
              >
                <view class="picker">{{ selectedTime || "请选择时间" }}</view>
              </picker>
            </view>

            <view class="form-item">
              <text class="form-label">预约时长</text>
              <picker
                mode="selector"
                :range="durationOptions"
                :value="durationIndex"
                @change="onDurationChange"
              >
                <view class="picker">{{
                  selectedDuration || "请选择时长"
                }}</view>
              </picker>
            </view>

            <view class="form-item">
              <text class="form-label">联系电话</text>
              <input
                type="number"
                v-model="contactPhone"
                placeholder="请输入手机号"
                class="phone-input"
                maxlength="11"
              />
            </view>
          </view>

          <view class="total-price">
            <text>总计</text>
            <text class="price">¥{{ calculateTotalPrice() }}</text>
          </view>

          <button class="confirm-reservation-btn" @tap="confirmReservation">
            确认预约
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCityStore } from "@/stores/city";
import { useRoomStore, type Room } from "@/stores/room";
import CityPicker from "@/components/CityPicker.vue";

const cityStore = useCityStore();
const roomStore = useRoomStore();

// 获取房间列表
const rooms = computed(() => roomStore.roomList);

// 筛选房间列表
const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const matchCategory =
      currentCategory.value === "all" ||
      room.category === currentCategory.value;
    const matchSearch =
      searchQuery.value === "" ||
      room.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCity =
      !cityStore.currentCity?.name || room.city === cityStore.currentCity?.name;
    return matchCategory && matchSearch && matchCity;
  });
});

const currentCity = ref(cityStore.currentCity?.name || "北京");
const showCityPicker = ref(false);
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

const handleCityChange = (cityCode: string) => {
  cityStore.setCurrentCity(cityCode);
  currentCity.value = cityStore.currentCity?.name || "北京";
  showCityPicker.value = false;
};

const selectCategory = (category: string) => {
  currentCategory.value = category;
};

const performSearch = () => {
  // 触发搜索逻辑
};

const showRoomDetail = (room: Room) => {
  uni.navigateTo({
    url: `/pages/room/room-detail?id=${room.id}`,
  });
};
// 预约弹窗相关的响应式变量
const showReservationModal = ref(false);
const currentRoom = ref<Room | null>(null);
const selectedDate = ref("");
const selectedTime = ref("");
const contactPhone = ref("");
const selectedDuration = ref("");
const durationOptions = ["1小时", "2小时", "3小时", "4小时"];

// 打开预约弹窗的方法
const openReservationModal = (room: Room) => {
  currentRoom.value = room;
  showReservationModal.value = true;
};

// 关闭预约弹窗的方法
const closeReservationModal = () => {
  showReservationModal.value = false;
  resetReservationForm();
};

// 重置预约表单
const resetReservationForm = () => {
  selectedDate.value = "";
  selectedTime.value = "";
  contactPhone.value = "";
  selectedDuration.value = "";
};

// 日期选择
const onDateChange = (e: any) => {
  selectedDate.value = e.detail.value;
};

// 时间选择
const onTimeChange = (e: any) => {
  selectedTime.value = e.detail.value;
};

// 时长选择
const durationIndex = ref(0);
const onDurationChange = (e: any) => {
  durationIndex.value = e.detail.value;
  selectedDuration.value = durationOptions[durationIndex.value];
};

// 计算总价
const calculateTotalPrice = () => {
  if (!currentRoom.value || !selectedDuration.value) return 0;
  const hours = parseInt(selectedDuration.value);
  return currentRoom.value.price * hours;
};

// 确认预约
const confirmReservation = () => {
  if (
    !selectedDate.value ||
    !selectedTime.value ||
    !contactPhone.value ||
    !selectedDuration.value
  ) {
    uni.showToast({
      title: "请填写完整预约信息",
      icon: "none",
    });
    return;
  }

  // 提交预约逻辑
  uni.showToast({
    title: "预约成功",
    icon: "success",
  });

  closeReservationModal();
};

// 获取今天和最大可选日期
const today = new Date().toISOString().split("T")[0];
const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

onMounted(() => {
  cityStore.initCurrentCity();
  currentCity.value = cityStore.currentCity?.name || "北京";
});
</script>

<style scoped>
.room-reservation-page {
  background-color: #ffffff;
  padding: 20rpx;
}

.location-search {
  padding: 20rpx;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  padding: 10rpx 20rpx;
}

.location {
  display: flex;
  align-items: center;
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
  height: 30rpx;
  background-color: #e0e0e0;
  margin: 0 20rpx;
}

.search-bar {
  flex-grow: 1;
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

.search-icon {
  font-size: 28rpx;
  color: #999;
  margin-right: 12rpx;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10rpx;
  padding: 10rpx 20rpx;
}

.category-tab {
  flex: 0 0 auto;
  padding: 10rpx 20rpx;
  margin-bottom: 10rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  background-color: #f4f4f4;
  color: #666;
}

.category-tab.active {
  background-color: #007bff;
  color: #ffffff;
}

.room-list {
  padding: 20rpx;
}

.room-item {
  display: flex;
  padding: 20rpx;
  margin-bottom: 20rpx;
  align-items: center;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.room-image {
  width: 150rpx;
  height: 150rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.room-info {
  flex-grow: 1;
}

.room-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
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

.room-address {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.address-icon {
  margin-right: 10rpx;
}
.room-distance {
  color: #999;
  font-size: 22rpx;
  margin-left: 8rpx;
}
.room-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 10rpx;
}

.feature-tag {
  background-color: #f0f0f0;
  color: #666;
  font-size: 22rpx;
  padding: 4rpx 10rpx;
  border-radius: 4rpx;
  margin-right: 8rpx;
  margin-bottom: 8rpx;
  white-space: nowrap;
}
.room-actions {
  width: 25%;
  text-align: end;
}
.reservation-btn {
  background-color: #007bff;
  color: #ffffff;
  font-size: 24rpx;
  border-radius: 30rpx;
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
  display: block;
  font-size: 32rpx;
  color: #333;
}

.empty-subtext {
  display: block;
  font-size: 28rpx;
  color: #999;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}

.modal-container {
  width: 100%;
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.modal-container.modal-show {
  transform: translateY(0);
}

.reservation-modal {
  padding: 30rpx;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
}

.room-preview {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.room-preview-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.room-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.room-price {
  font-size: 28rpx;
  color: #ff4d4f;
}

.reservation-form {
  margin-bottom: 20rpx;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-label {
  font-size: 28rpx;
}

.picker {
  color: #666;
}

.phone-input {
  text-align: right;
  font-size: 28rpx;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.price {
  color: #ff4d4f;
  font-size: 36rpx;
  font-weight: bold;
}

.confirm-reservation-btn {
  width: 100%;
  background-color: #007bff;
  color: #ffffff;
  border-radius: 10rpx;
}
</style>
