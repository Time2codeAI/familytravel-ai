import { NextRequest } from 'next/server';

// Voor nu simpele success response, echte logic in frontend
export async function POST(request: NextRequest) {
    const body = await request.json();
    return Response.json({ success: true, trip: { id: Date.now(), ...body } });
}