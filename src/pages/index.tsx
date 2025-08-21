import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/config/links";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import HiringProcessSection from "@/components/sections/HiringProcessSection";
import LearningJourneySection from "@/components/sections/LearningJourneySection";
import PerksSection from "@/components/sections/PerksSection";
import CallToActionSection from "@/components/sections/CallToActionSection";

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