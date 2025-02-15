"use client";
import Header from '@/components/features/header';
import Sidebar from '@/components/features/sidebar';
import StockTable from '@/components/features/stockTable';
import '@/components/ui/main.css';



export default function Home() {

  return (
    <div className="main-layout">
      <Sidebar></Sidebar>
      <Header></Header>
      <StockTable></StockTable>
    </div>
  );
}

