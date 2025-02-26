'use client'
import { StockTable } from "./stock"
import './table.css'



export default function Home() {
  return (
    <>
      <div className="stockTable">
          <StockTable></StockTable>
      </div>
    </>
  )
}