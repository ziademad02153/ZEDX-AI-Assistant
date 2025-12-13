import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4 col-span-1 md:col-span-4 text-center">
                        <h3 className="font-bold text-lg text-gray-900">ZEDX-AI</h3>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                            Your real-time AI interview assistant. Ace your next interview with confidence.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6 text-sm">
                    <Link href="/privacy" className="text-gray-600 hover:text-teal-600 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-gray-600 hover:text-teal-600 transition-colors">
                        Terms of Service
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} ZEDX-AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
