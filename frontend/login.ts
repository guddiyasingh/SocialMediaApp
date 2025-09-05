// app/login/actions.ts
'use server';
import { api } from '@/lib/api';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  // store access token in client (httpOnly refresh stays in cookie)
  return data; // { accessToken, user }
}
