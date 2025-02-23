"use client"


import { StockNotesCompotent } from '@/components/features/notes/notes';
import { NotesStockInterface } from '@/components/features/notes/types';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());
interface Params {
    stock: string;
}
export default function Home(
    { params }: { params: Promise<Params> }
) {
    const stock = React.use(params).stock
    const { data: resp } = useSWR<NotesStockInterface>(`http://localhost:8000/api/stock/notes/${stock}`, fetcher)


    return (
        <StockNotesCompotent stock={resp?.data}>

        </StockNotesCompotent>
    )
}
