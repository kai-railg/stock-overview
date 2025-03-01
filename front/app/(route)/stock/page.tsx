'use client'
import { StockTable } from "./stock"



export default function Home() {
  return (
    <>
      <div className="stockTable">
          <StockTable></StockTable>
      </div>
    </>
  )
}