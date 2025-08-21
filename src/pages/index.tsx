import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LINKS, SITE } from "@/config/links";

type CampusConnectProps = {
  seo: {
    title: string;
    description: string;
    url: string;
    image: string;
  };
};

export default function CampusConnect({ seo }: CampusConnectProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:image" content={seo.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: seo.title,
              description: seo.description,
              url: seo.url,
              publisher: { "@type": "Organization", name: SITE.name },
            }),
          }}
        />
      </Head>

      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 md:px-8 py-12 md:py-20 bg-[radial-gradient(80%_80%_at_100%_0%,#ff575722_0%,transparent_60%),radial-gradient(80%_80%_at_0%_100%,#a78bfa22_0%,transparent_60%)]">
          <div className="mx-auto max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-black leading-tight">
                Be the Face of Tech in Your College 🚀
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join The Boring Education&apos;s Campus Connect & DevRel Program — Build, Lead, and Learn.
              </p>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
                <Link
                  href={LINKS.joinDevRelAdvocate}
                  target="_blank"
                  className="bg-[#ff5757] hover:bg-[#ff6b6b] text-white px-6 py-3 rounded-xl shadow-lg shadow-[#ff5757]/25 text-base font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
                >
                  Apply Now
                </Link>
                <Link
                  href={LINKS.viewSessionDetails}
                  target="_blank"
                  className="button-text underline text-black hover:text-black/60 text-center transition-colors duration-300"
                >
                  View Program Details
                </Link>
              </div>
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-4 text-black/60 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Open across colleges in India
                </span>
                <span className="opacity-40 hidden sm:block">•</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                  Limited Seats
                </span>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur-xl p-4 md:p-6 shadow-xl">
                <Image src="/globe.svg" alt="Campus tech vibes" width={800} height={450} className="rounded-xl w-full h-auto" />
                <div className="absolute -bottom-3 -right-3 bg-[#ff5757] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  🎯 Join Now
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="px-4 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
                About the Program
              </h2>
              <p className="text-black/60 mt-2">We are hiring DevRels across colleges in India</p>
            </div>
            <p className="text-black/70 text-base leading-relaxed max-w-3xl">
              As a Campus DevRel, you will build a tech and learning community on your campus, host events and workshops, collaborate on hackathons, and learn directly from our mentors. Become a leader who drives innovation and community building at your college.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mt-8">
              {[{
                title: "Build Community",
                desc: "Lead a tech-first community at your campus",
                icon: "👥",
              }, {
                title: "Host Events",
                desc: "Workshops, meetups, hackathons",
                icon: "🎪",
              }, {
                title: "Learn from Mentors",
                desc: "Industry guidance and feedback",
                icon: "🎓",
              }, {
                title: "Grow Your Brand",
                desc: "Certificates, badges, and visibility",
                icon: "⭐",
              }].map((item) => (
                <div key={item.title} className="rounded-xl border border-black/10 p-4 lg:p-5 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-black/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hiring Process</h2>
              <p className="text-black/60 mt-2">A simple and fast selection process</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {[{
                step: "01",
                title: "Apply Online",
                desc: "Submit your application form with portfolio",
                icon: "📝",
              }, {
                step: "02",
                title: "Short Interview",
                desc: "Quick conversation with our team",
                icon: "🎯",
              }, {
                step: "03",
                title: "Onboarding & Training",
                desc: "Kickstart with resources and guidance",
                icon: "🚀",
              }, {
                step: "04",
                title: "Start Building",
                desc: "Lead your campus community",
                icon: "🏗️",
              }].map((s, idx) => (
                <div key={s.step} className="relative text-center">
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 -translate-y-1/2" />
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center font-bold text-indigo-600 shadow-lg text-lg mx-auto mb-4">
                      {s.step}
                    </div>
                    <div className="text-xl mb-3">{s.icon}</div>
                    <h3 className="text-base font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Journey */}
        <section className="px-4 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Learning Journey</h2>
              <p className="text-black/60 mt-2">Grow from fundamentals to leadership</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 mt-8">
              {[{
                title: "DevRel Fundamentals",
                icon: "🎯",
                color: "from-blue-500 to-indigo-600",
              }, {
                title: "Event Planning & Community Building",
                icon: "🏗️",
                color: "from-indigo-500 to-purple-600",
              }, {
                title: "Hands-on Projects with TBE",
                icon: "⚡",
                color: "from-purple-500 to-pink-600",
              }, {
                title: "Networking & Leadership Growth",
                icon: "🌟",
                color: "from-pink-500 to-red-600",
              }, {
                title: "Graduation & Certification",
                icon: "🎓",
                color: "from-red-500 to-orange-600",
              }].map((item, idx) => (
                <div key={item.title} className="rounded-xl border border-black/10 bg-white p-3 lg:p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group min-w-0">
                  <div className="text-center">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-lg lg:text-xl text-white mb-3 mx-auto`}>
                      {item.icon}
                    </div>
                    <div className="text-xs text-black/60 mb-2 font-medium">Stage {idx + 1}</div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-1.5 rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${(idx + 1) * 20}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section id="perks" className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Perks & Rewards</h2>
              <p className="text-black/60 mt-2">Grow faster with exclusive benefits</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[{
                perk: "Free mentorship from industry experts",
                icon: "👨‍🏫",
                color: "from-blue-500 to-indigo-600",
              }, {
                perk: "TBE Swag & Merchandise",
                icon: "🎁",
                color: "from-indigo-500 to-purple-600",
              }, {
                perk: "Certificates & LinkedIn Badges",
                icon: "🏆",
                color: "from-purple-500 to-pink-600",
              }, {
                perk: "Priority Access to TBE Internships",
                icon: "💼",
                color: "from-pink-500 to-red-600",
              }, {
                perk: "Event hosting budget",
                icon: "💰",
                color: "from-red-500 to-orange-600",
              }, {
                perk: "Networking with top founders & engineers",
                icon: "🤝",
                color: "from-orange-500 to-yellow-600",
              }].map((item) => (
                <div key={item.perk} className="rounded-xl border border-black/10 bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-lg text-white flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-black text-base leading-relaxed font-medium">{item.perk}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 md:px-8 py-20 md:py-28 bg-gradient-to-br from-[#ff5757] to-[#ff6b6b] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="mx-auto max-w-6xl relative z-10 text-center">
            <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
              Ready to Lead Your Campus Tech Community? 🚀
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of students who are already building the future of tech education. Don&apos;t miss this opportunity to grow, learn, and make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={LINKS.joinDevRelAdvocate}
                target="_blank"
                className="bg-white text-[#ff5757] hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl text-lg font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
              >
                Apply Now - Limited Time!
              </Link>
              <Link
                href={LINKS.viewSessionDetails}
                target="_blank"
                className="text-white underline hover:text-gray-200 transition-colors duration-300 text-lg"
              >
                Learn More About the Program
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Applications Open
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Rolling Admissions
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Start Anytime
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const title = "Campus Connect – The Boring DevRels";
  const description =
    "Join The Boring Education&apos;s Campus Connect & DevRel Program — build communities, host events, and learn from mentors. Open across colleges in India.";
  const url = `${SITE.baseUrl}/campus-connect`;
  const image = `${SITE.baseUrl}/file.svg`;

  return {
    props: {
      seo: { title, description, url, image },
    },
  };
}

