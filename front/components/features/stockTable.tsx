import { Groups, StockGroupData } from '@/types/groupStock';
import { useState } from 'react';
import useSWR from 'swr';
export default function StockTable() {
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const { data: groups } = useSWR<Groups>('http://localhost:8000/api/stock/groups', fetcher)
    const [groupStockName, setGroupStockName] = useState("自选股");
    const { data: groupStocks } = useSWR<StockGroupData>(`http://localhost:8000/api/stock/group/${groupStockName}`, fetcher)

    return (
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
    )
}