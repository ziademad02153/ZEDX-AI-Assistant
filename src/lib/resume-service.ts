
import { supabase } from "@/lib/supabase";

export interface Resume {
    id: string;
    user_id: string;
    name: string;
    content: string;
    created_at: string;
}

export const resumeService = {
    // Fetch all resumes for the current user
    getUserResumes: async (): Promise<Resume[]> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Resume[];
    },

    // Create a new resume (max 10 per user)
    createResume: async (name: string, content: string): Promise<Resume> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Check resume limit
        const existingResumes = await resumeService.getUserResumes();
        if (existingResumes.length >= 10) {
            throw new Error("Maximum of 10 resumes allowed. Please delete an existing resume first.");
        }

        const { data, error } = await supabase
            .from('resumes')
            .insert({
                user_id: user.id,
                name: name,
                content: content
            })
            .select()
            .single();

        if (error) throw error;
        return data as Resume;
    },

    // Delete a resume
    deleteResume: async (id: string): Promise<void> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id); // Security: ensure user owns this resume

        if (error) throw error;
    }
};
