"use client"
import { useEffect, useState } from 'react';

// 模拟股票数据
const mockStocks = [
    { id: 1, name: 'AAPL', price: 150 },
    { id: 2, name: 'GOOGL', price: 2800 },
    { id: 3, name: 'AMZN', price: 3400 },
];

export default function StockMonitor() {
    const [stocks, setStocks] = useState(mockStocks);
    const [newStock, setNewStock] = useState({ name: '', price: 0 });
    const [editStock, setEditStock] = useState(null);
    const [monitorPrice, setMonitorPrice] = useState(0);

    // 模拟获取股票数据
    useEffect(() => {
        // 在这里可以调用后端接口获取数据
        setStocks(mockStocks);
    }, []);

    // 添加股票
    const addStock = () => {
        if (newStock.name && newStock.price > 0) {
            const newStockData = { id: stocks.length + 1, ...newStock };
            setStocks([...stocks, newStockData]);
            setNewStock({ name: '', price: 0 });
        }
    };

    // 删除股票
    const deleteStock = (id) => {
        setStocks(stocks.filter(stock => stock.id !== id));
    };

    // 更新股票价格
    const updateStockPrice = (id, newPrice) => {
        setStocks(stocks.map(stock => stock.id === id ? { ...stock, price: newPrice } : stock));
    };

    // 编辑股票
    const startEditStock = (stock) => {
        setEditStock(stock);
    };

    const saveEditStock = () => {
        if (editStock) {
            updateStockPrice(editStock.id, editStock.price);
            setEditStock(null);
        }
    };

    // 监控价格变化
    useEffect(() => {
        stocks.forEach(stock => {
            if (stock.price >= monitorPrice && monitorPrice > 0) {
                alert(`股票 ${stock.name} 的价格已达到监控价格 ${monitorPrice}`);
                const audio = new Audio('/path/to/alert-sound.mp3');
                audio.play();
            }
        });
    }, [stocks, monitorPrice]);

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">股票价格监控</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="股票名称"
                    value={newStock.name}
                    onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                    className="border p-2 mr-2 rounded"
                />
                <input
                    type="number"
                    placeholder="价格"
                    value={newStock.price}
                    onChange={(e) => setNewStock({ ...newStock, price: parseFloat(e.target.value) })}
                    className="border p-2 mr-2 rounded"
                />
                <button onClick={addStock} className="bg-blue-500 text-white px-4 py-2 rounded">添加</button>
            </div>
            <div className="mb-4">
                <input
                    type="number"
                    placeholder="监控价格"
                    value={monitorPrice}
                    onChange={(e) => setMonitorPrice(parseFloat(e.target.value))}
                    className="border p-2 mr-2 rounded"
                />
            </div>
            <ul className="space-y-2">
                {stocks.map(stock => (
                    <li key={stock.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        {editStock && editStock.id === stock.id ? (
                            <>
                                <input
                                    type="number"
                                    value={editStock.price}
                                    onChange={(e) => setEditStock({ ...editStock, price: parseFloat(e.target.value) })}
                                    className="border p-1 mr-2 rounded"
                                />
                                <button onClick={saveEditStock} className="bg-green-500 text-white px-2 py-1 rounded">保存</button>
                            </>
                        ) : (
                            <>
                                <span>{stock.name}: ${stock.price}</span>
                                <div>
                                    <button onClick={() => startEditStock(stock)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">编辑</button>
                                    <button onClick={() => deleteStock(stock.id)} className="bg-red-500 text-white px-2 py-1 rounded">删除</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
} 