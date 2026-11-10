import SiteHeader from "./components/SiteHeader";
import { client } from "../sanity/lib/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Restaurang Å | Lunch & restaurang i Åkersberga",
  },
  description:
    "Restaurang Å vid Åkersberga Golfklubb – lunch, middag, catering, konferens och event i Åkersberga. Utsedd till Stockholms bästa lunchrestaurang 2025.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/",
    siteName: "Restaurang Å",
    title: "Restaurang Å | Lunch & restaurang i Åkersberga",
    description:
      "Lunch, middag, catering, konferens och event vid Åkersberga Golfklubb.",
    images: [
      {
        url: "/images/restaurang-a/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Restaurang Å vid Åkersberga Golfklubb i Åkersberga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurang Å | Lunch & restaurang i Åkersberga",
    description:
      "Lunch, middag, catering, konferens och event vid Åkersberga Golfklubb.",
    images: ["/images/restaurang-a/hero.jpg"],
  },
};

type DayMenu = {
  dish1?: string;
  dish2?: string;
};

type WeekendLunch = {
  dailyDish?: string;
  weekendFish?: string;
};

type WeeklyLunch = {
  year?: number;
  weekNumber?: number;

  monday?: DayMenu;
  tuesday?: DayMenu;
  wednesday?: DayMenu;
  thursday?: DayMenu;
  friday?: DayMenu;

  weeklyVegetarian?: string;

  weekendLunch?: WeekendLunch;
};

type LunchSettings = {
  weekdayPrice?: number;
  weekendDailyPrice?: number;
  weekendFishPrice?: number;
};

type EventItem = {
  _id: string;
  title?: string;
  date?: string;
  time?: string;
  shortDescription?: string;
  price?: string;
  bookingLabel?: string;
  bookingLink?: string;
  featured?: boolean;

  image?: {
    alt?: string;
    asset?: {
      url?: string;
    };
  };
};

type SiteImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type SiteImages = {
  heroImage?: SiteImage;
  atmosphereImage?: SiteImage;
  teamImage?: SiteImage;
  cateringImage?: SiteImage;
  lunchHeroImage?: SiteImage;
  conferenceHeroImage?: SiteImage;
  conferenceRoomImage?: SiteImage;
  conferenceDiningImage?: SiteImage;
  conferenceLoungeImage?: SiteImage;
  eveningHeroImage?: SiteImage;
  galleryImages?: Array<SiteImage & { _key?: string }>;
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

const services = [
  {
    title: "Konferens",
    text: "Möten och konferenser för upp till 60 personer med mat, fika och personlig service.",
    href: "/konferens",
    cta: "Se konferens",
  },
  {
    title: "Privata fester",
    text: "Födelsedagar, jubileum och andra tillfällen där mat, lokal och stämning får hänga ihop.",
    subject: "Förfrågan om privat tillställning",
    cta: "Skicka förfrågan",
  },
  {
    title: "Bröllop",
    text: "En personlig plats för bröllopsmiddag och firande nära Åkersbergas kyrkor och golfklubbens omgivningar.",
    subject: "Bröllopsförfrågan",
    cta: "Prata med oss",
  },
  {
    title: "Minnesstund",
    text: "En lugn miljö för minnesstund, kyrkkaffe och måltid tillsammans med familj och vänner.",
    subject: "Förfrågan om minnesstund",
    cta: "Kontakta oss",
  },
];

const WEEKLY_LUNCH_QUERY = `
  *[
    _type == "weeklyLunch" &&
    year == $year &&
    weekNumber == $weekNumber
  ]
  | order(_updatedAt desc)[0] {
    year,
    weekNumber,

    monday {
      dish1,
      dish2
    },

    tuesday {
      dish1,
      dish2
    },

    wednesday {
      dish1,
      dish2
    },

    thursday {
      dish1,
      dish2
    },

    friday {
      dish1,
      dish2
    },

    weeklyVegetarian,

    weekendLunch {
      dailyDish,
      weekendFish
    }
  }
`;

const LUNCH_SETTINGS_QUERY = `
  *[_type == "lunchSettings"]
  | order(_updatedAt desc)[0] {
    weekdayPrice,
    weekendDailyPrice,
    weekendFishPrice
  }
`;

const EVENTS_QUERY = `
  *[
    _type == "event" &&
    visible != false &&
    date >= $today
  ]
  | order(featured desc, date asc)[0...6] {
    _id,
    title,
    date,
    time,
    shortDescription,
    price,
    bookingLabel,
    bookingLink,
    featured,

    image {
      alt,
      asset-> {
        url
      }
    }
  }
`;

const SITE_IMAGES_QUERY = `
  *[_type == "siteImages"]
  | order(_updatedAt desc)[0] {
    heroImage {
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
    },

    cateringImage {
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
    },

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

    eveningHeroImage {
      alt,
      asset-> {
        url
      }
    },

    galleryImages[] {
      _key,
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

function getStockholmDate() {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const year = Number(
    parts.find((part) => part.type === "year")?.value
  );

  const month = Number(
    parts.find((part) => part.type === "month")?.value
  );

  const day = Number(
    parts.find((part) => part.type === "day")?.value
  );

  return {
    year,
    month,
    day,
  };
}

function getISOWeek(
  year: number,
  month: number,
  day: number
) {
  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  const dayNumber = date.getUTCDay() || 7;

  date.setUTCDate(
    date.getUTCDate() + 4 - dayNumber
  );

  const isoYear = date.getUTCFullYear();

  const yearStart = new Date(
    Date.UTC(isoYear, 0, 1)
  );

  const weekNumber = Math.ceil(
    ((date.getTime() - yearStart.getTime()) /
      86400000 +
      1) /
      7
  );

  return {
    year: isoYear,
    weekNumber,
  };
}

function getDayNumber(
  year: number,
  month: number,
  day: number
) {
  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  const jsDay = date.getUTCDay();

  return jsDay === 0 ? 7 : jsDay;
}

function getDateString(
  year: number,
  month: number,
  day: number
) {
  return `${year}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
}

