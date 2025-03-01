import { CreateGroupModal, UpdateGroupModal } from '@/components/features/modal/modal';
import { Groups } from '@/types/groupStock';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';

const handleAddGroup = async (groupName: string) => {
    if (!groupName) {
        return;
    }
    try {
        const response = await axios.post(
            `http://localhost:8000/api/stock/group/${groupName}`,
        );
        console.log('创建成功:', response);
    } catch (error) {
        console.error('提交失败:', error);
    }
};

const handleDeleteGroup = async (groupName: string) => {
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
export function GroupButton(
    { name, OnClick }:
    { name: string, OnClick: () => void }) {

    const [hiddenStatus, setHiddenStatus] = useState(false);
    const [showModal, setShowModal] = useState(false);
    function UpdateEvent({newGroupName}: {newGroupName: string}) {
        return 
    }
    return (
        // 分组的栏目
        <div className='relative'>
            <button className="
                border-solid border-2 border-black
                px-2 py-1 m-1
                text-color-black font-bold
                bg-sky-100/50
                rounded-xl 
                hover:bg-blue-500/50
                hover:shadow-blue-500/50 
                hover:shadow-md"
                
                onClick={() => OnClick()}
                onContextMenu={(e) => { e.preventDefault(), setHiddenStatus(!hiddenStatus) }}
            >
                {name}
            </button>
            {/* 分组的操作按钮 */}
            <div className={`"
                absolute ${hiddenStatus ? 'block' : 'hidden'}
                box-border border border-collapse w-32 h-16 
                flex flex-col justify-center items-center
                bg-white text-black z-10
            "`}>
                <button className='
                    flex-auto border-solid border border-black
                    w-full h-full hover:bg-blue-500/50'
                    onClick={() => setShowModal(true)}
                >
                    更新名称
                </button>
                {showModal &&
                    <UpdateGroupModal
                        initialText={name}
                        onSave={UpdateEvent}
                        onClose={() => setShowModal(false)}
                    ></UpdateGroupModal>
                }
                <button className='
                    flex-auto border-solid border border-black
                    w-full h-full hover:bg-blue-500/50'
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("确定要删除此笔记吗？")) {
                            handleDeleteGroup(name)
                        }
                        setShowModal(false)
                    }}
                >
                    删除分组
                </button>
            </div>
        </div>
    )
}
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

    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');

    const handleSave = (text: string) => {
        handleAddGroup(text);
        setContent('');
    };


    return (
        <div className="
            w-full px-2 py-2 mb-4
            flex flex-auto flex-row flex-wrap 
            border-solid border-black
            text-color-black font-bold
            bg-sky-200
            ">  
            
            {groups?.data?.map((group) => (
                <GroupButton 
                    key={group.id}
                    name={group.name} 
                    OnClick={() => setGroupStockName(group.name)}>
                </GroupButton>
            ))}
            <button
            className='ml-4 font-semibold text-2xl'
                onClick={() => setShowModal(true)}>
                <span>+</span>
            </button>

            {showModal && (
                <CreateGroupModal
                    initialText={content}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
