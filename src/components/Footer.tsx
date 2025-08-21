import { LINKS } from "@/config/links";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/80">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-black/60">© {new Date().getFullYear()} The Boring Education</p>
          <div className="flex items-center gap-4 text-sm">
            <a href={LINKS.instagram} target="_blank" className="hover:underline">Instagram</a>
            <a href={LINKS.youtube} target="_blank" className="hover:underline">YouTube</a>
            <a href={LINKS.linkedin} target="_blank" className="hover:underline">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