function formatEventDate(date?: string) {
  if (!date) {
    return "";
  }

  const [year, month, day] = date
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Stockholm",
  }).format(
    new Date(Date.UTC(year, month - 1, day))
  );
}

export default async function Home() {
  const stockholmDate = getStockholmDate();

  const isoWeek = getISOWeek(
    stockholmDate.year,
    stockholmDate.month,
    stockholmDate.day
  );

  const dayNumber = getDayNumber(
    stockholmDate.year,
    stockholmDate.month,
    stockholmDate.day
  );

  const today = getDateString(
    stockholmDate.year,
    stockholmDate.month,
    stockholmDate.day
  );

  let weeklyLunch: WeeklyLunch | null = null;
  let lunchSettings: LunchSettings | null = null;
  let events: EventItem[] = [];
  let siteImages: SiteImages | null = null;
  let siteSettings: SiteSettings | null = null;

  try {
    const freshClient = client.withConfig({
      useCdn: false,
    });

    [weeklyLunch, lunchSettings, events, siteImages, siteSettings] =
      await Promise.all([
        freshClient.fetch<WeeklyLunch | null>(
          WEEKLY_LUNCH_QUERY,
          {
            year: isoWeek.year,
            weekNumber: isoWeek.weekNumber,
          },
          {
            cache: "no-store",
          }
        ),

        freshClient.fetch<LunchSettings | null>(
          LUNCH_SETTINGS_QUERY,
          {},
          {
            cache: "no-store",
          }
        ),

        freshClient.fetch<EventItem[]>(
          EVENTS_QUERY,
          {
            today,
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
      "Kunde inte hämta innehåll från Sanity:",
      error
    );
  }

  const weekdayPrice =
    lunchSettings?.weekdayPrice ?? 149;

  const weekendDailyPrice =
    lunchSettings?.weekendDailyPrice ?? 149;

  const weekendFishPrice =
    lunchSettings?.weekendFishPrice ?? 215;

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

  const openingHoursText =
    clean(siteSettings?.openingHoursText) ||
    "Måndag till Söndag\n08:00 till 20:00";

  const instagramUrl =
    clean(siteSettings?.instagramUrl) ||
    "https://www.instagram.com/restauranga/";

  const facebookUrl =
    clean(siteSettings?.facebookUrl) ||
    "https://www.facebook.com/p/Restaurang-%C3%85-61556303224438/";

  const mainCtaLabel =
    clean(siteSettings?.mainCtaLabel) || "Ring & boka";

  const conferenceCtaLabel =
    clean(siteSettings?.conferenceCtaLabel) || "Skicka förfrågan";

  const conferenceSubject =
    clean(siteSettings?.conferenceSubject) || "Konferensförfrågan";

  const cleanPhoneHref = phoneHref.replace(/[^+\d]/g, "");

  const mailHref = (subject: string) =>
    `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  let currentDayName = "";
  let currentMenu: DayMenu | null = null;

  switch (dayNumber) {
    case 1:
      currentDayName = "Måndag";
      currentMenu = weeklyLunch?.monday ?? null;
      break;

    case 2:
      currentDayName = "Tisdag";
      currentMenu = weeklyLunch?.tuesday ?? null;
      break;

    case 3:
      currentDayName = "Onsdag";
      currentMenu = weeklyLunch?.wednesday ?? null;
      break;

    case 4:
      currentDayName = "Torsdag";
      currentMenu = weeklyLunch?.thursday ?? null;
      break;

    case 5:
      currentDayName = "Fredag";
      currentMenu = weeklyLunch?.friday ?? null;
      break;

    case 6:
      currentDayName = "Lördag";
      break;

    case 7:
      currentDayName = "Söndag";
      break;
  }

  const isWeekend =
    dayNumber === 6 || dayNumber === 7;

  const heroImage = {
    src:
      siteImages?.heroImage?.asset?.url ||
      "/images/restaurang-a/hero.jpg",
    alt:
      clean(siteImages?.heroImage?.alt) ||
      "Restaurang Å vid Åkersberga Golfklubb i Åkersberga",
  };

  const lunchImage = {
    src:
      siteImages?.lunchHeroImage?.asset?.url ||
      "/images/restaurang-a/lunch-restaurang-a.jpg",
    alt:
      clean(siteImages?.lunchHeroImage?.alt) ||
      "Lunch på Restaurang Å vid Åkersberga Golfklubb",
  };

  const atmosphereImage = {
    src:
      siteImages?.atmosphereImage?.asset?.url ||
      "/images/restaurang-a/atmosphere.jpg",
    alt:
      clean(siteImages?.atmosphereImage?.alt) ||
      "Atmosfären på Restaurang Å",
  };

  const conferenceImage = {
    src:
      siteImages?.conferenceHeroImage?.asset?.url ||
      siteImages?.conferenceRoomImage?.asset?.url ||
      "/images/restaurang-a/conference-dining.jpg",
    alt:
      clean(siteImages?.conferenceHeroImage?.alt) ||
      clean(siteImages?.conferenceRoomImage?.alt) ||
      "Konferens och företagsevent på Restaurang Å vid Åkersberga Golfklubb",
  };

  const cateringImage = {
    src:
      siteImages?.cateringImage?.asset?.url ||
      "/images/restaurang-a/catering-restaurang-a.jpg",
    alt:
      clean(siteImages?.cateringImage?.alt) ||
      "Catering från Restaurang Å i Stockholm",
  };

  const teamImage = {
    src:
      siteImages?.teamImage?.asset?.url ||
      "/images/restaurang-a/team.jpg",
    alt:
      clean(siteImages?.teamImage?.alt) ||
      "Teamet på Restaurang Å",
  };

  const galleryImages =
    siteImages?.galleryImages?.filter(
      (image) => Boolean(image.asset?.url)
    ) ?? [];

  const gallery =
    galleryImages.length > 0
      ? galleryImages.map((image, index) => ({
          key: image._key ?? `gallery-${index}`,
          src: image.asset?.url || "",
          alt:
            clean(image.alt) ||
            `Restaurang Å - galleribild ${index + 1}`,
        }))
      : [
          {
            key: "lunch",
            src: "/images/restaurang-a/lunch.jpg",
            alt: "Mat på Restaurang Å",
          },
          {
            key: "atmosphere",
            src: "/images/restaurang-a/atmosphere.jpg",
            alt: "Restaurangmiljö på Restaurang Å",
          },
          {
            key: "catering",
            src: "/images/restaurang-a/catering.jpg",
            alt: "Catering från Restaurang Å",
          },
        ];

  const addressMatch = addressLine2.match(/^(\d{3}\s?\d{2})\s*(.*)$/);
  const postalCode = addressMatch?.[1] || "184 33";
  const addressLocality = addressMatch?.[2] || "Åkersberga";

  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": "https://restauranga.se/#restaurant",
        name: "Restaurang Å",
        url: "https://restauranga.se",
        telephone: cleanPhoneHref,
        email,
        image: [heroImage.src, lunchImage.src, atmosphereImage.src],
        address: {
          "@type": "PostalAddress",
          streetAddress: addressLine1,
          postalCode,
          addressLocality,
          addressRegion: "Stockholms län",
          addressCountry: "SE",
        },
        servesCuisine: ["Svenskt", "Lunch", "À la carte"],
        priceRange: "$$",
        hasMenu: [
          {
            "@type": "Menu",
            name: "Lunchmeny",
            url: "https://restauranga.se/lunch",
          },
          {
            "@type": "Menu",
            name: "After Golf & kvällsmeny",
            url: "https://restauranga.se/kvallsmeny",
          },
        ],
        sameAs: [instagramUrl, facebookUrl].filter(Boolean),
        award: "Stockholms bästa lunchrestaurang 2025 – Edenred",
      },
      {
        "@type": "WebSite",
        "@id": "https://restauranga.se/#website",
        url: "https://restauranga.se",
        name: "Restaurang Å",
        inLanguage: "sv-SE",
        publisher: {
          "@id": "https://restauranga.se/#restaurant",
        },
      },
    ],
  };

  return (
    <main className="bg-[#F8F6F2] text-[#222222]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader
        active="home"
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        email={email}
        mainCtaLabel={mainCtaLabel}
        conferenceCtaLabel={conferenceCtaLabel}
        conferenceSubject={conferenceSubject}
      />

      {/* HERO */}
      <section
        id="top"
        className="relative flex min-h-[92vh] items-end overflow-hidden bg-[#283229]"
      >
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] md:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/52 to-black/28" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/45 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-14 pt-36 sm:pb-16 sm:pt-40 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-white/85 md:text-sm">
              {locationName}
            </p>

            <h1 className="serif max-w-4xl text-[3.65rem] font-medium leading-[0.88] tracking-[-0.035em] text-white sm:text-7xl md:text-8xl lg:text-[7.5rem]">
              Lunch värd
              <br />
              en omväg.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-white/90 md:text-lg">
              Stockholms bästa lunchrestaurang 2025.
              Vällagad mat, generösa smaker och en varm
              atmosfär på Åkersberga Golfklubb.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/lunch"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#1E2721] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F2EBDD]"
              >
                Se veckans lunch
              </a>

              <a
                href={`tel:${cleanPhoneHref}`}
                className="rounded-full border border-white/80 bg-black/45 px-7 py-3.5 text-sm font-semibold !text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:!text-[#1E2721]"
              >
                {mainCtaLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden text-xs uppercase tracking-[0.22em] text-white/70 md:block">
          Scrolla för att upptäcka
        </div>
      </section>

      {/* AWARD */}
      <section className="border-b border-[#E8E3DB] bg-[#F8F6F2]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-16 md:px-10 lg:grid-cols-[1fr_2fr] lg:px-16 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Edenred · 2025
            </p>
          </div>

          <div>
            <h2 className="serif max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Utsedd till Stockholms bästa
              lunchrestaurang.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#66635F] md:text-lg">
              Ett erkännande vi är stolta över och en
              anledning att fortsätta göra lunchen till
              något mer än bara ett stopp mitt på dagen.
            </p>
          </div>
        </div>
      </section>

      {/* LUNCH */}
      <section
        id="lunch"
        className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 lg:px-16 lg:py-32"
      >
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
              Dagens lunch
            </p>

            <h2 className="serif text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              Bra lunch behöver inte vara komplicerad.
            </h2>

            <p className="mt-7 max-w-lg leading-7 text-[#66635F]">
              Varje vardag serverar vi en vällagad lunch
              med smaker som följer säsongen. Se dagens
              alternativ här eller öppna hela veckans meny.
            </p>

            <div className="mt-8">
              <a
                href="/lunch"
                className="inline-flex text-sm font-semibold text-[#263229] underline decoration-[#B5A180] underline-offset-8 transition hover:text-[#9C7B4F]"
              >
                Se hela veckans lunch
              </a>
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.5rem] bg-[#EDE8E0]">
              <img
                src={lunchImage.src}
                alt={lunchImage.alt}
                className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>

          <div className="self-start rounded-[2rem] bg-[#263229] p-8 text-white md:p-12 lg:sticky lg:top-28">
            <div className="flex items-start justify-between gap-8 border-b border-white/15 pb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                  {currentDayName || "Idag"}
                </p>

                <h3 className="serif mt-3 text-4xl font-medium">
                  {isWeekend
                    ? "Helglunch"
                    : "Dagens lunch"}
                </h3>
              </div>

              <p className="serif whitespace-nowrap text-3xl">
                {isWeekend
                  ? `${weekendDailyPrice} kr`
                  : `${weekdayPrice} kr`}
              </p>
            </div>

            {isWeekend ? (
              <div className="space-y-7 py-8">
                <div>
                  <div className="flex items-baseline justify-between gap-5">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                      Dagens rätt
                    </p>

                    <p className="text-sm text-white/60">
                      {weekendDailyPrice} kr
                    </p>
                  </div>

                  <p className="text-lg leading-7">
                    {clean(
                      weeklyLunch?.weekendLunch?.dailyDish
                    ) ||
                      "Helgens rätt publiceras snart."}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-5">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                      Helgfisk
                    </p>

                    <p className="text-sm text-white/60">
                      {weekendFishPrice} kr
                    </p>
                  </div>

                  <p className="text-lg leading-7">
                    {clean(
                      weeklyLunch
                        ?.weekendLunch
                        ?.weekendFish
                    ) ||
                      "Helgens fisk publiceras snart."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-7 py-8">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                    Rätt 1
                  </p>

                  <p className="text-lg leading-7">
                    {clean(currentMenu?.dish1) ||
                      "Dagens rätt publiceras snart."}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                    Rätt 2
                  </p>

                  <p className="text-lg leading-7">
                    {clean(currentMenu?.dish2) ||
                      "Dagens rätt publiceras snart."}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                    Veckans veg
                  </p>

                  <p className="text-lg leading-7">
                    {clean(
                      weeklyLunch?.weeklyVegetarian
                    ) ||
                      "Veckans vegetariska alternativ publiceras snart."}
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-white/15 pt-7">
              <p className="text-sm leading-6 text-white/70">
                {isWeekend
                  ? "Helglunchen serveras lördag och söndag."
                  : "Lunch serveras vardagar. Menyn uppdateras löpande av restaurangen."}
              </p>

              <a
                href="/lunch"
                className="mt-6 inline-flex text-sm font-semibold !text-white underline decoration-white/40 underline-offset-8 transition hover:decoration-white"
              >
                Se hela veckans meny
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ATMOSPHERE */}
      <section className="bg-[#202A23] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[520px] overflow-hidden lg:min-h-[700px]">
            <img
              src={atmosphereImage.src}
              alt={atmosphereImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center px-6 py-20 md:px-10 lg:px-20 lg:py-28">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
                Restaurang Å
              </p>

              <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                En restaurang att stanna kvar på.
              </h2>

              <p className="mt-8 text-base leading-8 text-white/75 md:text-lg">
                Här möts vällagad mat, avslappnad service
                och utsikten över Åkersberga Golfklubb.
                För en snabb lunch, en lång middag eller
                bara något gott efter rundan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONFERENCE */}
      <section className="overflow-hidden bg-[#F8F6F2]">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[520px] overflow-hidden bg-[#DDD7CE] lg:min-h-[720px]">
            <img
              src={conferenceImage.src}
              alt={conferenceImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center px-6 py-24 md:px-10 lg:px-16 lg:py-32">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                Konferens
              </p>

              <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                Möten som får ta plats.
              </h2>

              <p className="mt-8 text-base leading-8 text-[#66635F] md:text-lg">
                Konferens på Åkersberga Golfklubb för upp
                till 60 personer, med mat, fika och
                personlig service från Restaurang Å.
                Lokalen kan anpassas efter grupp,
                mötesform och dagens upplägg.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-5 border-y border-[#D9D2C8] py-7">
                <div>
                  <p className="serif text-3xl">60</p>

                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    personer i biosittning
                  </p>
                </div>

                <div>
                  <p className="serif text-3xl">32</p>

                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    personer i skolsittning
                  </p>
                </div>
              </div>

              <a
                href="/konferens"
                className="mt-9 inline-flex rounded-full bg-[#263229] px-7 py-3.5 text-sm font-semibold !text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#344338]"
              >
                Upptäck konferens
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CATERING */}
      <section
        id="catering"
        className="overflow-hidden bg-[#EDE8E0]"
      >
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center px-6 py-24 md:px-10 lg:px-16 lg:py-32">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                Catering
              </p>

              <h2 className="serif mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
                Maten från Å,
                <br />
                var ni än samlas.
              </h2>

              <p className="mt-8 max-w-lg text-base leading-8 text-[#66635F]">
                Från mindre sammankomster till större
                fester, konferenser och företagsevent. Vi
                hjälper till med mat och upplägg som passar
                tillfället.
              </p>

              <a
                href="/catering"
                className="mt-9 inline-flex rounded-full bg-[#263229] px-7 py-3.5 text-sm font-semibold !text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#344338]"
              >
                Se catering
              </a>
            </div>
          </div>

          <div className="relative min-h-[500px] overflow-hidden lg:min-h-[720px]">
            <img
              src={cateringImage.src}
              alt={cateringImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section
        id="services"
        className="bg-[#F8F6F2] px-6 py-24 md:px-10 lg:px-16 lg:py-32"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
            Mer än restaurang
          </p>

          <div className="mt-5 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="serif max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
              En plats för både vardag och stora dagar.
            </h2>

            <p className="max-w-xl self-end text-base leading-8 text-[#66635F] md:text-lg">
              Å är inte bara lunch och middag. Här samlas
              företag, familjer och vänner för möten,
              bröllop, minnesstunder, fester och andra
              tillfällen där mat och miljö spelar roll.
            </p>
          </div>

          <div className="mt-16 grid border-t border-[#DCD6CD] md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="group border-b border-[#DCD6CD] py-10 md:p-10 md:first:border-r md:nth-[3]:border-r"
              >
                <p className="serif text-3xl font-medium">
                  {service.title}
                </p>

                <p className="mt-5 max-w-md leading-7 text-[#66635F]">
                  {service.text}
                </p>

                <a
                  href={
                    "href" in service && service.href
                      ? service.href
                      : mailHref(
                          "subject" in service && service.subject
                            ? service.subject
                            : ""
                        )
                  }
                  className="mt-7 inline-flex text-sm font-semibold text-[#263229] underline decoration-[#B5A180] underline-offset-8 transition group-hover:text-[#9C7B4F]"
                >
                  {service.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EVENING MENU */}
      <section
        id="menu"
        className="bg-[#EFEAE2] px-6 py-24 md:px-10 lg:px-16 lg:py-32"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
                Kväll
              </p>

              <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                Från lunch
                <br />
                till kväll.
              </h2>
            </div>

            <div className="flex items-end">
              <div>
                <p className="max-w-2xl text-lg leading-8 text-[#66635F]">
                  När lunchen är över fortsätter köket med
                  After Golf, snacks, rätter och något gott
                  i glaset.
                </p>

                <a
                  href="/kvallsmeny"
                  className="mt-7 inline-flex text-sm font-semibold text-[#263229] underline decoration-[#B5A180] underline-offset-8 transition hover:text-[#9C7B4F]"
                >
                  Se After Golf och dryckesmeny
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        className="bg-[#263229] px-6 py-24 text-white md:px-10 lg:px-16 lg:py-32"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
            Event
          </p>

          <div className="mt-5 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <h2 className="serif max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
              Kvällar värda att samlas kring.
            </h2>

            <div className="flex items-end">
              <div>
                <p className="max-w-lg leading-8 text-white/75">
                  Vinprovningar, middagar, temakvällar och
                  andra event dyker upp under året. Här
                  hittar du det som är aktuellt just nu.
                </p>

                <a
                  href="/event"
                  className="mt-7 inline-flex text-sm font-semibold text-white underline decoration-white/40 underline-offset-8 hover:decoration-white"
                >
                  Se alla event
                </a>
              </div>
            </div>
          </div>

          {events.length > 0 ? (
            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05]"
                >
                  {event.image?.asset?.url && (
                    <div className="overflow-hidden">
                      <img
                        src={event.image.asset.url}
                        alt={
                          event.image.alt ||
                          event.title ||
                          "Event på Restaurang Å"
                        }
                        className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <div className="p-7 md:p-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D1B78E]">
                      {event.date && (
                        <span>
                          {formatEventDate(event.date)}
                        </span>
                      )}

                      {event.time && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-white/30" />
                          <span>{event.time}</span>
                        </>
                      )}
                    </div>

                    <h3 className="serif mt-5 text-3xl font-medium leading-tight">
                      {event.title || "Event på Å"}
                    </h3>

                    {event.shortDescription && (
                      <p className="mt-4 leading-7 text-white/70">
                        {event.shortDescription}
                      </p>
                    )}

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
                      {event.price ? (
                        <p className="serif text-xl text-white/90">
                          {event.price}
                        </p>
                      ) : (
                        <span />
                      )}

                      {event.bookingLink && (
                        <a
                          href={event.bookingLink}
                          className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-white hover:!text-[#263229]"
                        >
                          {event.bookingLabel ||
                            "Boka plats"}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-16 border-t border-white/15 pt-10">
              <p className="max-w-xl leading-7 text-white/60">
                Inga kommande event är publicerade just
                nu. Håll utkik här för nästa middag,
                provning eller temakväll.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="bg-[#F8F6F2] px-6 py-24 md:px-10 lg:px-16 lg:py-32"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
            Galleri
          </p>

          <h2 className="serif mt-5 text-5xl font-medium tracking-tight md:text-6xl">
            Smaker, människor och miljö.
          </h2>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {gallery.map((image, index) => (
              <div
                key={image.key}
                className={`overflow-hidden rounded-[1.5rem] ${
                  index % 3 === 1 ? "md:translate-y-12" : ""
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/5] h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="bg-[#EFEAE2] px-6 py-24 md:px-10 lg:px-16 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="overflow-hidden rounded-[1.5rem]">
            <img
              src={teamImage.src}
              alt={teamImage.alt}
              className="w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Om Å
            </p>

            <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              Mat lagad av människor som bryr sig.
            </h2>

            <p className="mt-8 max-w-xl text-base leading-8 text-[#66635F] md:text-lg">
              Restaurang Å är en plats för både vardag och
              firande. Här står maten, gästerna och den
              personliga känslan i centrum.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-[#1E2721] px-6 py-24 text-white md:px-10 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
                Kontakt
              </p>

              <h2 className="serif mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                Välkommen till Å.
              </h2>

              <p className="mt-7 max-w-md leading-7 text-white/70">
                Lunch, konferens, catering eller något att
                fira. Hör av dig så hjälper vi dig vidare.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Hitta hit
                </p>

                <p className="mt-4 leading-7 text-white/85">
                  {locationName}
                  <br />
                  {addressLine1}
                  <br />
                  {addressLine2}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Kontakt
                </p>

                <div className="mt-4 space-y-2 text-white/85">
                  <a
                    href={`tel:${cleanPhoneHref}`}
                    className="block transition hover:text-white"
                  >
                    {phoneDisplay}
                  </a>

                  <a
                    href={`mailto:${email}`}
                    className="block transition hover:text-white"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Öppettider
                </p>

                <p className="mt-4 whitespace-pre-line leading-7 text-white/85">
                  {openingHoursText}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Följ oss
                </p>

                <div className="mt-4 space-y-2">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-white/85 transition hover:text-white"
                  >
                    Instagram ↗
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-white/85 transition hover:text-white"
                  >
                    Facebook ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-white/15 pt-8 text-sm text-white/50">
            Restaurang Å · {locationName}
          </div>
        </div>
      </section>
    </main>
  );
}