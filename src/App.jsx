import { useState } from 'react'
import {
  Menu, X, CheckCircle, TrendingUp, MessageSquare, BarChart3,
  Shield, Award, FileText, Zap, ExternalLink, Linkedin, Mail,
  ChevronRight,
  Link as LinkIcon,
} from 'lucide-react'

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const WHITE      = '#FFFFFF'
const OFF_WHITE  = '#F8FAFC'
const MIDNIGHT   = '#0A0F1E'
const INDIGO     = '#4F46E5'
const INDIGO_DK  = '#4338CA'
const LIGHT_GREY = '#F1F5F9'
const MID_GREY   = '#64748B'

// ─── LOGO ICON ────────────────────────────────────────────────────────────────
function LogoIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Globe — indigo */}
      <circle cx="15" cy="15" r="13" fill={INDIGO} />
      <ellipse cx="15" cy="15" rx="13" ry="5.5" stroke={WHITE} strokeWidth="1.1" fill="none" opacity="0.45" />
      <ellipse cx="15" cy="15" rx="5.5" ry="13" stroke={WHITE} strokeWidth="1.1" fill="none" opacity="0.45" />
      <line x1="2" y1="15" x2="28" y2="15" stroke={WHITE} strokeWidth="1.1" opacity="0.45" />
      {/* Newspaper — midnight with copper text */}
      <rect x="17" y="17" width="13" height="13" rx="2.5" fill={MIDNIGHT} />
      <rect x="19" y="19.5" width="9" height="2" rx="1" fill="#F5C518" />
      <rect x="19" y="23"   width="7" height="1.2" rx="0.6" fill="#F5C518" opacity="0.85" />
      <rect x="19" y="25.2" width="8" height="1.2" rx="0.6" fill="#F5C518" opacity="0.85" />
      <rect x="19" y="27.4" width="5" height="1.2" rx="0.6" fill="#F5C518" opacity="0.85" />
    </svg>
  )
}

