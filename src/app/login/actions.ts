"use server";

import { getAuthUsers, verifyPassword } from '@/lib/auth';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const MAX_ATTEMPTS = 5;
const BLOCK_MINUTES = 5;

const failedAttempts = new Map<string, { count: number; blockedUntil: number | null }>();

function normalizeUsername(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.toLowerCase().trim();
}

function incrementFailedAttempt(username: string) {
    const now = Date.now();
    const current = failedAttempts.get(username) ?? { count: 0, blockedUntil: null };

    const nextCount = current.count + 1;
    const blockedUntil = nextCount >= MAX_ATTEMPTS ? now + BLOCK_MINUTES * 60 * 1000 : null;

    failedAttempts.set(username, { count: nextCount, blockedUntil });
}

function clearFailedAttempts(username: string) {
    failedAttempts.delete(username);
}

export async function login(prevState: unknown, formData: FormData) {
    const username = normalizeUsername(formData.get('username'));
    const password = formData.get('password')?.toString() ?? '';

    if (!username || !password) {
        return { error: 'Preencha todos os campos.' };
    }

    const currentAttempt = failedAttempts.get(username);
    if (currentAttempt?.blockedUntil && currentAttempt.blockedUntil > Date.now()) {
        return { error: `Usuário temporariamente bloqueado. Tente novamente em ${BLOCK_MINUTES} minutos.` };
    }

    const users = getAuthUsers();
    const storedPassword = users[username];

    if (!storedPassword) {
        incrementFailedAttempt(username);
        return { error: 'Usuário ou senha inválidos.' };
    }

    const isValid = await verifyPassword(password, storedPassword);
    if (!isValid) {
        incrementFailedAttempt(username);
        return { error: 'Usuário ou senha inválidos.' };
    }

    clearFailedAttempts(username);
    await createSession(username);
    redirect('/');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
