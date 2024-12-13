import { defineStore } from 'pinia';

export interface Room {
  id: number;
  name: string;
  category: string;
  status: string;
  price: number;
  size: string;
  equipment: string[];
  image: string;
  description: string;
  orderCount: number;
  rating: string;
  city: string;
  address: string;
  features: string[];
  distance: number;
}

interface RoomState {
  roomInfo: Room;
  roomList: Room[];
}

export const useRoomStore = defineStore('room', {
  state: (): RoomState => ({
    roomInfo: {} as Room,
    roomList: [
      {
        id: 1,
        name: "钢琴练习室A",
        category: "piano",
        status: "空闲",
        price: 80,
        size: "15㎡",
        equipment: ["钢琴", "节拍器", "谱架"],
        image: "",
        description: "配备雅马哈钢琴，环境安静",
        orderCount: 256,
        rating: "4.8",
        city: "广州市",
        address: "天河区体育西路123号",
        features: ["隔音好", "采光好", "有空调"],
        distance: 0.8
      },
      {
        id: 2,
        name: "架子鼓练习室B",
        category: "drums",
        status: "空闲",
        price: 100,
        size: "20㎡",
        equipment: ["架子鼓", "节拍器"],
        image: "",
        description: "专业架子鼓练习室",
        orderCount: 188,
        rating: "4.6",
        city: "广州市",
        address: "海珠区工业大道288号",
        features: ["专业设备", "24小时开放"],
        distance: 1.2
      },
      {
        id: 3,
        name: "乐队排练室C",
        category: "band",
        status: "空闲",
        price: 150,
        size: "30㎡",
        equipment: ["电吉他", "贝斯", "架子鼓", "音响设备"],
        image: "",
        description: "专业乐队排练室，配备完整乐器",
        orderCount: 320,
        rating: "4.9",
        city: "广州市",
        address: "番禺区大学城北路123号",
        features: ["设备齐全", "24小时开放", "空调"],
        distance: 2.5
      },
      {
        id: 4,
        name: "录音室D",
        category: "recording",
        status: "空闲",
        price: 200,
        size: "25㎡",
        equipment: ["专业录音设备", "监听音箱", "话筒"],
        image: "",
        description: "专业录音室，配备顶级设备",
        orderCount: 156,
        rating: "4.7",
        city: "广州市",
        address: "越秀区环市东路456号",
        features: ["专业设备", "隔音好", "空调"],
        distance: 3.1
      }
    ]
  }),

  actions: {
    // 获取房间列表
    async getRoomList() {
      return this.roomList;
    },

    // 获取房间详情
    async getRoomDetail(id: number) {
      return this.roomList.find(room => room.id === id) || null;
    },

    // 更新房间信息
    updateRoom(room: Room) {
      this.roomInfo = room;
    },

    // 按分类获取房间
    getRoomsByCategory(category: string) {
      if (category === 'all') {
        return this.roomList;
      }
      return this.roomList.filter(room => room.category === category);
    },

    // 按城市获取房间
    getRoomsByCity(city: string) {
      return this.roomList.filter(room => room.city === city);
    },

    // 搜索房间
    searchRooms(keyword: string) {
      const lowerKeyword = keyword.toLowerCase();
      return this.roomList.filter(room => 
        room.name.toLowerCase().includes(lowerKeyword) ||
        room.description.toLowerCase().includes(lowerKeyword) ||
        room.equipment.some(item => item.toLowerCase().includes(lowerKeyword))
      );
    }
  }
}); 