import { supabase } from "@/lib/supabase";

export interface Interview {
    id: string;
    user_id: string;
    title: string;
    transcript: string | null;
    analysis: {
        job_description?: string;
        resume_name?: string;
        interview_type?: string;
        language?: string;
        ai_responses?: string[];
    } | null;
    created_at: string;
}

export const interviewService = {
    // Get all interviews for current user
    getUserInterviews: async (): Promise<Interview[]> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('interviews')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Interview[];
    },

    // Save a new interview
    saveInterview: async (
        title: string,
        transcript: string,
        analysis: Interview['analysis']
    ): Promise<Interview> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('interviews')
            .insert({
                user_id: user.id,
                title,
                transcript,
                analysis
            })
            .select()
            .single();

        if (error) throw error;
        return data as Interview;
    },

    // Delete an interview
    deleteInterview: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('interviews')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
