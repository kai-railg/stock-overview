'use client';

import '@/components/features/header/header.css';
import { Header, HeaderButton } from '@/components/features/layout';
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import './daily.css';
function DailyButton() {
    const pathname = usePathname();
    const match = pathname.match(/^\/dailies\/daily\/([^/]+)/);
    if (match) {
        return <button>{decodeURIComponent(match[1])}</button>
    }
    return null
}

function HistoryButton() {
    return <button>近期浏览</button>
}

export default function DailiesRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [searchValue, setSearchValue] = React.useState('');
    const router = useRouter();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/dailies/daily/${encodeURIComponent(searchValue)}`);
    };

    const handleIndexSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dailies');
    };
    
    return (
        <div>
            <Header>
                <HeaderButton text="所有日报" url="/dailies"></HeaderButton>
                <HeaderButton text="近期浏览" url="/dailies/history"></HeaderButton>
            </Header>
            {children}
        </div>
    )
}