// ─── HERO ILLUSTRATION ────────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <svg viewBox="0 0 460 420" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg mx-auto" aria-hidden="true">
      <defs>
        <filter id="sh" x="-15%" y="-10%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor={MIDNIGHT} floodOpacity="0.14" />
        </filter>
        <filter id="sh2" x="-20%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={INDIGO} floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ── Browser chrome ── */}
      <rect x="40" y="30" width="380" height="368" rx="14" fill={WHITE} filter="url(#sh)" />
      {/* Title bar */}
      <rect x="40" y="30" width="380" height="40" rx="14" fill={LIGHT_GREY} />
      <rect x="40" y="56" width="380" height="14" fill={LIGHT_GREY} />
      {/* Neutral dot indicators */}
      <circle cx="66" cy="50" r="5" fill={MID_GREY} opacity="0.22" />
      <circle cx="82" cy="50" r="5" fill={MID_GREY} opacity="0.22" />
      <circle cx="98" cy="50" r="5" fill={MID_GREY} opacity="0.22" />
      {/* Address bar */}
      <rect x="116" y="42" width="240" height="16" rx="8" fill={WHITE} />
      <rect x="126" y="47" width="120" height="6" rx="3" fill={MID_GREY} opacity="0.30" />

      {/* ── Masthead ── */}
      <text x="230" y="108" textAnchor="middle"
        fontFamily="Georgia, serif" fontSize="24" fontWeight="700"
        fill={MIDNIGHT} letterSpacing="4">
        The Guardian
      </text>
      {/* Double rule under masthead */}
      <line x1="60" y1="116" x2="400" y2="116" stroke={MIDNIGHT} strokeWidth="2" />
      <line x1="60" y1="120" x2="400" y2="120" stroke={MIDNIGHT} strokeWidth="0.5" />

      {/* Section tag */}
      <rect x="60" y="130" width="64" height="18" rx="3" fill={INDIGO} />
      <rect x="67" y="135.5" width="50" height="7" rx="3" fill={WHITE} opacity="0.85" />

      {/* Article headline — larger, more prominent */}
      <rect x="60" y="158" width="320" height="16" rx="4" fill={MIDNIGHT} />
      <rect x="60" y="180" width="280" height="16" rx="4" fill={MIDNIGHT} />

      {/* Author row: avatar + byline */}
      <circle cx="74" cy="214" r="10" fill={LIGHT_GREY} stroke={MID_GREY} strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Avatar face placeholder */}
      <circle cx="74" cy="211" r="4" fill={MID_GREY} opacity="0.35" />
      <ellipse cx="74" cy="220" rx="6" ry="4" fill={MID_GREY} opacity="0.25" />
      <rect x="90" y="208" width="80" height="7" rx="3" fill={MID_GREY} opacity="0.65" />
      <rect x="90" y="219" width="55" height="6" rx="3" fill={MID_GREY} opacity="0.35" />

      {/* Divider below byline */}
      <line x1="60" y1="232" x2="400" y2="232" stroke={LIGHT_GREY} strokeWidth="1.2" />

      {/* Body text lines */}
      <rect x="60" y="242" width="320" height="7" rx="3" fill={MID_GREY} opacity="0.32" />
      <rect x="60" y="255" width="308" height="7" rx="3" fill={MID_GREY} opacity="0.32" />
      <rect x="60" y="268" width="315" height="7" rx="3" fill={MID_GREY} opacity="0.32" />
      <rect x="60" y="281" width="260" height="7" rx="3" fill={MID_GREY} opacity="0.32" />

      {/* Pull quote */}
      <rect x="60" y="300" width="4" height="48" rx="2" fill={INDIGO} />
      <rect x="74" y="306" width="210" height="9" rx="3" fill={MIDNIGHT} opacity="0.52" />
      <rect x="74" y="321" width="180" height="9" rx="3" fill={MIDNIGHT} opacity="0.52" />
      <rect x="74" y="336" width="130" height="9" rx="3" fill={MIDNIGHT} opacity="0.38" />

      {/* More body text */}
      <rect x="60" y="360" width="316" height="7" rx="3" fill={MID_GREY} opacity="0.25" />
      <rect x="60" y="373" width="270" height="7" rx="3" fill={MID_GREY} opacity="0.25" />

      {/* ── Chain-link badge ── */}
      <circle cx="390" cy="372" r="24" fill={INDIGO} filter="url(#sh2)" />
      {/* Lucide Link icon paths, scaled to fit the circle */}
      <g transform="translate(380, 362) scale(0.85)" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
    </svg>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { label: 'Home',       href: '#home' },
    { label: 'Services',   href: '#services' },
    { label: 'Case Study', href: '#case-study' },
    { label: 'Contact',    href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#0A0F1E]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          <a href="#home" className="flex items-center gap-2.5">
            <LogoIcon size={32} />
            <span
              className="font-bold text-[1.375rem] tracking-tight"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #0A0F1E 0%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ranking Atlas
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="text-[#0A0F1E]/65 hover:text-[#0A0F1E] text-[0.9375rem] font-medium transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex">
            <a href="#contact"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_16px_2px_rgba(245,197,24,0.35)]">
              Start a Campaign
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#0A0F1E] hover:text-[#4F46E5] transition-colors" aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#0A0F1E]/10 py-4">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-[#0A0F1E]/65 hover:text-[#0A0F1E] hover:bg-[#F1F5F9] transition-colors text-sm font-medium">
                {l.label}
              </a>
            ))}
            <div className="px-4 pt-3 pb-1">
              <a href="#contact" onClick={() => setMenuOpen(false)}
                className="block bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-5 py-2.5 rounded-lg text-center transition-colors duration-200">
                Start a Campaign
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" className="bg-white min-h-screen flex items-center pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 lg:pt-6 lg:pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            {/* Headline */}
            <h1 className="text-[64px] lg:text-[72px] font-black leading-[1.0] tracking-tight mb-2">
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #0A0F1E 0%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Digital PR</span>
              <br />
              <span className="relative" style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #0A0F1E 0%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                That Delivers.
                <svg
                  viewBox="0 0 340 12"
                  className="absolute left-0 w-full"
                  style={{ bottom: '-14px', height: '12px' }}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8 C30 3, 60 10, 90 6 S150 2, 180 7 S240 11, 270 5 S310 2, 338 7"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            <div className="mb-5" />

            {/* Subheadline */}
            <p className="text-lg sm:text-xl leading-relaxed max-w-xl mb-6" style={{ color: MID_GREY }}>
              <span style={{ color: INDIGO, fontWeight: 600 }}>Earned media placements</span> in the world's top publications. Minimum 8 links per campaign, guaranteed. No retainers. No filler. Just links that matter.
            </p>

            {/* Stat bar — fixed single row */}
            <div className="flex items-center gap-4 mb-8 flex-nowrap">
              {[
                '8–12 Links Per Campaign (Minimum!)',
                '100% Link Guarantee',
                'No Retainers',
              ].map((stat, i) => (
                <div key={stat} className="flex items-center gap-1.5 shrink-0">
                  {i > 0 && <span className="text-[#0A0F1E]/20 mx-1">·</span>}
                  <CheckCircle size={14} color={INDIGO} className="shrink-0" />
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: MIDNIGHT }}>
                    {stat}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold px-8 py-4 rounded-lg text-base transition-all duration-200 hover:shadow-[0_0_20px_4px_rgba(245,197,24,0.35)] hover:-translate-y-0.5">
                Start a Campaign – $3.5K
                <ChevronRight size={18} />
              </a>
              <a href="#case-study"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#4F46E5]/50 hover:border-[#4F46E5] text-[#4F46E5] font-bold px-8 py-4 rounded-lg text-base transition-all duration-200 hover:shadow-[0_0_16px_2px_rgba(245,197,24,0.25)] hover:-translate-y-0.5">
                See Case Study
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center justify-center">
            <HeroIllustration />
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── PUBLICATIONS BAR ─────────────────────────────────────────────────────────
function PublicationsBar() {
  const pubs = [
    'The Guardian', 'BBC', 'Forbes', 'Bloomberg',
    'The Telegraph', 'Daily Mail', 'The Sun', 'New York Times',
  ]
  const doubled = [...pubs, ...pubs]

  return (
    <div className="bg-[#F8FAFC] border-y border-[#0A0F1E]/8 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: MID_GREY }}>
          We Target Publications Including
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex items-center animate-scroll whitespace-nowrap">
          {doubled.map((pub, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              <span className="font-semibold text-lg hover:text-[#0A0F1E] transition-colors px-10"
                style={{ color: MIDNIGHT }}>
                {pub}
              </span>
              <span className="font-light shrink-0" style={{ color: INDIGO, opacity: 0.3 }}>|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      icon: TrendingUp,
      title: 'Reactive PR',
      image: '/reactive-pr.png',
      description: 'We monitor trending events, Google Trends, and breaking news to secure rapid link acquisition.',
      bullets: ['Google Trends monitoring', 'Breaking news response', 'Rapid link acquisition', 'Real-time pitching'],
    },
    {
      icon: MessageSquare,
      title: 'Expert Commentary',
      image: '/expert-pr.png',
      description: 'We position your brand as a thought leader by securing expert tips and insights in top-tier publications.',
      bullets: ['Thought leadership', 'Expert tips & insights', 'High-authority placements', 'Brand authority building'],
    },
    {
      icon: BarChart3,
      title: 'Data Campaigns',
      image: '/data-campaign.png',
      description: 'We create original research stories using government statistics and proprietary datasets that generate high-authority backlinks at scale.',
      bullets: ['Government statistics', 'Proprietary data analysis', 'Original research stories', 'Scalable campaigns'],
    },
  ]

  return (
    <section id="services" className="bg-white pt-12 pb-24 lg:pt-14 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: MIDNIGHT }}>
            Our Digital PR Services
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: MID_GREY }}>
            Three ways we get your brand featured in major publications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon
            return (
              <div key={svc.title}
                className="bg-[#F1F5F9] rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${INDIGO}18` }}>
                  <Icon size={24} color={INDIGO} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: MIDNIGHT }}>{svc.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: MID_GREY }}>{svc.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {svc.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5">
                      <CheckCircle size={15} color={INDIGO} className="shrink-0" />
                      <span className="text-sm font-medium" style={{ color: MIDNIGHT }}>{b}</span>
                    </li>
                  ))}
                </ul>
                <img
                  src={svc.image}
                  alt={`${svc.title} example`}
                  className="w-full rounded-xl"
                  style={{ boxShadow: '0 4px 16px rgba(10,15,30,0.12)' }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── GUARANTEES ───────────────────────────────────────────────────────────────
function Guarantees() {
  const items = [
    { icon: Award,    title: '100% Earned Links',      desc: 'Every link is genuinely earned through editorial placements — no paid inserts, ever.' },
    { icon: Shield,   title: '100% Link Guarantee',    desc: 'We run unlimited stories until your agreed link count is achieved.' },
    { icon: FileText, title: 'No Long-Term Contracts', desc: 'Campaign-by-campaign model. Stay because of results, not commitments.' },
    { icon: Zap,      title: 'Highly Scalable',        desc: 'From 10 links to 80 — our process scales to match your growth ambitions.' },
  ]

  return (
    <section className="bg-[#0A0F1E] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Digital PR with link guarantees
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: MID_GREY }}>
            We run unlimited stories for you until link numbers are achieved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title}
                className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-[#4F46E5]/40 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors duration-300 group-hover:bg-[#4F46E5]"
                  style={{ background: `${INDIGO}28` }}>
                  <Icon size={28} color={INDIGO} className="group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MID_GREY }}>{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── CASE STUDY ───────────────────────────────────────────────────────────────
function CaseStudy() {
  return (
    <section id="case-study" className="bg-[#F8FAFC] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: MIDNIGHT }}>Case Study</h2>
          <p className="text-xl" style={{ color: MID_GREY }}>Real results from a real client.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#0A0F1E]/8 shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="bg-[#0A0F1E] px-8 py-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: INDIGO }}>
                <span className="text-white font-black text-sm">SM</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">SEO Mandarin</h3>
                <a href="https://seomandarin.com" target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:underline flex items-center gap-1 transition-colors"
                  style={{ color: INDIGO }}>
                  seomandarin.com <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{ background: `${INDIGO}22`, borderColor: `${INDIGO}55`, color: INDIGO }}>
              <CheckCircle size={12} /> Campaign Complete
            </span>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: MID_GREY }}>The Client</p>
                <p className="leading-relaxed" style={{ color: MID_GREY }}>
                  A fast-growing SEO education brand looking to build domain authority through earned media.
                  SEO Mandarin needed high-authority backlinks to strengthen its position in a competitive niche.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: MID_GREY }}>The Result</p>
                <p className="leading-relaxed" style={{ color: MID_GREY }}>
                  Secured earned backlinks in multiple high-authority publications including national news outlets.
                  Campaign delivered measurable improvements to domain authority and organic search visibility within the first 60 days.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {[
                { label: 'High-Authority Publications', value: 'Multiple' },
                { label: 'Links Delivered', value: '10–12' },
                { label: 'Link Guarantee Met', value: '100%' },
              ].map((s) => (
                <div key={s.label} className="bg-[#F1F5F9] border border-[#0A0F1E]/8 rounded-xl px-6 py-4 text-center">
                  <p className="text-2xl font-black" style={{ color: MIDNIGHT }}>{s.value}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: MID_GREY }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a href="https://seomandarin.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: INDIGO }}>
                View Website <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="bg-[#0A0F1E] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
          Start Digital PR with Ranking Atlas
        </h2>
        <p className="text-xl mb-10 max-w-xl mx-auto" style={{ color: MID_GREY }}>
          $3.5K per campaign. Minimum 8 links guaranteed. No long-term contracts.
        </p>
        <a href="#contact"
          className="inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-xl text-base transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: INDIGO }}
          onMouseEnter={e => { e.currentTarget.style.background = INDIGO_DK; e.currentTarget.style.boxShadow = '0 0 20px 4px rgba(245,197,24,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.background = INDIGO; e.currentTarget.style.boxShadow = 'none' }}>
          Launch a Campaign – $3.5K
          <ChevronRight size={18} />
        </a>
      </div>
    </section>
  )
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', website: '', message: '' })
  const [status, setStatus] = useState(null)

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojkolng'
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _replyto: 'contact@ranking-atlas.com' }),
      })
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', website: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputClass = `w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors`
  const inputStyle = { borderColor: `${MIDNIGHT}22`, color: MIDNIGHT }

  return (
    <section id="contact" className="bg-[#F8FAFC] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: MIDNIGHT }}>Start Your First Campaign</h2>
            <p className="text-xl" style={{ color: MID_GREY }}>
              No commitment required. Tell us about your brand and we'll put together a campaign proposal within one business day.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#0A0F1E]/8 shadow-md p-8 lg:p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-1.5" style={{ color: MIDNIGHT }}>
                  Name <span style={{ color: INDIGO }}>*</span>
                </label>
                <input id="name" name="name" type="text" required
                  value={form.name} onChange={handleChange} placeholder="Jane Smith"
                  className={inputClass} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = INDIGO; e.target.style.boxShadow = `0 0 0 3px ${INDIGO}22` }}
                  onBlur={e => { e.target.style.borderColor = `${MIDNIGHT}22`; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1.5" style={{ color: MIDNIGHT }}>
                  Email <span style={{ color: INDIGO }}>*</span>
                </label>
                <input id="email" name="email" type="text" required
                  value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className={inputClass} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = INDIGO; e.target.style.boxShadow = `0 0 0 3px ${INDIGO}22` }}
                  onBlur={e => { e.target.style.borderColor = `${MIDNIGHT}22`; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-semibold mb-1.5" style={{ color: MIDNIGHT }}>Website <span style={{ color: INDIGO }}>*</span></label>
              <input id="website" name="website" type="text" required
                value={form.website} onChange={handleChange} placeholder="https://yourwebsite.com"
                className={inputClass} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = INDIGO; e.target.style.boxShadow = `0 0 0 3px ${INDIGO}22` }}
                onBlur={e => { e.target.style.borderColor = `${MIDNIGHT}22`; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1.5" style={{ color: MIDNIGHT }}>
                Message <span style={{ color: INDIGO }}>*</span>
              </label>
              <textarea id="message" name="message" required rows={5}
                value={form.message} onChange={handleChange}
                placeholder="Tell us about your goals and what you'd like to achieve with Digital PR..."
                className={`${inputClass} resize-none`} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = INDIGO; e.target.style.boxShadow = `0 0 0 3px ${INDIGO}22` }}
                onBlur={e => { e.target.style.borderColor = `${MIDNIGHT}22`; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                <CheckCircle size={16} /> Message sent! We'll be in touch within one business day.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                Something went wrong. Please email{' '}
                <a href="mailto:contact@ranking-atlas.com" className="underline font-medium">contact@ranking-atlas.com</a>
              </div>
            )}

            {/* What happens next */}
            <div className="pt-2 pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: MID_GREY }}>What happens next</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: '1', title: 'You Apply',          desc: 'Fill in the form with your brand details and goals.' },
                  { n: '2', title: 'We Review',           desc: 'We assess your site, niche, and link profile to plan your campaign.' },
                  { n: '3', title: 'You Get a Proposal',  desc: 'We send a tailored campaign proposal within one business day. No obligation.' },
                ].map(step => (
                  <div key={step.n} className="flex flex-col gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: INDIGO }}>
                      {step.n}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: MIDNIGHT }}>{step.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: MID_GREY }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance line */}
            <p className="text-center text-xs" style={{ color: MID_GREY }}>
              No retainers. No long-term commitments. Just results.
            </p>

            {/* Send button — centred, max 300px */}
            <div className="flex justify-center">
              <button type="submit" disabled={status === 'sending'}
                className="text-white font-bold py-4 px-10 rounded-xl text-base transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: INDIGO, width: '100%', maxWidth: '300px' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = INDIGO_DK; e.currentTarget.style.boxShadow = '0 0 20px 4px rgba(245,197,24,0.35)' } }}
                onMouseLeave={e => { e.currentTarget.style.background = INDIGO; e.currentTarget.style.boxShadow = 'none' }}>
                {status === 'sending' ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Mail size={18} /> Send Message</>
                )}
              </button>
            </div>
          </form>

          {/* Direct email line */}
          <p className="text-center text-sm mt-6" style={{ color: MID_GREY }}>
            Prefer to reach out directly? Email us at{' '}
            <a href="mailto:contact@ranking-atlas.com"
              className="font-medium transition-colors"
              style={{ color: INDIGO }}
              onMouseEnter={e => e.currentTarget.style.color = INDIGO_DK}
              onMouseLeave={e => e.currentTarget.style.color = INDIGO}>
              contact@ranking-atlas.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const navLinks = [
    { label: 'Home',       href: '#home' },
    { label: 'Services',   href: '#services' },
    { label: 'Case Study', href: '#case-study' },
    { label: 'Contact',    href: '#contact' },
  ]

  return (
    <footer className="bg-[#0A0F1E] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <a href="#home" className="flex items-center gap-2.5 mb-4">
              <LogoIcon size={32} />
              <span className="text-white font-bold text-xl tracking-tight">Ranking Atlas</span>
            </a>
            <p className="text-sm leading-relaxed" style={{ color: MID_GREY }}>
              A results-focused digital PR agency securing high-authority backlinks through earned media placements.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Navigation</h4>
            <nav className="space-y-3">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href}
                  className="block text-sm transition-colors duration-200"
                  style={{ color: MID_GREY }}
                  onMouseEnter={e => e.currentTarget.style.color = INDIGO}
                  onMouseLeave={e => e.currentTarget.style.color = MID_GREY}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <div className="space-y-4">
              <a href="mailto:contact@ranking-atlas.com"
                className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                style={{ color: MID_GREY }}
                onMouseEnter={e => e.currentTarget.style.color = INDIGO}
                onMouseLeave={e => e.currentTarget.style.color = MID_GREY}>
                <Mail size={16} color={INDIGO} className="shrink-0" />
                contact@ranking-atlas.com
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                style={{ color: MID_GREY }}
                onMouseEnter={e => e.currentTarget.style.color = INDIGO}
                onMouseLeave={e => e.currentTarget.style.color = MID_GREY}>
                <Linkedin size={16} color={INDIGO} className="shrink-0" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: MID_GREY }}>© 2026 Ranking Atlas. All rights reserved.</p>
          <p className="text-xs" style={{ color: `${MID_GREY}88` }}>ranking-atlas.com</p>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <PublicationsBar />
      <Services />
      <Guarantees />
      <CaseStudy />
      <CTASection />
      <Contact />
      <Footer />
    </div>
  )
}






