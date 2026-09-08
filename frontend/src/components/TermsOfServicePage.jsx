import React, { useState, useEffect } from 'react'
import { POLICY_CONFIG } from '../config/policyConfig'

export default function TermsOfServicePage({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('acceptance')
  const [copiedEmail, setCopiedEmail] = useState(false)

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms', icon: 'check_circle' },
    { id: 'description-of-service', title: '2. Description of Service', icon: 'analytics' },
    { id: 'financial-disclaimer', title: '3. Financial & Legal Disclaimer', icon: 'gavel' },
    { id: 'eligibility-account', title: '4. Eligibility & Accounts', icon: 'account_circle' },
    { id: 'acceptable-use', title: '5. Acceptable Use Policy', icon: 'rule' },
    { id: 'intellectual-property', title: '6. Intellectual Property', icon: 'copyright' },
    { id: 'disclaimer-warranties', title: '7. Disclaimer of Warranties', icon: 'error_outline' },
    { id: 'limitation-liability', title: '8. Limitation of Liability', icon: 'health_and_safety' },
    { id: 'termination', title: '9. Termination & Suspension', icon: 'cancel' },
    { id: 'governing-law', title: '10. Governing Law', icon: 'balance' },
    { id: 'contact-legal', title: '11. Legal Contact Inquiries', icon: 'mail' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const top = element.offsetTop
          const height = element.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -90
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 w-full animate-in fade-in duration-300">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#2B303B]/80 mb-10">
        <div className="flex items-center gap-3 text-xs font-mono text-[#8A93A3]">
          <button 
            onClick={() => onNavigate('upload')} 
            className="hover:text-[#D99A4E] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to Statement Audit</span>
          </button>
          <span>/</span>
          <span className="text-[#ECEEF3]">Terms of Service</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-[#181C25] border border-[#2B303B] hover:border-[#D99A4E] text-xs font-mono text-[#8A93A3] hover:text-[#ECEEF3] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">print</span>
            <span>Print Terms</span>
          </button>
          <div className="px-3 py-1.5 rounded-lg bg-[#181C25] border border-[#2B303B] text-xs font-mono text-[#D99A4E] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6FA88C]"></span>
            <span>Effective: {POLICY_CONFIG.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 max-w-4xl mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181C25] border border-[#2B303B] text-xs font-mono text-[#D99A4E]">
          <span className="material-symbols-outlined text-[16px]">description</span>
          <span>User Agreement & Operating Conditions</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-normal tracking-tight text-[#ECEEF3]">
          Terms of Service
        </h1>
        <p className="text-sm md:text-base text-[#8A93A3] leading-relaxed">
          Please read these Terms of Service carefully before utilizing the StopTheDrip financial analysis engine. 
          These terms govern your access to and use of our web application, parsers, and leak detection algorithms.
        </p>
      </div>

      {/* MANDATORY LEGAL NOTICE BANNER */}
      <div className="mb-12 p-5 rounded-2xl bg-[#181C25]/90 border border-[#D99A4E]/40 flex flex-col sm:flex-row items-start gap-4 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-[#D99A4E]/10 border border-[#D99A4E]/30 flex items-center justify-center flex-shrink-0 text-[#D99A4E]">
          <span className="material-symbols-outlined text-[22px]">gavel</span>
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-[#ECEEF3] text-sm flex items-center gap-2">
            <span>Notice for Production & Legal Review</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D99A4E]/20 text-[#D99A4E]">Advisory</span>
          </h4>
          <p className="text-[#8A93A3] leading-relaxed">
            These Terms of Service provide a comprehensive operational and legal framework for StopTheDrip. 
            <strong className="text-[#ECEEF3]"> This document must be reviewed and tailored by a qualified legal professional</strong> prior to operating a live production service handling actual consumer financial documents.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar TOC + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT 4 COLS: STICKY TABLE OF CONTENTS */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2B303B]">
                <h3 className="font-headline text-base font-normal text-[#ECEEF3] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#D99A4E] text-[18px]">list_alt</span>
                  <span>Terms Index</span>
                </h3>
                <span className="text-[11px] font-mono text-[#8A93A3]">11 Sections</span>
              </div>

              <nav className="space-y-1">
                {sections.map((sec) => {
                  const isActive = activeSection === sec.id
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all group ${
                        isActive
                          ? 'bg-[#D99A4E]/15 text-[#D99A4E] font-medium border border-[#D99A4E]/30'
                          : 'text-[#8A93A3] hover:text-[#ECEEF3] hover:bg-[#181C25]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-[#D99A4E]' : 'text-[#8A93A3] group-hover:text-[#ECEEF3]'}`}>
                          {sec.icon}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                        arrow_forward
                      </span>
                    </button>
                  )
                })}
              </nav>

              {/* Privacy Quick Link */}
              <div className="pt-4 border-t border-[#2B303B] space-y-3">
                <span className="text-[11px] font-mono text-[#8A93A3] uppercase tracking-wider block">
                  Related Documents
                </span>
                <button
                  onClick={() => onNavigate('policy')}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#181C25] border border-[#2B303B] hover:border-[#D99A4E] text-xs font-mono text-[#D99A4E] flex items-center justify-center gap-2 transition-all hover:bg-[#1C222F]"
                >
                  <span className="material-symbols-outlined text-[16px]">shield</span>
                  <span>View Privacy & Security Policy</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT 8 COLS: TERMS CONTENT */}
        <main className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-[#ECEEF3]">
          
          {/* SECTION 1: ACCEPTANCE */}
          <section id="acceptance" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#D99A4E]/10 border border-[#D99A4E]/30 flex items-center justify-center text-[#D99A4E]">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#D99A4E] uppercase tracking-wider block">Section 01</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">1. Acceptance of Terms</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">
              By accessing, browsing, or uploading documents to StopTheDrip, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service and our Privacy & Security Policy. 
              If you do not agree with any portion of these terms, you must refrain from using the service immediately.
            </p>
          </section>

          {/* SECTION 2: DESCRIPTION OF SERVICE */}
          <section id="description-of-service" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#6FA88C]/10 border border-[#6FA88C]/30 flex items-center justify-center text-[#6FA88C]">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#6FA88C] uppercase tracking-wider block">Section 02</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">2. Description of Service</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">
              StopTheDrip provides automated financial analytics software designed to assist individuals in detecting 
              recurring subscription expenditures, rate increases, forgotten trial memberships, and potential savings opportunities 
              from uploaded statements (.PDF, .CSV, .XLSX, .TXT). All calculations, recurring frequency groupings, and 
              cancellation playbooks are generated via automated algorithmic heuristic rules and dual-agent AI classification models.
            </p>
          </section>

          {/* SECTION 3: FINANCIAL & LEGAL DISCLAIMER */}
          <section id="financial-disclaimer" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B]">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#FF6B6B] uppercase tracking-wider block">Section 03</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">3. Financial, Tax & Legal Advice Disclaimer</h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#281919]/60 border border-[#FF6B6B]/30 space-y-2 text-xs">
              <span className="font-mono text-[#FF6B6B] uppercase tracking-wider block font-semibold">
                CRITICAL NOTICE: NOT A FINANCIAL ADVISOR OR FIDUCIARY
              </span>
              <p className="text-[#ECEEF3] leading-relaxed">
                StopTheDrip is an informational software tool. <strong>StopTheDrip is NOT a registered investment advisor, certified financial planner (CFP), CPA, or attorney.</strong> 
                The calculations, annual leak estimations, audit scores, and cancellation recommendations provided by the application 
                do not constitute formal financial, investment, legal, accounting, or tax advice.
              </p>
              <p className="text-[#8A93A3] leading-relaxed">
                You remain solely responsible for independently verifying your bank balances, contract obligations, cancellation penalty clauses, 
                and banking terms with your financial institutions and subscription providers.
              </p>
            </div>
          </section>

          {/* SECTION 4: ELIGIBILITY & ACCOUNTS */}
          <section id="eligibility-account" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#D99A4E]/10 border border-[#D99A4E]/30 flex items-center justify-center text-[#D99A4E]">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#D99A4E] uppercase tracking-wider block">Section 04</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">4. User Eligibility & Account Security</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">
              To use StopTheDrip, you must be at least 18 years of age (or the age of legal majority in your jurisdiction). 
              If you authenticate using Google SSO, you are responsible for maintaining the confidentiality of your credentials 
              and for all activities conducted under your authenticated session.
            </p>
          </section>

          {/* SECTION 5: ACCEPTABLE USE */}
          <section id="acceptable-use" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#6FA88C]/10 border border-[#6FA88C]/30 flex items-center justify-center text-[#6FA88C]">
                <span className="material-symbols-outlined text-[20px]">rule</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#6FA88C] uppercase tracking-wider block">Section 05</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">5. Acceptable Use Policy</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">Users agree not to engage in any of the following prohibited behaviors:</p>
            <ul className="space-y-2 text-xs text-[#8A93A3] list-disc list-inside">
              <li>Uploading financial statements or confidential documents belonging to third parties without explicit legal authorization.</li>
              <li>Attempting to bypass rate limits, reverse-engineer API endpoints, or conduct automated denial-of-service tests.</li>
              <li>Injecting malicious software, corrupted binaries, macro-enabled spreadsheets, or cross-site scripting payloads into the parser.</li>
              <li>Using StopTheDrip to facilitate money laundering, tax evasion, fraud, or unlawful financial activities.</li>
            </ul>
          </section>

          {/* SECTION 6: INTELLECTUAL PROPERTY */}
          <section id="intellectual-property" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#D99A4E]/10 border border-[#D99A4E]/30 flex items-center justify-center text-[#D99A4E]">
                <span className="material-symbols-outlined text-[20px]">copyright</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#D99A4E] uppercase tracking-wider block">Section 06</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">6. Intellectual Property Rights</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">
              The StopTheDrip software, user interface design, logos, visual aesthetics, 3D WebGL assets, classification heuristics, 
              and documentation are the proprietary intellectual property of StopTheDrip. You are granted a personal, 
              non-exclusive, non-transferable license to utilize the application for individual financial auditing.
            </p>
          </section>

          {/* SECTION 7: DISCLAIMER OF WARRANTIES */}
          <section id="disclaimer-warranties" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#6FA88C]/10 border border-[#6FA88C]/30 flex items-center justify-center text-[#6FA88C]">
                <span className="material-symbols-outlined text-[20px]">error_outline</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#6FA88C] uppercase tracking-wider block">Section 07</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">7. Disclaimer of Warranties</h2>
              </div>
            </div>

            <p className="text-[#8A93A3] text-xs leading-relaxed">
              STOPTHEDRIP IS PROVIDED STRICTLY ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, 
              WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT STATEMENT PARSING 
              WILL BE ERROR-FREE, UNINTERRUPTED, OR COMPREHENSIVELY ACCURATE ACROSS ALL GLOBAL BANKING LAYOUTS.
            </p>
          </section>

          {/* SECTION 8: LIMITATION OF LIABILITY */}
          <section id="limitation-liability" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#D99A4E]/10 border border-[#D99A4E]/30 flex items-center justify-center text-[#D99A4E]">
                <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#D99A4E] uppercase tracking-wider block">Section 08</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">8. Limitation of Liability</h2>
              </div>
            </div>

            <p className="text-[#8A93A3] text-xs leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL STOPTHEDRIP, ITS DIRECTORS, EMPLOYEES, 
              OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
              LOSS OF PROFITS, LOSS OF REVENUE, OVERDRAFT CHARGES, SUBSCRIPTION RENEWAL DISPUTES, OR DATA CORRUPTION 
              ARISING OUT OF OR RELATED TO YOUR USE OF THE APPLICATION.
            </p>
          </section>

          {/* SECTION 9: TERMINATION */}
          <section id="termination" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#6FA88C]/10 border border-[#6FA88C]/30 flex items-center justify-center text-[#6FA88C]">
                <span className="material-symbols-outlined text-[20px]">cancel</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#6FA88C] uppercase tracking-wider block">Section 09</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">9. Service Modification & Termination</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">
              We reserve the right to modify, suspend, or discontinue any feature or endpoint of StopTheDrip at any time without 
              prior notice. We may also terminate or restrict your access if you violate any provision of these Terms of Service.
            </p>
          </section>

          {/* SECTION 10: GOVERNING LAW */}
          <section id="governing-law" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#D99A4E]/10 border border-[#D99A4E]/30 flex items-center justify-center text-[#D99A4E]">
                <span className="material-symbols-outlined text-[20px]">balance</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#D99A4E] uppercase tracking-wider block">Section 10</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">10. Governing Law & Dispute Resolution</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">
              These Terms shall be construed in accordance with applicable laws without regard to conflict of law principles. 
              Any disputes arising from these Terms or the service shall be resolved through good-faith negotiation prior to formal arbitration.
            </p>
          </section>

          {/* SECTION 11: CONTACT */}
          <section id="contact-legal" className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B303B]">
              <div className="w-9 h-9 rounded-xl bg-[#6FA88C]/10 border border-[#6FA88C]/30 flex items-center justify-center text-[#6FA88C]">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#6FA88C] uppercase tracking-wider block">Section 11</span>
                <h2 className="font-headline text-xl md:text-2xl font-normal text-[#ECEEF3]">11. Legal Inquiries & Contact</h2>
              </div>
            </div>

            <p className="text-[#8A93A3]">
              For inquiries regarding these Terms of Service or commercial licensing requests, please contact our legal team:
            </p>

            <div className="p-4 rounded-2xl bg-[#181C25] border border-[#2B303B] flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] text-[#8A93A3] uppercase block">Legal Contact</span>
                <span className="font-mono text-xs text-[#ECEEF3]">{POLICY_CONFIG.supportEmail}</span>
              </div>
              <button
                onClick={() => handleCopyEmail(POLICY_CONFIG.supportEmail)}
                className="p-2 rounded-lg bg-[#202531] hover:bg-[#2B303B] text-[#D99A4E] transition-colors"
                title="Copy Email"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            {copiedEmail && (
              <p className="text-xs text-[#6FA88C] font-mono text-center animate-in fade-in">
                ✓ Legal contact email copied to clipboard.
              </p>
            )}
          </section>

          {/* Navigation Bottom Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#2B303B]">
            <button
              onClick={() => onNavigate('upload')}
              className="shimmer-btn px-6 py-3 rounded-xl text-[#12151C] text-xs font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Launch Statement Audit</span>
            </button>

            <button
              onClick={() => onNavigate('policy')}
              className="px-5 py-3 rounded-xl bg-[#181C25] border border-[#2B303B] hover:border-[#D99A4E] text-xs font-mono text-[#8A93A3] hover:text-[#ECEEF3] transition-all flex items-center gap-2"
            >
              <span>View Privacy & Security Policy</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
