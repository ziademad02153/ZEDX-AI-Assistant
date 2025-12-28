import Link from "next/link";
import { Instagram, Linkedin, Youtube } from "lucide-react";

// X (Twitter) Logo SVG Component
const XLogo = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4 col-span-1 md:col-span-4 text-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">ZEDX AI</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Your real-time AI interview assistant. Ace your next interview with confidence.
                        </p>

                        {/* Social Media Links */}
                        <div className="flex justify-center gap-4 pt-4">
                            <a
                                href="https://www.instagram.com/zedx.ai.assistant"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-110 transition-transform"
                                aria-label="Follow us on Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://www.youtube.com/@ZEDX-AI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#FF0000] text-white hover:scale-110 transition-transform"
                                aria-label="Subscribe on YouTube"
                            >
                                <Youtube size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/zedx-ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#0077B5] text-white hover:scale-110 transition-transform"
                                aria-label="Follow us on LinkedIn"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="https://x.com/ZEDX_AI_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-black text-white hover:scale-110 transition-transform"
                                aria-label="Follow us on X"
                            >
                                <XLogo size={20} />
                            </a>
                            <a
                                href="https://www.producthunt.com/posts/zedx-ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#DA552F] text-white hover:scale-110 transition-transform"
                                aria-label="Support us on Product Hunt"
                            >
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6 text-sm">
                    <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        Terms of Service
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} ZEDX AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
