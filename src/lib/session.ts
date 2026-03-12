import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET precisa ser definido para criptografia de sessão.");
}

const encodedKey = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function encrypt(payload: Record<string, unknown>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("4h")
        .setIssuer("manager-internal")
        .setAudience("manager-users")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
            issuer: "manager-internal",
            audience: "manager-users",
        });
        return payload;
    } catch {
        return null;
    }
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 horas de sessão
    const session = await encrypt({ userId, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}
