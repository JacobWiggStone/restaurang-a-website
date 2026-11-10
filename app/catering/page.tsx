import SiteHeader from "../components/SiteHeader";
import { client } from "../../sanity/lib/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type SiteImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type SiteImages = {
  cateringImage?: SiteImage;
  atmosphereImage?: SiteImage;
  teamImage?: SiteImage;
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
    cateringImage {
      alt,
      asset-> {
        url
      }
    },

    atmosphereImage {
      alt,
      asset-> {
        url
      }
    },

    teamImage {
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

export const metadata: Metadata = {
  title: "Catering i Stockholm, Åkersberga & Österåker",

  description:
    "Catering från Restaurang Å för företag, fester, bröllop, minnesstunder och andra tillfällen i hela Stockholm. Restaurangen ligger vid Åkersberga Golfklubb i Österåker.",

  alternates: {
    canonical: "/catering",
  },

  openGraph: {
    type: "website",
    url: "/catering",
    title: "Catering i Stockholm | Restaurang Å",
    description:
      "Catering för företag, privata fester, bröllop och andra tillfällen i hela Stockholm från Restaurang Å i Åkersberga.",
    images: [
      {
        url: "/images/restaurang-a/catering.jpg",
        width: 1200,
        height: 630,
        alt: "Catering från Restaurang Å i Stockholm",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Catering i Stockholm | Restaurang Å",
    description:
      "Catering för företag, fester och andra tillfällen i hela Stockholm från Restaurang Å.",
    images: ["/images/restaurang-a/catering.jpg"],
  },
};

const occasions = [
  {
    number: "01",
    title: "Företag",
    text: "Luncher, möten, konferenser och företagsevent där maten ska vara enkel att beställa och uppskattad av gästerna.",
  },
  {
    number: "02",
    title: "Fester",
    text: "Födelsedagar, jubileum och andra tillfällen där ni vill kunna fokusera på gästerna och låta oss ta hand om maten.",
  },
  {
    number: "03",
    title: "Bröllop",
    text: "Mat för bröllopsmiddag och firande, anpassad efter sällskap, önskemål och hur ni vill att dagen ska kännas.",
  },
  {
    number: "04",
    title: "Minnesstunder",
    text: "Ett personligt och omtänksamt upplägg för minnesstunder, kyrkkaffe och måltider tillsammans med familj och vänner.",
  },
];

const process = [
  {
    label: "01",
    title: "Berätta om tillfället",
    text: "Skicka några rader om datum, antal gäster och vilken typ av tillställning ni planerar.",
  },
  {
    label: "02",
    title: "Vi föreslår ett upplägg",
    text: "Vi hjälper till att hitta ett upplägg som passar sällskapet, tillfället och era önskemål.",
  },
  {
    label: "03",
    title: "Maten ordnas",
    text: "När detaljerna är klara tar vi hand om maten så att ni kan lägga tiden på resten.",
  },
];

export default async function CateringPage() {
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
      "Kunde inte hämta cateringdata från Sanity:",
      error
    );
  }

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

  const cateringInquiryHref = "/forfragan?typ=catering";
  const generalInquiryHref = "/forfragan?typ=kontakt";

  const cateringImage = {
    src:
      siteImages?.cateringImage?.asset?.url ||
      "/images/restaurang-a/catering.jpg",
    alt:
      clean(siteImages?.cateringImage?.alt) ||
      "Catering från Restaurang Å i Stockholm",
  };

  const atmosphereImage = {
    src:
      siteImages?.atmosphereImage?.asset?.url ||
      "/images/restaurang-a/atmosphere.jpg",
    alt:
      clean(siteImages?.atmosphereImage?.alt) ||
      "Mat från Restaurang Å",
  };

  const teamImage = {
    src:
      siteImages?.teamImage?.asset?.url ||
      "/images/restaurang-a/team.jpg",
    alt:
      clean(siteImages?.teamImage?.alt) ||
      "Teamet på Restaurang Å",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Catering från Restaurang Å",
    serviceType: "Catering",
    url: "https://restauranga.se/catering",
    description:
      "Catering för företag, fester, bröllop, minnesstunder och andra tillfällen i Stockholm.",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Stockholms län",
    },
    provider: {
      "@type": "Restaurant",
      name: "Restaurang Å",
      url: "https://restauranga.se",
      telephone: cleanPhoneHref,
      email,
      address: {
        "@type": "PostalAddress",
        streetAddress: addressLine1,
        postalCode: "184 33",
        addressLocality: "Åkersberga",
        addressRegion: "Stockholms län",
        addressCountry: "SE",
      },
    },
  };

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
        name: "Catering",
        item: "https://restauranga.se/catering",
      },
    ],
  };

  return (
    <main className="bg-[#F8F6F2] text-[#222222]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <SiteHeader
        active="catering"
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
          src={cateringImage.src}
          alt={cateringImage.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/56 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
            Restaurang Å · Stockholm
          </p>

          <h1 className="serif mt-6 max-w-5xl text-[3.8rem] font-medium leading-[0.88] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[7rem]">
            Catering för
            <br />
            tillfällen som räknas.
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            Mat från Restaurang Å för företag, fester,
            bröllop och andra tillfällen i hela Stockholm.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={cateringInquiryHref}
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#1E2721] transition hover:-translate-y-0.5 hover:bg-[#F2EBDD]"
            >
              Fråga om catering
            </a>

            <a
              href={`tel:${cleanPhoneHref}`}
              className="rounded-full border border-white/70 bg-black/35 px-7 py-3.5 text-sm font-semibold !text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:!text-[#1E2721]"
            >
              Ring {phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Catering från Å
            </p>

            <h2 className="serif mt-5 max-w-2xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
              Bra mat, där ni vill samlas.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-lg leading-9 text-[#66635F]">
              Restaurang Å erbjuder catering för både företag och privata
              sällskap i hela Stockholm. Från vår restaurang i Åkersberga
              hjälper vi kunder i Österåker och resten av Stockholmsområdet
              med mat för allt från mindre sammankomster till större
              tillställningar. Upplägget anpassas efter tillfället,
              antalet gäster och era önskemål.
            </p>

            <p className="mt-6 text-lg leading-9 text-[#66635F]">
              Hör av er med era önskemål så hjälper vi till att
              hitta ett upplägg som passar.
            </p>
          </div>
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="bg-[#263229] px-6 py-24 text-white md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
            För små och stora tillfällen
          </p>

          <div className="mt-5 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="serif max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
              Från arbetsdagen till den stora dagen.
            </h2>

            <p className="max-w-xl self-end text-lg leading-8 text-white/70">
              Catering behöver inte vara komplicerat. Vi
              hjälper till med maten och anpassar upplägget
              efter gästerna och tillfället.
            </p>
          </div>

          <div className="mt-16 grid border-t border-white/15 md:grid-cols-2">
            {occasions.map((occasion, index) => (
              <article
                key={occasion.title}
                className={`border-b border-white/15 py-10 md:p-10 ${
                  index % 2 === 0 ? "md:border-r" : ""
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D1B78E]">
                  {occasion.number}
                </p>

                <h3 className="serif mt-5 text-4xl font-medium">
                  {occasion.title}
                </h3>

                <p className="mt-5 max-w-lg leading-7 text-white/65">
                  {occasion.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE */}
      <section className="overflow-hidden bg-[#EDE8E0]">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[520px] lg:min-h-[720px]">
            <img
              src={atmosphereImage.src}
              alt={atmosphereImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center px-6 py-24 md:px-10 lg:px-16 lg:py-32">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                Maten i centrum
              </p>

              <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                Samma känsla,
                <br />
                en annan plats.
              </h2>

              <p className="mt-8 text-lg leading-8 text-[#66635F]">
                Catering från Å bygger på samma tanke som maten
                på restaurangen: vällagat, generöst och
                personligt. Skillnaden är bara var den serveras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
                Så går det till
              </p>

              <h2 className="serif mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                Enkelt från första kontakt.
              </h2>
            </div>

            <div>
              {process.map((step) => (
                <article
                  key={step.label}
                  className="grid gap-5 border-t border-[#D8D1C7] py-8 sm:grid-cols-[0.18fr_0.82fr]"
                >
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#9C7B4F]">
                    {step.label}
                  </p>

                  <div>
                    <h3 className="serif text-3xl">
                      {step.title}
                    </h3>

                    <p className="mt-4 max-w-xl leading-7 text-[#66635F]">
                      {step.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STOCKHOLM */}
      <section className="bg-[#F0EBE3] px-6 py-24 md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Stockholm
            </p>

            <h2 className="serif mt-5 max-w-2xl text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              Catering i hela Stockholm.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#66635F]">
              Restaurang Å har sin bas vid Åkersberga Golfklubb
              i Österåker och erbjuder catering till företag och
              privata sällskap i hela Stockholmsområdet.
              Kontakta oss och berätta var och när ni planerar
              ert arrangemang så hjälper vi er vidare.
            </p>

            <a
              href={cateringInquiryHref}
              className="mt-9 inline-flex rounded-full bg-[#263229] px-7 py-3.5 text-sm font-semibold !text-white transition hover:-translate-y-0.5 hover:bg-[#344338]"
            >
              Be om ett förslag
            </a>
          </div>

          <div className="overflow-hidden rounded-[1.75rem]">
            <img
              src={teamImage.src}
              alt={teamImage.alt}
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E2721] px-6 py-24 text-white md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
                Cateringförfrågan
              </p>

              <h2 className="serif mt-5 max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                Vad planerar ni?
              </h2>
            </div>

            <div className="self-end">
              <p className="max-w-lg text-lg leading-8 text-white/70">
                Berätta datum, ungefär hur många ni blir och
                vad ni har tänkt er, så återkommer vi med ett
                förslag.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={cateringInquiryHref}
                  className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold !text-[#1E2721] transition hover:-translate-y-0.5 hover:bg-[#F2EBDD]"
                >
                  Skicka cateringförfrågan
                </a>

                <a
                  href={`tel:${cleanPhoneHref}`}
                  className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold !text-white transition hover:bg-white hover:!text-[#1E2721]"
                >
                  Ring {phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#172019] px-6 py-16 text-white md:px-10 lg:px-16">
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
              className="block transition hover:text-white"
            >
              {email}
            </a>

            <a
              href={`tel:${cleanPhoneHref}`}
              className="block transition hover:text-white"
            >
              {phoneDisplay}
            </a>

            <a
              href="/"
              className="mt-4 block !text-white transition hover:!text-[#D1B78E]"
            >
              Till startsidan
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}