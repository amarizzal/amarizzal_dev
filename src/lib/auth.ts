import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/db'
import type { User } from '@/lib/types'

export const COOKIE = 'amz_session'
const MASA_BERLAKU = 60 * 60 * 12 // 12 jam

function rahasia() {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET belum diatur di .env.local')
  return new TextEncoder().encode(s)
}

export async function terbitkanToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MASA_BERLAKU}s`)
    .sign(rahasia())
}

export async function buatSesi(userId: string) {
  const token = await terbitkanToken(userId)

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MASA_BERLAKU,
  })
}

export async function hapusSesi() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

async function userIdDariToken(token: string | undefined): Promise<string | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, rahasia())
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}

export type Session = { user: User }

/** Sesi dari user id. */
export async function sesiDariUserId(id: string): Promise<Session | null> {
  const user = await queryOne<User>(
    `select id, email, nama, role, aktif from users where id = $1 and aktif`,
    [id],
  )
  if (!user) return null
  return { user }
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value
  const id = await userIdDariToken(token)
  if (!id) return null
  return sesiDariUserId(id)
}

/** Sesi wajib — melempar ke /login bila belum masuk. Hanya dipakai di
 *  Server Component (layout admin). Server Action TIDAK melewati layout,
 *  jadi setiap action tetap wajib memanggil ini sendiri secara eksplisit. */
export async function requireSession(): Promise<Session> {
  const sesi = await getSession()
  if (!sesi) redirect('/login')
  return sesi
}

export async function verifikasiKredensial(email: string, sandi: string): Promise<User | null> {
  const row = await queryOne<User & { password_hash: string }>(
    `select id, email, nama, role, aktif, password_hash
       from users where lower(email) = lower($1) and aktif`,
    [email],
  )
  if (!row) return null

  const cocok = await bcrypt.compare(sandi, row.password_hash)
  if (!cocok) return null

  const { password_hash: _hash, ...user } = row
  return user
}

export const hashSandi = (sandi: string) => bcrypt.hash(sandi, 10)
