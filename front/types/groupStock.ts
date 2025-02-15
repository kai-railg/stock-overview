export interface Groups {
    data: Array<{
        id: number;    // 根据实际返回字段修改
        name: string;
    }>;
}


// 定义完整数据结构接口
export interface StockGroupData {
    data: {
        id: number;
        name: string;
        stock_info: StockInfo[];
    };
}


// 定义实时数据接口
interface RealtimeData {
    代码: string;
    名称: string;
    涨幅: number;
    最新: number;
    最高: number;
    最低: number;
    今开: number;
    换手率: number;
    量比: number;
    市盈率: number;
    成交量: number;
    成交额: number;
    昨收: number;
    总市值: number;
    流通市值: number;
    市场: string;
    时间: string;
}

// 定义股票信息接口
interface StockInfo {
    id: number;
    hidden: boolean;
    name: string;
    code: string;
    realtime_data: RealtimeData;
}