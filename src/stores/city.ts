import { defineStore } from "pinia";

interface City {
  code: string;
  name: string;
  status: "active" | "coming";
  services: {
    teacher: boolean;
    store: boolean;
    instrument: boolean;
  };
}

export const useCityStore = defineStore("city", {
  state: () => ({
    cities: [
      {
        code: "beijing",
        name: "北京市",
        status: "active",
        services: {
          teacher: true,
          store: true,
          instrument: true,
        },
      },
      {
        code: "guangzhou",
        name: "广州市",
        status: "active",
        services: {
          teacher: true,
          store: true,
          instrument: true,
        },
      },
      {
        code: "shenzhen",
        name: "深圳市",
        status: "active",
        services: {
          teacher: true,
          store: true,
          instrument: true,
        },
      },
      {
        code: "dongguan",
        name: "东莞市",
        status: "active",
        services: {
          teacher: true,
          store: true,
          instrument: false,
        },
      },
      {
        code: "foshan",
        name: "佛山市",
        status: "coming",
        services: {
          teacher: false,
          store: false,
          instrument: false,
        },
      },
    ] as City[],
    currentCity: null as City | null,
  }),
  getters: {
    // 获取所有已开通的城市
    activeCities: (state) =>
      state.cities.filter((city) => city.status === "active"),

    // 获取即将开通的城市
    comingCities: (state) =>
      state.cities.filter((city) => city.status === "coming"),

    // 获取已开通教员服务的城市
    citiesWithTeacher: (state) =>
      state.cities.filter(
        (city) => city.status === "active" && city.services.teacher
      ),

    // 获取已开通门店服务的城市
    citiesWithStore: (state) =>
      state.cities.filter(
        (city) => city.status === "active" && city.services.store
      ),

    // 获取已开通乐器服务的城市
    citiesWithInstrument: (state) =>
      state.cities.filter(
        (city) => city.status === "active" && city.services.instrument
      ),
  },
  actions: {
    // 设置当前城市
    setCurrentCity(cityCode: string) {
      const city = this.cities.find((c) => c.code === cityCode);
      if (city) {
        this.currentCity = city;
        // 可以在这里添加持久化存储
        uni.setStorageSync("currentCity", city);
      }
    },

    // 初始化当前城市（从本地存储或定位）
    initCurrentCity() {
      // 先尝试从本地存储获取
      const savedCity = uni.getStorageSync("currentCity");
      if (savedCity) {
        this.currentCity = savedCity;
        return;
      }

      // 如果没有存储的城市，默认使用广州
      this.setCurrentCity("guangzhou");

      // TODO: 后续可以添加地理定位功能
      // this.getCurrentLocation()
    },

    // 检查某个城市是否开通了特定服务
    checkCityService(
      cityCode: string,
      service: keyof City["services"]
    ): boolean {
      const city = this.cities.find((c) => c.code === cityCode);
      return (city?.status === "active" && city.services[service]) || false;
    },
  },
});
