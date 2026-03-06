"use server";

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const username = formData.get('username')?.toString().toLowerCase().trim();
    const password = formData.get('password')?.toString();

    if (!username || !password) {
        return { error: 'Preencha todos os campos.' };
    }

    let expectedPassword = '';
    if (username === 'rodrigo') {
        expectedPassword = process.env.RODRIGO_PASSWORD || '';
    } else if (username === 'guilherme') {
        expectedPassword = process.env.GUILHERME_PASSWORD || '';
    } else {
        return { error: 'Usuário ou senha inválidos.' };
    }

    if (password !== expectedPassword) {
        return { error: 'Usuário ou senha inválidos.' };
    }

    await createSession(username);
    redirect('/');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
