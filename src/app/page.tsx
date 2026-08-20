import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Check, Globe, Sparkles, ChevronDown, ArrowRight, Star, Code } from "lucide-react";
import { PlatformSection } from "@/components/platform-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-24 relative">
        {/* Global Background Fusion */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-100/40 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-teal-50/40 rounded-full blur-[120px] animate-float-delayed"></div>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">


            <h1 className="text-[2.25rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-gray-900 dark:text-white mb-6 md:mb-8 leading-[1.15] md:leading-[1.1] max-w-[90rem] mx-auto px-4">
              Master Your Next Interview <br className="xs:hidden" />
              <span className="text-gradient-fusion">Before It Happens.</span>
            </h1>

            <p className="text-[0.95rem] md:text-xl text-gray-500 dark:text-gray-400 mb-4 max-w-4xl mx-auto leading-relaxed font-medium px-6 md:px-0">
              The ultimate training platform featuring a <strong>Voice-to-Voice AI Recruiter</strong> for rigorous mock interviews, and an <strong>Advanced Desktop Sandbox</strong> for high-fidelity technical practice.
            </p>
            <p className="text-[0.85rem] md:text-lg text-emerald-600 dark:text-emerald-400 mb-8 md:mb-12 max-w-4xl mx-auto font-bold tracking-wide px-6 md:px-0">
              Mock Interview Simulator (Web) • Advanced Practice Sandbox (Desktop)
            </p>

            <div className="flex flex-wrap items-center gap-5 w-full justify-center mb-16 px-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-base md:text-lg px-8 py-4 md:px-10 md:py-7 rounded-full bg-[#065f46] hover:bg-[#047857] text-white shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 group font-semibold border-none">
                  Try for free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Hero Visual: Realistic UI Mockup (Reverted) */}
            <div className="relative w-full max-w-[900px] mx-auto perspective-1000 px-4">
              <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-zinc-700 overflow-hidden relative z-10 transition-transform duration-700 hover:rotate-x-1">
                <div className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 p-3 md:p-4 flex items-center gap-2 md:gap-2.5">
                  <div className="flex gap-1.5 md:gap-2">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                    <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Real-Time Interview Simulation
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-10 bg-white dark:bg-zinc-900 min-h-[320px] md:min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Background Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>

                  {/* Floating Chat Bubbles */}
                  <div className="relative z-10 w-full max-w-4xl space-y-6 md:space-y-10">
                    {/* Chat Bubble 1 (AI Question) */}
                    <div className="flex gap-3 md:gap-7 items-start justify-start animate-fade-in-up">
                      <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-black flex items-center justify-center shadow-md flex-shrink-0 border border-gray-200">
                        <Image src="/AI.jpg" alt="ZEDX AI Simulator" width={52} height={52} className="object-cover w-full h-full" />
                      </div>
                      <div className="bg-gray-100 dark:bg-zinc-800 rounded-[1.1rem] md:rounded-[2rem] rounded-tl-none p-3.5 md:p-6 text-[0.85rem] md:text-[1.05rem] text-gray-700 dark:text-gray-200 shadow-sm max-w-[88%] md:max-w-[85%] border border-gray-200/50 leading-relaxed font-medium">
                        &quot;Can you explain how you optimized the database query performance in your previous e-commerce project?&quot;
                      </div>
                    </div>

                    {/* Chat Bubble 2 (User Answer) */}
                    <div className="flex gap-3 md:gap-7 items-start justify-end animate-fade-in-up" style={{ animationDelay: '1s' }}>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-[1.1rem] md:rounded-[2.1rem] rounded-tr-none p-4 md:p-8 text-[0.85rem] md:text-[1.1rem] text-gray-800 dark:text-gray-100 shadow-xl max-w-[88%] md:max-w-[85%] relative border-r-4 border-r-green-500 text-left">
                        <div className="absolute -top-2.5 -left-2.5 md:-top-5 md:-left-5 bg-white dark:bg-zinc-800 border-2 border-green-500 dark:border-green-600 rounded-full p-1 md:p-2.5 shadow-xl">
                          <Code className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                        </div>
                        <div className="mb-1 md:mb-2 text-left">
                          <span className="text-[10px] md:text-xs font-bold text-emerald-700/80 dark:text-emerald-400/80 uppercase tracking-wider">
                            Candidate Response
                          </span>
                        </div>
                        <p className="leading-relaxed">
                          &quot;I noticed the PostgreSQL join logic was causing a 4-second delay, so I added a composite index on the frequently queried columns, which decreased execution time by 85%.&quot;
                        </p>
                      </div>
                      <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md flex-shrink-0 border border-gray-200">
                        <Image src="/IIcon1.jpg" alt="User" width={52} height={52} className="object-cover w-full h-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Massive Atmosphere Glow */}
              <div className="absolute -inset-16 bg-gradient-to-r from-green-400/20 to-teal-400/20 blur-[130px] -z-10 rounded-full"></div>
            </div>

          </div>

          <div className="mt-16 md:mt-24 relative w-full max-w-[900px] mx-auto perspective-1000 px-4">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 mb-4 md:mb-6 shadow-sm">
                <Code className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Advanced Coding
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                Technical <span className="text-gradient-fusion">Precision.</span>
              </h2>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-zinc-700 overflow-hidden relative z-10 transition-transform duration-700 hover:rotate-x-1">
              <div className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 p-3 md:p-4 flex items-center gap-2 md:gap-2.5">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
                </div>
                  <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                    <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Architecture Review
                    </span>
                  </div>
              </div>
              <div className="p-4 md:p-10 bg-white dark:bg-zinc-900 min-h-[320px] md:min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>

                {/* Floating Chat Bubbles */}
                <div className="relative z-10 w-full max-w-4xl space-y-6 md:space-y-10">
                  {/* Chat Bubble 1 (AI Question) */}
                  <div className="flex gap-3 md:gap-7 items-start justify-start animate-fade-in-up">
                    <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-green-100 flex items-center justify-center shadow-xl border-2 border-green-500/20 flex-shrink-0">
                      <Image src="/AI.jpg" alt="ZEDX AI Simulator" width={52} height={52} className="object-cover w-full h-full" />
                    </div>
                    <div className="bg-gray-100 dark:bg-zinc-800 rounded-[1.1rem] md:rounded-[2rem] rounded-tl-none p-3.5 md:p-6 text-[0.85rem] md:text-[1.05rem] text-gray-700 dark:text-gray-200 shadow-sm max-w-[88%] md:max-w-[85%] border border-gray-200/50 leading-relaxed font-medium">
                      &quot;Your next task is to implement a custom React hook that stores the previous value of a prop without causing an extra render. How would you approach this?&quot;
                    </div>
                  </div>

                  {/* Chat Bubble 2 (User Code) */}
                  <div className="flex gap-3 md:gap-7 items-start justify-end animate-fade-in-up" style={{ animationDelay: '1s' }}>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-800 rounded-[1.1rem] md:rounded-[2.1rem] rounded-tr-none p-4 md:p-8 shadow-xl max-w-[88%] md:max-w-[85%] relative border-r-4 border-r-green-500">
                      <div className="absolute -top-2.5 -left-2.5 md:-top-5 md:-left-5 bg-white dark:bg-zinc-800 border-2 border-green-500 dark:border-green-600 rounded-full p-1 md:p-2.5 shadow-xl">
                        <Code className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                      </div>
                      <div className="mb-2 md:mb-3 text-left">
                        <span className="text-[10px] md:text-xs font-bold text-emerald-700/80 dark:text-emerald-400/80 uppercase tracking-wider">
                          Live Coding
                        </span>
                      </div>
                      <div className="bg-white/50 dark:bg-black/30 rounded-xl p-3 md:p-5 mb-3 md:mb-4 font-mono text-[10px] md:text-sm leading-relaxed overflow-x-auto border border-black/5 dark:border-white/10 shadow-inner">
                        <pre className="text-gray-800 dark:text-gray-200">
                          <span className="text-pink-600 dark:text-pink-400 font-semibold">const</span> <span className="text-blue-600 dark:text-blue-400">usePrevious</span> = (<span className="text-orange-600 dark:text-orange-300">value</span>) <span className="text-pink-600 dark:text-pink-400 font-semibold">=&gt;</span> {"{\n"}
                          {"  "}<span className="text-pink-600 dark:text-pink-400 font-semibold">const</span> <span className="text-sky-600 dark:text-sky-300">ref</span> = <span className="text-yellow-600 dark:text-yellow-200">useRef</span>();{"\n"}
                          {"  "}<span className="text-yellow-600 dark:text-yellow-200">useEffect</span>(() <span className="text-pink-600 dark:text-pink-400 font-semibold">=&gt;</span> {"{\n"}
                          {"    "}<span className="text-sky-600 dark:text-sky-300">ref</span>.current = <span className="text-orange-600 dark:text-orange-300">value</span>;{"\n"}
                          {"  "}, [<span className="text-orange-600 dark:text-orange-300">value</span>]);{"\n"}
                          {"  "}<span className="text-purple-600 dark:text-purple-400 font-semibold">return</span> <span className="text-sky-600 dark:text-sky-300">ref</span>.current;{"\n"}
                          {"};"}
                          {"\n"}
                          <span className="text-gray-400 dark:text-gray-500 italic">// This hook allows you to store the previous state</span>{"\n"}
                          <span className="text-gray-400 dark:text-gray-500 italic">// without causing an additional re-render loop.</span>
                        </pre>
                      </div>
                    </div>
                    <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md flex-shrink-0 border border-gray-200">
                      <Image src="/IIcon1.jpg" alt="User" width={52} height={52} className="object-cover w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Massive Atmosphere Glow */}
            <div className="absolute -inset-x-32 top-1/4 bottom-0 bg-gradient-to-br from-[#d9f99d]/60 via-emerald-400/40 to-[#b5f850]/50 dark:from-[#b5f850]/20 dark:via-emerald-500/20 dark:to-green-500/10 blur-[160px] -z-10 rounded-full opacity-80 animate-pulse"></div>
          </div>
        </section>

        {/* Platform Integration Section */}
        <PlatformSection />

        {/* Features Section */}
        <section id="features" className="py-24 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything you need to <span className="text-gradient-fusion">succeed</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Turn difficult questions into learning opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

              {/* Feature 1: Context Upload */}
              <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-zinc-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#d9f99d] text-green-950 text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
                    Context
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">Upload Context Documents</h3>

                {/* Visual: Context File */}
                <div className="flex-grow flex items-center justify-center mb-8">
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 p-6 shadow-sm relative overflow-hidden w-full max-w-[280px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image src="/cv.png" alt="CV" width={48} height={64} className="object-contain drop-shadow-md" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">Software_Engineer_Resume.pdf</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 font-medium mt-0.5">
                          <Check size={12} /> Analyzed & Ready
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Upload your CV or technical reports to get highly contextual interview questions and personalized feedback during practice.
                </p>
              </div>

              {/* Feature 2: Real-Time Accessibility */}
              <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-zinc-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#d9f99d] text-green-950 text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
                    Instant Verification
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">Instant Feedback</h3>

                {/* Visual: Chat Bubble */}
                <div className="flex-grow flex items-center justify-center mb-8 w-full">
                  <div className="space-y-4 w-full max-w-[280px]">
                    {/* ZEDX AI Interviewer Asking */}
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200 dark:border-zinc-700">
                        <Image src="/AI.jpg" alt="ZEDX AI" width={32} height={32} className="object-cover w-full h-full" />
                      </div>
                      <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-3.5 rounded-[1.5rem] rounded-bl-sm shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.2)] text-[13px] text-gray-700 dark:text-gray-200 w-[85%] font-medium">
                        Can you explain your experience with React?
                      </div>
                    </div>
                    {/* User Answering */}
                    <div className="flex items-end gap-2 justify-end">
                      <div className="bg-gradient-to-br from-[#f4fce3] to-[#d9f99d] dark:from-[#b5f850]/20 dark:to-[#b5f850]/10 border border-[#b5f850]/50 dark:border-[#b5f850]/30 p-3.5 rounded-[1.5rem] rounded-br-sm shadow-[0_10px_25px_rgba(181,248,80,0.3)] dark:shadow-[0_10px_25px_rgba(181,248,80,0.1)] text-[13px] text-green-950 dark:text-emerald-100 w-[85%] font-medium">
                        I used React to build scalable web applications...
                      </div>
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 shadow-md border border-gray-200 dark:border-zinc-700 overflow-hidden">
                        <Image src="/IIcon1.jpg" alt="User" width={32} height={32} className="object-cover w-full h-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  ZEDX AI Simulator listens to your answers and instantly generates real-time feedback and corrections to help you improve.
                </p>
              </div>

              {/* Feature 3: Multilingual */}
              <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-zinc-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#d9f99d] text-green-950 text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
                    Multilingual
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">29 Languages</h3>

                {/* Visual: Language Globe */}
                <div className="flex-grow flex items-center justify-center mb-8 relative">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Abstract Globe Circles */}
                    <div className="absolute inset-0 border border-green-100/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-green-200/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-8 border border-green-300/50 rounded-full animate-[spin_20s_linear_infinite]"></div>

                    {/* Center Icon */}
                    <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center z-10 relative">
                      <Image 
                        src="/Multi-Language.png" 
                        alt="Multi-Language Globe" 
                        width={80} 
                        height={80} 
                        className="rounded-full object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse" 
                      />
                    </div>

                    {/* Floating Flags - Orbiting like planets */}
                    
                    {/* Outer Orbit */}
                    <div className="absolute inset-0 z-20 pointer-events-none" style={{ animation: 'spin 20s linear infinite' }}>
                      <div className="absolute top-0 left-1/2 -ml-[14px] -mt-[10px] pointer-events-auto" style={{ animation: 'spin 20s linear infinite reverse' }}>
                        <div className="relative w-7 h-5 rounded overflow-hidden shadow-md hover:scale-125 transition-transform cursor-pointer">
                          <Image src="/ARABIC.png" alt="Arabic" fill className="object-cover" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 -ml-[14px] -mb-[10px] pointer-events-auto" style={{ animation: 'spin 20s linear infinite reverse' }}>
                        <div className="relative w-7 h-5 rounded overflow-hidden shadow-md hover:scale-125 transition-transform cursor-pointer">
                          <Image src="/SPAIN%20LANG.png" alt="Spanish" fill className="object-cover" />
                        </div>
                      </div>
                    </div>

                    {/* Middle Orbit */}
                    <div className="absolute inset-4 z-20 pointer-events-none" style={{ animation: 'spin 15s linear infinite reverse' }}>
                      <div className="absolute top-1/2 left-0 -mt-[10px] -ml-[14px] pointer-events-auto" style={{ animation: 'spin 15s linear infinite' }}>
                        <div className="relative w-7 h-5 rounded overflow-hidden shadow-md hover:scale-125 transition-transform cursor-pointer">
                          <Image src="/ENG.png" alt="English" fill className="object-cover" />
                        </div>
                      </div>
                      <div className="absolute top-1/2 right-0 -mt-[10px] -mr-[14px] pointer-events-auto" style={{ animation: 'spin 15s linear infinite' }}>
                        <div className="relative w-7 h-5 rounded overflow-hidden shadow-md hover:scale-125 transition-transform cursor-pointer">
                          <Image src="/France%20lang.png" alt="French" fill className="object-cover" />
                        </div>
                      </div>
                    </div>

                    {/* Inner Orbit */}
                    <div className="absolute inset-8 z-20 pointer-events-none" style={{ animation: 'spin 12s linear infinite' }}>
                      <div className="absolute top-0 left-1/2 -ml-[14px] -mt-[10px] pointer-events-auto" style={{ animation: 'spin 12s linear infinite reverse' }}>
                        <div className="relative w-7 h-5 rounded overflow-hidden shadow-md hover:scale-125 transition-transform cursor-pointer">
                          <Image src="/german.png" alt="German" fill className="object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Simulate interview questions in any language - practice your professional communication wherever you are.
                </p>
              </div>

              {/* Feature 4: AI Analysis */}
              <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-zinc-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#d9f99d] text-green-950 text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
                    Analysis
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">Performance Analysis</h3>

                {/* Visual: Summary Card Mockup */}
                <div className="flex-grow flex items-center justify-center mb-8">
                  <div className="w-full max-w-[280px] bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200 dark:border-zinc-700">
                          <Image src="/AI.jpg" alt="ZEDX AI" width={32} height={32} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white">Training</div>
                          <div className="text-[10px] text-gray-400">Interview Analysis</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400 drop-shadow-sm" />)}
                      </div>
                    </div>

                    <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-3 mb-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Summary</div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full"></div>
                        <div className="h-1.5 w-[90%] bg-gray-200 rounded-full"></div>
                        <div className="h-1.5 w-[95%] bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  After each practice session, get detailed automated feedback and AI-powered action items to improve your answers.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div >
  );
}
