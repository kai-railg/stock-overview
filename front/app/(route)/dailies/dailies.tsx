// pages/stock-daily.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu } from '@headlessui/react';

interface StockPost {
    id: number;
    content: string;
    date: string;
}

export default function StockDailyPage() {
    const [posts, setPosts] = useState<StockPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<StockPost | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [inputContent, setInputContent] = useState('');

    // 获取数据
    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/stock/daily');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // 创建新文章
    const handleCreate = async () => {
        try {
            await axios.post('http://localhost:8000/api/stock/daily', {
                content: inputContent
            });
            fetchPosts();
            setIsModalOpen(false);
            setInputContent('');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // 更新文章
    const handleUpdate = async () => {
        if (!selectedPost) return;
        try {
            await axios.put(`http://localhost:8000/api/stock/daily/${selectedPost.id}`, {
                content: inputContent
            });
            fetchPosts();
            setIsModalOpen(false);
            setInputContent('');
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    // 删除文章
    const handleDelete = async (id: number) => {
        if (!confirm('确定要删除这篇文章吗？')) return;
        try {
            await axios.delete(`http://localhost:8000/api/stock/daily/${id}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div>
        </div>
    );
}
