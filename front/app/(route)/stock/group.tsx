import { Groups } from '@/types/groupStock';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';
import './group.css';

const handleAddGroupSubmit = async (groupName: string) => {
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

const handleDeleteGroupSubmit = async (groupName: string) => {
    if (!groupName) {
        return;
    }
    try {
        const response = await axios.delete(
            `http://localhost:8000/api/stock/group/${groupName}`,
        );
        console.log('创建成功:', response.data);
    } catch (error) {
        console.error('提交失败:', error);
    }
};
const fetcher = (url: string) => fetch(url).then(res => res.json());
export function GroupComponent(
    {
        groupStockName,
        setGroupStockName,
    }: {
        groupStockName: string,
        setGroupStockName: (groupStockName: string) => void,
    }
) {
    const { data: groups } = useSWR<Groups>('http://localhost:8000/api/stock/groups', fetcher)

    const [display, setDisplay] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [updateGroupName, setUpdateGroupName] = useState('');
    const handleSetDisplay = () => {
        setDisplay(!display);
    }

    const handleRightClick = (e: React.MouseEvent, name: string) => {
        e.preventDefault(); // 阻止浏览器默认右键菜单
        if (name !== updateGroupName) {
            setUpdateGroupName(name);
        } else {
            setUpdateGroupName('');
        }
    };

    return (
        <nav className="groupHeader">
            
            {groups?.data?.map((group) => (
   
                <div>

                    <button
                        className={groupStockName === group.name ? 'group-button-active' : ''}
                        key={group.id}
                        onClick={() => setGroupStockName(group.name)}
                        onContextMenu={(e)=>handleRightClick(e, group.name)}
                    >
                        {group.name}
                    </button>
                    <div className={`group-button-menu ${updateGroupName === group.name ? 'visible' : 'hidden'}`}>
                        <div>
                            <button onClick={() => (handleDeleteGroupSubmit(updateGroupName), setUpdateGroupName(''))}>
                                删除分组</button>
                            <button>更新名称

                            </button>

                        </div>


                    </div>
                </div>

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
                style={{ background: "white" }}
                onClick={() => (
                    handleAddGroupSubmit(inputValue), 
                    handleSetDisplay(), 
                    setInputValue(""))}
            >{inputValue ? "✅" : "x"}</button>
        </nav>
    )
}
