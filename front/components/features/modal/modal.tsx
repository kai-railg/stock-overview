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
