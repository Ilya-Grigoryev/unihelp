// src/api/users.ts
import { API_BASE_URL } from './config';
import { Publication } from './publications';
import { User } from './auth';
  
export async function fetchCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    const resp = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  
    if (!resp.ok) {
      const err = await resp.json().catch(() => null);
      throw new Error(err?.detail || resp.statusText);
    }
  
    return (await resp.json()) as User;
  }



export async function fetchCurrentUserPublications(): Promise<
  Array<Publication>
> {
  const token = localStorage.getItem('token') || '';
  const resp = await fetch(
    `${API_BASE_URL}/users/me/publications`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }
  const data = (await resp.json()) as Publication[];
  return data;
}