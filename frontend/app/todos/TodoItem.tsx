'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();

  
  const handleToggle = async () => {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    router.refresh(); 
  };

  return (
    <li className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white shadow-sm gap-3">
      <div className="flex items-center gap-3 flex-grow overflow-hidden">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="w-5 h-5 cursor-pointer accent-blue-500 shrink-0"
        />
        <span 
          className={`text-lg truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
        >
          {todo.title}
        </span>
      </div>
      
      <div className="flex shrink-0 gap-1">
        {}
        <Link
          href={`/todos/${todo.id}`}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          수정
        </Link>
      </div>
    </li>
  );
}