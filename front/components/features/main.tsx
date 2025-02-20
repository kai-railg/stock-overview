import '@/styles/stockTable.css';
import { Groups, StockGroupData } from '@/types/groupStock';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';

export function Header() {
    return (
        <nav>
            <button className="logo">logo</button>
            <button>股票</button>
            <button>其他</button>
        </nav>
    )
}

export function Sidebar() {
    return (
        <nav>
            <button>自选</button>
            <button>个股</button>
        </nav>
    )
}

function GroupComponent(
    {
        groupStockName,
        setGroupStockName
    }: {
        groupStockName: string,
        setGroupStockName: (groupStockName: string) => void
    }
) {
    const [open, setOpen] = useState(false);
    const { data: groups } = useSWR<Groups>('http://localhost:8000/api/stock/groups', fetcher)

    const [display, setDisplay] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const handleSetDisplay = () => {
        setDisplay(!display);
    }
    const handleAddGroupDialogSubmit = async (groupName: string) => {
        if (!groupName) {
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:8000/api/stock/group/${groupName}`,
            );
            console.log('创建成功:', response.data);
        } catch (error) {
            console.error('提交失败:', error);
        }
    };
    return (
        <nav className="groupHeader">
            {groups?.data?.map((group) => (
                <button className='groupName' key={group.id} onClick={() => setGroupStockName(group.name)}>
                    {group.name}
                </button>
            ))}
            <button className={`addGroup ${display ? 'visible' : 'hidden'}`} onClick={handleSetDisplay}>+</button>
            <input 
                className={`${display ? 'hidden' : 'visible'}`} 
                type="text" 
                placeholder='分组名称'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                
             />
            <button 
                className={`${display ? 'hidden' : 'visible'}`} 
                style={{ background: "white"}}
                onClick={() => (handleAddGroupDialogSubmit(inputValue), handleSetDisplay(), setInputValue(""))}
            >{inputValue ? "✅" : "x" }</button>
        </nav>
    )
}

function StockCompotent(
    { groupStockName }: {
        groupStockName: string
    }
) {

    const { data: groupStocks } = useSWR<StockGroupData>(`http://localhost:8000/api/stock/group/${groupStockName}`, fetcher)

    const [display, setDisplay] = useState(false);
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
    return (
        <table className="stockTable">
            <thead>
                <tr>
                    <th>筛选</th>
                    {groupStocks?.data?.keys?.map((row) => (
                        <th key={row}>{row}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {groupStocks?.data?.stock_info?.map((stock, idx) => (
                    <tr key={stock.id}>
                        <td>{idx + 1}</td>
                        {Object.values(stock.realtime_data).map((value) => (
                            <td >{value}</td>
                        ))}
                    </tr>
                ))}
                <tr>
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
                    {Array.from({ length: groupStocks?.data?.keys?.length ?? 1 - 1 }, (_, i) => (
                        <td></td>
                    ))}
                </tr>


            </tbody>
        </table>
    )
}

const fetcher = (url: string) => fetch(url).then(res => res.json());
export function StockTable() {

    const [groupStockName, setGroupStockName] = useState("自选股");

    return (
        <div>
            <GroupComponent 
                groupStockName={groupStockName} 
                setGroupStockName={setGroupStockName}
            ></GroupComponent>
            <StockCompotent 
                groupStockName={groupStockName}
            ></StockCompotent>
            
        </div>
    );
}