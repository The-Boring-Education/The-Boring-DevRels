import Link from "next/link";
import { LINKS } from "@/config/links";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded bg-black"></span>
            <span className="text-sm font-semibold tracking-tight">The Boring DevRels</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-black/70">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <Link href="#about" className="hover:text-black transition-colors">About</Link>
            <Link href="#process" className="hover:text-black transition-colors">Process</Link>
            <Link href="#perks" className="hover:text-black transition-colors">Perks</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href={LINKS.joinDevRelAdvocate}
              target="_blank"
              className="inline-flex items-center justify-center rounded-xl bg-[#ff5757] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#ff5757]/25 transition-transform duration-200 hover:scale-105 hover:bg-[#ff6b6b]"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

