<template>
  <view class="form-container">
    <view class="notice-bar">
      <text>提交资料后,平台将在1-3个工作日内和您联系进行入驻</text>
      <text class="close-icon" @tap="closeNotice">×</text>
    </view>

    <form @submit="handleSubmit">
      <view class="form-section">
        <view class="section-title">基本信息</view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">姓名</text>
          <input
            v-model="formData.name"
            placeholder="请填写姓名"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">手机号</text>
          <input
            v-model="formData.phone"
            type="number"
            maxlength="11"
            placeholder="请填写手机号"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">身份证</text>
          <input
            v-model="formData.idCard"
            maxlength="18"
            placeholder="请填写身份证"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">期限类型</text>
          <picker
            :range="idCardTypes"
            @change="handleTypeChange"
            class="picker"
          >
            <view class="picker-value">
              {{ formData.idCardType || "请选择身份证期限" }}
              <text class="arrow">></text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">所在城市</text>
          <picker mode="region" @change="handleCityChange" class="picker">
            <view class="picker-value">
              {{ formData.city || "请选择门店所在城市" }}
              <text class="arrow">></text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">详细地址</text>
          <input
            v-model="formData.address"
            placeholder="请填写门店详细地址"
            class="input"
          />
        </view>

        <view class="form-item upload-item">
          <text class="required">*</text>
          <text class="label">法人身份证证件</text>
          <view class="upload-area">
            <text class="upload-tip"
              >上传身份证正反面照，支持png、jpg格式，大小不超过2M</text
            >
            <view class="id-card-uploads">
              <view
                class="upload-box"
                @tap="chooseImage('front')"
                v-if="!formData.idCardFront"
              >
                <text class="plus">+</text>
                <text class="upload-text">上传身份证人像面</text>
              </view>
              <image
                v-else
                :src="formData.idCardFront"
                mode="aspectFill"
                class="preview-image"
                @tap="previewImage(formData.idCardFront)"
              />

              <view
                class="upload-box"
                @tap="chooseImage('back')"
                v-if="!formData.idCardBack"
              >
                <text class="plus">+</text>
                <text class="upload-text">上传身份证国徽面</text>
              </view>
              <image
                v-else
                :src="formData.idCardBack"
                mode="aspectFill"
                class="preview-image"
                @tap="previewImage(formData.idCardBack)"
              />
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">企业名称</text>
          <input
            v-model="formData.companyName"
            placeholder="请填写企业名称"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">信用代码</text>
          <input
            v-model="formData.creditCode"
            placeholder="请填写社会信用代码"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">法定代表人</text>
          <input
            v-model="formData.legalPerson"
            placeholder="请填写法定人姓名"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="label">法人手机号</text>
          <input
            v-model="formData.legalPersonPhone"
            type="number"
            maxlength="11"
            placeholder="请填写法人手机号"
            class="input"
          />
        </view>

        <view class="form-item upload-item">
          <text class="required">*</text>
          <text class="label">营业执照扫描件</text>
          <view class="upload-area">
            <text class="upload-tip"
              >可上传营业执照，支持png、jpg格式，大小不超过2M</text
            >
            <view class="business-license-upload">
              <view
                class="upload-box"
                @tap="chooseLicenseImage"
                v-if="!formData.businessLicense"
              >
                <text class="plus">+</text>
                <text class="upload-text">上传营业执照</text>
              </view>
              <image
                v-else
                :src="formData.businessLicense"
                mode="aspectFill"
                class="preview-image"
                @tap="previewImage(formData.businessLicense)"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <checkbox
            value="agreed"
            :checked="isAgreed"
            style="transform: scale(0.7)"
          />
        </checkbox-group>
        <text>我已阅读并同意</text>
        <text class="link" @tap="showAgreement">《商家入驻协议》</text>
      </view>

      <button form-type="submit" class="submit-btn">提交资料</button>

      <AgreementPopup
        v-model:visible="agreementVisible"
        :title="agreements.store.title"
        :content="agreements.store.content"
        @confirm="handleAgreementConfirm"
      />
    </form>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AgreementPopup from "@/components/agreement-popup.vue";
import { agreements } from "@/data/agreements";

const formData = ref({
  name: "",
  phone: "",
  idCard: "",
  idCardType: "",
  city: "",
  address: "",
  idCardFront: "",
  idCardBack: "",
  companyName: "",
  creditCode: "",
  legalPerson: "",
  legalPersonPhone: "",
  businessLicense: "",
});

const idCardTypes = ["长期", "固定期限"];
const showNotice = ref(true);

const closeNotice = () => {
  showNotice.value = false;
};

const handleTypeChange = (e: any) => {
  formData.value.idCardType = idCardTypes[e.detail.value];
};

