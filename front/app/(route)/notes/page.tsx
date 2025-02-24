'use client';

import { NotesCompotent } from "@/components/features/notes/notes";
import { NotesInterface } from "@/components/features/notes/types";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { data: resp } = useSWR<NotesInterface>(`http://localhost:8000/api/stock/notes`, fetcher)

  return (

    <NotesCompotent notes={resp?.data}>

    </NotesCompotent>
  )
}