"use client"

import '@/components/features/header/header.css';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import './notes.css';

const NAV_BUTTONS = [
    {
        text: '所有便签',
        path: '/notes', // 匹配基础路径
        matchPattern: /^\/notes/ // 匹配 /notes 及其子路由
    },
    {
        text: '股票便签',
        path: '/notes/stock',
        matchPattern: /^\/notes\/stock(\/|$)/ // 匹配 /notes/stock 及其子路由
    },
    {
        text: '最近浏览',
        path: '/notes/history',
        matchPattern: /^\/notes\/history/
    }
];
function StockButton() {
    const pathname = usePathname();
    const match = pathname.match(/^\/notes\/stock\/([^/]+)/);
    if (match) {
        return <button>{decodeURIComponent(match[1]) }</button>
    }
    return null
}

function HistoryButton( ) {
    return <button>近期浏览</button>
}
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [searchValue, setSearchValue] = React.useState('');
    const router = useRouter();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/notes/stock/${encodeURIComponent(searchValue)}`);
    };

    const handleAllSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/notes');
    };


    return (
        <div>
            <div className="header">
                <nav>
                    <button onClick={handleAllSubmit}>所有便签</button>
                    <StockButton></StockButton>
                    <HistoryButton></HistoryButton>
                    <div className="search-container">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Search.."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button type="submit">
                                <i>搜索</i>
                            </button>
                        </form>
                    </div>
                </nav>
            </div>
            {children}
        </div>
    )
}



