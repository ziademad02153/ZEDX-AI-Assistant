"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileText, Calendar, ArrowRight } from "lucide-react";
import { resumeStore, Resume } from "@/lib/resume-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MyResumesPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newResumeName, setNewResumeName] = useState("");
    const [newResumeContent, setNewResumeContent] = useState("");

    useEffect(() => {
        setResumes(resumeStore.getResumes());
    }, []);

    const handleAddResume = () => {
        if (!newResumeName.trim() || !newResumeContent.trim()) return;
        resumeStore.addResume(newResumeName, newResumeContent);
        setResumes(resumeStore.getResumes());
        setIsAdding(false);
        setNewResumeName("");
        setNewResumeContent("");
    };

    const handleDeleteResume = (id: string) => {
        if (confirm("Are you sure you want to delete this resume?")) {
            resumeStore.deleteResume(id);
            setResumes(resumeStore.getResumes());
        }
    };

    const handleUseResume = (resume: Resume) => {
        // Save to the key used by the interview setup page
        localStorage.setItem("interview_context_resume", resume.content);
        router.push("/dashboard/new");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
                    <p className="text-gray-500">Manage your resumes for different job applications.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "secondary" : "default"} className="gap-2">
                    {isAdding ? "Cancel" : <><Plus size={20} /> Add New Resume</>}
                </Button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold text-lg">Add New Resume</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Resume Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Frontend Developer Resume"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={newResumeName}
                            onChange={(e) => setNewResumeName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Resume Content (Text)</label>
                        <textarea
                            placeholder="Paste your resume text here..."
                            className="w-full h-40 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            value={newResumeContent}
                            onChange={(e) => setNewResumeContent(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button variant="gradient" onClick={handleAddResume} disabled={!newResumeName.trim() || !newResumeContent.trim()}>
                            Save Resume
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                {resumes.length === 0 && !isAdding ? (
                    <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                        <h3 className="text-lg font-medium text-gray-900">No resumes yet</h3>
                        <p className="text-gray-500 mb-4">Add your first resume to get started.</p>
                        <Button onClick={() => setIsAdding(true)} variant="outline">Add Resume</Button>
                    </div>
                ) : (
                    resumes.map((resume) => (
                        <div key={resume.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{resume.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            {new Date(resume.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteResume(resume.id)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4 font-mono bg-gray-50 p-2 rounded-lg">
                                {resume.content}
                            </p>
                            <Button
                                className="w-full gap-2 group-hover:bg-green-600 group-hover:text-white transition-colors"
                                variant="outline"
                                onClick={() => handleUseResume(resume)}
                            >
                                Use for Interview <ArrowRight size={16} />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
