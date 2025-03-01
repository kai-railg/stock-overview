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
        keys: string[];
        stock_info: Array<{
            id: number;
            市场: string;
            代码: string;
            名称: string;
            最新: number;
            涨幅: number;
            金额: number;
            换手: number;
            量比: number;
            最高: number;
            最低: number;
            今开: number;
            昨收: number;
            涨停: number;
            跌停: number;
            外盘: number;
            内盘: number;
        }>;
    };
    
}


