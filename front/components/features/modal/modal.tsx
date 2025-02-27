import { useState } from 'react';
import './modal.css';

export default function InputModal(
    { initialText = "", onSave, onClose, title, place }: {
        initialText: string,
        onSave: (text: string) => void,
        onClose?: () => void
        title: string,
        place: string,

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
        <div className="
            flex justify-center items-center
            fixed top-0 right-0 left-0 bottom-0
            bg-black/50
            z-[9999]
        ">
            <div className="
            w-[500px] p-6 bg-sky-200 rounded-[8px]
            ">
                <h3 className='text-center mb-4'>{title}</h3>
                <input
                    className="
                        w-full
                        border-2 border-solid border-blue-300 
                        rounded-[2px]
                        mb-10
                        foucs:border-blue-500
                        foucs:rounded-blue-500
                    "
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={place}
                />

                <div className="flex justify-center items-center gap-24">
                    <button className="py-2 px-4 hover:bg-blue-500/30" onClick={handleClose}>
                        取消
                    </button>
                    <button className="py-2 px-4 hover:bg-blue-500/30" onClick={handleSave}>
                        创建
                    </button>
                </div>


            </div>
        </div>
    );
}

export function CreateGroupModal(props: {
    initialText: string,
    onSave: (text: string) => void,
    onClose?: () => void
}) {
    return InputModal({...props, title: "创建分组", place: "输入分组名"})
}

export function UpdateGroupModal(props: {
    initialText: string,
    onSave: (text: string) => void,
    onClose?: () => void
}) {
    return InputModal({ ...props, title: "更新分组", place: "请重新输入分组名" })
}

export function CreateStockModal(props: {
    initialText: string,
    onSave: (text: string) => void,
    onClose?: () => void
}) {
    return InputModal({ ...props, title: "添加股票", place: "输入股票名称或者代码" })
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

export interface TradeModalInterface  {
    trade_type: number,
    price: number,
    volume: number,
    reason: string,
    stock: string
}
export function TradeModal(
    { inintialTrade, onSave, onClose }: {
        inintialTrade: TradeModalInterface,
        onSave: (trade: TradeModalInterface) => void,
        onClose?: () => void
    }
) {
    const [trade, setTrade] = useState<TradeModalInterface>(inintialTrade);
    const [isOpen, setIsOpen] = useState(true);

    console.log(trade)
    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    const handleSave = () => {
        onSave?.(trade);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>编辑内容</h2>
                {
                    Object.keys(trade).map((key) => {
                        return (
                        <>
                        {key}: <textarea
                            className="resizable-textarea"
                            key={key}
                            value={trade[key as keyof TradeModalInterface]}
                            onChange={(e) => {
                                setTrade({
                                    ...trade,
                                    [key]: e.target.value
                                })
                            }} />
                        </>
                        )
                    })
                }
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
