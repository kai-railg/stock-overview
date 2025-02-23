export interface Note {
    note: string;
    date: string;
    id: number;
}

export interface Stock {
    name: string;
    code: string;
    id: number;
    market: string
}

export interface StockNotes extends Stock {
    notes: Note[]
}

export interface Notes extends Note {
    stock: Stock
}

export interface NotesInterface {
    data: Notes[]
}

export interface NotesStockInterface {
    data: StockNotes
}