export interface Resume {
    id: string;
    name: string;
    content: string;
    createdAt: number;
}

const RESUMES_KEY = "zedx_resumes";

export const resumeStore = {
    getResumes: (): Resume[] => {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(RESUMES_KEY);
        return data ? JSON.parse(data) : [];
    },

    addResume: (name: string, content: string): Resume => {
        const resumes = resumeStore.getResumes();
        const newResume: Resume = {
            id: crypto.randomUUID(),
            name,
            content,
            createdAt: Date.now(),
        };
        resumes.push(newResume);
        localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
        return newResume;
    },

    deleteResume: (id: string) => {
        const resumes = resumeStore.getResumes().filter(r => r.id !== id);
        localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    },

    getResumeById: (id: string): Resume | undefined => {
        return resumeStore.getResumes().find(r => r.id === id);
    }
};
