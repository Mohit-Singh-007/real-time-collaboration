import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Link from "next/link";

export function NavbarClient() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 border-b border-[#ddd8cd] bg-[#f5f2ec]/85 backdrop-blur-md">
      <Link
        href="/"
        className="font-serif text-2xl tracking-tight text-[#0f0e0d]"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Coll<span className="text-[#c8601a] italic">ab</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/features"
          className="hidden sm:block text-sm font-medium text-[#8a8070] px-4 py-2 rounded-full hover:text-[#0f0e0d] hover:bg-[#ede9e0] transition-colors"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="hidden sm:block text-sm font-medium text-[#8a8070] px-4 py-2 rounded-full hover:text-[#0f0e0d] hover:bg-[#ede9e0] transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium px-5 py-2 rounded-full bg-[#0f0e0d] text-[#f5f2ec] hover:bg-[#c8601a] transition-colors duration-200 hover:-translate-y-px"
        >
          Get started
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
