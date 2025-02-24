'use client'
import Header from "@/components/features/header/header"
import { TradeModal, TradeModalInterface } from "@/components/features/modal/modal"
import axios from "axios"
import React from "react"
import useSWR from "swr"
import './trades.css'

interface Stock {
  id: number
  name: string, 
  code: string,
  market: string
}

interface TradeInterface {
  id: number
  trade_date: string
  trade_type: number
  price: number
  volume: number
  reason: string
  returns: number,
  stock: Stock
}

interface TradesInterface {
  data: TradeInterface[]
}
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { data: resp } = useSWR<TradesInterface>(`http://localhost:8000/api/stock/trades`, fetcher)

  const [modalOpen, setModalOpen] = React.useState(false)
  const initModal = {
    trade_type: 1,
    price: 0,
    volume: 0,
    reason: "",
    stock: ""
  }
  const handleSave = (trade: TradeModalInterface) => {
    axios.post(
      `http://localhost:8000/api/stock/trade`,
      {
        "trade_type": trade.trade_type,
        "price": trade.price,
        "volume": trade.volume,
        "reason": trade.reason,
        "stock_iden": trade.stock,
      }
    ).then(res => {
      console.log(res)
    })

  };
  return (
    <div>
          <Header navList={["记录", "成交"]} />
      <div className="trade-list-container">
        <button onClick={() => setModalOpen(true)}>+</button>
        {resp?.data.map((trade) => (
          <div key={trade.id} className="trade-item">
            <div className="trade-info">
              <div className="stock-info">
                <p className="stock-name">{trade.stock.name}</p>
                <p className="trade-date">{trade.trade_date}</p>
              </div>
              <div className="price-info">
                <p className="price">
                  {trade.trade_type ===1 ? "买入" : "卖出"}价格: {trade.price}
                  <span className="price-unit">元</span>
                </p>
                <p className="volume">
                  {trade.volume}股
                </p>
              </div>
              <div className="returns-info">
                <p className="returns">
                  收益: {trade.returns}元
                  {trade.returns >= 0 ? (
                    <span className="returns-positive">↑</span>
                  ) : (
                    <span className="returns-negative">↓</span>
                  )}
                </p>
                <p className="reason">买入理由: {trade.reason}</p>
              </div>
            </div>
            {/* <div className="trade-actions">
              <button className="view-details">查看详情</button>
              <button className="copy">复制</button>
            </div>
             */}
          </div>
        ))}
      </div>
      {
        modalOpen && <TradeModal 
          inintialTrade={initModal}
          onClose={() => setModalOpen(false)}
          onSave={(trade) => { handleSave(trade)}}
        >

        </TradeModal>
      }
      
    </div>
  )
}