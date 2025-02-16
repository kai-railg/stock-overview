"use client";
import Header from '@/components/features/header';
import Sidebar from '@/components/features/sidebar';
import StockTable from '@/components/features/stockTable';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';



export default function Home() {
  return (
    <Box sx={{ height: "100vh" }}>
      {/* 主容器 - 垂直方向 */}
      <Grid container direction="column" sx={{ height: "100%" }}>
        {/* 上部分（高度 2/12） */}
        <Grid item sx={{ flex: "0.5 0 auto" }}>
          {/* 嵌套横向容器 */}
          <Grid container sx={{ height: "100%" }}>
            <Grid item xs={0.5} sx={{ bgcolor: "#f0f0f0" }}>
              icon
            </Grid>
            <Grid item xs={11.5} sx={{ bgcolor: "#e0e0e0" }}>
              <Header></Header>
            </Grid>
          </Grid>
        </Grid>

        {/* 下部分（高度 10/12） */}
        <Grid item sx={{ flex: "11.5 0 auto" }}>
          {/* 嵌套横向容器 */}
          <Grid container sx={{ height: "100%" }}>
            <Grid item xs={0.5} sx={{ bgcolor: "#d0d0d0" }}>
              <Sidebar></Sidebar>
            </Grid>
            <Grid item xs={11.5} sx={{ bgcolor: "#c0c0c0" }}>
              <StockTable></StockTable>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

