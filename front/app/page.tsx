"use client";
import { Header, Sidebar, StockTable } from '@/components/features/main';
import '@/styles/main.css';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <Header/>
      </div>
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="content">
        <StockTable></StockTable>
      </div>
    </div>

  )
}

