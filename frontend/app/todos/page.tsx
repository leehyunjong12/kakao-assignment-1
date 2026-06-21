'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

function TodoContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [todos, setTodos] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    
    const currentFilter = searchParams.get('filter') || 'all';
    const initialSearch = searchParams.get('search') || '';
    const [searchInput, setSearchInput] = useState(initialSearch);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (searchInput) {
                params.set('search', searchInput);
            } else {
                params.delete('search');
            }
            router.replace(`${pathname}?${params.toString()}`);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput, pathname, router]);

    useEffect(() => {
        fetchTodos();
    }, [searchParams]);

    const fetchTodos = async () => {
        const params = searchParams.toString();
        const res = await fetch(`/api/todos${params ? `?${params}` : ''}`, { cache: 'no-store' });
        const data = await res.json();
        setTodos(data);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        setTitle('');
        fetchTodos();
    };

    const toggleComplete = async (todo: any) => {
        await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_completed: !todo.is_completed })
        });
        fetchTodos();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제할까요?')) return;
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        fetchTodos();
    };

    const handleFilterChange = (newFilter: string) => {
        const params = new URLSearchParams(window.location.search);
        if (newFilter === 'all') {
            params.delete('filter');
        } else {
            params.set('filter', newFilter);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-[480px] bg-white p-8 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
            <h1 className="text-3xl font-bold text-[#672be0] text-center mb-6 tracking-tight">TODO</h1>

            {/* 검색창 */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="할 일 검색..."
                    className="w-full px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none transition focus:border-[#672be0] focus:ring-[3px] focus:ring-[#672be0]/15 bg-gray-50"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleAdd} className="flex gap-2.5 mb-6">
                <input
                    type="text"
                    placeholder="오늘 할 일은 무엇인가요?"
                    className="flex-1 px-4 py-3 border-[1.5px] border-gray-200 rounded-lg text-base outline-none transition focus:border-[#672be0] focus:ring-[3px] focus:ring-[#672be0]/15"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button type="submit" className="bg-[#672be0] hover:bg-[#5222b3] text-white px-6 rounded-lg font-semibold transition">
                    추가
                </button>
            </form>

            {/* 필터 탭 */}
            <div className="flex gap-1.5 mb-4 border-b border-gray-100 pb-2.5">
                {['all', 'active', 'completed'].map((f) => (
                    <button 
                        key={f}
                        onClick={() => handleFilterChange(f)}
                        className={`px-3 py-1.5 text-sm rounded-md transition ${currentFilter === f ? 'text-[#672be0] bg-[#672be0]/10 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-medium'}`}
                    >
                        {f === 'all' ? '전체' : f === 'active' ? '진행 중' : '완료'}
                    </button>
                ))}
            </div>

            {/* 리스트 */}
            <ul className="mt-2 space-y-1">
                {todos.map((todo: any) => (
                    <li key={todo.id} className="flex items-center justify-between p-3 border-b border-gray-100 group hover:bg-gray-50 transition rounded-lg">
                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleComplete(todo)}>
                            <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center transition-all duration-200 
                                ${todo.is_completed ? 'bg-[#672be0] border-[#672be0]' : 'border-gray-300 group-hover:border-[#672be0]'}`}>
                                {todo.is_completed && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-base transition-all duration-200 ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {todo.title}
                            </span>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Link href={`/todos/${todo.id}`} className="text-xs font-medium px-2.5 py-1.5 text-gray-500 hover:text-[#672be0] hover:bg-indigo-50 rounded-md transition">
                                수정
                            </Link>
                            <button onClick={() => handleDelete(todo.id)} className="text-xs font-medium px-2.5 py-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition">
                                삭제
                            </button>
                        </div>
                    </li>
                ))}
                {todos.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">해당하는 할 일이 없습니다.</div>
                )}
            </ul>
        </div>
    );
}

export default function TodosPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-10 pb-20 text-gray-800">
            <Suspense fallback={<div className="mt-20 text-gray-500 font-medium animate-pulse">데이터를 불러오는 중...</div>}>
                <TodoContent />
            </Suspense>
        </div>
    );
}