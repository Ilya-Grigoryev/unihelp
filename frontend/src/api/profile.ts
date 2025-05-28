import { API_BASE_URL } from './config';
import { Publication } from "./publications";


export interface Profile {
    id: number;
    name: string;
    university: string;
    bio: string;
    avatar: string;
    created_at: string;
    publications: Publication[];
    active_offers: number;
    active_requests: number;
    helped: number;
    got_help: number;
    rating: number;
}

export interface EditProfileParams {
    name: string;
    university: string;
    bio: string;
}


export async function fetchProfile(id: number): Promise<Profile> {
    const resp = await fetch(`${API_BASE_URL}/profile/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => null);
      throw new Error(err?.detail || resp.statusText);
    }
    const profile = (await resp.json()) as Profile;
    profile.avatar = profile.avatar ? `${API_BASE_URL}${profile.avatar}` : '';
    return profile;
}


export async function updateProfile(profileData: EditProfileParams, id: number) {
  const token = localStorage.getItem('token') || '';
  const resp = await fetch(
    `${API_BASE_URL}/profile/${id}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: profileData.name,
        university: profileData.university,
        bio: profileData.bio,
      }),
    }
  );
  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }
}



export async function uploadAvatar(formData: FormData): Promise<string> {
  const token = localStorage.getItem('token') || ''
  const resp = await fetch(`${API_BASE_URL}/profile/avatar`, {
    method: 'PATCH',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })
  if (!resp.ok) {
    throw new Error(`Upload failed: ${resp.status} ${resp.statusText}`);
  }

  const json = await resp.json();
  return `${API_BASE_URL}${json.avatar}`;
}