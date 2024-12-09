<template>
  <view class="address-container">
    <!-- 地址列表 -->
    <view class="address-list">
      <view
        v-for="(address, index) in addresses"
        :key="address.id"
        class="address-item"
      >
        <view class="address-info">
          <view class="address-header">
            <text class="contact-name">{{ address.name }}</text>
            <text class="contact-phone">{{ address.phone }}</text>
            <text v-if="address.isDefault" class="default-tag"> 默认 </text>
          </view>
          <view class="address-details">
            <text class="address-text">
              {{ address.province }} {{ address.city }} {{ address.district }}
              {{ address.detail }}
            </text>
          </view>
        </view>

        <view class="address-actions">
          <view class="edit-btn" @tap="editAddress(index)"> 编辑 </view>
          <view class="delete-btn" @tap="deleteAddress(index)"> 删除 </view>
        </view>
      </view>
    </view>

    <!-- 新增地址按钮 -->
    <view class="add-address-btn-container">
      <button class="add-address-btn" @tap="showAddressModal('add')">
        + 新增收货地址
      </button>
    </view>

    <!-- 自定义地址编辑/新增弹窗 -->
    <view v-if="showModal" class="modal-mask" @tap.self="closeAddressModal">
      <view class="modal-container" :class="{ 'modal-show': showModal }">
        <view class="address-modal">
          <view class="modal-header">
            <text class="modal-title">
              {{ modalType === "add" ? "新增地址" : "编辑地址" }}
            </text>
            <text class="modal-close" @tap="closeAddressModal"> ✕ </text>
          </view>

          <view class="address-form">
            <view class="form-item">
              <text class="label">联系人</text>
              <input
                v-model="currentAddress.name"
                placeholder="请输入联系人姓名"
                class="input"
              />
            </view>

            <view class="form-item">
              <text class="label">手机号</text>
              <input
                v-model="currentAddress.phone"
                type="number"
                placeholder="请输入手机号"
                class="input"
              />
            </view>

            <view class="form-item">
              <text class="label">省份</text>
              <picker mode="region" @change="onRegionChange">
                <view class="picker">
                  {{ currentAddress.province || "请选择省份" }}
                </view>
              </picker>
            </view>

            <view class="form-item">
              <text class="label">详细地址</text>
              <input
                v-model="currentAddress.detail"
                placeholder="请输入详细地址"
                class="input"
              />
            </view>

            <view class="form-item default-switch">
              <text class="label">设为默认地址</text>
              <switch
                :checked="currentAddress.isDefault"
                @change="toggleDefaultAddress"
              />
            </view>
          </view>

          <button class="confirm-btn" @tap="saveAddress">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 地址接口定义
interface Address {
  id?: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// 响应式变量
const addresses = ref<Address[]>([
  {
    id: "1",
    name: "张三",
    phone: "13800138000",
    province: "广东省",
    city: "深圳市",
    district: "南山区",
    detail: "科技园1号",
    isDefault: true,
  },
  {
    id: "2",
    name: "李四",
    phone: "15900159000",
    province: "北京市",
    city: "北京市",
    district: "海淀区",
    detail: "中关村软件园",
    isDefault: false,
  },
]);

const showModal = ref(false);
const modalType = ref<"add" | "edit">("add");
const currentEditIndex = ref(-1);
const currentAddress = ref<Address>({
  name: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  detail: "",
  isDefault: false,
});

// 地址弹窗引用
const addressPopup = ref<any>(null);

// 显示地址弹窗
const showAddressModal = (type: "add" | "edit", index?: number) => {
  modalType.value = type;

  if (type === "edit" && index !== undefined) {
    currentEditIndex.value = index;
    currentAddress.value = { ...addresses.value[index] };
  } else {
    // 重置表单
    currentAddress.value = {
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
      isDefault: false,
    };
  }

  showModal.value = true;
};

// 关闭地址弹窗
const closeAddressModal = () => {
  showModal.value = false;
};

// 地区选择
const onRegionChange = (e: any) => {
  const [province, city, district] = e.detail.value;
  currentAddress.value.province = province;
  currentAddress.value.city = city;
  currentAddress.value.district = district;
};

// 切换默认地址
const toggleDefaultAddress = (e: any) => {
  currentAddress.value.isDefault = e.detail.value;

  // 如果设为默认，取消其他默认地址
  if (currentAddress.value.isDefault) {
    addresses.value.forEach((addr) => {
      addr.isDefault = false;
    });
  }
};

// 保存地址
const saveAddress = () => {
  // 表单验证
  if (!validateAddress()) return;

  if (modalType.value === "add") {
    // 新增地址
    addresses.value.push({
      ...currentAddress.value,
      id: `${addresses.value.length + 1}`,
    });
  } else {
    // 编辑地址
    addresses.value[currentEditIndex.value] = { ...currentAddress.value };
  }

  closeAddressModal();
};

// 地址验证
const validateAddress = () => {
  const { name, phone, province, detail } = currentAddress.value;

  if (!name) {
    uni.showToast({ title: "请输入联系人姓名", icon: "none" });
    return false;
  }

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    uni.showToast({ title: "请输入正确的手机号", icon: "none" });
    return false;
  }

  if (!province) {
    uni.showToast({ title: "请选择省份", icon: "none" });
    return false;
  }

  if (!detail) {
    uni.showToast({ title: "请输入详细地址", icon: "none" });
    return false;
  }

  return true;
};

// 编辑地址
const editAddress = (index: number) => {
  showAddressModal("edit", index);
};

// 删除地址
const deleteAddress = (index: number) => {
  uni.showModal({
    title: "删除地址",
    content: "确定要删除此地址吗？",
    success: (res) => {
      if (res.confirm) {
        addresses.value.splice(index, 1);
        uni.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
};
</script>

<style scoped>
.address-container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20rpx;
}

.address-list {
  margin-bottom: 20rpx;
}

.address-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.address-info {
  flex: 1;
  margin-right: 20rpx;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.contact-name {
  font-size: 32rpx;
  color: #333;
  margin-right: 20rpx;
}

.contact-phone {
  font-size: 28rpx;
  color: #666;
}

.default-tag {
  background-color: #007bff;
  color: #ffffff;
  font-size: 24rpx;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  margin-left: 10rpx;
}

.address-details {
  font-size: 28rpx;
  color: #666;
}

.address-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.edit-btn,
.delete-btn {
  font-size: 28rpx;
  color: #007bff;
  margin-bottom: 10rpx;
}

.delete-btn {
  color: #d9534f;
}

.add-address-btn-container {
  margin: 20rpx 0;
}

.add-address-btn {
  width: 100%;
  background-color: #007bff;
  color: #ffffff;
  border-radius: 10rpx;
}

.address-modal {
  background-color: #ffffff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  padding: 30rpx;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 36rpx;
  color: #999;
}

.address-form {
  margin-bottom: 20rpx;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.label {
  width: 150rpx;
  font-size: 28rpx;
  color: #333;
}

.input {
  flex: 1;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 10rpx 0;
  font-size: 28rpx;
}

.picker {
  flex: 1;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 10rpx 0;
  font-size: 28rpx;
  color: #666;
}

.default-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confirm-btn {
  width: 100%;
  background-color: #007bff;
  color: #ffffff;
  border-radius: 10rpx;
}
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.modal-container {
  width: 100%;
  max-height: 80%;
  background-color: transparent;
  transition: all 0.3s ease;
  transform: translateY(100%);
}

.modal-container.modal-show {
  transform: translateY(0);
}
</style>
