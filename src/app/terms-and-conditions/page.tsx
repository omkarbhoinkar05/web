import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: {
    absolute: "Terms & Conditions | KeyCodeWeb — Building a Brighter Web",
  },
  description:
    "Review the terms and conditions governing web development, SaaS applications, custom ERP, and IT software services provided by KeyCodeWeb.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "services", title: "2. Scope of Services" },
    { id: "proposals", title: "3. Proposals & Milestones" },
    { id: "client-duties", title: "4. Client Obligations" },
    { id: "payments", title: "5. Invoicing & Payments" },
    { id: "ip-rights", title: "6. Intellectual Property & Ownership" },
    { id: "confidentiality", title: "7. Confidentiality & NDA" },
    { id: "scope-changes", title: "8. Change Requests & Scope" },
    { id: "warranty", title: "9. Warranty & Bug-Fix Period" },
    { id: "liability", title: "10. Limitation of Liability" },
    { id: "termination", title: "11. Termination of Agreement" },
    { id: "governing-law", title: "12. Governing Law & Jurisdiction" },
    { id: "contact", title: "13. Contact & Legal Inquiries" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 bg-gradient-to-b from-emerald-50/40 via-white to-white border-b border-zinc-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                LEGAL AGREEMENT
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
              Terms &amp; Conditions
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-3xl leading-relaxed">
              These Terms and Conditions govern the engagement between KeyCodeWeb (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) and clients or visitors (&ldquo;Client&rdquo;, &ldquo;you&rdquo;) accessing our website or contracting our software design, development, and digital services.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-4 pt-4 border-t border-zinc-200/60">
              <span>Effective Date: January 1, 2026</span>
              <span>•</span>
              <span>Last Updated: September 2026</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Standard Enterprise Edition</span>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
            {/* Table of Contents Sticky Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800 mb-3">
                Contents Index
              </h3>
              <nav className="space-y-1.5 text-xs">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1 text-zinc-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all font-medium truncate"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-5 border-t border-zinc-200/80 text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-800 block mb-1">Need Clarification?</span>
                <span>Our legal &amp; operations desk is available at </span>
                <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                  dev.omkar05@gmail.com
                </a>
              </div>
            </aside>

            {/* Document Body */}
            <div className="lg:col-span-8 space-y-10 text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
              {/* Section 1 */}
              <section id="acceptance" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing the KeyCodeWeb website, commissioning any digital development project, signing a Statement of Work (SOW), or submitting payment for software consulting, you explicitly confirm that you have read, understood, and agreed to be legally bound by these Terms and Conditions.
                </p>
                <p className="mt-2.5">
                  If you do not agree to all terms stated herein, you must refrain from utilizing our services and accessing this website.
                </p>
              </section>

              {/* Section 2 */}
              <section id="services" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  2. Scope of Services
                </h2>
                <p>
                  KeyCodeWeb delivers end-to-end digital technology solutions, including but not limited to:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
                  <li>Custom Web Design, UI/UX Prototyping, and Design Systems</li>
                  <li>Full-Stack Web Application &amp; SaaS Platform Engineering</li>
                  <li>Custom Enterprise Resource Planning (ERP) &amp; Internal Dashboard Systems</li>
                  <li>E-Commerce Portal Development &amp; Payment Gateway Integration</li>
                  <li>Cloud Infrastructure Setup, CI/CD Pipelines, and Web Hosting Consulting</li>
                  <li>Ongoing Maintenance, Performance Audits, and Technical SLA Support</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="proposals" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  3. Proposals, SOW &amp; Milestones
                </h2>
                <p>
                  Each development engagement is defined by an official Statement of Work (SOW), Proposal, or Contract outlining project scope, feature deliverables, sprint schedules, and milestone compensation.
                </p>
                <div className="my-4 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950">
                  <span className="font-extrabold text-emerald-900 block mb-0.5">✦ Milestone Sign-Off</span>
                  Upon completion of each developmental milestone, the Client is provided with an inspection preview or staging environment. Deliverables are deemed accepted upon formal approval or after five (5) business days without written revisions.
                </div>
              </section>

              {/* Section 4 */}
              <section id="client-duties" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  4. Client Obligations &amp; Cooperation
                </h2>
                <p>
                  Timely delivery of software is collaborative. The Client agrees to provide necessary textual copy, media assets, third-party credentials, and feedback in a reasonable timeframe. Delays caused by pending client materials automatically extend project delivery dates proportionally.
                </p>
              </section>

              {/* Section 5 */}
              <section id="payments" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  5. Invoicing &amp; Payment Terms
                </h2>
                <p>
                  Unless specified otherwise in an executed SOW:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
                  <li>A non-refundable advance deposit (typically 30% to 50%) is required prior to project kick-off.</li>
                  <li>Subsequent payments are released against defined milestone deliveries or monthly sprints.</li>
                  <li>Final production source code, live server deployments, and domain handoffs occur only after full settlement of outstanding invoices.</li>
                  <li>Invoices are payable within seven (7) business days of issuance via bank transfer, UPI, or designated corporate gateway.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="ip-rights" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  6. Intellectual Property &amp; Code Ownership
                </h2>
                <p>
                  <strong>Client Ownership:</strong> Upon full and final settlement of all project invoices, all custom source code, design mockups, and client-specific business logic created specifically for the project belong exclusively to the Client.
                </p>
                <p className="mt-2.5">
                  <strong>Third-Party &amp; Open Source:</strong> Components utilizing third-party libraries (e.g. React, Next.js, Tailwind CSS) remain governed by their respective open-source licenses (such as MIT or Apache 2.0).
                </p>
              </section>

              {/* Section 7 */}
              <section id="confidentiality" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  7. Confidentiality &amp; Non-Disclosure
                </h2>
                <p>
                  Both parties agree to treat all proprietary business data, trade secrets, customer databases, and software architectures as strictly confidential. Neither party will disclose sensitive materials to third parties without prior written consent.
                </p>
              </section>

              {/* Section 8 */}
              <section id="scope-changes" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  8. Scope Changes &amp; Change Requests
                </h2>
                <p>
                  Requests for additional features, third-party integrations, or architectural redesigns not covered in the original SOW will be assessed as a Change Request (CR) with supplementary timeline and cost estimates, requiring mutual written authorization.
                </p>
              </section>

              {/* Section 9 */}
              <section id="warranty" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  9. Warranty &amp; Bug-Fix Period
                </h2>
                <p>
                  KeyCodeWeb provides a complimentary <strong>thirty (30) day warranty period</strong> following final production deployment. During this window, any defects or bugs directly attributed to the contracted scope will be remediated at no additional charge.
                </p>
              </section>

              {/* Section 10 */}
              <section id="liability" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  10. Limitation of Liability
                </h2>
                <p>
                  In no event shall KeyCodeWeb, its directors, developers, or affiliates be liable for indirect, incidental, punitive, or consequential damages (including loss of business profits or data interruption) arising out of third-party cloud outages, hosting downtime, or unauthorized external breaches. Our aggregate liability is limited to the total fees paid by the client under the specific SOW.
                </p>
              </section>

              {/* Section 11 */}
              <section id="termination" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  11. Termination of Agreement
                </h2>
                <p>
                  Either party may terminate an ongoing engagement with fourteen (14) days written notice. In such case, the Client will pay for all work completed up to the date of notice, and KeyCodeWeb will release all completed assets and documentation corresponding to paid milestones.
                </p>
              </section>

              {/* Section 12 */}
              <section id="governing-law" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  12. Governing Law &amp; Jurisdiction
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Navi Mumbai / Mumbai, Maharashtra.
                </p>
              </section>

              {/* Section 13 */}
              <section id="contact" className="scroll-mt-28 pt-4 border-t border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  13. Contact &amp; Legal Inquiries
                </h2>
                <p>
                  For any legal queries, contract notices, or formal discussions regarding our Terms &amp; Conditions, please reach out directly:
                </p>

                <div className="mt-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong>Company:</strong> KeyCodeWeb Software &amp; Digital Solutions
                  </div>
                  <div>
                    <strong>Operations Center:</strong> Kharghar, Navi Mumbai, Maharashtra, India
                  </div>
                  <div>
                    <strong>Direct Telephone:</strong>{" "}
                    <a href="tel:+919920818481" className="font-bold text-emerald-700 hover:underline">
                      +91 99208 18481
                    </a>
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                      dev.omkar05@gmail.com
                    </a>
                  </div>
                </div>
              </section>

              {/* Bottom Quick Switcher */}
              <div className="pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                <Link href="/" className="text-emerald-700 hover:underline flex items-center gap-1">
                  <span>←</span> Back to Homepage
                </Link>
                <Link href="/privacy-policy" className="text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
                  View Privacy Policy <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
