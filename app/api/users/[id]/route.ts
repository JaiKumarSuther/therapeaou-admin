import { NextResponse, NextRequest } from 'next/server';
import { USERS } from '@/data/users';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const user = USERS.find(u => u.id === id);
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}


