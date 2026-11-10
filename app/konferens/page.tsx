import SiteHeader from "../components/SiteHeader";
import { client } from "../../sanity/lib/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type SanityImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type SiteImages = {
  conferenceHeroImage?: SanityImage;
  conferenceRoomImage?: SanityImage;
  conferenceDiningImage?: SanityImage;
  conferenceLoungeImage?: SanityImage;
  lunchHeroImage?: SanityImage;
};


type SiteSettings = {
  phoneDisplay?: string;
  phoneHref?: string;
  email?: string;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  openingHoursText?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  mainCtaLabel?: string;
  conferenceCtaLabel?: string;
  conferenceSubject?: string;
};

const SITE_IMAGES_QUERY = `
  *[_type == "siteImages"]
  | order(_updatedAt desc)[0] {
    conferenceHeroImage {
      alt,
      asset-> {
        url
      }
    },

    conferenceRoomImage {
      alt,
      asset-> {
        url
      }
    },

    conferenceDiningImage {
      alt,
      asset-> {
        url
      }
    },

    conferenceLoungeImage {
      alt,
      asset-> {
        url
      }
    },

    lunchHeroImage {
      alt,
      asset-> {
        url
      }
    }
  }
`;


const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"]
  | order(_updatedAt desc)[0] {
    phoneDisplay,
    phoneHref,
    email,
    locationName,
    addressLine1,
    addressLine2,
    openingHoursText,
    instagramUrl,
    facebookUrl,
    mainCtaLabel,
    conferenceCtaLabel,
    conferenceSubject
  }
