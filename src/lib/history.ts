/**
 * Core interface representing a local session tracking record for offline support.
 */
export interface InterviewSession {
    /** The unique UUID assigned locally */
    id: string;
    /** The ISO 8601 creation date string */
    date: string;
    /** The related meeting agenda or description */
    jobDescription: string;
    /** The category or type of professional meeting */
    type: string;
    /** The total length of the session in seconds */
    durationSeconds: number;
    /** The full extracted STT string */
    transcript: string;
}

/**
 * Aggregated statistics representation for dashboard display.
 */
export interface SessionSummaryStats {
    totalInterviews: number;
    totalMinutes: number;
}

const STORAGE_KEY = 'zedx_interview_history';

/**
 * Fallback LocalStorage cache for immediate UI rendering before DB sync occurs.
 */
export const history = {
    /**
     * Appends a new session record into the local device cache.
     * @param session The session payload omitting dynamically generated core keys.
     * @returns {InterviewSession | undefined} The fully inflated record, or void if SSR.
     */
    saveSession: (session: Omit<InterviewSession, 'id' | 'date'>): InterviewSession | undefined => {
        if (typeof window === 'undefined') return undefined;

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

    /**
     * Reads and parses local historical session data.
     * @returns {InterviewSession[]} Array of stored sessions or an empty array.
     */
    getSessions: (): InterviewSession[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        try {
            return stored ? (JSON.parse(stored) as InterviewSession[]) : [];
        } catch (error) {
            console.error("Local caching corruption detected", error);
            return [];
        }
    },

    /**
     * Aggregates usage data into summary metrics for dashboard plotting.
     * @returns {SessionSummaryStats} Summarized KPIs.
     */
    getStats: (): SessionSummaryStats => {
        const sessions = history.getSessions();
        const totalInterviews = sessions.length;
        const totalDurationSeconds = sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
        const totalMinutes = Math.floor(totalDurationSeconds / 60);

        return {
            totalInterviews,
            totalMinutes
        };
    },

    /**
     * Wipes the persistent user local history cache completely.
     */
    clearHistory: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    }
};
