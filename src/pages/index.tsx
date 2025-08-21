import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LINKS, SITE } from "@/config/links";

// Section Component (following webapp pattern)
const Section = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`px-4 md:px-8 py-16 md:py-20 ${className}`}>
    {children}
  </section>
);

// FlexContainer Component (following webapp pattern)
const FlexContainer = ({
  children,
  direction = "row",
  itemCenter = false,
  justifyCenter = true,
  className = "",
  wrap = true
}: {
  children: React.ReactNode;
  direction?: "row" | "col";
  itemCenter?: boolean;
  justifyCenter?: boolean;
  className?: string;
  wrap?: boolean;
}) => (
  <div className={`flex ${direction === "col" ? "flex-col" : "flex-row"} ${itemCenter ? "items-center" : ""} ${justifyCenter ? "justify-center" : ""} ${wrap ? "flex-wrap" : ""} ${className}`}>
    {children}
  </div>
);

// Text Component (following webapp pattern)
const Text = ({
  level,
  children,
  className = "",
  textCenter = false
}: {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  children: React.ReactNode;
  className?: string;
  textCenter?: boolean;
}) => {
  const Tag = level;
  return (
    <Tag className={`${className} ${textCenter ? "text-center" : ""}`}>
      {children}
    </Tag>
  );
};

// SectionHeaderContainer Component (following webapp pattern)
const SectionHeaderContainer = ({
  heading,
  focusText,
  headingLevel = 2
}: {
  heading: string;
  focusText: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}) => (
  <div className="text-center mb-16">
    <Text level={`h${headingLevel}` as any} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      {heading}
    </Text>
    <Text level="p" className="text-xl text-gray-600 max-w-3xl mx-auto">
      {focusText}
    </Text>
  </div>
);

// Hero Section Component
const HeroSection = () => (
  <Section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl" />
    </div>

    <div className="max-w-6xl mx-auto relative z-10">
      <FlexContainer direction="col" itemCenter className="gap-12 lg:gap-16 lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <Text level="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Be the Face of Open-Source Tech Education in 🇮🇳
          </Text>
          <Text level="p" className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Join The Boring Education&apos;s Campus Connect & DevRel Program — Build, Lead, and Learn.
          </Text>

          <FlexContainer className="mt-8 gap-4 justify-center lg:justify-start" direction="col" wrap={false}>
            <Link
              href={LINKS.joinDevRelAdvocate}
              target="_blank"
              className="bg-[#ff5757] hover:bg-[#ff6b6b] text-white px-8 py-4 rounded-xl shadow-lg shadow-[#ff5757]/25 text-lg font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
            >
              Apply Now
            </Link>
            <Link
              href={LINKS.viewSessionDetails}
              target="_blank"
              className="text-gray-700 underline hover:text-gray-900 text-center transition-colors duration-300 text-lg"
            >
              View Program Details
            </Link>
          </FlexContainer>

          <FlexContainer className="mt-8 gap-6 justify-center lg:justify-start" itemCenter>
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              Open across colleges in India
            </span>
            <span className="opacity-40 hidden sm:block">•</span>
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              Limited Seats
            </span>
          </FlexContainer>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl p-6 shadow-2xl">
            <Image
              src={'https://ik.imagekit.io/tbe/webapp/hero-image.svg'}
              alt="Campus tech vibes"
              width={500}
              height={500}
              className="rounded-xl w-full h-auto"
            />
            <div className="absolute -bottom-3 -right-3 bg-[#ff5757] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              🎯 Join Now
            </div>
          </div>
        </div>
      </FlexContainer>
    </div>
  </Section>
);

// About Section Component
const AboutSection = () => (
  <Section id="about" className="bg-white">
    <div className="max-w-6xl mx-auto">
      <SectionHeaderContainer
        heading="About the Program"
        focusText="We are hiring DevRels across colleges in India"
      />

      <div className="mb-12">
        <Text level="p" className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto" textCenter>
          As a Campus DevRel, you will build a tech and learning community on your campus,
          host events and workshops, collaborate on hackathons, and learn directly from our mentors.
          Become a leader who drives innovation and community building at your college.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Build Community",
            desc: "Lead a tech-first community at your campus",
            icon: "👥",
          },
          {
            title: "Host Events",
            desc: "Workshops, meetups, hackathons",
            icon: "🎪",
          },
          {
            title: "Learn from Mentors",
            desc: "Industry guidance and feedback",
            icon: "🎓",
          },
          {
            title: "Grow Your Brand",
            desc: "Certificates, badges, and visibility",
            icon: "⭐",
          },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl mb-4">{item.icon}</div>
            <Text level="h3" className="text-xl font-semibold text-gray-900 mb-3">{item.title}</Text>
            <Text level="p" className="text-gray-600 leading-relaxed">{item.desc}</Text>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// Hiring Process Section Component
