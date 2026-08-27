import 'server-only'
import { NextResponse } from 'next/server'
import { getSession, type Session } from '@/lib/auth'

export function jsonError(status: number, pesan: string) {
  return NextResponse.json({ error: pesan }, { status })
}

/** Guard untuk route handler admin (cookie, bukan Bearer — situs ini tidak
 *  punya klien native, semua panggilan admin berasal dari browser yang sudah
 *  login). Layout admin TIDAK melindungi route handler, jadi setiap route
 *  di src/app/api/admin/** wajib memanggil ini di baris pertama. */
export async function requireApiSession(): Promise<
  { session: Session } | { error: NextResponse }
> {
  const session = await getSession()
  if (!session) return { error: jsonError(401, 'Sesi tidak valid atau kedaluwarsa.') }
  return { session }
}
