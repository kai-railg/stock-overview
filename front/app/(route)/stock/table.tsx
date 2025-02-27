import { CreateStockModal } from '@/components/features/modal/modal';
import { StockGroupData } from '@/types/groupStock';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export function StockCompotent(
    { groupStockName }: {
        groupStockName: string
    }
) {
    const router = useRouter();
    const { data: groupStocks } = useSWR<StockGroupData>(`http://localhost:8000/api/stock/group/${groupStockName}`, fetcher)

    const [inputStockName, setInputStockName] = useState('');
    const [createModal, setCreateModal] = useState(false);

    const handleAddStock = async (text: string) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/stock/group/${groupStockName}/${text}`,
            );
            console.log('创建成功:', response.data);
        } catch (error) {
            console.error('提交失败:', error);
        }
    };

    const handleSave = (text: string) => {
        handleAddStock(text);
        setInputStockName('');
    };
    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault(); // 阻止浏览器默认右键菜单

    };

    return (
        <>
        <table className="table-auto">
            <thead>
                <tr>
                    <th>筛选</th>
                    {groupStocks?.data?.keys?.map((row) => (
                        <th>{row}</th>
                    ))}
                    <th>链接</th>
                </tr>
            </thead>
            <tbody>
                {groupStocks?.data?.stock_info?.map((stock, idx) => (
                    <tr key={stock.id}
                        onContextMenu={handleRightClick}>
                        <td>{idx + 1}</td>
                        {Object.values(stock.realtime_data).map((value) => (
                            <td>{value}</td>
                        ))}
                        <td className="relative">
                            <p>链接</p>
                            <div className="absolute hidden hover:block">
                                <div><a target="_blank" href={`https://xueqiu.com/S/${stock.realtime_data['市场'] === "深A" ? "SZ" : "SH"}${stock.realtime_data.代码}`}>雪球</a></div>
                                <div><a target="_blank" href={`https://guba.eastmoney.com/list,${stock.realtime_data.代码}.html`}>东财</a></div>
                                <div><a onClick={() => { router.push(`/notes/stock/${stock.name}`) }}>便签</a></div>
                                <div><a onClick={() => { router.push(`/trade`) }}>交易</a></div>
                            </div>
                        </td>
                    </tr>
                ))}

                <tr key='add-stock'>
                    <td>
                        <button onClick={() => setCreateModal(!createModal)}>+</button>
                    </td>

                    {Array.from({ length: groupStocks?.data?.keys?.length ?? 1 }, (_, i) => (
                        <td key={i}></td>
                    ))}
                </tr>


            </tbody>
        </table>
        {createModal && 
            <CreateStockModal 
                    initialText={inputStockName}
                    onSave={handleSave}
                    onClose={() => setCreateModal(false)}
            ></CreateStockModal>}
        </>

    )
}
