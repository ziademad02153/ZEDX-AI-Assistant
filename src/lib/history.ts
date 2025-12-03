export interface InterviewSession {
    id: string;
    date: string;
    jobDescription: string;
    type: string;
    durationSeconds: number;
    transcript: string;
}

const STORAGE_KEY = 'zedx_interview_history';

export const history = {
    saveSession: (session: Omit<InterviewSession, 'id' | 'date'>) => {
        if (typeof window === 'undefined') return;

        const newSession: InterviewSession = {
            ...session,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };

        const existing = history.getSessions();
        const updated = [newSession, ...existing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newSession;
    },

    getSessions: (): InterviewSession[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    getStats: () => {
        const sessions = history.getSessions();
        const totalInterviews = sessions.length;
        const totalDurationSeconds = sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
        const totalMinutes = Math.floor(totalDurationSeconds / 60);

        return {
            totalInterviews,
            totalMinutes
        };
    },

    clearHistory: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    }
};
