"use client";
import { useEffect, useState } from 'react';
import './MainLayout.css';

interface Groups {
  data: Array<{
    id: number;    // 根据实际返回字段修改
    name: string;
  }>;
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

// 定义完整数据结构接口
export interface StockGroupData {
  data: {
    id: number;
    name: string;
    stock_info: StockInfo[];
  };
}

export default function Home() {
  const [groups, setGroups] = useState<Groups | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/stock/groups');
        
        const responseData = await response.json();
        setGroups(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const [groupStocks, setGroupStocks] = useState<StockGroupData | null>(null);
  const [groupStockName, setGroupStockName] = useState("自选股");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/stock/group/${groupStockName}`);
        const responseData = await response.json();
        setGroupStocks(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [groupStockName]);

  return (
    <div className="main-layout">
      <div className="sidebar">
        <ul>
          <li>自选</li>
          <li>个股</li>
          <li>行情</li>
        </ul>
      </div>
      <div className="header">  
        <nav className="navbar" key="header-navbar">  
          <a href="#">自选</a>
          <a href="#">发现</a>
          <a href="#">搜索</a>
        </nav>   
      </div>
      <div className="main-content">
        {/* // 将下面这个ul标签中的元素横向展示 */}
        <ul style={{
          display: 'flex',
          padding: 0,
          listStyle: 'none',
          gap: '20px'
        }}>
          {groups?.data?.map((group) => (
            <li key={group.id}>
              <button onClick={() => setGroupStockName(group.name)}>{group.name}</button>
            </li>
          ))}
        </ul> 
        <br></br>
        {/* // todo 使用groupStocks展示每行的数据 */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {/* 表头 */}
          <thead>
            <tr>
              {/* 动态生成表头 */}
              {[
                '代码', '名称', '涨幅', '最新', '最高',
                '最低', '今开', '换手率', '量比', '市盈率',
                '成交量', '成交额', '昨收', '总市值', '流通市值',
                '市场', '时间'
              ].map((key) => (
                <th
                  key={key}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #ddd',
                    textAlign: 'left'
                  }}
                >
                  {/* 处理中文表头显示 */}
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          {/* 表格数据 */}
          <tbody>
            {groupStocks?.data?.stock_info?.map((stock) => (
              <tr key={stock.id}>
                {Object.values(stock.realtime_data).map((value, index) => (
                  <td key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

