import { StockGroupData } from '@/types/groupStock';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';
import './table.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function StockCompotent(
    { groupStockName }: {
        groupStockName: string
    }
) {

    const { data: groupStocks } = useSWR<StockGroupData>(`http://localhost:8000/api/stock/group/${groupStockName}`, fetcher)

    const [display, setDisplay] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const handleSetDisplay = () => {
        setDisplay(!display);
    }

    const handleAddStockDialogSubmit = async (stock_iden: string) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/stock/group/${groupStockName}/${stock_iden}`,
            );
            console.log('创建成功:', response.data);
        } catch (error) {
            console.error('提交失败:', error);
        }
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault(); // 阻止浏览器默认右键菜单

    };

    return (
        <table className="stockTable">
            <thead>
                <tr>
                    <th key="filter">筛选</th>
                    {groupStocks?.data?.keys?.map((row) => (
                        <th key={row}>{row}</th>
                    ))}
                    <th key="link">链接</th>
                </tr>
            </thead>
            <tbody>
                {groupStocks?.data?.stock_info?.map((stock, idx) => (
                    <tr 
                        key={stock.id} 
                        onContextMenu={handleRightClick}>
                        <td>{idx + 1}</td>
                        {Object.values(stock.realtime_data).map((value) => (
                            <td >{value}</td>
                        ))}
                        <td className="linkDropdown">
                            <p>链接</p>
                            <div className="linkDropdownContent">
                                <div><a target="_blank" href={`https://xueqiu.com/S/${stock.realtime_data['市场'] === "深A" ? "SZ" : "SH"}${stock.realtime_data.代码}`}>雪球</a></div>
                                <div><a target="_blank" href={`https://guba.eastmoney.com/list,${stock.realtime_data.代码}.html`}>东财</a></div>
                            </div>
                        </td>
                    </tr>
                ))}
                <tr key='addStock'>
                    <td className={`addStock ${display ? 'visible' : 'hidden'}`}>
                        <button onClick={handleSetDisplay}>+</button>
                    </td>
                    <td className={`${display ? 'hidden' : 'visible'}`}>
                        <input
                            type="text"
                            placeholder='600001'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            style={{ background: "white" }}
                            onClick={() => (handleAddStockDialogSubmit(inputValue), handleSetDisplay(), setInputValue(""))}
                        >{inputValue ? "✅" : "x"}</button>
                    </td>
                    {Array.from({ length: groupStocks?.data?.keys?.length ?? 1 }, (_, i) => (
                        <td></td>
                    ))}
                </tr>


            </tbody>
        </table>
    )
}
