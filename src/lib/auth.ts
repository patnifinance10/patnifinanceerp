import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-default-key-change-me-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export const AUTH_COOKIE_NAME = 'auth_token';

// 1. Password Management
export async function hashPassword(plain: string): Promise<string> {
    return await hash(plain, 12);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
    return await compare(plain, hashed);
}

// 2. Token Management
export async function signJWT(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('8h') // 8 hour session
        .sign(key);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null; // Invalid token
    }
}
