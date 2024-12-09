// src/stores/service.ts
import { defineStore } from "pinia";

// 定义客服信息接口
export interface OnlineService {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy";
}

// 创建客服信息状态管理
export const useServiceStore = defineStore("service", {
  state: () => ({
    currentService: null as OnlineService | null,
  }),
  actions: {
    // 设置当前选中的客服
    setCurrentService(service: OnlineService) {
      this.currentService = service;
    },
    // 清除当前客服信息
    clearCurrentService() {
      this.currentService = null;
    },
  },
  // 使用 persist 持久化存储
  persist: {
    enabled: true,
    strategies: [
      {
        storage: uni.getStorageSync,
        paths: ["currentService"],
      },
    ],
  },
});
