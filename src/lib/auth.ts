export interface User {
    email: string;
    passwordHash: string;
    name: string;
}

const USERS_KEY = "zedx_users";

// Secure SHA-256 hashing
const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

export const auth = {
    signUp: async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
        const usersJson = localStorage.getItem(USERS_KEY);
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];

        if (users.find(u => u.email === email)) {
            return { success: false, message: "User already exists" };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: "Please enter a valid email address." };
        }

        const passwordHash = await hashPassword(password);
        const newUser: User = {
            email,
            passwordHash,
            name
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return { success: true, message: "Account created successfully" };
    },

    signIn: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
        const usersJson = localStorage.getItem(USERS_KEY);
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];

        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: "User not found" };
        }

        const inputHash = await hashPassword(password);
        if (user.passwordHash !== inputHash) {
            return { success: false, message: "Invalid password" };
        }

        return { success: true, message: "Login successful", user };
    }
};
