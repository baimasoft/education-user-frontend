import { defineStore } from 'pinia';

interface Service {
    id: number;
    name: string;
    duration: string;
    price: number;
}

interface Teacher {
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
}

interface TeacherState {
    teacherInfo: Teacher;
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
            introduction: ""
        }
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