import { defineStore } from 'pinia';

interface UserInfo {
  id: number;
  nickname: string;
  avatar: string;
  balance: number;
  couponCount: number;
  favoriteCount: number;
  isLoggedIn: boolean;
}

interface UserState {
  userInfo: {
    isLoggedIn: boolean;
    nickname: string;
    avatar: string;
    balance: number;
    couponCount: number;
    favoriteCount: number;
    token?: string;
  };
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: {
      isLoggedIn: false,
      nickname: '',
      avatar: '',
      balance: 0,
      couponCount: 0,
      favoriteCount: 0,
      token: uni.getStorageSync('token') || '',
    }
  }),

  actions: {
    login(data: { token: string; userInfo: Partial<UserState['userInfo']> }) {
      this.userInfo.token = data.token;
      this.userInfo = {
        ...this.userInfo,
        ...data.userInfo,
      };
    },

    logout() {
      uni.removeStorageSync('token');
      this.userInfo = {
        isLoggedIn: false,
        nickname: '',
        avatar: '',
        balance: 0,
        couponCount: 0,
        favoriteCount: 0,
        token: '',
      };
    }
  }
}); 