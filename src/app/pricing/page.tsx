"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, ArrowRight, ShieldCheck, Wallet, Globe, Copy, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { AnimatedOrb } from "@/components/animated-orb";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PricingPage() {
    const router = useRouter();
    const [isInstapayModalOpen, setIsInstapayModalOpen] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [copied, setCopied] = useState(false);
    const [userTier, setUserTier] = useState<string>("free");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchTier = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                const { data: profile } = await supabase.from('profiles').select('tier').eq('id', session.user.id).single();
                if (profile?.tier) setUserTier(profile.tier);
            }
        };
        fetchTier();
    }, []);

    const handleInstapaySubmit = async () => {
        if (!transactionId.trim()) return;
        setIsSubmitting(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Should probably redirect to login, but let's just alert for now
                alert("Please log in first.");
                setIsSubmitting(false);
                return;
            }

            const response = await fetch('/api/payments/instapay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ transactionId }),
            });

            if (!response.ok) {
                const data = await response.json();
                console.error("Error submitting:", data.error);
                alert("Payment Error: " + data.error);
                setIsSubmitting(false);
                return;
            } else {
                setSubmitSuccess(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            <Navbar />
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-24 relative z-10 w-full">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 relative z-10">
                    <h1 className="text-[36px] md:text-[44px] lg:text-[48px] font-bold mb-3 md:mb-4 tracking-tight leading-[1.15] bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-300">
                        Train Like It's the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Real Interview</span>
                    </h1>
                    <p className="text-[15px] md:text-[16px] text-zinc-400 font-normal tracking-normal max-w-2xl mx-auto leading-[1.6]">
                        Practice real interviews with an AI interviewer that listens, speaks, adapts, and evaluates your answers.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-6 max-w-[850px] mx-auto items-stretch relative z-10">
                    {/* Free Plan */}
                    <div className="w-full md:w-[380px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-3xl flex flex-col relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.4)]">
                        <div className="mb-6">
                            <h3 className="text-[20px] md:text-[22px] font-semibold mb-1 text-white">Free</h3>
                            <p className="text-zinc-500 text-[12px] font-medium">Explore ZEDX.</p>
                            <div className="mt-5 flex items-baseline gap-1">
                                <span className="text-[36px] font-bold text-white leading-none">$0</span>
                            </div>
                        </div>

                        <div className="space-y-5 mb-8 flex-1 pt-6">
                            <div className="flex items-start gap-3 text-zinc-300 min-h-[36px] items-center">
                                <Check className="w-[18px] h-[18px] text-[#a3e635]/80 shrink-0" strokeWidth={2.5} />
                                <span className="text-[14px] font-medium">Voice-to-Voice AI (4 questions)</span>
                            </div>
                            <div className="flex items-start gap-3 text-zinc-300 min-h-[36px] items-center">
                                <Check className="w-[18px] h-[18px] text-[#a3e635]/80 shrink-0" strokeWidth={2.5} />
                                <span className="text-[14px] font-medium">English interviews</span>
                            </div>
                            <div className="flex items-start gap-3 text-zinc-300 min-h-[36px] items-center">
                                <Check className="w-[18px] h-[18px] text-[#a3e635]/80 shrink-0" strokeWidth={2.5} />
                                <span className="text-[14px] font-medium">Basic AI model & feedback</span>
                            </div>
                            
                            {/* Locked Pro Features */}
                            <div className="pt-3 space-y-5">
                                <div className="flex items-start gap-3 text-zinc-600 min-h-[36px] items-center">
                                    <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center font-bold text-lg">×</div>
                                    <span className="text-[14px] font-medium">Unlimited Sessions & Questions</span>
                                </div>
                                <div className="flex items-start gap-3 text-zinc-600 min-h-[36px] items-center">
                                    <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center font-bold text-lg">×</div>
                                    <span className="text-[14px] font-medium">29+ Languages</span>
                                </div>
                                <div className="flex items-start gap-3 text-zinc-600 min-h-[36px] items-center">
                                    <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center font-bold text-lg">×</div>
                                    <span className="text-[14px] font-medium">3 Premium AI Models</span>
                                </div>
                                <div className="flex items-start gap-3 text-zinc-600 min-h-[36px] items-center">
                                    <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center font-bold text-lg">×</div>
                                    <span className="text-[14px] font-medium">Real-Time Evaluation</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="w-full mt-auto rounded-full py-6 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all shadow-none text-[16px]"
                        >
                            Continue Free
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="w-full md:w-[420px] bg-white/[0.04] border border-[#a3e635]/30 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-3xl flex flex-col relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_40px_rgba(163,230,53,0.15)] transition-all duration-500 hover:bg-white/[0.07] hover:border-[#a3e635]/50 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_12px_60px_rgba(163,230,53,0.25)] overflow-hidden">

                        {/* Soft Top Glow inside card */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-[#a3e635]/20 blur-[60px] pointer-events-none" />

                        <div className="mb-6 relative z-10">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-[20px] md:text-[22px] font-semibold text-white tracking-tight">ZEDX Pro</h3>
                                <span className="bg-[#a3e635]/10 text-[#a3e635] text-[11px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide">Most Popular</span>
                            </div>
                            <p className="text-zinc-400 text-[12px] font-medium mb-5">Master the interview.</p>

                            <div className="flex items-baseline gap-2">
                                <span className="text-[16px] text-zinc-500 font-medium line-through decoration-zinc-600">$20</span>
                                <span className="text-[40px] font-bold text-white leading-none tracking-tight">$10</span>
                                <span className="text-[13px] text-zinc-500 font-medium">/ month</span>
                                <span className="ml-1 bg-[#a3e635]/10 text-[#a3e635] text-[11px] font-bold px-2 py-0.5 rounded-md">50% OFF</span>
                            </div>

                            <div className="mt-2">
                                <span className="text-[12px] text-zinc-400 font-medium"> Egypt: <strong className="text-[#a3e635] font-semibold">300 EGP</strong> / month</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 flex-1 relative z-10 border-t border-white/5 pt-6">

                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 shrink-0 flex items-center justify-center relative z-20 mix-blend-screen opacity-90 mt-0.5">
                                    <AnimatedOrb />
                                </div>
                                <div>
                                    <div className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">Voice-to-Voice AI Interviewer</div>
                                    <div className="text-[13px] text-zinc-400 font-normal leading-snug">Practice with natural, real-time conversations</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 shrink-0 flex items-center justify-center mt-0.5">
                                    <Image src="/Multi-Language.png" alt="Languages" width={32} height={32} className="object-contain opacity-90" />
                                </div>
                                <div>
                                    <div className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">29+ Languages</div>
                                    <div className="text-[13px] text-zinc-400 font-normal leading-snug">Multilingual voice interviews</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 shrink-0 flex items-center justify-center mt-0.5">
                                    <Image src="/Interview-Logo.png" alt="Scenarios" width={26} height={26} className="object-contain invert opacity-80" />
                                </div>
                                <div>
                                    <div className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">Technical & Behavioral</div>
                                    <div className="text-[13px] text-zinc-400 font-normal leading-snug">Tailored interview scenarios</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 shrink-0 flex items-center justify-center mt-0.5">
                                    <Image src="/Granular Scorecards.png" alt="Analytics" width={32} height={32} className="object-contain opacity-90" />
                                </div>
                                <div>
                                    <div className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">Real-Time Evaluation</div>
                                    <div className="text-[13px] text-zinc-400 font-normal leading-snug">Granular feedback & PDF reports</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 shrink-0 flex items-center justify-center mt-0.5">
                                    <Image src="/question.png" alt="Unlimited" width={26} height={26} className="object-contain opacity-80" />
                                </div>
                                <div>
                                    <div className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">Unlimited Sessions & Questions</div>
                                    <div className="text-[13px] text-zinc-400 font-normal leading-snug">Practice without any limits</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center mt-0.5 bg-black border border-white/10">
                                    <Image src="/AI.jpg" alt="AI Engine" width={36} height={36} className="w-full h-full object-cover scale-110 opacity-90" />
                                </div>
                                <div>
                                    <div className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">3 Premium AI Models</div>
                                    <div className="text-[13px] text-zinc-400 font-normal leading-snug">Powered by Groq for instant responses</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {userTier === 'pro' ? (
                                <motion.div 
                                    whileHover={{ scale: 1.01 }}
                                    className="w-full relative overflow-hidden flex flex-col items-center justify-center gap-3 rounded-full py-5 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                                    <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#a3e635]/10 blur-[50px] rounded-full"></div>
                                    <div className="flex items-center gap-3 z-10">
                                        <Image src="/zedx-logo.png" alt="ZEDX" width={28} height={28} className="object-contain" />
                                        <span className="text-white font-semibold text-[17px] tracking-tight font-sans">ZEDX Pro Active</span>
                                    </div>
                                    <span className="text-[11px] text-zinc-400 font-medium z-10 tracking-[0.15em] uppercase">Enjoy unlimited access</span>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Global Payment */}
                                    <Button
                                        className="w-full rounded-full py-6 bg-gradient-to-r from-[#22c55e] to-[#a3e635] text-black hover:opacity-90 font-bold text-[15px] transition-all shadow-[0_2px_12px_rgba(34,197,94,0.25)] border-none flex items-center justify-center"
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                toast.error("Please create an account first to upgrade.");
                                                router.push("/login");
                                                return;
                                            }
                                            window.open('https://ziademad5.gumroad.com/l/hkfdfv', '_blank');
                                        }}
                                    >
                                        <div className="w-[84px] h-7 mr-3 rounded-md overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-black/10">
                                            <Image src="/gumroad.webp" alt="Gumroad" width={84} height={28} className="w-full h-full object-cover object-center scale-110" />
                                        </div>
                                        Start Practicing (USD)
                                    </Button>

                                    {/* Local Payment */}
                                    <Button
                                        className="w-full rounded-full py-6 bg-[#22c55e]/5 border border-[#22c55e]/30 text-[#a3e635] hover:bg-[#22c55e]/15 font-semibold text-[15px] transition-all flex items-center justify-center shadow-none"
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                toast.error("Please create an account first to upgrade.");
                                                router.push("/login");
                                                return;
                                            }
                                            setIsInstapayModalOpen(true);
                                        }}
                                    >
                                        <div className="w-8 h-8 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                                            <Image src="/instapay.jpg" alt="Instapay" width={32} height={32} className="w-full h-full object-cover" />
                                        </div>
                                        Start Practicing via Instapay (EGP)
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Instapay Modal - Apple/MacBook Style */}
            <Dialog open={isInstapayModalOpen} onOpenChange={setIsInstapayModalOpen}>
                <DialogContent className="sm:max-w-[420px] bg-zinc-950/70 backdrop-blur-3xl border border-white/10 text-white rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden p-6 sm:p-8">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-[22px] font-semibold flex items-center gap-3 tracking-tight">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white/5 border border-white/10 shadow-sm">
                                <Image src="/instapay.jpg" alt="Instapay" width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            Instapay Payment
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-[14px] leading-relaxed mt-3">
                            To upgrade to <strong className="text-white font-medium">ZEDX Pro</strong>, please transfer exactly <strong className="text-emerald-400 font-semibold">300 EGP</strong> to the account below. Once transferred, provide your handle or transaction ID for verification.
                        </DialogDescription>
                    </DialogHeader>

                    {!submitSuccess ? (
                        <div className="space-y-6">
                            <div className="bg-white/[0.03] p-5 rounded-[1.5rem] border border-white/[0.08] flex flex-col items-center justify-center relative group transition-all hover:bg-white/[0.05]">
                                <p className="text-[12px] text-zinc-500 mb-2 font-medium tracking-wide uppercase">Send to Instapay Address</p>
                                <div className="flex items-center gap-3">
                                    <div className="text-[18px] sm:text-[20px] font-mono font-semibold text-white tracking-wide">
                                        zyad02153@instapay
                                    </div>
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await navigator.clipboard.writeText("zyad02153@instapay");
                                                setCopied(true);
                                                toast.success("Instapay address copied to clipboard!");
                                                setTimeout(() => setCopied(false), 2000);
                                            } catch (err) {
                                                toast.error("Failed to copy. Please copy manually.");
                                            }
                                        }}
                                        className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-zinc-300 hover:text-white flex-shrink-0 cursor-pointer border border-white/5 shadow-sm active:scale-95"
                                        title="Copy address"
                                    >
                                        {copied ? <CheckCircle2 className="w-[18px] h-[18px] text-emerald-400" /> : <Copy className="w-[18px] h-[18px]" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[12px] font-medium text-zinc-400 tracking-wide uppercase pl-1">
                                    Your Handle or Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="e.g. 01012345678 or handle@instapay"
                                    className="w-full bg-black/50 border border-white/10 rounded-full px-5 py-3.5 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-[22px] font-semibold text-white tracking-tight">Request Submitted!</h3>
                            <p className="text-zinc-400 text-[14px] max-w-[280px] mx-auto leading-relaxed">
                                We are verifying your payment. Your account will be upgraded to Pro within 1-2 hours.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="sm:justify-end gap-3 mt-8">
                        {!submitSuccess ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsInstapayModalOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full h-11 px-6 font-medium text-[15px] transition-colors">Cancel</Button>
                                <Button
                                    onClick={handleInstapaySubmit}
                                    disabled={!transactionId.trim() || isSubmitting}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-full h-11 px-6 font-semibold shadow-[0_2px_10px_rgba(16,185,129,0.2)] text-[15px] transition-all"
                                >
                                    {isSubmitting ? "Submitting..." : "I have transferred"}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    setIsInstapayModalOpen(false);
                                    setSubmitSuccess(false);
                                    setTransactionId("");
                                }}
                                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full h-11 font-medium transition-colors"
                            >
                                Done
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