`;


function clean(value?: string) {
  return value?.trim() || "";
}

const layouts = [
  {
    number: "60",
    title: "Biosittning",
  },
  {
    number: "32",
    title: "Skolsittning",
  },
  {
    number: "32",
    title: "Öar",
  },
];

const dayParts = [
  {
    label: "Morgon",
    title: "En bra start",
    text: "Börja dagen med kaffe, frukost eller fika innan mötet drar igång.",
  },
  {
    label: "Mitt på dagen",
    title: "Lunch från Å",
    text: "Ta paus tillsammans och låt köket stå för en vällagad lunch.",
  },
  {
    label: "Eftermiddag",
    title: "Fika och fortsatt fokus",
    text: "Kaffe och fika kan ordnas när det behövs under konferensdagen.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute: "Konferens i Åkersberga | Restaurang Å",
  },
  description:
    "Boka konferens i Åkersberga på Restaurang Å vid Åkersberga Golfklubb. Konferenslokal för upp till 60 personer med fika, lunch, mat och personlig service.",
  alternates: {
    canonical: "/konferens",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/konferens",
    siteName: "Restaurang Å",
    title: "Konferens i Åkersberga | Restaurang Å",
    description:
      "Konferenslokal, fika och mat vid Åkersberga Golfklubb för upp till 60 personer.",
    images: [
      {
        url: "/images/restaurang-a/conference-room.jpg",
        width: 1200,
        height: 630,
        alt: "Konferenslokal på Restaurang Å i Åkersberga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Konferens i Åkersberga | Restaurang Å",
    description:
      "Konferenslokal, fika och mat vid Åkersberga Golfklubb för upp till 60 personer.",
    images: ["/images/restaurang-a/conference-room.jpg"],
  },
};

export default async function ConferencePage() {
  let siteImages: SiteImages | null = null;
  let siteSettings: SiteSettings | null = null;

  try {
    const freshClient = client.withConfig({
      useCdn: false,
    });

    [siteImages, siteSettings] = await Promise.all([
      freshClient.fetch<SiteImages | null>(
        SITE_IMAGES_QUERY,
        {},
        {
          cache: "no-store",
        }
      ),

      freshClient.fetch<SiteSettings | null>(
        SITE_SETTINGS_QUERY,
        {},
        {
          cache: "no-store",
        }
      ),
    ]);
  } catch (error) {
    console.error(
      "Kunde inte hämta konferensbilder från Sanity:",
      error
    );
  }

  /*
   * Fallback-system:
   *
   * Om restaurangen inte har laddat upp en bild i Sanity
   * används de befintliga lokala bilderna automatiskt.
   */

  const heroImage =
    siteImages?.conferenceHeroImage?.asset?.url ||
    siteImages?.conferenceRoomImage?.asset?.url ||
    "/images/restaurang-a/conference-dining.jpg";

  const heroAlt =
    siteImages?.conferenceHeroImage?.alt ||
    siteImages?.conferenceRoomImage?.alt ||
    "Konferens och företagsevent på Restaurang Å vid Åkersberga Golfklubb";

  const roomImage =
    siteImages?.conferenceRoomImage?.asset?.url ||
    "/images/restaurang-a/conference-room.jpg";

  const roomAlt =
    siteImages?.conferenceRoomImage?.alt ||
    "Konferenslokal på Åkersberga Golfklubb";

  const loungeImage =
    siteImages?.conferenceLoungeImage?.asset?.url ||
    "/images/restaurang-a/conference-lounge.jpg";

  const loungeAlt =
    siteImages?.conferenceLoungeImage?.alt ||
    "Lounge och samlingsyta på Restaurang Å";

  const foodImage =
    siteImages?.lunchHeroImage?.asset?.url ||
    "/images/restaurang-a/lunch.jpg";

  const foodAlt =
    siteImages?.lunchHeroImage?.alt ||
    "Mat och lunch från Restaurang Å";

  const phoneDisplay =
    clean(siteSettings?.phoneDisplay) || "079-324 00 21";

  const phoneHref =
    clean(siteSettings?.phoneHref) || "+46793240021";

  const email =
    clean(siteSettings?.email) || "boka@restauranga.se";

  const locationName =
    clean(siteSettings?.locationName) || "Åkersberga Golfklubb";

  const addressLine1 =
    clean(siteSettings?.addressLine1) || "Bränsle gård 1";

  const addressLine2 =
    clean(siteSettings?.addressLine2) || "184 33 Åkersberga";

  const mainCtaLabel =
    clean(siteSettings?.mainCtaLabel) || "Ring & boka";

  const conferenceCtaLabel =
    clean(siteSettings?.conferenceCtaLabel) || "Skicka förfrågan";

  const conferenceSubject =
    clean(siteSettings?.conferenceSubject) || "Konferensförfrågan";

  const cleanPhoneHref = phoneHref.replace(/[^+\d]/g, "");

  const conferenceInquiryHref = "/forfragan?typ=konferens";
  const generalInquiryHref = "/forfragan?typ=kontakt";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Restaurang Å",
        item: "https://restauranga.se",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Konferens i Åkersberga",
        item: "https://restauranga.se/konferens",
      },
    ],
  };

  return (
    <main className="bg-[#F8F6F2] text-[#222222]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* HEADER */}
      <SiteHeader
        active="conference"
        conferenceCta
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        email={email}
        mainCtaLabel={mainCtaLabel}
        conferenceCtaLabel={conferenceCtaLabel}
        conferenceSubject={conferenceSubject}
      />

      {/* HERO */}
      <section className="relative flex min-h-[82vh] items-end overflow-hidden bg-[#1E2721]">
        <img
          src={heroImage}
          alt={heroAlt}
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] md:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/54 to-black/28" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-40 md:px-10 lg:px-16 lg:pb-24">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              {locationName}
            </p>

            <h1 className="serif mt-6 text-[3.8rem] font-medium leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[7rem]">
              Konferens
              <br />
              på Å.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/85">
              Möten med mat, fokus och lugna omgivningar. Restaurang Å hjälper
              er med lokal, fika, lunch och upplägg för hela dagen.
            </p>

            <a
              href={conferenceInquiryHref}
              className="mt-10 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#1E2721] transition hover:-translate-y-0.5 hover:bg-[#F2EBDD]"
            >
              {conferenceCtaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Konferens på Å
            </p>

            <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              Allt ni behöver för en bra mötesdag.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-lg leading-9 text-[#66635F]">
              Hos Restaurang Å kombineras konferenslokal med mat, fika och
              personlig service. Lokalen kan anpassas efter grupp och upplägg,
              från mindre möten till större konferenser.
            </p>

            <p className="mt-6 text-lg leading-9 text-[#66635F]">
              Ni kan lägga fokus på mötet medan vi hjälper till med det runt
              omkring.
            </p>
          </div>
        </div>
      </section>

      {/* CAPACITY */}
      <section className="bg-[#1E2721] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] bg-white/15 md:grid-cols-3">
            {layouts.map((layout) => (
              <div
                key={layout.title}
                className="bg-[#263229] px-8 py-12 md:px-10"
              >
                <p className="serif text-6xl text-white">
                  {layout.number}
                </p>

                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-white/60">
                  {layout.title}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl leading-7 text-white/65">
            Andra möbleringar kan också ordnas, exempelvis styrelsesittning,
            U-sittning och cirkelformation.
          </p>
        </div>
      </section>

      {/* CONFERENCE SPACES */}
      <section className="bg-[#F8F6F2] px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
                Lokaler och miljö
              </p>

              <h2 className="serif mt-5 max-w-2xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                Från mötesrum till gemensam måltid.
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-8 text-[#66635F] md:text-lg">
              Konferensdagen behöver inte stanna i ett och samma rum. Här finns
              plats för mötet, pausen och måltiden, med golfklubbens lugna
              omgivningar precis utanför.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[1.75rem] bg-[#EDE8E0]">
              <img
                src={roomImage}
                alt={roomAlt}
                className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-[1.75rem] bg-[#EDE8E0] lg:mt-16">
              <img
                src={loungeImage}
                alt={loungeAlt}
                className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONFERENCE DAY */}
      <section className="px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
            En dag på Å
          </p>

          <h2 className="serif mt-5 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
            Från första kaffet till sista punkten på agendan.
          </h2>

          <div className="mt-16 grid border-t border-[#D8D1C7] md:grid-cols-3">
            {dayParts.map((part) => (
              <article
                key={part.label}
                className="border-b border-[#D8D1C7] py-10 md:px-8 md:first:pl-0 md:last:pr-0"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C7B4F]">
                  {part.label}
                </p>

                <h3 className="serif mt-5 text-3xl">
                  {part.title}
                </h3>

                <p className="mt-5 max-w-sm leading-7 text-[#66635F]">
                  {part.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOD */}
      <section className="overflow-hidden bg-[#EDE8E0]">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[500px] lg:min-h-[680px]">
            <img
              src={foodImage}
              alt={foodAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center px-6 py-24 md:px-10 lg:px-16 lg:py-28">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                Mat & fika
              </p>

              <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                Bra möten behöver bra pauser.
              </h2>

              <p className="mt-8 text-lg leading-8 text-[#66635F]">
                Restaurang Å finns på plats under hela konferensdagen och kan
                ordna frukost, fika, lunch och andra måltider efter gruppens
                behov.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENVIRONMENT */}
      <section className="bg-[#263229] px-6 py-24 text-white md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
              Omgivningen
            </p>

            <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              Utanför mötesrummet väntar golfbanan.
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-2xl text-lg leading-9 text-white/70">
              Åkersberga Golfklubb ger konferensen en miljö som känns långt
              från ett vanligt kontor. Här finns gröna omgivningar, lugn och
              möjlighet att byta miljö mellan dagens möten.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1440px] rounded-[2rem] bg-[#EDE8E0] px-7 py-16 md:px-12 lg:px-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                Boka konferens
              </p>

              <h2 className="serif mt-5 max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                Planerar ni nästa möte?
              </h2>
            </div>

            <div className="self-end">
              <p className="max-w-lg leading-8 text-[#66635F]">
                Berätta hur många ni blir och hur dagen ska se ut, så hjälper
                vi er med lokal, mat och upplägg.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={conferenceInquiryHref}
                  className="rounded-full bg-[#263229] px-7 py-3.5 text-sm font-semibold !text-white transition hover:-translate-y-0.5 hover:bg-[#344338]"
                >
                  {conferenceCtaLabel}
                </a>

                <a
                  href={`tel:${cleanPhoneHref}`}
                  className="rounded-full border border-[#263229]/30 px-7 py-3.5 text-sm font-semibold text-[#263229] transition hover:bg-[#263229] hover:text-white"
                >
                  Ring {phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E2721] px-6 py-16 text-white md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row">
          <div>
            <p className="serif text-2xl">
              Restaurang Å
            </p>

            <p className="mt-3 text-sm leading-6 text-white/60">
              {locationName}
              <br />
              {addressLine1}
              <br />
              {addressLine2}
            </p>
          </div>

          <div className="text-sm leading-7 text-white/70">
            <a
              href={generalInquiryHref}
              className="block hover:text-white"
            >
              {email}
            </a>

            <a
              href={`tel:${cleanPhoneHref}`}
              className="block hover:text-white"
            >
              {phoneDisplay}
            </a>

            <a
              href="/"
              className="mt-4 block text-white hover:text-[#D1B78E]"
            >
              Till startsidan
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}