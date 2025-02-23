
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import EditModal from "../modal/modal";
import './notes.css';
import { Note, Notes, Stock, StockNotes } from "./types";

function Dropdown({note}: {note: Note}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState(note.note);

    const handleSave = (newText: string) => {
        handleUpdateNote(newText);
        setContent('');
    };
    const handleUpdateNote = async (newText: string) => {

        try {
            const response = await axios.put(
                `http://localhost:8000/api/stock/note/${note.id}`,
                {
                    "note": newText
                }
            );
            console.log('更新成功:', response, note.id);
        } catch (error) {
            console.error('更新失败:', error);
        }
    };
    const handleDeleteNote = async () => {

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/stock/note/${note.id}`
            );
            console.log('删除成功:', note.id);
        } catch (error) {
            console.error('删除失败:', error);
        }
    };

    return (
        <div className="dropdown-container">
            <button
                className="dropdown-toggle"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                }}
            >
                ···
            </button>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <button
                        className="dropdown-item"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("确定要删除此笔记吗？")) {
                                handleDeleteNote()
                            }
                            setIsDropdownOpen(false);
                        }}
                    >
                        删除
                    </button>
                    <button
                        className="dropdown-item"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(true);
                            setIsDropdownOpen(false);
                        }}
                    >
                        更新
                    </button>
                </div>
            )}

            {showModal && (
                <EditModal
                    initialText={content}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

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
            <Dropdown note={note}></Dropdown>
            <button className="note-top" onClick={() => handleBodyOnclick(note.id)}>
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

    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const match = pathname.match(/^\/notes\/stock\/([^/]+)/);
    const handleSave = (newText: string) => {
        if (match) {
            handleAddNoteSubmit(match[1], newText)
            setContent('');
        } 
    };

    const handleAddNoteSubmit = async (stock: string, note: string) => {

        try {
            const response = await axios.post(
                `http://localhost:8000/api/stock/note/${stock}`,
                {
                    note: note
                }
            );
            console.log('创建成功:', response.data);
            if (response.data) {
                router.refresh()
            }
            
        } catch (error) {
            console.error('提交失败:', error);
        }

    };
    return (
        <div className="notes">
            <div className="note" key='addNote'>
                <button className="note-top" onClick={() => setShowModal(true)}>
                    <p>+</p>
                </button>
            {showModal && (
                <EditModal
                    initialText={content}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
                )}
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
                    return <StockNoteCards key={note.id} stock={stock} note={note}/>
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
                    return <StockNoteCards key={note.id} stock={note.stock} note={note} />
                })
            }
        </StockCompotent>
    )
}