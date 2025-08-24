import { MainLayout } from "@/components";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import HiringProcessSection from "@/components/sections/HiringProcessSection";
import LearningJourneySection from "@/components/sections/LearningJourneySection";
import PerksSection from "@/components/sections/PerksSection";
import CallToActionSection from "@/components/sections/CallToActionSection";
import { GetServerSideProps } from "next";

// SEO Constants following TBE WEBAPP pattern
const SEO_CONSTANTS = {
  TITLE: "Campus Connect – The Boring DevRels",
  DESCRIPTION: "Join The Boring Education's Campus Connect & DevRel Program — build communities, host events, and learn from mentors. Open across colleges in India.",
  IMAGE_PATH: "/file.svg",
  CANONICAL_PATH: "/campus-connect",
} as const;

// Main Component
const CampusConnect = ({ seo }: { seo: { title: string; description: string; url: string; image: string } }) => {
  return (
    <MainLayout 
      title={seo.title}
      description={seo.description}
      showNavigation={true}
      seo={{
        canonicalUrl: seo.url,
        ogImage: seo.image,
        keywords: "Campus Connect, DevRel, Developer Relations, Community Building, The Boring Education, College Ambassadors, Tech Events, Student Leadership"
      }}
    >
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <HiringProcessSection />
        <LearningJourneySection />
        <PerksSection />
        <CallToActionSection />
      </main>
    </MainLayout>
  );
};

export default CampusConnect;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Get host from request headers for dynamic URL generation
    const host = context.req.headers.host || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    // Build dynamic URLs following TBE WEBAPP pattern
    const baseUrl = `${protocol}://${host}`;
    const canonicalUrl = `${baseUrl}${SEO_CONSTANTS.CANONICAL_PATH}`;
    const imageUrl = `${baseUrl}${SEO_CONSTANTS.IMAGE_PATH}`;

    // SEO data following TBE WEBAPP structure
    const seoData = {
      title: SEO_CONSTANTS.TITLE,
      description: SEO_CONSTANTS.DESCRIPTION,
      url: canonicalUrl,
      image: imageUrl,
    };

    return {
      props: {
        seo: seoData,
      },
    };
  } catch (error) {
    // Error handling following TBE WEBAPP pattern
    console.error('Error in getServerSideProps for CampusConnect:', error);
    
    // Fallback props in case of error - following TBE WEBAPP fallback pattern
    const fallbackSeo = {
      title: SEO_CONSTANTS.TITLE,
      description: SEO_CONSTANTS.DESCRIPTION,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${SEO_CONSTANTS.CANONICAL_PATH}`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${SEO_CONSTANTS.IMAGE_PATH}`,
    };

    return {
      props: {
        seo: fallbackSeo,
      },
    };
  }
}; 