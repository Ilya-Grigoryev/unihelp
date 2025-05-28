// src/api/auth.ts

import { API_BASE_URL } from "./config";

/** Параметры для логина */
export interface LoginParams {
    email: string;
    password: string;
  }
  
  /** Модель, которую возвращает FastAPI (/login) */
  export interface Token {
    access_token: string;
    token_type: string;
  }
  
  /** Параметры для регистрации (добавили repeat_password) */
  export interface SignupParams {
    name: string;
    university: string;
    email: string;
    password: string;
    repeat_password: string;
  }
  
  /** Модель, которую возвращает ваш /register (UserRead) */
  export interface User {
    id: number;
    name: string;
    university: string;
    bio: string;
    avatar: string;
  }
  
  export async function login(
    params: LoginParams
  ): Promise<Token> {
    const body = new URLSearchParams({
      username: params.email,  // OAuth2PasswordRequestForm ждёт поле "username"
      password: params.password,
      grant_type: 'password',
      scope: '',
    });
  
    const resp = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
  
    if (!resp.ok) {
      // FastAPI возвращает { detail: string } или просто 401
      const err = await resp.json().catch(() => null);
      throw new Error(err?.detail ?? resp.statusText);
    }
  
    // Ответ имеет shape { access_token: string; token_type: string }
    return await resp.json();
  }
  
  /**
   * API-метод регистрации.
   * POST /register  с полями name, university, email, password, repeat_password
   */
  export async function signup(
    params: SignupParams
  ): Promise<User> {
    const resp = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  
    if (!resp.ok) {
      const err = await resp.json().catch(() => null);
      throw new Error(err?.detail || resp.statusText);
    }
  
    return await resp.json();
  }
  