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
    latitude: number;
    longitude: number;
    images: string[];
}

interface StoreState {
    storeInfo: Store;
    storeList: Store[];
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
            latitude: 23.03504,
            longitude: 113.726245,
            images: []
        },
        storeList: [
            {
                id: 0,
                name: "雀巢音乐华南摩尔店",
                status: "营业中",
                price: "189",
                distance: 1.2,
                address: "华南摩尔",
                features: ["免服务费", "可预约"],
                rating: "4.8",
                image: "",
                orderCount: 1560,
                city: "广州市",
                instruments: ["吉他", "钢琴", "架子鼓"],
                businessHours: "10:00-23:00",
                phone: "0571-88888888",
                latitude: 23.03504,
                longitude: 113.726245,
                images: []
            },
            {
                id: 1,
                name: "音乐空间(小雅立创店)",
                status: "营业中",
                price: "109",
                distance: 0.8,
                address: "小雅立创1号楼",
                features: ["免费WiFi", "停车场", "休息区"],
                rating: "4.9",
                orderCount: 2890,
                city: "广州市",
                instruments: ["小提琴", "古筝", "电子琴"],
                businessHours: "10:00-23:00",
                phone: "0571-88888888",
                latitude: 23.037055,
                longitude: 113.728407,
                images: []
            },
            {
                id: 2,
                name: "乐器中心(万江店)",
                status: "休息中",
                price: "199",
                distance: 1.2,
                address: "东莞市万盛花园",
                features: ["免费WiFi", "器材租赁", "休息区"],
                rating: "4.8",
                orderCount: 1560,
                city: "广州市",
                instruments: ["架子鼓", "贝斯", "电吉他"],
                businessHours: "10:00-23:00",
                phone: "0571-88888888",
                latitude: 23.050936,
                longitude: 113.729904,
                image: 'https://th.bing.com/th/id/R.577c74ccdb6896eba21b075f97b5e060?rik=irykHnfInt86Yg&riu=http%3a%2f%2fwww.qiyuexuexi.com%2fuploads%2fallimg%2f220308%2f1-22030Q44631411.jpeg&ehk=BGBKNo8R4alGjppTOCfEgd%2fXcKfmurZZNn7KmoQ6ujI%3d&risl=&pid=ImgRaw&r=0',
                images: ['https://th.bing.com/th/id/R.425c554e07aa9beb6e77f022f9f42124?rik=wtY5Yc29sN3r0Q&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50049%2f9850.jpg_wh1200.jpg&ehk=VtPJMtkls4VWYQkM%2flVGS%2f8E5sX1XRXnpOmwZq5o86U%3d&risl=&pid=ImgRaw&r=0', 'https://th.bing.com/th/id/R.23d182bff9a5f48310c966c6e3f5e2fb?rik=ovbQ5T%2bfL%2bEjOg&riu=http%3a%2f%2fimg95.699pic.com%2fphoto%2f50072%2f0100.jpg_wh860.jpg&ehk=v9oQFO7ZhRw2F0%2f%2fT8soIHFGyS0NdUDtm2ZWMFURvx8%3d&risl=&pid=ImgRaw&r=0']
            },
        ]
    }),

    actions: {
        // 获取门店详情
        async getStoreDetail() {
            return this.storeInfo; // 如果找不到就返回默认门店
        },
        async getStoreList() {
            return this.storeList;
        },

        // 更新门店信息
        updateStore(data: Partial<Store>) {
            this.storeInfo = data;
        }
    }
}); 