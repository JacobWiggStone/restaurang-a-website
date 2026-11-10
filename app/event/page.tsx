import SiteHeader from "../components/SiteHeader";
import { client } from "../../sanity/lib/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type EventImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type RestaurantEvent = {
  _id: string;
  title?: string;
  date?: string;
  time?: string;
  shortDescription?: string;
  image?: EventImage;
  price?: string;
  bookingLabel?: string;
  bookingLink?: string;
  featured?: boolean;
};

type SiteImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type SiteImages = {
  atmosphereImage?: SiteImage;
  eveningHeroImage?: SiteImage;
};

type SiteSettings = {
  phoneDisplay?: string;
  phoneHref?: string;
  email?: string;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  mainCtaLabel?: string;
  conferenceCtaLabel?: string;
  conferenceSubject?: string;
};

const EVENTS_QUERY = `
  *[
    _type == "event" &&
    visible == true &&
    defined(date) &&
    date >= $today
  ]
  | order(featured desc, date asc) {
    _id,
    title,
    date,
    time,
    shortDescription,
    image {
      alt,
      asset-> {
        url
      }
    },
    price,
    bookingLabel,
    bookingLink,
    featured
  }
`;

const SITE_IMAGES_QUERY = `
  *[_type == "siteImages"]
  | order(_updatedAt desc)[0] {
    atmosphereImage {
      alt,
      asset-> {
        url
      }
    },

    eveningHeroImage {
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
    mainCtaLabel,
    conferenceCtaLabel,
    conferenceSubject
  }
`;

function clean(value?: string) {
  return value?.trim() || "";
}

