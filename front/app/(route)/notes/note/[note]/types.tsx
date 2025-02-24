export interface Params {
    note: string;
}


export interface NoteResponse {
    data: Note;
}

interface Note {
    note: string;
    date: string;
    id: number;
    stock_id: number;
}