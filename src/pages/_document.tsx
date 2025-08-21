import { Html, Head, Main, NextScript } from "next/document";
import { SITE } from "@/config/links";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="application-name" content={SITE.name} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
