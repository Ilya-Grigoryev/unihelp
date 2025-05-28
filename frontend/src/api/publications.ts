// src/api/publications.ts
import { User } from "./auth";
import { API_BASE_URL } from "./config";


export interface NewPublicationParams {
    title: string;
    description: string;
    price: number;
    type: 'offer' | 'request';
    university: string;
    faculty: string;
    subject: string;
}

export interface EditPublicationParams {
  title: string;
  description: string;
  price: number;
}


export interface Publication {
  id: number;
  is_offer: boolean;
  title: string;
  university: string;
  faculty: string;
  subject: string;
  price: number;
  description: string;
  bought: number;
  is_active: boolean;
  created_at: string;
  author: User;
}


export interface FetchPublicationParams {
  tab: 'need' | 'help';
  university?: string;
  faculty?: string;
  subject?: string;
}


export async function createPublication(
  params: NewPublicationParams
): Promise<Publication> {
  const token = localStorage.getItem('token');
  const resp = await fetch(`${API_BASE_URL}/publications/`, {
    method: 'POST',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      is_offer:   params.type === 'offer',
      title:      params.title,
      university: params.university,
      faculty:    params.faculty,
      subject:    params.subject,
      price:      params.price,
      description:params.description,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }

  // теперь возвращаем весь объект Publication
  return (await resp.json()) as Publication;
}


export async function deletePublication(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  const resp = await fetch(`${API_BASE_URL}/publications/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }
}


export async function fetchPublicationById(id: number): Promise<Publication> {
  const resp = await fetch(`${API_BASE_URL}/publications/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }

  return (await resp.json()) as Publication;
}


export async function editPublication(
  id: number,
  params: EditPublicationParams
): Promise<Publication> {
  const token = localStorage.getItem('token') || '';
  const resp = await fetch(`${API_BASE_URL}/publications/${id}`, {
    method: 'PUT',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      title:       params.title,
      description: params.description,
      price:       params.price,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }

  return (await resp.json()) as Publication;
}


export async function updatePublicationState(
  id: number,
  is_active: boolean
): Promise<Publication> {
  const token = localStorage.getItem('token') || '';
  const resp = await fetch(`${API_BASE_URL}/publications/${id}`, {
    method: 'PATCH',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      is_active: is_active,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }

  return (await resp.json()) as Publication;
}


export async function fetchPublications(
  params: FetchPublicationParams
): Promise<Publication[]> {
  const qp: Record<string, string> = { tab: params.tab };
  if (params.university) qp.university = params.university;
  if (params.faculty)    qp.faculty    = params.faculty;
  if (params.subject)    qp.subject    = params.subject;

  const url = `${API_BASE_URL}/publications?${new URLSearchParams(qp)}`;

  const resp = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || resp.statusText);
  }

  return (await resp.json()) as Publication[];
}