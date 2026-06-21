'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="text-red-500 bg-red-50 p-4 rounded-full">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">문제가 발생했어요</h2>
            <p className="text-gray-500">{error.message}</p>
            <button onClick={() => reset()} className="mt-2 px-5 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition">다시 시도</button>
        </div>
    );
}