function localDateString() {
  const now = new Date();

  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function formatEventDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatShortDate(date?: string) {
  if (!date) {
    return {
      day: "",
      month: "",
    };
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  const day = new Intl.DateTimeFormat("sv-SE", {
    day: "2-digit",
  }).format(parsedDate);

  const month = new Intl.DateTimeFormat("sv-SE", {
    month: "short",
  })
    .format(parsedDate)
    .replace(".", "")
    .toUpperCase();

  return {
    day,
    month,
  };
}

function bookingHref(
  bookingLink: string | undefined,
  title: string
) {
  const link = clean(bookingLink);
  const inquiryHref = `/forfragan?typ=event&event=${encodeURIComponent(title)}`;

  if (!link) {
    return inquiryHref;
  }

  if (
    link.startsWith("mailto:") ||
    link.includes("@")
  ) {
    return inquiryHref;
  }

  if (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("tel:")
  ) {
    return link;
  }

  const possiblePhone = link.replace(/[\s()-]/g, "");

  if (/^\+?\d+$/.test(possiblePhone)) {
    return `tel:${possiblePhone}`;
  }

  return link;
}

export const metadata: Metadata = {
  title: "Event i Åkersberga | Restaurang Å",

  description:
    "Upptäck kommande event på Restaurang Å vid Åkersberga Golfklubb. Middagar, After Golf, temakvällar, provningar och andra upplevelser i Åkersberga och Österåker.",

  alternates: {
    canonical: "/event",
  },

  openGraph: {
    type: "website",
    url: "/event",
    title: "Event i Åkersberga | Restaurang Å",
    description:
      "Se kommande event, temakvällar och upplevelser på Restaurang Å vid Åkersberga Golfklubb.",
    images: [
      {
        url: "/images/restaurang-a/atmosphere.jpg",
        width: 1200,
        height: 630,
        alt: "Event på Restaurang Å i Åkersberga",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Event i Åkersberga | Restaurang Å",
    description:
      "Kommande event och upplevelser på Restaurang Å vid Åkersberga Golfklubb.",
    images: ["/images/restaurang-a/atmosphere.jpg"],
  },
};

export default async function EventPage() {
  let events: RestaurantEvent[] = [];
  let siteImages: SiteImages | null = null;
  let siteSettings: SiteSettings | null = null;

  try {
    const freshClient = client.withConfig({
      useCdn: false,
    });

    [events, siteImages, siteSettings] = await Promise.all([
      freshClient.fetch<RestaurantEvent[]>(
        EVENTS_QUERY,
        {
          today: localDateString(),
        },
        {
          cache: "no-store",
        }
      ),

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
      "Kunde inte hämta event från Sanity:",
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

  const cleanPhoneHref =
    phoneHref.replace(/[^+\d]/g, "");

  const heroImage =
    siteImages?.eveningHeroImage?.asset?.url ||
    siteImages?.atmosphereImage?.asset?.url ||
    "/images/restaurang-a/atmosphere.jpg";

  const heroAlt =
    clean(siteImages?.eveningHeroImage?.alt) ||
    clean(siteImages?.atmosphereImage?.alt) ||
    "Event och kvällar på Restaurang Å";

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
        name: "Event",
        item: "https://restauranga.se/event",
      },
    ],
  };

  const eventJsonLd = events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: clean(event.title) || "Event på Restaurang Å",
    startDate: event.time
      ? `${event.date}T${
          event.time.match(/\d{1,2}:\d{2}/)?.[0] || "18:00"
        }`
      : event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    description: clean(event.shortDescription),
    image: event.image?.asset?.url
      ? [event.image.asset.url]
      : undefined,
    location: {
      "@type": "Place",
      name: "Restaurang Å",
      address: {
        "@type": "PostalAddress",
        streetAddress: addressLine1,
        postalCode: "184 33",
        addressLocality: "Åkersberga",
        addressRegion: "Stockholms län",
        addressCountry: "SE",
      },
    },
    organizer: {
      "@type": "Restaurant",
      name: "Restaurang Å",
      url: "https://restauranga.se",
      telephone: cleanPhoneHref,
      email,
    },
    url: "https://restauranga.se/event",
  }));

  return (
    <main className="bg-[#F8F6F2] text-[#222222]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {eventJsonLd.map((eventSchema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventSchema),
          }}
        />
      ))}

      <SiteHeader
        active="events"
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        email={email}
        mainCtaLabel={mainCtaLabel}
        conferenceCtaLabel={conferenceCtaLabel}
        conferenceSubject={conferenceSubject}
      />

      {/* HERO */}
      <section className="relative flex min-h-[76vh] items-end overflow-hidden bg-[#172019]">
        <img
          src={heroImage}
          alt={heroAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#E4CC9F]">
            Restaurang Å · Åkersberga
          </p>

          <h1 className="serif mt-6 max-w-5xl text-[4rem] font-medium leading-[0.88] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            Det händer
            <br />
            på Å.
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            Middagar, temakvällar, After Golf, provningar
            och andra tillfällen att samlas på Restaurang Å.
          </p>

          {events.length > 0 && (
            <a
              href="#kommande-event"
              className="mt-10 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold !text-[#1E2721] transition hover:-translate-y-0.5 hover:bg-[#F2EBDD]"
            >
              Se kommande event
            </a>
          )}
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Kalendern på Å
            </p>

            <h2 className="serif mt-5 max-w-2xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
              Mer än bara en middag.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-lg leading-9 text-[#66635F]">
              Under året händer det olika saker på Restaurang Å
              vid Åkersberga Golfklubb. Här hittar du våra
              kommande event, särskilda middagar, After Golf
              och andra kvällar värda att boka in.
            </p>

            <p className="mt-6 text-lg leading-9 text-[#66635F]">
              Nya event publiceras här löpande.
            </p>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="kommande-event"
        className="bg-[#263229] px-6 py-24 text-white md:px-10 lg:px-16 lg:py-32"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
            Kommande
          </p>

          <h2 className="serif mt-5 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
            Kommande event.
          </h2>

          {events.length === 0 ? (
            <div className="mt-16 border-t border-white/15 py-14">
              <p className="serif max-w-3xl text-3xl leading-tight text-white/90 md:text-4xl">
                Just nu finns inga nya event publicerade.
              </p>

              <p className="mt-5 max-w-xl leading-8 text-white/60">
                Håll utkik här — nya middagar, temakvällar och
                andra event läggs upp löpande.
              </p>
            </div>
          ) : (
            <div className="mt-16 space-y-8">
              {events.map((event) => {
                const title =
                  clean(event.title) || "Event på Restaurang Å";

                const dateParts =
                  formatShortDate(event.date);

                const href = bookingHref(
                  event.bookingLink,
                  title
                );

                return (
                  <article
                    key={event._id}
                    className="group overflow-hidden border-t border-white/15 pt-8"
                  >
                    <div className="grid gap-8 lg:grid-cols-[0.14fr_0.48fr_1fr] lg:gap-12">
                      <div>
                        <p className="serif text-5xl leading-none text-[#D1B78E]">
                          {dateParts.day}
                        </p>

                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                          {dateParts.month}
                        </p>
                      </div>

                      {event.image?.asset?.url ? (
                        <div className="overflow-hidden rounded-[1.25rem]">
                          <img
                            src={event.image.asset.url}
                            alt={
                              clean(event.image.alt) ||
                              title
                            }
                            className="aspect-[4/3] h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center rounded-[1.25rem] bg-white/5">
                          <span className="serif text-5xl text-white/15">
                            Å
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col justify-center py-2">
                        {event.featured && (
                          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D1B78E]">
                            Utvalt event
                          </p>
                        )}

                        <h3 className="serif text-4xl font-medium leading-tight md:text-5xl">
                          {title}
                        </h3>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
                          {event.date && (
                            <span>
                              {formatEventDate(event.date)}
                            </span>
                          )}

                          {clean(event.time) && (
                            <span>{event.time}</span>
                          )}

                          {clean(event.price) && (
                            <span>{event.price}</span>
                          )}
                        </div>

                        {clean(event.shortDescription) && (
                          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
                            {event.shortDescription}
                          </p>
                        )}

                        <div className="mt-8">
                          <a
                            href={href}
                            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold !text-[#1E2721] transition hover:-translate-y-0.5 hover:bg-[#F2EBDD]"
                          >
                            {clean(event.bookingLabel) ||
                              "Boka plats"}
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ATMOSPHERE */}
      <section className="px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="overflow-hidden rounded-[1.75rem]">
            <img
              src={
                siteImages?.atmosphereImage?.asset?.url ||
                heroImage
              }
              alt={
                clean(siteImages?.atmosphereImage?.alt) ||
                "Kväll på Restaurang Å"
              }
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              På Restaurang Å
            </p>

            <h2 className="serif mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              En anledning att stanna lite längre.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#66635F]">
              Restaurang Å ligger vid Åkersberga Golfklubb i
              Österåker. Våra event är öppna för både golfare
              och andra gäster — du behöver alltså inte spela
              golf för att komma hit.
            </p>

            <a
              href="/kvallsmeny"
              className="mt-9 inline-flex rounded-full border border-[#263229] px-7 py-3.5 text-sm font-semibold !text-[#263229] transition hover:bg-[#263229] hover:!text-white"
            >
              Se kvällsmenyn
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-[#1E2721] px-6 py-24 text-white md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
              Frågor & bokning
            </p>

            <h2 className="serif mt-5 max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
              Ses vi på nästa?
            </h2>
          </div>

          <div className="self-end">
            <p className="max-w-lg text-lg leading-8 text-white/70">
              Har du frågor om ett event eller vill veta mer?
              Hör av dig till restaurangen.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/forfragan?typ=event"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold !text-[#1E2721] transition hover:-translate-y-0.5 hover:bg-[#F2EBDD]"
              >
                Mejla oss
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
              href="/forfragan?typ=kontakt"
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