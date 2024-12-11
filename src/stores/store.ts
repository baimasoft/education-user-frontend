import { defineStore } from 'pinia';
interface Store {
    id: number;
    name: string;
    status: string;
    price: string;
    distance: number;
    address: string;
    features: string[];
    rating: string;
    orderCount: number;
    image?: string;
    city: string;
    instruments: string[];
    businessHours: string;
    phone: string;
    storeid?: number;
}

interface StoreState {
    storeInfo: Store;
}

export const useStoreStore = defineStore('store', {
    state: (): StoreState => ({
        storeInfo: {
            id: 0,
            name: "",
            status: "",
            price: "",
            distance: 0,
            address: "",
            features: [],
            rating: "",
            orderCount: 0,
            image: "",
            city: "",
            instruments: [],
            businessHours: "",
            phone: "",
            storeid: 0,
        }
    }),

    actions: {
        // 获取门店详情
        async getStoreDetail() {
            return this.storeInfo; // 如果找不到就返回默认门店
        },

        // 更新门店信息
        updateStore(data: Partial<Store>) {
            this.storeInfo = data;
        }
    }
}); 