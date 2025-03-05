'use client'
import { fetcher } from "@/types/fetcher";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";

interface Detail {
  price: number;
  note: string;
}
export interface Monitor {
    code: string;
    name: string;
    details: Detail[];
}

export interface MonitorResp {
  data: Monitor[];
}

function InputMonitor({ detail, detailState, setDetailState }: {
  detail: Detail, detailState: Detail, setDetailState: (detail: Detail) => void
}) {
  return (
    <div className="p-2">
      <input
        type="number"
        value={detail.price}
        onChange={(e) => setDetailState({ ...detailState, price: parseFloat(e.target.value) })}
        className="border p-1 mr-2 rounded"
      />
      <input
        type="string"
        value={detail.note}
        onChange={(e) => setDetailState({ ...detailState, note: e.target.value })}
        className="border p-1 mr-2 rounded"
      />
    </div>
  )
}
export function UpdateMonitor({ detail, detailState, setDetailState, setUpdateIndex }: { 
  detail: Detail, 
  detailState: Detail, 
  setDetailState: (detail: Detail) => void, 
  setUpdateIndex: (index: number) => void }) {
  return (
    <>
      <InputMonitor
        detail={detail} 
        detailState={detailState} 
        setDetailState={setDetailState}>
      </InputMonitor>
      <button onClick={() => { setDetailState({ price: 0, note: "" }), setUpdateIndex(-1) }} className="bg-yellow-500 text-white px-2 py-1 rounded">取消</button>
      <button className="bg-green-500 text-white px-2 py-1 rounded">保存</button>
    </>
  )
}

export function AddMonitor({ detail, detailState, setDetailState, setAddDetail, monitor }: {
  detail: Detail, detailState: Detail, 
  setDetailState: (detail: Detail) => void, 
  setAddDetail: (addDetail: boolean) => void,
  monitor: Monitor
}) {
  const AddMonitor = async () => {

    try {
      const response = await axios.post(
        `http://localhost:8000/api/stock/monitor`,
        {
          ...monitor, 
          details: [...monitor.details, detailState]
        }
      );
      console.log('创建成功:', response);
    } catch (error) {
      console.error('创建失败:', error);
    }
  };
  return (
    <>
      <InputMonitor
        detail={detail}
        detailState={detailState}
        setDetailState={setDetailState}>
      </InputMonitor>
      <button onClick={() => { setAddDetail(false)} } className="bg-yellow-500 text-white px-2 py-1 rounded">取消</button>
      <button 
        onClick={() => { setDetailState({ price: 0, note: "" }), AddMonitor() }} 
        className="bg-green-500 text-white px-2 py-1 rounded">
        保存
      </button>
    </>
  )
}

export default function Home() {
  const [detailState, setDetailState] = useState<Detail>({price: 0, note: ""});
  const { data: resp } = useSWR<MonitorResp>(`http://localhost:8000/api/stock/monitor`, fetcher)
  const [addDetail, setAddDetail] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);


  // const audio = new Audio("/christmas.mp3")
  // audio.play();
  // audio.pause()

  return (
    <>
      <div>
        <h1 className="text-3xl text-center font-bold">股票价格监控</h1>
        <div className="grid grid-cols-4 gap-2">
        {resp?.data?.map((monitor) => (
          <div key={monitor.code} className="border-2 p-2 m-2">
            <h2 className="text-xl ml-2 mb-2">{monitor.name}</h2>
            {monitor?.details?.map((detail, index) => (
              <div key={detail.price} className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded">
                {
                  updateIndex === index ? (
                    <UpdateMonitor 
                      detail={detail} 
                      detailState={detailState} 
                      setDetailState={setDetailState}
                      setUpdateIndex={setUpdateIndex}>
                    </UpdateMonitor>
                  ) : (
                    <>
                      <div className="p-2">
                        <span className="mr-2">{detail.price}</span>
                        <span>{detail.note}</span>
                      </div>
                      <div>
                        <button onClick={() => { setDetailState({ ...detail }), setUpdateIndex(index) }} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">编辑</button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); 
                            if (window.confirm("确定要删除吗")) {
                              try {
                                const response = axios.post(
                                  `http://localhost:8000/api/stock/monitor/`, 
                                  {
                                    ...monitor, 
                                    details: monitor.details.filter((_, i) => i !== index)
                                  }
                                );
                                console.log('删除成功:', response);
                              } catch (error) {
                                console.error('删除失败:', error);
                              }
                            }}} 
                          className="bg-red-500 text-white px-2 py-1 rounded">删除</button>
                      </div>
                    </>
                )}

              </div>
            ))}
            {
              addDetail ? (
                <div className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded">
                  <AddMonitor 
                    detail={detailState} 
                    detailState={detailState} 
                    setDetailState={setDetailState}
                    setAddDetail={setAddDetail}
                    monitor={monitor}>
                  </AddMonitor>
                </div>
              ) : (
                <div className="flex justify-end items-center bg-gray-100 p-2 rounded">
                  <button onClick={() => { setAddDetail(true) }} className="bg-green-500 text-white mr-2 px-2 py-1 rounded">新增</button>
                </div>              
            )}

            </div>
        ))}
        </div>
      </div>
    </>
  )
}