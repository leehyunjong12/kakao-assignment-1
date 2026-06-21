'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTodoPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        
        if (res.ok) {
            router.push('/todos');
            router.refresh();
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 pt-16">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">새 할 일 작성</h1>
            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                    <input
                        type="text"
                        required
                        placeholder="어떤 일을 할 예정인가요?"
                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">내용 (선택)</label>
                    <textarea
                        placeholder="상세 내용을 적어주세요."
                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none h-32 resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition">취소</button>
                    <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 font-medium transition shadow-sm">저장하기</button>
                </div>
            </form>
        </div>
    );
}