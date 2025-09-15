import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let lastUpdateTime = 0;
const UPDATE_INTERVAL = 1000 * 60 * 15;

export async function savingsStatusChecker(request: NextRequest) {
    const now = Date.now();

    if (now - lastUpdateTime >= UPDATE_INTERVAL) {
        try {
            await fetch(`${request.nextUrl.origin}/api/savings/status`, {
                method: 'POST',
            });
            lastUpdateTime = now;
        } catch (error) {
            console.error('Failed to update savings statuses:', error);
        }
    }

    return NextResponse.next();
}