const handleCityChange = (e: any) => {
  formData.value.city = e.detail.value.join(" ");
};

const chooseImage = async (type: "front" | "back") => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
    });

    if (type === "front") {
      formData.value.idCardFront = res.tempFilePaths[0];
    } else {
      formData.value.idCardBack = res.tempFilePaths[0];
    }
  } catch (e) {
    // uni.showToast({
    //   title: "选择图片失败",
    //   icon: "none",
    // });
  }
};

const previewImage = (url: string) => {
  uni.previewImage({
    urls: [url],
  });
};

const chooseLicenseImage = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
    });
    formData.value.businessLicense = res.tempFilePaths[0];
  } catch (e) {
    uni.showToast({
      title: "选择图片失败",
      icon: "none",
    });
  }
};

const agreementVisible = ref(false);
const isAgreed = ref(false);

const showAgreement = () => {
  agreementVisible.value = true;
};

const handleAgreementConfirm = () => {
  isAgreed.value = true;
};

const handleAgreementChange = (e: any) => {
  isAgreed.value = e.detail.value.length > 0;
};

const handleSubmit = () => {
  // 添加协议检查
  if (!isAgreed.value) {
    return uni.showToast({
      title: "请先同意协议",
      icon: "none",
    });
  }

  // 企业信息验证
  if (!formData.value.companyName) {
    return uni.showToast({
      title: "请填写企业名称",
      icon: "none",
    });
  }
  if (!formData.value.creditCode) {
    return uni.showToast({
      title: "请填写信用代码",
      icon: "none",
    });
  }
  if (!formData.value.legalPerson) {
    return uni.showToast({
      title: "请填写法定代表人",
      icon: "none",
    });
  }
  if (!formData.value.legalPersonPhone) {
    return uni.showToast({
      title: "请填写法人手机号",
      icon: "none",
    });
  }
  if (!/^1\d{10}$/.test(formData.value.legalPersonPhone)) {
    return uni.showToast({
      title: "请输入正确的法人手机号",
      icon: "none",
    });
  }
  if (!formData.value.businessLicense) {
    return uni.showToast({
      title: "请上传营业执照",
      icon: "none",
    });
  }

  // 表单验证
  if (!formData.value.name) {
    return uni.showToast({
      title: "请填写姓名",
      icon: "none",
    });
  }
  if (!formData.value.phone) {
    return uni.showToast({
      title: "请填写手机号",
      icon: "none",
    });
  }
  if (!/^1\d{10}$/.test(formData.value.phone)) {
    return uni.showToast({
      title: "请输入正确的手机��",
      icon: "none",
    });
  }
  if (!formData.value.idCard) {
    return uni.showToast({
      title: "请填写身份证号",
      icon: "none",
    });
  }
  if (!formData.value.idCardType) {
    return uni.showToast({
      title: "请选择期限类型",
      icon: "none",
    });
  }
  if (!formData.value.city) {
    return uni.showToast({
      title: "请选择所在城市",
      icon: "none",
    });
  }
  if (!formData.value.address) {
    return uni.showToast({
      title: "请填写详细地址",
      icon: "none",
    });
  }
  if (!formData.value.idCardFront || !formData.value.idCardBack) {
    return uni.showToast({
      title: "请上传身份证正反面照片",
      icon: "none",
    });
  }

  // TODO: 提交表单数据到服务器
  console.log("提交的表单数据:", formData.value);

  uni.showToast({
    title: "提交成功",
    icon: "success",
  });
};
</script>

<style>
.form-container {
  min-height: 100vh;
  background-color: #ffffff;
  padding-bottom: 40rpx;
}

.notice-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff7e6;
  color: #fa8c16;
  font-size: 24rpx;
}

.close-icon {
  padding: 0 10rpx;
}

.form-section {
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item .label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.required {
  color: #ff4d4f;
  margin-right: 8rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #e8e8e8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-top: 10rpx;
}

.picker {
  width: 100%;
  margin-top: 10rpx;
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  border: 1px solid #e8e8e8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  color: #999;
  font-size: 24rpx;
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.id-card-uploads {
  display: flex;
  gap: 20rpx;
}

.upload-box {
  width: 320rpx;
  height: 200rpx;
  border: 1px dashed #d9d9d9;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
}

.preview-image {
  width: 320rpx;
  height: 200rpx;
  border-radius: 8rpx;
}

.plus {
  font-size: 48rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.submit-btn {
  width: 90%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  margin: 40rpx auto;
}

.submit-btn:active {
  opacity: 0.8;
}

.business-license-upload {
  width: 320rpx;
}

.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.agreement .link {
  color: #007aff;
}

.submit-btn[disabled] {
  opacity: 0.6;
  background: #ccc;
}
</style>
