"use client";

import { useEffect, useState } from "react";

type SiteHeaderProps = {
  active?:
    | "home"
    | "conference"
    | "lunch"
    | "evening"
    | "catering"
    | "events";

  conferenceCta?: boolean;

  phoneDisplay?: string;
  phoneHref?: string;
  email?: string;

  mainCtaLabel?: string;
  conferenceCtaLabel?: string;
  conferenceSubject?: string;
};

const navigation = [
  { label: "Lunch", href: "/lunch", key: "lunch" },
  { label: "Konferens", href: "/konferens", key: "conference" },
  { label: "Catering", href: "/catering", key: "catering" },
  { label: "Event", href: "/event", key: "events" },
  { label: "Kvällsmeny", href: "/kvallsmeny", key: "evening" },
  { label: "Galleri", href: "/#gallery", key: "gallery" },
  { label: "Om Å", href: "/#about", key: "about" },
  { label: "Kontakt", href: "/#contact", key: "contact" },
];

export default function SiteHeader({
  active = "home",
  conferenceCta = false,

  phoneDisplay = "079-324 00 21",
  phoneHref = "+46793240021",
  email = "boka@restauranga.se",

  mainCtaLabel = "Ring & boka",
  conferenceCtaLabel = "Skicka förfrågan",
  conferenceSubject = "Konferensförfrågan",
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const cleanPhoneHref = phoneHref.replace(/[^+\d]/g, "");

  const conferenceInquiryHref = "/forfragan?typ=konferens";
  const generalInquiryHref = "/forfragan?typ=kontakt";

  const ctaHref = conferenceCta
    ? conferenceInquiryHref
    : `tel:${cleanPhoneHref}`;

  const ctaLabel = conferenceCta
    ? conferenceCtaLabel
    : mainCtaLabel;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-[#172019]/95 shadow-[0_10px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            : "border-white/10 bg-gradient-to-b from-black/70 via-black/40 to-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between px-6 transition-all duration-500 md:px-10 lg:px-12 xl:px-16 ${
            scrolled ? "py-4" : "py-5 md:py-6"
          }`}
        >
          <a
            href="/"
            onClick={() => setMenuOpen(false)}
            className="serif relative z-50 shrink-0 text-2xl font-medium tracking-tight !text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]"
          >
            Restaurang Å
          </a>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
            {navigation.map((item) => {
              const isActive = active === item.key;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`whitespace-nowrap text-[13px] font-semibold [text-shadow:0_2px_14px_rgba(0,0,0,0.95)] transition duration-300 xl:text-sm ${
                    isActive
                      ? "!text-[#F1D9B0]"
                      : "!text-white hover:!text-[#F1D9B0]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="relative z-50 flex items-center gap-3">
            <a
              href={ctaHref}
              className="hidden rounded-full border border-white/90 bg-black/45 px-5 py-2.5 text-sm font-semibold !text-white shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:!text-[#1E2721] sm:inline-flex"
            >
              {ctaLabel}
            </a>

            <button
              type="button"
              aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-black/45 !text-white backdrop-blur-md transition hover:bg-white hover:!text-[#1E2721] lg:hidden"
            >
              <span className="sr-only">
                {menuOpen ? "Stäng meny" : "Öppna meny"}
              </span>

              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 block h-[1.5px] w-5 bg-current transition duration-300 ${
                    menuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />

                <span
                  className={`absolute left-0 top-[7px] block h-[1.5px] w-5 bg-current transition duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />

                <span
                  className={`absolute left-0 top-[14px] block h-[1.5px] w-5 bg-current transition duration-300 ${
                    menuOpen ? "translate-y-[-7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#172019] transition-all duration-500 lg:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="flex min-h-full flex-col px-6 pb-10 pt-28 md:px-10">
          <nav className="flex flex-1 flex-col justify-center py-8">
            {navigation.map((item, index) => {
              const isActive = active === item.key;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`serif border-b border-white/10 py-4 text-[2.45rem] leading-none tracking-tight transition duration-300 sm:text-5xl ${
                    isActive
                      ? "text-[#D7BF96]"
                      : "text-white hover:text-[#D7BF96]"
                  }`}
                  style={{
                    transitionDelay: menuOpen
                      ? `${70 + index * 35}ms`
                      : "0ms",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="grid gap-3 border-t border-white/15 pt-7 sm:grid-cols-2">
            <a
              href={`tel:${cleanPhoneHref}`}
              className="rounded-full bg-white px-6 py-3.5 text-center text-sm font-semibold !text-[#1E2721]"
            >
              Ring {phoneDisplay}
            </a>

            <a
              href={generalInquiryHref}
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-white/40 px-6 py-3.5 text-center text-sm font-semibold !text-white"
            >
              Kontakta restaurangen
            </a>
          </div>
        </div>
      </div>
    </>
  );
}