const HiringProcessSection = () => (
  <Section id="process" className="bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <SectionHeaderContainer
        heading="Hiring Process"
        focusText="A simple and fast selection process"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            step: "01",
            title: "Apply Online",
            desc: "Submit your application form with portfolio",
            icon: "📝",
          },
          {
            step: "02",
            title: "Short Interview",
            desc: "Quick conversation with our team",
            icon: "🎯",
          },
          {
            step: "03",
            title: "Onboarding & Training",
            desc: "Kickstart with resources and guidance",
            icon: "🚀",
          },
          {
            step: "04",
            title: "Start Building",
            desc: "Lead your campus community",
            icon: "🏗️",
          },
        ].map((s, idx) => (
          <div key={s.step} className="relative flex flex-col items-center text-center">
            {/* Arrow connector */}
            {idx < 3 && (
              <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 transform -translate-y-1/2 z-0" />
            )}

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center font-bold text-indigo-600 shadow-lg text-xl mb-6">
                {s.step}
              </div>

              <div className="text-3xl mb-4">{s.icon}</div>
              <Text level="h3" className="text-xl font-bold text-gray-900 mb-3">
                {s.title}
              </Text>
              <Text level="p" className="text-gray-600 leading-relaxed">
                {s.desc}
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile arrow indicators */}
      <div className="lg:hidden mt-8 flex justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <span>↓</span>
          <span>↓</span>
          <span>↓</span>
        </div>
      </div>
    </div>
  </Section>
);

// Learning Journey Section Component
const LearningJourneySection = () => (
  <Section className="bg-white">
    <div className="max-w-6xl mx-auto">
      <SectionHeaderContainer
        heading="Learning Journey"
        focusText="Grow from fundamentals to leadership"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            title: "DevRel Fundamentals",
            icon: "🎯",
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "Event Planning & Community Building",
            icon: "🏗️",
            color: "from-indigo-500 to-purple-600",
          },
          {
            title: "Hands-on Projects with TBE",
            icon: "⚡",
            color: "from-purple-500 to-pink-600",
          },
          {
            title: "Networking & Leadership Growth",
            icon: "🌟",
            color: "from-pink-500 to-red-600",
          },
          {
            title: "Graduation & Certification",
            icon: "🎓",
            color: "from-red-500 to-orange-600",
          },
        ].map((item, idx) => (
          <div key={item.title} className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl text-white mb-4`}>
              {item.icon}
            </div>
            <div className="text-sm text-gray-500 mb-3 font-medium">Stage {idx + 1}</div>
            <Text level="h4" className="text-sm font-semibold text-gray-900 leading-tight mb-4">
              {item.title}
            </Text>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                style={{ width: `${(idx + 1) * 20}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// Perks Section Component
const PerksSection = () => (
  <Section id="perks" className="bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <SectionHeaderContainer
        heading="Perks & Rewards"
        focusText="Grow faster with exclusive benefits"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            perk: "Free mentorship from industry experts",
            icon: "👨‍🏫",
            color: "from-blue-500 to-indigo-600",
          },
          {
            perk: "TBE Swag & Merchandise",
            icon: "🎁",
            color: "from-indigo-500 to-purple-600",
          },
          {
            perk: "Certificates & LinkedIn Badges",
            icon: "🏆",
            color: "from-purple-500 to-pink-600",
          },
          {
            perk: "Priority Access to TBE Internships",
            icon: "💼",
            color: "from-pink-500 to-red-600",
          },
          {
            perk: "Event hosting budget",
            icon: "💰",
            color: "from-red-500 to-orange-600",
          },
          {
            perk: "Networking with top founders & engineers",
            icon: "🤝",
            color: "from-orange-500 to-yellow-600",
          },
        ].map((item) => (
          <div key={item.perk} className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xl text-white flex-shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <Text level="p" className="text-gray-900 text-lg leading-relaxed font-medium">
                {item.perk}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// Call to Action Section Component
const CallToActionSection = () => (
  <Section className="bg-gradient-to-br from-[#ff5757] to-[#ff6b6b] relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
    </div>

    <div className="max-w-6xl mx-auto relative z-10 text-center">
      <Text level="h2" className="text-3xl md:text-4xl font-bold text-white mb-8">
        Ready to Lead Your Campus Tech Community? 🚀
      </Text>
      <Text level="p" className="text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
        Join hundreds of students who are already building the future of tech education.
        Don&apos;t miss this opportunity to grow, learn, and make a difference.
      </Text>

      <FlexContainer className="mb-10 gap-6 justify-center" direction="col" wrap={false}>
        <Link
          href={LINKS.joinDevRelAdvocate}
          target="_blank"
          className="bg-white text-[#ff5757] hover:bg-gray-100 px-10 py-5 rounded-2xl shadow-xl text-xl font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
        >
          Apply Now - Limited Time!
        </Link>
        <Link
          href={LINKS.viewSessionDetails}
          target="_blank"
          className="text-white underline hover:text-gray-200 transition-colors duration-300 text-xl"
        >
          Learn More About the Program
        </Link>
      </FlexContainer>

      <FlexContainer className="gap-6 justify-center" itemCenter wrap>
        <span className="flex items-center gap-2 text-white/90 text-sm">
          <span className="w-3 h-3 bg-green-400 rounded-full" />
          Applications Open
        </span>
        <span className="opacity-40">•</span>
        <span className="flex items-center gap-2 text-white/90 text-sm">
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          Rolling Admissions
        </span>
        <span className="opacity-40">•</span>
        <span className="flex items-center gap-2 text-white/90 text-sm">
          <span className="w-3 h-3 bg-blue-400 rounded-full" />
          Start Anytime
        </span>
      </FlexContainer>
    </div>
  </Section>
);

// Main Component
const CampusConnect = ({ seo }: { seo: { title: string; description: string; url: string; image: string } }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
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
        <HeroSection />
        <AboutSection />
        <HiringProcessSection />
        <LearningJourneySection />
        <PerksSection />
        <CallToActionSection />
      </main>

      <Footer />
    </div>
  );
};

export default CampusConnect;

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