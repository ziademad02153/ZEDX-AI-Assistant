import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                <p className="text-gray-500 text-sm mb-8">Last updated: December 2024</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing and using ZEDX-AI Assistant, you accept and agree to be bound by the terms and conditions of this agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                        <p>ZEDX-AI Assistant is an AI-powered interview preparation tool that provides:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Real-time interview assistance</li>
                            <li>Resume-based response generation</li>
                            <li>Interview transcript storage</li>
                            <li>AI-powered answer suggestions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Provide accurate information during registration</li>
                            <li>Use the service for legitimate interview preparation</li>
                            <li>Not misuse or abuse the AI capabilities</li>
                            <li>Keep your account credentials secure</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. AI Service</h2>
                        <p>ZEDX-AI Assistant uses server-side AI processing powered by Groq. The AI service is provided free of charge and is subject to availability and rate limits.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
                        <p>ZEDX-AI Assistant is provided "as is" without warranties of any kind. We are not responsible for:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Interview outcomes or job offers</li>
                            <li>Accuracy of AI-generated responses</li>
                            <li>Third-party API service interruptions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Termination</h2>
                        <p>We reserve the right to terminate or suspend access to our service at any time, without prior notice, for conduct that we believe violates these Terms of Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Changes to Terms</h2>
                        <p>We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact</h2>
                        <p>For questions about these Terms, contact us at: ziademadbts@gmail.com</p>
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
