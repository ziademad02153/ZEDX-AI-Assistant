import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-gray-500 text-sm mb-8">Last updated: December 2024</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                        <p>When you use ZEDX-AI Assistant, we may collect:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Email address (for authentication)</li>
                            <li>Name (if provided during signup)</li>
                            <li>Resume content (stored securely for interview preparation)</li>
                            <li>Interview transcripts (stored for your reference)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Provide AI-powered interview assistance</li>
                            <li>Store your interview history for future reference</li>
                            <li>Improve our services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security</h2>
                        <p>Your data is protected using industry-standard encryption. We use Supabase for secure data storage with Row Level Security (RLS) enabled.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
                        <p>We use the following third-party services:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Google (for authentication)</li>
                            <li>Supabase (for database and authentication)</li>
                            <li>AI providers (for generating responses)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Access your personal data</li>
                            <li>Delete your account and data</li>
                            <li>Export your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, contact us at: ziademadbts@gmail.com</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <Link href="/" className="text-teal-600 hover:text-teal-700">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
