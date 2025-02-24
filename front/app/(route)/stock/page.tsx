import Header from "@/components/features/header/header"
import { StockTable } from "./stock"
import './table.css'

export default function Home() {
  return (
    <>
          <div>
              <Header navList={["自选", "智能选股"]} />
          </div>
          <div className="stockTable">
              <StockTable></StockTable>
          </div>
    </>
  )
}