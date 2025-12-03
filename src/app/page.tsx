import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Zap, FileText, Globe, Brain, Sparkles, MessageSquare, BarChart3, UploadCloud } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-24 relative">
        {/* Global Background Fusion */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-100/40 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-teal-50/40 rounded-full blur-[120px] animate-float-delayed"></div>
        </div>

        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-green-100 shadow-sm text-green-700 font-semibold text-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              AI Interview Copilot
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Ace Every Interview. <br />
              <span className="text-gradient-fusion">Confidently. Discreetly.</span>
            </h1>

            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your invisible AI assistant. Get real-time answers, tailored to your resume, directly on your screen during any video interview.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-16">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/20 transition-all hover:scale-105">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-gray-200 hover:bg-gray-50 text-gray-700">
                  How it Works
                </Button>
              </Link>
            </div>

            {/* Hero Visual: Realistic UI Mockup (Reverted) */}
            <div className="relative w-full max-w-4xl mx-auto perspective-1000">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative z-10">
                <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto bg-white border border-gray-200 px-3 py-1 rounded-md text-xs text-gray-400 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Interview Session - Live
                  </div>
                </div>
                <div className="p-8 bg-white min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Background Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                  {/* Floating Chat Bubbles */}
                  <div className="relative z-10 w-full max-w-lg space-y-6">
                    <div className="flex gap-4 items-start animate-fade-in-up">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">👤</div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm text-gray-700 shadow-sm max-w-[80%]">
                        Can you describe a time you had to optimize a slow database query?
                      </div>
                    </div>

                    <div className="flex gap-4 items-start justify-end animate-fade-in-up" style={{ animationDelay: '1s' }}>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl rounded-tr-none p-4 text-sm text-gray-800 shadow-md max-w-[80%] relative">
                        <div className="absolute -top-3 -left-3 bg-white border border-green-100 rounded-full p-1 shadow-sm">
                          <Sparkles className="w-4 h-4 text-green-500 fill-green-500" />
                        </div>
                        <p className="font-medium text-green-700 mb-1 text-xs uppercase tracking-wide">AI Suggestion</p>
                        "In my previous role, I identified a bottleneck in a PostgreSQL query. I analyzed the execution plan, added a composite index, and refactored the join logic, reducing execution time by 85%..."
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">🤖</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 blur-3xl -z-10 rounded-[3rem]"></div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything you need to <span className="text-gradient-fusion">succeed</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Powerful tools designed to give you the unfair advantage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

              {/* Feature 1: Resume Upload */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-wider uppercase">
                    Resume
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">Upload your Resume</h3>

                {/* Visual: Resume File */}
                <div className="flex-grow flex items-center justify-center mb-8">
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 shadow-sm relative overflow-hidden w-full max-w-[280px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 shadow-sm">
                        <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-1 bg-gray-200 rounded-full"></div>
                        <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">My_Resume.pdf</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 font-medium">
                          <Check size={12} /> Analyzed & Ready
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed">
                  Upload once and get instant interview answers perfectly matched to your experience.
                </p>
              </div>

              {/* Feature 2: Instant Answers */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wider uppercase">
                    Instant Answers
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">Instant Answers</h3>

                {/* Visual: Chat Bubble */}
                <div className="flex-grow flex items-center justify-center mb-8 w-full">
                  <div className="space-y-3 w-full max-w-[280px]">
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-600 w-3/4">
                      What are your salary expectations?
                    </div>
                    <div className="bg-teal-50 border border-teal-100 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-gray-800 w-3/4 ml-auto">
                      Based on market research...
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed">
                  Parakeet automatically detects questions and generates answers instantly.
                </p>
              </div>

              {/* Feature 3: Multilingual */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#84cc16] text-black text-xs font-bold tracking-wider uppercase">
                    Multilingual
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">52 Languages</h3>

                {/* Visual: Language Globe */}
                <div className="flex-grow flex items-center justify-center mb-8 relative">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Abstract Globe Circles */}
                    <div className="absolute inset-0 border border-green-100/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-green-200/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-8 border border-green-300/50 rounded-full animate-[spin_20s_linear_infinite]"></div>

                    {/* Center Icon */}
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center z-10 relative">
                      <Globe size={32} className="text-gray-700" strokeWidth={1.5} />
                    </div>

                    {/* Floating Flags (represented as dots/badges) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-4 bg-gray-100 rounded shadow-sm"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-4 bg-gray-100 rounded shadow-sm"></div>
                    <div className="absolute top-1/3 left-2 w-6 h-4 bg-gray-100 rounded shadow-sm"></div>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed">
                  Real-time interview responses in any language - communicate fluently and naturally, wherever you interview.
                </p>
              </div>

              {/* Feature 4: AI Analysis */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#84cc16] text-black text-xs font-bold tracking-wider uppercase">
                    Summary
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">AI Summary & Analysis</h3>

                {/* Visual: Summary Card Mockup */}
                <div className="flex-grow flex items-center justify-center mb-8">
                  <div className="w-full max-w-[280px] bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">A</div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">Acme</div>
                          <div className="text-[10px] text-gray-400">Interview Analysis</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-yellow-400"></div>)}
                      </div>
                    </div>

                    <div className="bg-green-50/50 rounded-xl p-3 mb-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Summary</div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full"></div>
                        <div className="h-1.5 w-[90%] bg-gray-200 rounded-full"></div>
                        <div className="h-1.5 w-[95%] bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed">
                  After each interview, get detailed insights on your performance and AI-powered recommendations for improvement.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
