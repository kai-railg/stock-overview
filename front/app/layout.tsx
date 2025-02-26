import { SidebarButton } from '@/components/features/layout';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './app.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head >
        {/* 确保所有设备都能正确呈现和触摸缩放 */}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex w-screen h-screen">
          <div className="flex-row flex-auto basis-1/12 max-w-24 bg-[rgb(35,50,63)]">
              <SidebarButton text="logo" url='./'></SidebarButton>
              <SidebarButton text="自选" url='./stock'></SidebarButton>
              <SidebarButton text="日报" url='./dailies'></SidebarButton>
              <SidebarButton text="便签" url='./notes'></SidebarButton>
              <SidebarButton text="交易" url='./trade'></SidebarButton>
          </div>
          <div className="basis-11/12 flex-auto">
            {children}
          </div>
            
          </div>

        
      </body>
    </html>
  );
}
