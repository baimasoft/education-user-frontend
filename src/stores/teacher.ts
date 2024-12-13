import { defineStore } from 'pinia';

export interface Service {
    id: number;
    name: string;
    duration: string;
    price: number;
}

export interface Teacher {
    id: number;
    name: string;
    age: number;
    avatar?: string;
    available: boolean;
    distance: string;
    orders: number;
    rating: number;
    signature?: string;
    price: number;
    services?: Service[];
    city: string;
    earliestTime: string;
    instruments: string[]; // 添加分类标签
    address: string;
    introduction: string;
    storeid?: number;
    latitude: number;
    longitude: number;
    images: string[];
    phone?: string;
}

interface TeacherState {
    teacherInfo: Teacher;
    teacherList: Teacher[];
}

export const useTeacherStore = defineStore('teacher', {
    state: (): TeacherState => ({
        teacherInfo: {
            id: 0,
            name: "",
            age: 0,
            available: true,
            distance: "",
            orders: 0,
            rating: 0,
            signature: "",
            price: 0,
            city: "",
            earliestTime: "",
            instruments: [""],
            avatar: "",
            services: [
                { id: 0, name: "", duration: "", price: 0 },
            ],
            address: "",
            introduction: "",
            storeid: 0,
            latitude: 0,
            longitude: 0,
            images: [],
            phone: ""
        },
        teacherList: [
            {
                id: 1,
                name: "刘老师",
                age: 28,
                available: true,
                distance: "1.2",
                orders: 128,
                rating: 4.9,
                signature: "专注钢琴教学10年",
                price: 280,
                city: "东莞市",
                earliestTime: "明天",
                instruments: ["钢琴"],
                avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
                services: [
                    { id: 1, name: "钢琴体验课", duration: "45分钟", price: 99 },
                    { id: 2, name: "钢琴正式课", duration: "60分钟", price: 280 },
                ],
                address: "东莞市第九人民医院(沙地塘西)",
                introduction: "",
                storeid: 0,
                latitude: 23.055457,
                longitude: 113.750016,
                images: [],
                phone: "13800138000"
            },
            {
                id: 2,
                name: "李老师",
                age: 32,
                available: true,
                distance: "2.5",
                orders: 256,
                rating: 4.8,
                signature: "专注小提琴教学12年",
                price: 320,
                city: "深圳市",
                earliestTime: "明天",
                instruments: ["小提琴"],
                avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
                services: [
                    { id: 3, name: "小提琴体验课", duration: "45分钟", price: 129 },
                    { id: 4, name: "小提琴正式课", duration: "60分钟", price: 320 },
                ],
                address: "深圳北站西北",
                introduction: "",
                latitude: 22.6125,
                longitude: 114.028037,
                images: [],
                phone: "13800138000"
            },
            {
                id: 3,
                name: "张老师",
                age: 35,
                available: false,
                distance: "0.8",
                orders: 312,
                rating: 4.95,
                signature: "专注古筝教学15年",
                price: 300,
                city: "广州市",
                earliestTime: "明天",
                instruments: ["古筝", "小提琴", "钢琴"],
                avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
                services: [
                    { id: 5, name: "古筝体验课", duration: "45分钟", price: 119 },
                    { id: 6, name: "古筝正式课", duration: "60分钟", price: 300 },
                ],
                address: "华阳湖国家湿地公园",
                introduction: "",
                storeid: 0,
                latitude: 23.064428,
                longitude: 113.57432,
                images: [],
                phone: "13800138000"
            },
            {
                id: 4,
                name: "陈老师",
                age: 30,
                available: true,
                distance: "1.5",
                orders: 200,
                rating: 4.85,
                signature: "吉他教学8年经验",
                price: 260,
                city: "广州市",
                earliestTime: "明天",
                instruments: ["吉他", "古筝"],
                avatar: "https://www.waseda.jp/fedu/edu/assets/uploads/2021/06/Img1503.jpg",
                services: [
                    { id: 7, name: "吉他体验课", duration: "45分钟", price: 89 },
                    { id: 8, name: "吉他正式课", duration: "60分钟", price: 260 },
                    { id: 9, name: "古筝体验课", duration: "60分钟", price: 130 },
                    { id: 10, name: "古筝正式课", duration: "120分钟", price: 260 },
                ],
                address: "番禺区广东科学中心(科普路北)",
                introduction: "",
                storeid: 0,
                latitude: 23.038934,
                longitude: 113.361961,
                images: [],
                phone: "13800138000"
            },
            {
                id: 5,
                name: "林老师",
                age: 28,
                available: true,
                distance: "3.0",
                orders: 150,
                rating: 4.75,
                signature: "架子鼓教授5年经验",
                price: 350,
                city: "广州市",
                earliestTime: "明天",
                instruments: ["架子鼓"],
                services: [
                    { id: 9, name: "架子鼓体验课", duration: "45分钟", price: 139 },
                    { id: 10, name: "架子鼓正式课", duration: "60分钟", price: 350 },
                ],
                address: "中山大学(广州校区南校园)",
                introduction:
                    "2017级星海音乐学院现代音乐与戏剧学院电子键盘专业学生;\n" +
                    "入选星海音乐学院优秀人才培养计划\n" +
                    "亚太电子键盘协会会员\n" +
                    "2017年考入星海音乐学院，跟随谢及老师和王稔仪老师进行更专业化的学习\n" +
                    "具备良好的音乐理论基础，在编曲和作曲方面有较深入的学习和积累，扎实的论基础和良好的执行能力\n" +
                    "2021年加入到玖月音乐教育进行执教活动\n" +
                    "主要奖项:\n" +
                    "2017年荣获星海音乐学院笃学奖\n",
                storeid: 1,
                latitude: 23.09719,
                longitude: 113.297459,
                images: ["https://media.istockphoto.com/id/1347685599/zh/%E7%85%A7%E7%89%87/young-asian-man-with-eyes-closed-enjoying-music-over-headphones-while-relaxing-on-the-sofa-at.jpg?s=2048x2048&w=is&k=20&c=kE7QiJFSFPKLUc7kkYErm3-hk532rJaojzkSTWauqjQ=",
                    "https://media.istockphoto.com/id/161838634/zh/%E7%85%A7%E7%89%87/rock-concert.jpg?s=2048x2048&w=is&k=20&c=uwX-5wpbsUJtk_ddlVqXj9tmKp7q_PEg0ao69DFfLWA=",
                    "https://media.istockphoto.com/id/1488536685/zh/%E7%85%A7%E7%89%87/grandfather-enjoy-singing-and-playing-music-with-family-in-the-living-room-at-home.jpg?s=2048x2048&w=is&k=20&c=tkYO3nBJGoxwH4-p2wefJLTqzHca3tmhSBOKx32Oy2A=",
                ],
                phone: "13800138000"
            },
        ]
    }),

    actions: {
        // 获取教员详情
        async getTeacherDetail() {
            return this.teacherInfo;
        },

        // 更新教员信息
        updateTeacher(data: Partial<Teacher>) {
            this.teacherInfo = data;
        }
    }
}); 