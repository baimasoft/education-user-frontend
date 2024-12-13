import { defineStore } from 'pinia';
// 先定义获取默认时间的函数
const getDefaultDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 5); // 当前时间加5小时
    const defaultDate = now.toISOString().split('T')[0];// 获取日期部分
    let hours = now.getHours();// 获取并调整时间部分
    const minutes = now.getMinutes();// 向上取整到最近的半小时
    if (minutes > 30) {
        hours += 1;
    }
    const roundedMinutes = minutes > 30 ? "00" : "30";
    hours = Math.max(9, Math.min(22, hours));// 确保小时在9-22之间
    const defaultTime = `${hours.toString().padStart(2, "0")}:${roundedMinutes}`;
    return `${defaultDate} ${defaultTime}`;
};
export interface OrderService {
    id: number;
    name: string;
    duration: string;
    price: number;
    quantity: number;
    remainingQuantity: number;
}

export interface Order {
    id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
    teacherName: string;
    teacherAvatar: string;
    teacherTitle: string;
    teacherId: number;
    teacherPhone: string;
    amount: number;
    services: OrderService[];
    orderNo: string;
    createTime: string;
    paymentMethod: string;
    hasComment: boolean;
    bookingTime: string;
    phone: string;
    address: string;
    notes?: string;
}

interface OrderState {
    currentOrder: Order | null;
    orderList: Order[];
}

export const useOrderStore = defineStore('order', {
    state: (): OrderState => ({
        currentOrder: null,
        orderList: []
    }),

    actions: {
        // 创建新订单
        createOrder(orderData: Partial<Order>) {
            const now = new Date();
            const createTime = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            const order: Order = {
                id: orderData.id || Date.now().toString(),
                status: 'pending',
                teacherName: orderData.teacherName || '',
                teacherAvatar: orderData.teacherAvatar || '',
                teacherTitle: orderData.teacherTitle || '',
                teacherId: orderData.teacherId || 0,
                teacherPhone: orderData.teacherPhone || '',
                amount: orderData.amount || 0,
                services: orderData.services || [],
                orderNo: `ORDER${Date.now()}`,
                createTime: createTime,
                paymentMethod: '微信支付',
                hasComment: false,
                bookingTime: orderData.bookingTime || getDefaultDateTime(),
                phone: orderData.phone || '',
                address: orderData.address || '',
                notes: orderData.notes || ''
            };

            this.currentOrder = order;
            this.orderList.unshift(order);
            return order;
        },

        // 获取订单详情
        getOrderById(id: string) {
            return this.orderList.find(order => order.id === id) || null;
        },

        // 更新订单状态
        updateOrderStatus(id: string, status: Order['status']) {
            const order = this.orderList.find((order: Order) => order.id === id);
            if (order) {
                order.status = status;
            }
        },

        // 获取订单列表
        getOrdersByStatus(status?: Order['status']) {
            if (!status) return this.orderList;
            return this.orderList.filter((order: Order) => order.status === status);
        },

        // 取消订单
        cancelOrder(id: string) {
            this.updateOrderStatus(id, 'cancelled');
        },

        // 完成订单
        completeOrder(id: string) {
            this.updateOrderStatus(id, 'completed');
        },

        // 申请退款
        refundOrder(id: string) {
            this.updateOrderStatus(id, 'refunded');
        },

        // 确认订单
        confirmOrder(id: string) {
            this.updateOrderStatus(id, 'confirmed');
        }
    }
}); 