'use client'
import { DailyModal } from "@/components/features/modal/modal";
import axios from "axios";
import { format } from 'date-fns';
import { useState } from "react";
import useSWR from "swr";
import './daily.css';
import { DailiesResp, Daily } from "./types";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
    const { data: resp } = useSWR<DailiesResp>(`http://localhost:8000/api/stock/dailies`, fetcher)
    const [curruentDaily, setCurruentDaily] = useState<Daily | null>(null)
    const [showModal, setShowModal] = useState(false);

    const handleDeleteDaily = async (daily_id: number) => {

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/stock/daily/${daily_id}`
            );
            console.log('删除成功:', daily_id);
        } catch (error) {
            console.error('删除失败:', error);
        }
    };
    const handleSave = (title: string, content: string) => {
        if (
            curruentDaily === null
        ) {
            
            const date = format(new Date(), 'yyyy-MM-dd')
            axios.post(
                `http://localhost:8000/api/stock/daily/${date}`,
                {
                    title: title,
                    content: content,
                }
            ).then(res => {
                console.log(res)
            })
        } else {
            axios.put(
                `http://localhost:8000/api/stock/daily/${curruentDaily.id}`,
                {
                    title: title,
                    content: content,
                }
            ).then(res => {
                console.log(res)
            })
        }
        setCurruentDaily(null);
        
    };

    return (

        <div className="dailies-container ">
            <div className="add-daily" onClick={() => setShowModal(true)}>
                <span>+ 新建每日股评</span>
            </div>

  
            <div className="dailies">
                {resp?.data.map(daily => (
                    <div key={daily.id} className="daily">
                        <div className="daily-header">
                            <div className="daily-title">{daily.title}  · {daily.date}</div>
                            <div className="daily-dropdown">
                                <button className="dropdown-btn">⋮</button>
                                <div className="dropdown-content">
                                    <button
                                        onClick={() => {
                                            setCurruentDaily(daily)
                                            setShowModal(true)
                                        }}
                                    >
                                        编辑
                                    </button>
                                    <button onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            if (window.confirm("确定要删除此日报吗?")) {
                                                handleDeleteDaily(daily.id)
                                            }
                                            
                                    }}>删除</button>
                                </div>
                            </div>
                        </div>
                        <div className="daily-content">{daily.content}</div>
  
                    </div>

                ))}
            </div>

            {showModal && (
                <DailyModal
                    initialTitle={curruentDaily?.title || ""}
                    initialContent={curruentDaily?.content || ""}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                >
                </DailyModal>
            )}

        </div>
    )
}