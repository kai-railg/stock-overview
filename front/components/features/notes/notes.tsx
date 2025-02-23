
import { useRouter } from "next/navigation";
import './notes.css';
import { Note, Notes, Stock, StockNotes } from "./types";

export function StockNoteCards({ stock, note }: { stock: Stock, note: Note }) {
    const router = useRouter();
    const handleBodyOnclick = (node_id: number) => {
        router.push(`/notes/note/${node_id}`);
    };
    const handleTitleOnclick = (name: string) => {
        router.push(`/notes/stock/${name}`);
    };
    return (
        <div className="note">
            <button className="note-top" onClick={() => handleBodyOnclick(note.note_id)}>
                <p>{note.note}</p>
            </button>
            <button className="note-bottom" onClick={() => handleTitleOnclick(stock.name)}>
                <p>{stock.name}</p>
                <p>{note.date}</p>
            </button>
        </div>
    )
}
export function StockCompotent({ children }: { children: React.ReactNode }) {

    return (
        <div className="notes">
            <div className="note" key='addNote'>
                <button className="note-top">
                    <p>+</p>
                </button>

            </div>
            
            {children}

        </div>
    )
}

export function StockNotesCompotent({ stock }: { stock: StockNotes }) {
    return (
        <StockCompotent>
            {
                stock?.notes?.map((note) => {
                    return <StockNoteCards key={note.note_id} stock={stock} note={note}/>
                })  
            }
            
        </StockCompotent>
    )
}

export function NotesCompotent({ notes }: { notes: Notes[] }) {
    return (
        <StockCompotent>
            {
                notes?.map((note) => {
                    return <StockNoteCards key={note.note_id} stock={note.stock} note={note} />
                })
            }
        </StockCompotent>
    )
}