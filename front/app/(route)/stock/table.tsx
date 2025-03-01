import { CreateStockModal } from '@/components/features/modal/modal';
import { StockGroupData } from '@/types/groupStock';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import './table.css';
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
    const t_css = "border border-solid border-black p-1"
    return (
        <>
        <div className='w-full pl-8 pr-8'>
            <table className="table-auto w-full border-collapse 
            overflow-hidden overflow-y-auto
            text-right text-gray-800
            ">
                    <thead>
                        <tr>
                            <th >筛选</th>
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
                                {groupStocks?.data?.keys?.map((key) => (
                                    <td>{stock[key]}</td>
                                ))}
                                <td className="relative group">
                                    <p>链接</p>
                                    <div className="absolute hidden 
                                        bg-black text-center text-white
                                        p-2 w-20 flex flex-col z-[10]
                                        border-collapse border border-blue border-solid
                                        group-hover:block">
                                        <div><a target="_blank" href={`https://xueqiu.com/S/${stock.市场}${stock.代码}`}>雪球</a></div>
                                        <div><a target="_blank" href={`https://guba.eastmoney.com/list,${stock.代码}.html`}>东财</a></div>
                                        <div><button onClick={() => { router.push(`/notes/stock/${stock.代码}`) }}>便签</button></div>
                                        <div><button onClick={() => { router.push(`/trade`) }}>交易</button></div>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        <tr key='add-stock'>
                            <td>
                                <button className="hover:bg-sky-200" onClick={() => setCreateModal(!createModal)}><span>+</span></button>
                            </td>

                            {Array.from({ length: (groupStocks?.data?.keys?.length ?? 1) + 1 }, (_, i) => (
                                <td key={i}></td>
                            ))}
                        </tr>


                    </tbody>
                </table>
        </div>
        {createModal && 
            <CreateStockModal 
                    initialText={inputStockName}
                    onSave={handleSave}
                    onClose={() => setCreateModal(false)}
            ></CreateStockModal>}
        </>

    )
}
