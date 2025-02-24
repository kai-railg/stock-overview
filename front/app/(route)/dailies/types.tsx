
export interface  DailyRequ {
    content: string;
    title: string, 
    date: string;
}

export interface Daily {
    id: number;
    title: string, 
    content: string;
    date: string;
    
}

export interface DailyResp{
    data: Daily;
}

export interface DailiesResp {
    data: Daily[];
}