import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '@/contexts/useAuth';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showNavigation?: boolean;
  seo?: {
    canonicalUrl?: string;
    ogImage?: string;
    keywords?: string;
  };
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'The Boring DevRels',
  description = 'Join The Boring Education\'s DevRel team and help build an amazing developer community.',
  showNavigation = true,
  seo = {}
}) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const pageTitle = title === 'The Boring DevRels' ? title : `${title} - The Boring DevRels`;
  const { canonicalUrl, ogImage, keywords = "DevRel, Developer Relations, Community, The Boring Education, Hiring, Jobs" } = seo;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        {/* Canonical URL */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Boring DevRels" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: pageTitle,
              description: description,
              url: canonicalUrl || router.asPath,
              publisher: {
                "@type": "Organization",
                name: "The Boring DevRels",
                url: "https://devrels.theboringeducation.com"
              },
              mainEntity: {
                "@type": "Organization",
                name: "The Boring Education",
                description: "Tech education platform empowering developers and students",
                url: "https://theboringeducation.com"
              }
            }),
          }}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        {showNavigation && (
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo and Branding */}
                <Link href="/" className="flex items-center space-x-3">
                  <div>
                    <h1 className="text-xl font-bold text-gray-700">
                      The Boring DevRels
                    </h1>
                    <p className="text-xs text-gray-700">
                      by The Boring Education
                    </p>
                  </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {router.pathname === '/' ? (
                    <>
                      <a href="#about" className="text-gray-700 hover:text-gray-700 transition-colors">
                        About
                      </a>
                      <a href="#process" className="text-gray-700 hover:text-gray-700 transition-colors">
                        Process
                      </a>
                      <a href="#perks" className="text-gray-700 hover:text-gray-700 transition-colors">
                        Why Join
                      </a>
                      <Link href="/apply" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors">
                        Apply Now
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/" className="text-gray-700 hover:text-gray-700 transition-colors">
                        Home
                      </Link>
                      {!user ? (
                        <Link href="/apply" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors">
                          Apply Now
                        </Link>
                      ) : (
                        <div className="flex items-center space-x-4">
                          {user.role && (
                            <Link href="/dashboard" className="text-gray-700 hover:text-gray-700 transition-colors">
                              Dashboard
                            </Link>
                          )}
                          <div className="flex items-center space-x-2">
                            {user.picture && (
                              <img
                                src={user.picture}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span className="text-sm text-gray-700">{user.name}</span>
                          </div>
                          <button
                            onClick={signOut}
                            className="text-sm text-gray-700 hover:text-gray-700 transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </nav>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Link href={user ? "/dashboard" : "/apply"} className="bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors">
                    {user ? "Dashboard" : "Apply"}
                  </Link>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-bold mb-3">The Boring DevRels</h3>
                <p className="text-gray-700-300 mb-4">
                  Building the future of developer education through community, content, and connections.
                </p>
                <p className="text-sm text-gray-700-400">
                  by The Boring Education
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-gray-700-300 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/apply" className="text-gray-700-300 hover:text-white transition-colors">
                      Apply Now
                    </Link>
                  </li>
                  {user && user.role && (
                    <li>
                      <Link href="/dashboard" className="text-gray-700-300 hover:text-white transition-colors">
                        Dashboard
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="font-semibold mb-3">Connect</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://www.linkedin.com/company/theboringeducation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700-300 hover:text-white transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@TheBoringEducation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700-300 hover:text-white transition-colors"
                    >
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/theboringeducation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700-300 hover:text-white transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://chat.whatsapp.com/EeB7LrPRg2p3RyMOicyIAC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700-300 hover:text-white transition-colors"
                    >
                      Community
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-700-400 text-sm">
                © 2024 The Boring Education. Building the future of developer education.
              </p>
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <a
                  href="https://theboringeducation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700-400 hover:text-white text-sm transition-colors"
                >
                  Main Website
                </a>
                <a
                  href="https://theboringeducation.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700-400 hover:text-white text-sm transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="https://theboringeducation.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700-400 hover:text-white text-sm transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainLayout;