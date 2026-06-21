import { NextRequest, NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
    
    const filter = request.nextUrl.searchParams.get('filter');
    const search = request.nextUrl.searchParams.get('search');

    const backendUrl = new URL(`${BACKEND_URL}/todos`);
    if (filter) backendUrl.searchParams.append('filter', filter);
    if (search) backendUrl.searchParams.append('search', search);

    const res = await fetch(backendUrl.toString(), { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}