import { useState } from 'react';
import './modal.css';

export default function EditModal(
    { initialText = "", onSave, onClose }: {
        initialText: string,
        onSave: (text: string) => void,
        onClose?: () => void
    }
) {
    const [text, setText] = useState(initialText);
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    const handleSave = () => {
        onSave?.(text);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>编辑内容</h2>

                <textarea
                    className="resizable-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="输入内容..."
                />

                <div className="button-group">
                    <button className="cancel-button" onClick={handleClose}>
                        取消
                    </button>
                    <button className="confirm-button" onClick={handleSave}>
                        创建
                    </button>
                </div>


            </div>
        </div>
    );
}


export function DailyModal(
    { initialTitle = "", initialContent = "", onSave, onClose }: {
        initialTitle: string,
        initialContent: string,
        onSave: (title: string, content: string) => void,
        onClose?: () => void
    }
) {
    const [title, setTitleText] = useState(initialTitle);
    const [content, setContentText] = useState(initialContent);
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    const handleSave = () => {
        onSave?.(title, content);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>编辑内容</h2>

                <textarea
                    className="resizable-textarea"
                    value={title}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="输入内容..."
                />

                <textarea
                    className="resizable-textarea"
                    value={content}
                    onChange={(e) => setContentText(e.target.value)}
                    placeholder="输入内容..."
                />

                <div className="button-group">
                    <button className="cancel-button" onClick={handleClose}>
                        取消
                    </button>
                    <button className="confirm-button" onClick={handleSave}>
                        创建
                    </button>
                </div>


            </div>
        </div>
    );
}
