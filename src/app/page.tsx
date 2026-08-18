import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Check, Globe, Sparkles, ChevronDown } from "lucide-react";
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
        <section className="py-20 md:py-32 text-center container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-green-100 dark:border-green-800 shadow-sm text-green-700 dark:text-green-400 font-semibold text-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              ZEDX AI Simulator: Live Interview Simulation
            </div>

            <h1 className="text-[2.25rem] xs:text-4xl sm:text-5xl md:text-[5.5rem] font-bold tracking-tight text-gray-900 dark:text-white mb-6 md:mb-8 leading-[1.15] md:leading-[1.1] max-w-[90rem] mx-auto px-4">
              Practice Real Interviews <br className="xs:hidden" />
              <span className="text-gradient-fusion">Before They Happen.</span>
            </h1>

            <p className="text-[0.95rem] md:text-xl text-gray-500 dark:text-gray-400 mb-4 max-w-4xl mx-auto leading-relaxed font-medium px-6 md:px-0">
              AI helps you practice. Independent Mode proves you've learned.
            </p>
            <p className="text-[0.85rem] md:text-lg text-emerald-600 dark:text-emerald-400 mb-8 md:mb-12 max-w-4xl mx-auto font-bold tracking-wide px-6 md:px-0">
              Simulate → Coach → Retry → Practice Independently → Measure Improvement
            </p>

            <div className="flex flex-wrap items-center gap-5 w-full justify-center mb-16 px-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-lg md:text-2xl px-8 py-6 md:px-12 md:py-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-xl shadow-gray-900/20 transition-all hover:scale-105">
                  Get Started for Free
                </Button>
              </Link>
            </div>

            {/* Hero Visual: Realistic UI Mockup (Reverted) */}
            <div className="relative w-full max-w-[1180px] mx-auto perspective-1000 px-4">
              <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2.25rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-zinc-700 overflow-hidden relative z-10 transition-transform duration-700 hover:rotate-x-1">
                <div className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 p-3 md:p-4 flex items-center gap-2 md:gap-2.5">
                  <div className="flex gap-1.5 md:gap-2">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 px-3 py-1 md:px-4 md:py-1 rounded-full text-[10px] md:text-[12px] text-gray-500 font-bold flex items-center gap-2 md:gap-2.5">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Live Interview Simulation
                  </div>
                </div>
                <div className="p-4 md:p-14 bg-white dark:bg-zinc-900 min-h-[320px] md:min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Background Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>

                  {/* Floating Chat Bubbles */}
                  <div className="relative z-10 w-full max-w-4xl space-y-6 md:space-y-10">
                    <div className="flex gap-3 md:gap-7 items-start animate-fade-in-up">
                      <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md flex-shrink-0 border border-gray-200">
                        <Image src="/IIcon1.jpg" alt="Manager" width={52} height={52} className="object-cover w-full h-full" />
                      </div>
                      <div className="bg-gray-100 dark:bg-zinc-800 rounded-[1.1rem] md:rounded-[2rem] rounded-tl-none p-3.5 md:p-6 text-[0.85rem] md:text-[1.05rem] text-gray-700 dark:text-gray-200 shadow-sm max-w-[88%] md:max-w-[85%] border border-gray-200/50 leading-relaxed font-medium">
                        &quot;I noticed the PostgreSQL join logic was causing a 4-second delay, so I added a composite index...&quot;
                      </div>
                    </div>

                    <div className="flex gap-3 md:gap-7 items-start justify-end animate-fade-in-up" style={{ animationDelay: '1s' }}>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-[1.1rem] md:rounded-[2.1rem] rounded-tr-none p-4 md:p-8 text-[0.85rem] md:text-[1.1rem] text-gray-800 dark:text-gray-100 shadow-xl max-w-[88%] md:max-w-[85%] relative border-l-4 border-l-green-500">
                        <div className="absolute -top-2.5 -left-2.5 md:-top-5 md:-left-5 bg-white dark:bg-zinc-800 border-2 border-green-500 dark:border-green-600 rounded-full p-1 md:p-2.5 shadow-xl">
                          <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-green-500 fill-green-500" />
                        </div>
                        <p className="font-extrabold text-green-600 mb-1.5 md:mb-2.5 text-[9px] md:text-sm uppercase tracking-widest">Instant Feedback</p>
                        <p className="leading-relaxed">
                          Great technical explanation! However, to make this answer stronger, mention the exact percentage of time saved (e.g., decreased execution time by 85%).
                        </p>
                      </div>
                      <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-green-100 flex items-center justify-center shadow-xl border-2 border-green-500/20 flex-shrink-0">
                        <Image src="/AI.jpg" alt="ZEDX AI Simulator" width={52} height={52} className="object-cover w-full h-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Massive Atmosphere Glow */}
              <div className="absolute -inset-16 bg-gradient-to-r from-green-400/20 to-teal-400/20 blur-[130px] -z-10 rounded-full"></div>
            </div>

          </div>

          <div className="mt-20 md:mt-32 relative w-full max-w-[1180px] mx-auto perspective-1000 px-4">
            <div className="text-center mb-10 md:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] md:text-xs font-extrabold tracking-widest uppercase mb-4">
                Advanced Coding
              </span>
              <h2 className="text-2xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                Technical <span className="text-gradient-fusion">Precision.</span>
              </h2>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2.25rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-zinc-700 overflow-hidden relative z-10 transition-transform duration-700 hover:rotate-x-1">
              <div className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 p-3 md:p-4 flex items-center gap-2 md:gap-2.5">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 px-3 py-1 md:px-4 md:py-1 rounded-full text-[10px] md:text-[12px] text-gray-500 font-bold flex items-center gap-2 md:gap-2.5">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Mock Interview - Architecture Review
                </div>
              </div>
              <div className="p-4 md:p-14 bg-white dark:bg-zinc-900 min-h-[380px] md:min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>

                {/* Floating Chat Bubbles */}
                <div className="relative z-10 w-full max-w-4xl space-y-6 md:space-y-10">
                  <div className="flex gap-3 md:gap-7 items-start animate-fade-in-up">
                    <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md flex-shrink-0 border border-gray-200">
                      <Image src="/IIcon1.jpg" alt="CTO" width={52} height={52} className="object-cover w-full h-full" />
                    </div>
                    <div className="bg-gray-100 dark:bg-zinc-800 rounded-[1.1rem] md:rounded-[2rem] rounded-tl-none p-3.5 md:p-6 text-[0.85rem] md:text-[1.05rem] text-gray-700 dark:text-gray-200 shadow-sm max-w-[88%] md:max-w-[85%] border border-gray-200/50 leading-relaxed font-medium">
                      &quot;I would use a combination of useState and useEffect to store the old prop when the component re-renders...&quot;
                    </div>
                  </div>

                  <div className="flex gap-3 md:gap-7 items-start justify-end animate-fade-in-up" style={{ animationDelay: '1s' }}>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-800 rounded-[1.1rem] md:rounded-[2.1rem] rounded-tr-none p-4 md:p-8 shadow-xl max-w-[88%] md:max-w-[85%] relative border-l-4 border-l-green-500">
                      <div className="absolute -top-2.5 -left-2.5 md:-top-5 md:-left-5 bg-white dark:bg-zinc-800 border-2 border-green-500 dark:border-green-600 rounded-full p-1 md:p-2.5 shadow-xl">
                        <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-green-500 fill-green-500" />
                      </div>
                      <p className="font-extrabold text-green-600 mb-1.5 md:mb-2.5 text-[9px] md:text-sm uppercase tracking-widest">Mock Reviewer</p>
                      <div className="bg-gray-900/5 dark:bg-white/5 rounded-xl p-2.5 md:p-4 mb-3 md:mb-4 font-mono text-[9px] md:text-sm leading-relaxed overflow-x-auto border border-black/5 dark:border-white/5">
                        <pre className="text-emerald-900 dark:text-emerald-200">
                          {`const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};`}
                        </pre>
                      </div>
                      <p className="leading-relaxed text-[0.85rem] md:text-[1rem] text-gray-700 dark:text-gray-200">
                        Using <code className="bg-green-100 dark:bg-green-900/50 px-1 rounded text-xs">useState</code> here will cause an extra render! The correct approach is to utilize <code className="bg-green-100 dark:bg-green-900/50 px-1 rounded text-xs">useRef</code> to persist the value.
                      </p>
                    </div>
                    <div className="w-8 h-8 md:w-13 md:h-13 rounded-full overflow-hidden bg-green-100 flex items-center justify-center shadow-xl border-2 border-green-500/20 flex-shrink-0">
                      <Image src="/AI.jpg" alt="ZEDX AI Simulator" width={52} height={52} className="object-cover w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Massive Atmosphere Glow */}
            <div className="absolute -inset-16 bg-gradient-to-r from-emerald-400/10 to-green-400/10 blur-[130px] -z-10 rounded-full"></div>
          </div>
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold">Scroll</span>
            <ChevronDown className="text-gray-400 dark:text-gray-500 w-5 h-5" />
          </div>
        </section>

        {/* Platform Integration Section */}
        <PlatformSection />

        {/* Features Section */}
        <section id="features" className="py-24 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Everything you need to <span className="text-gradient-fusion">succeed</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Turn difficult questions into learning opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

              {/* Feature 1: Context Upload */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-wider uppercase">
                    Context
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Upload Context Documents</h3>

                {/* Visual: Context File */}
                <div className="flex-grow flex items-center justify-center mb-8">
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 p-6 shadow-sm relative overflow-hidden w-full max-w-[280px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-600 rounded-lg flex flex-col items-center justify-center gap-1 shadow-sm">
                        <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-1 bg-gray-200 rounded-full"></div>
                        <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">Q3_Agenda.pdf</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 font-medium">
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
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wider uppercase">
                    Live Verification
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Instant Feedback</h3>

                {/* Visual: Chat Bubble */}
                <div className="flex-grow flex items-center justify-center mb-8 w-full">
                  <div className="space-y-3 w-full max-w-[280px]">
                    <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-600 dark:text-gray-300 w-3/4">
                      Can you explain your experience with React?
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-gray-800 dark:text-gray-200 w-3/4 ml-auto">
                      I used React to build scalable web applications...
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  ZEDX AI Simulator listens to your answers and instantly generates real-time feedback and corrections to help you improve.
                </p>
              </div>

              {/* Feature 3: Multilingual */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#84cc16] text-black text-xs font-bold tracking-wider uppercase">
                    Multilingual
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">52 Languages</h3>

                {/* Visual: Language Globe */}
                <div className="flex-grow flex items-center justify-center mb-8 relative">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Abstract Globe Circles */}
                    <div className="absolute inset-0 border border-green-100/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-green-200/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-8 border border-green-300/50 rounded-full animate-[spin_20s_linear_infinite]"></div>

                    {/* Center Icon */}
                    <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center z-10 relative">
                      <Globe size={32} className="text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
                    </div>

                    {/* Floating Flags (represented as dots/badges) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-4 bg-gray-100 rounded shadow-sm"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-4 bg-gray-100 rounded shadow-sm"></div>
                    <div className="absolute top-1/3 left-2 w-6 h-4 bg-gray-100 rounded shadow-sm"></div>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Simulate interview questions in any language - practice your professional communication wherever you are.
                </p>
              </div>

              {/* Feature 4: AI Analysis */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#84cc16] dark:bg-green-700 text-black dark:text-white text-xs font-bold tracking-wider uppercase">
                    Analysis
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Performance Analysis</h3>

                {/* Visual: Summary Card Mockup */}
                <div className="flex-grow flex items-center justify-center mb-8">
                  <div className="w-full max-w-[280px] bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white">Training</div>
                          <div className="text-[10px] text-gray-400">Interview Analysis</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-yellow-400"></div>)}
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
