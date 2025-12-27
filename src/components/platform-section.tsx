"use client";

import Image from "next/image";

// Platform icons - Reduced to 4 unique per row as requested
const iconsSet1 = [
    { src: "/google-meet-seeklogo.png", alt: "Google Meet" },
    { src: "/microsoft-teams-2025-seeklogo.png", alt: "Microsoft Teams" },
    { src: "/leetcode-seeklogo.png", alt: "LeetCode" },
    { src: "/Hackerrank Logo.png", alt: "HackerRank" },
    { src: "/webex.webp", alt: "Webex" },
];

const iconsSet2 = [
    { src: "/webex.webp", alt: "Webex" },
    { src: "/google-meet-seeklogo.png", alt: "Google Meet" },
    { src: "/Hackerrank Logo.png", alt: "HackerRank" },
    { src: "/leetcode-seeklogo.png", alt: "LeetCode" },
    { src: "/microsoft-teams-2025-seeklogo.png", alt: "Microsoft Teams" },
];

const iconsSet3 = [
    { src: "/Hackerrank Logo.png", alt: "HackerRank" },
    { src: "/microsoft-teams-2025-seeklogo.png", alt: "Microsoft Teams" },
    { src: "/webex.webp", alt: "Webex" },
    { src: "/google-meet-seeklogo.png", alt: "Google Meet" },
    { src: "/leetcode-seeklogo.png", alt: "LeetCode" },
];

// Reusable Marquee Row Component for perfect seamlessness
function MarqueeRow({ icons, duration, reverse = false }: { icons: any[], duration: string, reverse?: boolean }) {
    return (
        <div className="relative bg-white rounded-l-full rounded-r-none py-1.5 md:py-3 px-4 md:px-6 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-[calc(100%+100px)] md:w-[calc(100%+400px)]">
            <div
                className="flex w-max animate-marquee pause-on-hover will-change-transform"
                style={{ animationDuration: duration, animationDirection: reverse ? 'reverse' : 'normal' }}
            >
                {/* First Set with a perfect gap/padding for seamlessness */}
                <div className="flex gap-6 md:gap-8 pr-6 md:pr-8">
                    {icons.map((icon, idx) => (
                        <div
                            key={`set1-${idx}`}
                            className="flex-shrink-0 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center transition-transform hover:scale-110"
                        >
                            <Image
                                src={icon.src}
                                alt={icon.alt}
                                width={80}
                                height={80}
                                className={`object-contain ${icon.alt === 'LeetCode' ? 'scale-[1.35]' : ''}`}
                                priority
                                quality={100}
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
                {/* Second Identical Set for -50% translation loop */}
                <div className="flex gap-6 md:gap-8 pr-6 md:pr-8">
                    {icons.map((icon, idx) => (
                        <div
                            key={`set2-${idx}`}
                            className="flex-shrink-0 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center transition-transform hover:scale-110"
                        >
                            <Image
                                src={icon.src}
                                alt={icon.alt}
                                width={80}
                                height={80}
                                className={`object-contain ${icon.alt === 'LeetCode' ? 'scale-[1.35]' : ''}`}
                                priority
                                quality={100}
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PlatformSection() {
    return (
        <section className="py-20 relative z-10 overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Premium Green Card */}
                <div className="relative bg-gradient-to-br from-[#22c55e] to-[#14532d] rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl min-h-[450px] border border-white/10 flex items-center">

                    {/* Background decorative glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/20 blur-[100px] -mr-48 -mt-48"></div>

                    <div className="flex flex-col md:flex-row items-center w-full gap-8 md:gap-12 relative z-10">

                        {/* Left: Text Content (45%) */}
                        <div className="w-full md:w-[45%] flex flex-col justify-center text-left">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2 tracking-tight">
                                Works with any
                            </h2>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-lime-300 leading-tight mb-6 tracking-tight">
                                interview platform
                            </h2>
                            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-sm">
                                You can use ZEDX-AI with any video or coding platform including Zoom, Google Meet, Microsoft Teams, HackerRank, and LeetCode.
                            </p>
                        </div>

                        {/* Right: Premium Rails (55%) - Bleeding to the right */}
                        <div className="w-full md:w-[55%] relative flex flex-col gap-4 md:gap-6 -mr-4 md:-mr-14">
                            <MarqueeRow icons={iconsSet1} duration="15s" />
                            <MarqueeRow icons={iconsSet2} duration="18s" reverse />
                            <MarqueeRow icons={iconsSet3} duration="20s" />
                        </div>

                        {/* Static ZEDX Robot Mascot - Pinned to Bottom (Parakeet match) */}
                        <div className="absolute bottom-0 -right-8 sm:-right-10 md:-right-20 w-48 h-48 sm:w-80 sm:h-80 md:w-[480px] md:h-[480px] z-20 pointer-events-none">
                            <div className="relative w-full h-full flex items-end">
                                <Image
                                    src="/zedx-logo-for-v.png"
                                    alt="ZEDX AI Robot Mascot"
                                    width={480}
                                    height={480}
                                    className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative z-10 transition-transform hover:scale-105 duration-700"
                                    unoptimized
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
