"use client"

import '@/components/features/header/header.css';
import React from 'react';
import useSWR from 'swr';
import './notes.css';
import { NoteResponse, Params } from './types';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home(
    { params }: { params: Promise<Params>}
) {
    const note = React.use(params).note
    const { data: noteResp } = useSWR<NoteResponse>(`http://localhost:8000/api/stock/note/${note}`, fetcher)
    

    return (
        <button>
            {
                noteResp?.data?.note
            }
        </button>
    )
}