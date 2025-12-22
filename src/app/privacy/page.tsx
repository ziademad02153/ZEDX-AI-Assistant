import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - ZEDX AI",
    description: "Privacy Policy for ZEDX AI Interview Assistant. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
                    <p className="text-gray-500 dark:text-gray-400">Last Updated: December 22, 2024</p>
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    {/* Introduction */}
                    <section className="mb-10">
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            This Privacy Notice for ZEDX AI ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
                        </p>
                        <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Visit our website at zedx-ai-assistant-1.vercel.app, or any website of ours that links to this Privacy Notice</li>
                            <li>Use our AI-powered interview assistant application</li>
                            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
                        </ul>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:ziademadbts@gmail.com" className="text-emerald-600 hover:underline">ziademadbts@gmail.com</a>.
                        </p>
                    </section>

                    {/* Summary */}
                    <section className="mb-10 p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Summary of Key Points</h2>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                            <li><strong>What personal information do we process?</strong> When you use our Services, we may process personal information depending on how you interact with us and the Services.</li>
                            <li><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</li>
                            <li><strong>Do we collect any information from third parties?</strong> We may collect limited information from Google when you use social login.</li>
                            <li><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</li>
                            <li><strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes in place to protect your personal information.</li>
                        </ul>
                    </section>

                    {/* Table of Contents */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Table of Contents</h2>
                        <ol className="list-decimal ml-6 space-y-2 text-emerald-600 dark:text-emerald-400">
                            <li><a href="#section1" className="hover:underline">What information do we collect?</a></li>
                            <li><a href="#section2" className="hover:underline">How do we process your information?</a></li>
                            <li><a href="#section3" className="hover:underline">What legal bases do we rely on?</a></li>
                            <li><a href="#section4" className="hover:underline">When and with whom do we share your information?</a></li>
                            <li><a href="#section5" className="hover:underline">Do we use cookies and tracking technologies?</a></li>
                            <li><a href="#section6" className="hover:underline">Do we offer AI-based products?</a></li>
                            <li><a href="#section7" className="hover:underline">How do we handle your social logins?</a></li>
                            <li><a href="#section8" className="hover:underline">How long do we keep your information?</a></li>
                            <li><a href="#section9" className="hover:underline">How do we keep your information safe?</a></li>
                            <li><a href="#section10" className="hover:underline">Do we collect information from minors?</a></li>
                            <li><a href="#section11" className="hover:underline">What are your privacy rights?</a></li>
                            <li><a href="#section12" className="hover:underline">Do we make updates to this notice?</a></li>
                            <li><a href="#section13" className="hover:underline">How can you contact us?</a></li>
                        </ol>
                    </section>

                    {/* Section 1 */}
                    <section id="section1" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. What information do we collect?</h2>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personal information you disclose to us</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We collect personal information that you provide to us.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Personal Information Provided by You.</strong> The personal information we collect may include:</p>
                        <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-300 mb-4">
                            <li>Names</li>
                            <li>Email addresses</li>
                            <li>Resume content (for interview preparation)</li>
                            <li>Job descriptions (for interview context)</li>
                            <li>Interview transcripts and AI responses</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <strong>Sensitive Information.</strong> We do not process sensitive information.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing Google account. If you choose to register in this way, we will collect certain profile information about you from Google, as described in Section 7 below.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-6">Information automatically collected</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: Some information is collected automatically when you visit our Services.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, and information about how and when you use our Services.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section id="section2" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How do we process your information?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">We process your personal information for a variety of reasons, including:</p>
                        <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li><strong>To facilitate account creation and authentication</strong> and otherwise manage user accounts.</li>
                            <li><strong>To provide AI-powered interview assistance</strong> using your resume and job description to generate relevant answers.</li>
                            <li><strong>To save your interview history</strong> for your future reference and improvement.</li>
                            <li><strong>To respond to user inquiries</strong> and offer support to users.</li>
                            <li><strong>To send administrative information</strong> about our products and services, changes to our terms and policies.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section id="section3" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. What legal bases do we rely on?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason to do so.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <strong>If you are located in the EU or UK:</strong> The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on. We may rely on the following legal bases:
                        </p>
                        <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li><strong>Consent.</strong> We may process your information if you have given us permission to use your personal information for a specific purpose.</li>
                            <li><strong>Performance of a Contract.</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you.</li>
                            <li><strong>Legitimate Interests.</strong> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests.</li>
                            <li><strong>Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section id="section4" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. When and with whom do we share your information?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We may share information in specific situations described in this section.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">We may share your personal information in the following situations:</p>
                        <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li><strong>With AI Service Providers.</strong> We share your input (resume, job description, interview questions) with AI providers (such as OpenAI, Google, Groq) to generate interview answers. These providers process your data according to their privacy policies.</li>
                            <li><strong>With Service Providers.</strong> We share your data with Supabase for database storage and authentication.</li>
                            <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with any merger, sale of company assets, or acquisition.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section id="section5" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Do we use cookies and tracking technologies?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We may use cookies and other tracking technologies to collect and store your information.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. These technologies help us maintain the security of our Services, save your preferences, and assist with basic site functions. We use essential cookies only for authentication and session management.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section id="section6" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Do we offer AI-based products?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We offer products powered by artificial intelligence and machine learning technologies.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your interview experience and provide you with AI-generated answers.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <strong>Use of AI Technologies:</strong> We provide AI Products through third-party service providers ("AI Service Providers"), including OpenAI, Google AI, and Groq. Your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <strong>Our AI Products are designed for:</strong>
                        </p>
                        <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-300">
                            <li>Natural language processing of interview questions</li>
                            <li>Generating contextual interview answers based on your resume</li>
                            <li>Speech-to-text transcription of interview conversations</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section id="section7" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. How do we handle your social logins?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: If you choose to register or log in using a social media account, we may have access to certain information about you.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Our Services offer you the ability to register and log in using your Google account. Where you choose to do this, we will receive certain profile information about you from Google. The profile information we receive may include your name, email address, and profile picture.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            We will use the information we receive only for the purposes described in this Privacy Notice. We recommend that you review Google's privacy policy to understand how they collect, use, and share your personal information.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section id="section8" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. How long do we keep your information?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required by law. When you delete your account, we will delete or anonymize your personal information within 30 days.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Your interview transcripts, resumes, and AI responses are stored as long as you have an active account. You can delete individual interviews or your entire account at any time.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section id="section9" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. How do we keep your information safe?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We aim to protect your personal information through a system of organizational and technical security measures.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. These include:
                        </p>
                        <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-300">
                            <li>Encryption of data in transit (HTTPS/TLS)</li>
                            <li>Secure database storage with Supabase using Row Level Security (RLS)</li>
                            <li>Authentication through secure OAuth providers</li>
                            <li>Regular security audits and updates</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 mt-4">
                            However, no electronic transmission over the Internet can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers or other unauthorized third parties will not be able to defeat our security.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section id="section10" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Do we collect information from minors?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: We do not knowingly collect data from or market to children under 18 years of age.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            We do not knowingly collect, solicit data from, or market to children under 18 years of age. By using the Services, you represent that you are at least 18 years old. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section id="section11" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. What are your privacy rights?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: Depending on your location, you have rights that allow you greater access to and control over your personal information.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right to:</p>
                        <ul className="list-disc ml-6 space-y-1 text-gray-600 dark:text-gray-300 mb-4">
                            <li>Request access and obtain a copy of your personal information</li>
                            <li>Request rectification or erasure of your personal information</li>
                            <li>Restrict the processing of your personal information</li>
                            <li>Data portability (if applicable)</li>
                            <li>Withdraw your consent at any time</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <strong>Account Information:</strong> You can review, change, or delete your account information at any time by logging into your account settings. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            If you have questions about your privacy rights, you may email us at <a href="mailto:ziademadbts@gmail.com" className="text-emerald-600 hover:underline">ziademadbts@gmail.com</a>.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section id="section12" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Do we make updates to this notice?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            <em>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Last Updated" date at the top of this Privacy Notice. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section id="section13" className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. How can you contact us?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            If you have questions or comments about this notice, you may email us at:
                        </p>
                        <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl">
                            <p className="text-gray-900 dark:text-white font-semibold">ZEDX AI</p>
                            <p className="text-gray-600 dark:text-gray-300">Email: <a href="mailto:ziademadbts@gmail.com" className="text-emerald-600 hover:underline">ziademadbts@gmail.com</a></p>
                        </div>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
                    <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
