'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTodoPage() {
    const params = useParams();
    const router = useRouter();
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetch(`/api/todos`) 
            .then(res => res.json())
            .then(data => {
                const todo = data.find((t: any) => t.id === Number(params.todoId));
                if (todo) {
                    setTitle(todo.title);
                }
            });
    }, [params.todoId]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`/api/todos/${params.todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        router.push('/todos');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-20 text-gray-800">
            <div className="w-full max-w-[480px] bg-white p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
                <h1 className="text-2xl font-bold text-[#672be0] mb-6 text-center">할 일 수정</h1>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">어떻게 변경할까요?</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-lg outline-none transition focus:border-[#672be0] focus:ring-[3px] focus:ring-[#672be0]/15" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => router.back()} className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition">
                            취소
                        </button>
                        <button type="submit" className="flex-1 py-3 text-white bg-[#672be0] rounded-lg hover:bg-[#5222b3] font-semibold transition shadow-sm">
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}