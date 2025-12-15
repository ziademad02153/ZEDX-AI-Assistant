import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateStrongPassword(length: number = 16): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const randomValues = new Uint32Array(length);

    // Use cryptographically secure random
    if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(randomValues);
    } else {
        // Fallback for server-side
        for (let i = 0; i < length; i++) {
            randomValues[i] = Math.floor(Math.random() * charset.length);
        }
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(randomValues[i] % charset.length);
    }
    return password;
}
